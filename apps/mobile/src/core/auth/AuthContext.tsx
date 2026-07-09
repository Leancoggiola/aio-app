import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react';
import useSWRImmutable from 'swr/immutable';
import { SWRConfig } from 'swr';

import { api, ApiError, API_KEYS, clearTokens, fetcher, getAccessToken, setTokens } from '@/shared/api';

import type { AuthTokensResponse, ProfileResponse, SessionUser } from '@omni/shared/auth';

export type { SessionUser };

interface AuthContextValue {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ApiError | undefined;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [bootstrapped, setBootstrapped] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await getAccessToken();
      if (!cancelled) {
        setHasToken(!!token);
        setBootstrapped(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const { data, isLoading, error, mutate } = useSWRImmutable<ProfileResponse>(
    bootstrapped && hasToken ? API_KEYS.auth.profile : null,
    fetcher
  );

  const user = data?.user ?? null;
  const isAuthenticated = !!data?.user;

  const login = useCallback(
    async (username: string, password: string) => {
      const res = await api.post<AuthTokensResponse>(API_KEYS.auth.login, { username, password });
      await setTokens(res.accessToken, res.refreshToken);
      setHasToken(true);
      await mutate({ user: res.user }, { revalidate: false });
    },
    [mutate]
  );

  const logout = useCallback(async () => {
    const { getRefreshToken } = await import('@/shared/api');
    const refreshToken = await getRefreshToken();
    try {
      await api.post(API_KEYS.auth.logout, { refreshToken: refreshToken ?? undefined });
    } catch {
      // still clear local session
    }
    await clearTokens();
    setHasToken(false);
    await mutate(undefined, { revalidate: false });
  }, [mutate]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading: !bootstrapped || (hasToken && isLoading),
      error: error as ApiError | undefined,
      login,
      logout,
    }),
    [user, isAuthenticated, bootstrapped, hasToken, isLoading, error, login, logout]
  );

  return (
    <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </SWRConfig>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return ctx;
};
