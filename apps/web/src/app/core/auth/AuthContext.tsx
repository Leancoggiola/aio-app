import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from "react";
import useSWR, { mutate } from "swr";
import { api } from "../../../lib/api";
import type { User } from "@aio-app/shared/auth";
import type { ProfileResponse } from "@aio-app/shared/auth";

export type { User };

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AUTH_KEY = "/api/auth/profile";

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data, isLoading } = useSWR<ProfileResponse>(AUTH_KEY, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const user = data?.user ?? null;

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<ProfileResponse>("/api/auth/login", {
      email,
      password,
    });
    await mutate(AUTH_KEY, res, { revalidate: false });
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await api.post<ProfileResponse>("/api/auth/register", {
        name,
        email,
        password,
      });
      await mutate(AUTH_KEY, res, { revalidate: false });
    },
    [],
  );

  const logout = useCallback(async () => {
    await api.post("/api/auth/logout");
    await mutate(AUTH_KEY, null, { revalidate: false });
  }, []);

  const value = useMemo(
    () => ({ user, loading: isLoading, login, register, logout }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
