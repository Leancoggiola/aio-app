import { useCallback } from 'react';
import { useSWRConfig } from 'swr';

import { api, API_KEYS, invalidateNotificationDigest } from '@/shared/api';

import type {
  AddGatheringExpensePayload,
  CreateGatheringPayload,
  CreateSplitFriendPayload,
  GatheringDetail,
  SplitFriend,
  ToggleGatheringSettledPayload,
  UpdateSplitFriendPayload,
} from '@omni/shared/split-expenses';

export function useSplitExpensesMutations() {
  const { mutate } = useSWRConfig();

  const invalidateFriends = useCallback(async () => {
    await mutate(
      (key: unknown) =>
        typeof key === 'string' &&
        (key === API_KEYS.splitExpenses.friends || key.startsWith(API_KEYS.splitExpenses.friendsSuggest)),
      undefined,
      { revalidate: true }
    );
  }, [mutate]);

  const invalidateGatherings = useCallback(async () => {
    await Promise.all([
      mutate(
        (key: unknown) => typeof key === 'string' && key.startsWith(API_KEYS.splitExpenses.gatherings),
        undefined,
        { revalidate: true }
      ),
      invalidateNotificationDigest(mutate),
    ]);
  }, [mutate]);

  const invalidateGathering = useCallback(
    async (gatheringId: string) => {
      await Promise.all([
        mutate(API_KEYS.splitExpenses.gathering(gatheringId), undefined, { revalidate: true }),
        invalidateNotificationDigest(mutate),
      ]);
    },
    [mutate]
  );

  const createFriend = useCallback(
    async (payload: CreateSplitFriendPayload) => {
      const friend = await api.post<SplitFriend>(API_KEYS.splitExpenses.friends, payload);
      await invalidateFriends();
      return friend;
    },
    [invalidateFriends]
  );

  const updateFriend = useCallback(
    async (friendId: string, payload: UpdateSplitFriendPayload) => {
      const friend = await api.patch<SplitFriend>(API_KEYS.splitExpenses.friend(friendId), payload);
      await invalidateFriends();
      return friend;
    },
    [invalidateFriends]
  );

  const deleteFriend = useCallback(
    async (friendId: string) => {
      await api.delete(API_KEYS.splitExpenses.friend(friendId));
      await invalidateFriends();
    },
    [invalidateFriends]
  );

  const createGathering = useCallback(
    async (payload: CreateGatheringPayload) => {
      const gathering = await api.post<GatheringDetail>(API_KEYS.splitExpenses.gatherings, payload);
      await invalidateGatherings();
      return gathering;
    },
    [invalidateGatherings]
  );

  const toggleGatheringSettled = useCallback(
    async (gatheringId: string, payload: ToggleGatheringSettledPayload) => {
      const gathering = await api.patch<GatheringDetail>(API_KEYS.splitExpenses.gatheringSettled(gatheringId), payload);
      await Promise.all([invalidateGatherings(), invalidateGathering(gatheringId)]);
      return gathering;
    },
    [invalidateGathering, invalidateGatherings]
  );

  const deleteGathering = useCallback(
    async (gatheringId: string) => {
      await api.delete(API_KEYS.splitExpenses.gathering(gatheringId));
      await invalidateGatherings();
    },
    [invalidateGatherings]
  );

  const addGatheringExpense = useCallback(
    async (gatheringId: string, payload: AddGatheringExpensePayload) => {
      const gathering = await api.post<GatheringDetail>(API_KEYS.splitExpenses.gatheringExpenses(gatheringId), payload);
      await Promise.all([invalidateGatherings(), invalidateGathering(gatheringId)]);
      return gathering;
    },
    [invalidateGathering, invalidateGatherings]
  );

  const deleteGatheringExpense = useCallback(
    async (gatheringId: string, expenseId: string) => {
      await api.delete(API_KEYS.splitExpenses.gatheringExpense(gatheringId, expenseId));
      await Promise.all([invalidateGatherings(), invalidateGathering(gatheringId)]);
    },
    [invalidateGathering, invalidateGatherings]
  );

  return {
    createFriend,
    updateFriend,
    deleteFriend,
    createGathering,
    toggleGatheringSettled,
    deleteGathering,
    addGatheringExpense,
    deleteGatheringExpense,
  };
}
