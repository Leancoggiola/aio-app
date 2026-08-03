export const GYM_PLAN_STATUSES = ['ACTIVE', 'ARCHIVED'] as const satisfies readonly string[];

export type GymPlanStatus = (typeof GYM_PLAN_STATUSES)[number];

export const GYM_PLAN_STATUS_LABELS: Record<GymPlanStatus, string> = {
  ACTIVE: 'Activo',
  ARCHIVED: 'Archivado',
};
