import useSWR from "swr";
import type { UserPreferences, UpdatePreferencesPayload } from "@aio-app/shared/users";
import { api } from "../../../../lib/api";
import { mutate } from "swr";
import { useCallback } from "react";

const PREFERENCES_KEY = "/api/users/preferences";

export function usePreferences() {
  const { data, isLoading, error } = useSWR<{ preferences: UserPreferences }>(PREFERENCES_KEY);

  const updatePreferences = useCallback(async (dto: UpdatePreferencesPayload) => {
    const result = await api.patch<{ preferences: UserPreferences }>(PREFERENCES_KEY, dto);
    await mutate(PREFERENCES_KEY, result, { revalidate: false });
    return result.preferences;
  }, []);

  return {
    preferences: data?.preferences ?? null,
    isLoading,
    error,
    updatePreferences,
  };
}
