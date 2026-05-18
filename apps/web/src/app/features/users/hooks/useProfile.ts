import useSWRImmutable from 'swr/immutable';
import useSWRMutation from 'swr/mutation';

import { api, SWR_KEYS } from '@/common/api';

import type { UserProfile } from '@aio-app/shared/users';
import type { UpdateProfilePayload } from '@aio-app/shared/users';

export function useProfile() {
  const { data, isLoading, error } = useSWRImmutable<{ user: UserProfile }>(SWR_KEYS.users.profile);

  const { trigger: updateProfile, isMutating } = useSWRMutation(
    SWR_KEYS.users.profile,
    (_url: string, { arg }: { arg: UpdateProfilePayload }) =>
      api.patch<{ user: UserProfile }>(SWR_KEYS.users.profile, arg),
    { populateCache: true, revalidate: false }
  );

  return {
    profile: data?.user ?? null,
    isLoading,
    isMutating,
    error,
    updateProfile,
  };
}
