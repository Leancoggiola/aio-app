import { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';

import { api, ApiError, SWR_KEYS } from '@/shared/api';

import type { SessionUser } from '@aio-app/shared/auth';
import type { ProfileResponse } from '@aio-app/shared/auth';

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
  const { data, isLoading, error, mutate } = useSWRImmutable<ProfileResponse>(SWR_KEYS.auth.profile);

  const user = data?.user ?? null;
  const isAuthenticated = !!data?.user;

  const login = useCallback(
    async (username: string, password: string) => {
      const res = await api.post<ProfileResponse>('/api/auth/login', { username, password });
      await mutate(res, { revalidate: false });
    },
    [mutate]
  );

  const logout = useCallback(async () => {
    await api.post('/api/auth/logout');
    await mutate(undefined, { revalidate: false });
  }, [mutate]);

  const value = useMemo(
    () => ({ user, isAuthenticated, isLoading, error, login, logout }),
    [user, isAuthenticated, isLoading, error, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return ctx;
};
