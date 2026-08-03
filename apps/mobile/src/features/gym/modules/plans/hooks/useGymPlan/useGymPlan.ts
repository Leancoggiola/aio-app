import useSWR from 'swr';

import { API_KEYS } from '@/shared/api';

import type { GymPlanDetail } from '@omni/shared/gym';

export function useGymPlan(planId: string | null | undefined) {
  const key = planId ? API_KEYS.gym.plan(planId) : null;
  const { data, error, isLoading } = useSWR<GymPlanDetail>(key);

  return {
    plan: data ?? null,
    isLoading,
    error,
  };
}
