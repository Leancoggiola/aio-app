import useSWR from 'swr';

import { buildQueryString, SWR_KEYS } from '@/shared/api';

import type { PaginatedResponse } from '@omni/shared/common';
import type {
  GatheringDetail,
  GatheringSummary,
  ListGatheringsParams,
  SplitFriend,
  SplitFriendSuggest,
} from '@omni/shared/split-expenses';

const DEFAULT_GATHERING_PARAMS: ListGatheringsParams = { page: 1, limit: 50 };

export function useSplitFriends() {
  const { data, error, isLoading } = useSWR<SplitFriend[]>(SWR_KEYS.splitExpenses.friends);
  return { items: data ?? [], isLoading, error };
}

export function useSplitFriendsSuggest(q: string, limit = 10) {
  const trimmed = q.trim();
  const key = trimmed ? `${SWR_KEYS.splitExpenses.friendsSuggest}${buildQueryString({ q: trimmed, limit })}` : null;
  const { data, error, isLoading } = useSWR<SplitFriendSuggest[]>(key);
  return { items: data ?? [], isLoading, error };
}

export function useGatherings(params: Partial<ListGatheringsParams> = {}) {
  const query = { ...DEFAULT_GATHERING_PARAMS, ...params };
  const key = `${SWR_KEYS.splitExpenses.gatherings}${buildQueryString(query)}`;
  const { data, error, isLoading } = useSWR<PaginatedResponse<GatheringSummary>>(key);

  return {
    items: data?.items ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? query.page,
    limit: data?.limit ?? query.limit,
    isLoading,
    error,
  };
}

export function useGathering(gatheringId: string | null | undefined) {
  const key = gatheringId ? SWR_KEYS.splitExpenses.gathering(gatheringId) : null;
  const { data, error, isLoading } = useSWR<GatheringDetail>(key);
  return { gathering: data ?? null, isLoading, error };
}
