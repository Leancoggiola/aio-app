import { useCallback } from 'react';
import useSWR from 'swr';
import { mutate } from 'swr';

import { api } from '@/common/api';

import type { UpdatePreferencesPayload, UserPreferences } from '@aio-app/shared/users';

const PREFERENCES_KEY = '/api/users/preferences';

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
