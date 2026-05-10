import useSWR from "swr";
import type { UserProfile } from "@aio-app/shared/users";
import { api } from "../../../../lib/api";
import type { UpdateProfilePayload } from "@aio-app/shared/users";
import { mutate } from "swr";
import { useCallback } from "react";

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
