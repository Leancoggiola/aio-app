import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from "react";
import useSWR, { mutate } from "swr";

import { api } from "@/common/api";

import type { User } from "@aio-app/shared/auth";
import type { ProfileResponse } from "@aio-app/shared/auth";

export type { User };

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
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

  const login = useCallback(async (username: string, password: string) => {
    const res = await api.post<ProfileResponse>("/api/auth/login", {
      username,
      password,
    });
    await mutate(AUTH_KEY, res, { revalidate: false });
  }, []);

  const logout = useCallback(async () => {
    await api.post("/api/auth/logout");
    await mutate(AUTH_KEY, null, { revalidate: false });
  }, []);

  const value = useMemo(
    () => ({ user, loading: isLoading, login, logout }),
    [user, isLoading, login, logout],
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
