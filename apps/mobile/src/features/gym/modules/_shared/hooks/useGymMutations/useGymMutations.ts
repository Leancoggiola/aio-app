import { useCallback } from 'react';
import { useSWRConfig } from 'swr';

import { api, API_KEYS } from '@/shared/api';

import type {
  AddGymExercisePayload,
  CreateGymPlanPayload,
  GymExercise,
  GymPlanDetail,
  UpdateGymExercisePayload,
  UpdateGymExerciseWeightPayload,
} from '@omni/shared/gym';

export function useGymMutations() {
  const { mutate } = useSWRConfig();

  const invalidatePlans = useCallback(async () => {
    await mutate((key: unknown) => typeof key === 'string' && key.startsWith(API_KEYS.gym.plans), undefined, {
      revalidate: true,
    });
  }, [mutate]);

  const invalidatePlan = useCallback(
    async (planId: string) => {
      await mutate(API_KEYS.gym.plan(planId), undefined, { revalidate: true });
    },
    [mutate]
  );

  const createPlan = useCallback(
    async (payload: CreateGymPlanPayload) => {
      const plan = await api.post<GymPlanDetail>(API_KEYS.gym.plans, payload);
      await invalidatePlans();
      return plan;
    },
    [invalidatePlans]
  );

  const archivePlan = useCallback(
    async (planId: string) => {
      const plan = await api.post<GymPlanDetail>(API_KEYS.gym.planArchive(planId));
      await Promise.all([invalidatePlans(), invalidatePlan(planId)]);
      return plan;
    },
    [invalidatePlan, invalidatePlans]
  );

  const addExercise = useCallback(
    async (payload: AddGymExercisePayload) => {
      const plan = await api.post<GymPlanDetail>(API_KEYS.gym.exercises, payload);
      await Promise.all([invalidatePlans(), invalidatePlan(payload.planId)]);
      return plan;
    },
    [invalidatePlan, invalidatePlans]
  );

  const updateExercise = useCallback(
    async (exerciseId: string, payload: UpdateGymExercisePayload, planId: string) => {
      const plan = await api.patch<GymPlanDetail>(API_KEYS.gym.exercise(exerciseId), payload);
      await Promise.all([invalidatePlans(), invalidatePlan(planId)]);
      return plan;
    },
    [invalidatePlan, invalidatePlans]
  );

  const updateExerciseWeight = useCallback(
    async (exerciseId: string, payload: UpdateGymExerciseWeightPayload, planId: string) => {
      const exercise = await api.patch<GymExercise>(API_KEYS.gym.exerciseWeight(exerciseId), payload);
      await Promise.all([invalidatePlans(), invalidatePlan(planId)]);
      return exercise;
    },
    [invalidatePlan, invalidatePlans]
  );

  const deleteExercise = useCallback(
    async (exerciseId: string, planId: string) => {
      await api.delete(API_KEYS.gym.exercise(exerciseId));
      await Promise.all([invalidatePlans(), invalidatePlan(planId)]);
    },
    [invalidatePlan, invalidatePlans]
  );

  return {
    createPlan,
    archivePlan,
    addExercise,
    updateExercise,
    updateExerciseWeight,
    deleteExercise,
  };
}
