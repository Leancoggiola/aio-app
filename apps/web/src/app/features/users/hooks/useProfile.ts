import { useCallback } from "react";
import useSWR from "swr";
import { mutate } from "swr";

import { api } from "@/common/api";

import type { UserProfile } from "@aio-app/shared/users";
import type { UpdateProfilePayload } from "@aio-app/shared/users";

const PROFILE_KEY = "/api/users/profile";

export function useProfile() {
  const { data, isLoading, error } = useSWR<{ user: UserProfile }>(PROFILE_KEY);

  const updateProfile = useCallback(async (dto: UpdateProfilePayload) => {
    const result = await api.patch<{ user: UserProfile }>(PROFILE_KEY, dto);
    await mutate(PROFILE_KEY, result, { revalidate: false });
    return result.user;
  }, []);

  return {
    profile: data?.user ?? null,
    isLoading,
    error,
    updateProfile,
  };
}
