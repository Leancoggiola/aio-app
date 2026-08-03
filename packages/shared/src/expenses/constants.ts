export const EXPENSE_CATEGORIES = [
  'FOOD',
  'TRANSPORT',
  'ENTERTAINMENT',
  'HEALTH',
  'EDUCATION',
  'HOME',
  'CLOTHING',
  'SERVICES',
  'SUBSCRIPTIONS',
  'OTHER',
] as const satisfies readonly string[];

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  FOOD: 'Alimentación',
  TRANSPORT: 'Transporte',
  ENTERTAINMENT: 'Entretenimiento',
  HEALTH: 'Salud',
  EDUCATION: 'Educación',
  HOME: 'Hogar',
  CLOTHING: 'Ropa',
  SERVICES: 'Servicios',
  SUBSCRIPTIONS: 'Suscripciones',
  OTHER: 'Otros',
};

export const EXPENSE_REMINDER_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const satisfies readonly string[];

export type ExpenseReminderPriority = (typeof EXPENSE_REMINDER_PRIORITIES)[number];

export const EXPENSE_REMINDER_PRIORITY_LABELS: Record<ExpenseReminderPriority, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
};

export const EXPENSE_REMINDER_RECURRENCES = ['ONCE', 'MONTHLY'] as const satisfies readonly string[];

export type ExpenseReminderRecurrence = (typeof EXPENSE_REMINDER_RECURRENCES)[number];

export const EXPENSE_REMINDER_RECURRENCE_LABELS: Record<ExpenseReminderRecurrence, string> = {
  ONCE: 'Única',
  MONTHLY: 'Mensual',
};

export const EXPENSE_REMINDER_STATUSES = ['PENDING', 'COMPLETED'] as const satisfies readonly string[];

export type ExpenseReminderStatus = (typeof EXPENSE_REMINDER_STATUSES)[number];

export const EXPENSE_REMINDER_STATUS_LABELS: Record<ExpenseReminderStatus, string> = {
  PENDING: 'Pendiente',
  COMPLETED: 'Completado',
};

export const EXPENSE_MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;
