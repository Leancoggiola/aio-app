import useSWRImmutable from 'swr/immutable';
import useSWRMutation from 'swr/mutation';

import { api, SWR_KEYS } from '@/common/api';

import type { UpdatePreferencesPayload, UserPreferences } from '@aio-app/shared/users';

export function usePreferences() {
  const { data, isLoading, error } = useSWRImmutable<{ preferences: UserPreferences }>(SWR_KEYS.users.preferences);

  const { trigger: updatePreferences, isMutating } = useSWRMutation(
    SWR_KEYS.users.preferences,
    (_url: string, { arg }: { arg: UpdatePreferencesPayload }) =>
      api.patch<{ preferences: UserPreferences }>(SWR_KEYS.users.preferences, arg),
    { populateCache: true, revalidate: false }
  );

  return {
    preferences: data?.preferences ?? null,
    isLoading,
    isMutating,
    error,
    updatePreferences,
  };
}
