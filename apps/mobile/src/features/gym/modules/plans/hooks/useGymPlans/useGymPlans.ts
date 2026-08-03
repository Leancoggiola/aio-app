import useSWR from 'swr';

import { buildQueryString, API_KEYS } from '@/shared/api';

import type { PaginatedResponse } from '@omni/shared/common';
import type { GymPlanSummary, ListGymPlansParams } from '@omni/shared/gym';

const DEFAULT_PARAMS: ListGymPlansParams = { page: 1, limit: 50 };

export function useGymPlans(params: Partial<ListGymPlansParams> = {}) {
  const query = { ...DEFAULT_PARAMS, ...params };
  const key = `${API_KEYS.gym.plans}${buildQueryString(query)}`;
  const { data, error, isLoading } = useSWR<PaginatedResponse<GymPlanSummary>>(key);

  return {
    items: data?.items ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? query.page,
    limit: data?.limit ?? query.limit,
    isLoading,
    error,
  };
}
