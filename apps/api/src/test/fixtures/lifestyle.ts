export const gymPlanDetail = {
  id: 'plan-1',
  name: 'Push Pull',
  status: 'ACTIVE' as const,
  createdAt: '2026-08-01T12:00:00.000Z',
  archivedAt: null,
  days: [
    {
      id: 'day-1',
      label: 'Lunes',
      sortOrder: 0,
      exercises: [
        {
          id: 'ex-1',
          name: 'Press banca',
          sets: 3,
          reps: '8-10',
          currentWeightKg: 60,
          sortOrder: 0,
        },
      ],
    },
  ],
};

export const pantrySummary = {
  totalProducts: 2,
  lowStockCount: 1,
  expiringSoonCount: 0,
  shoppingListCount: 1,
};

export const pantryProduct = {
  id: 'prod-1',
  name: 'Arroz',
  category: 'GRAINS' as const,
  unit: 'UNITS' as const,
  quantity: 1,
  minQuantity: 2,
  expiresAt: null,
  isLowStock: true,
  isExpiringSoon: false,
  createdAt: '2026-08-01T12:00:00.000Z',
  updatedAt: '2026-08-01T12:00:00.000Z',
};

export const expenseReminder = {
  id: 'rem-1',
  title: 'Alquiler',
  description: null,
  dueDate: '2026-08-05',
  priority: 'HIGH' as const,
  recurrence: 'MONTHLY' as const,
  status: 'PENDING' as const,
  isOverdue: false,
  daysUntilDue: 3,
  createdAt: '2026-08-01T12:00:00.000Z',
  updatedAt: '2026-08-01T12:00:00.000Z',
};

export const expensesSummary = {
  totalAmount: 0,
  transactionCount: 0,
  pendingRemindersCount: 1,
  overdueRemindersCount: 0,
  activeCategoriesCount: 0,
  byCategory: [],
};

export const splitFriend = {
  id: 'friend-1',
  name: 'Ana',
  alias: null,
  createdAt: '2026-08-01T12:00:00.000Z',
  updatedAt: '2026-08-01T12:00:00.000Z',
};

export const notificationDigest = {
  generatedAt: '2026-08-02T12:00:00.000Z',
  userId: 'user-test-1',
  expenses: { overdueCount: 0, dueTodayCount: 0, items: [] },
  pantry: { lowStockCount: 0, expiringSoonCount: 0, items: [] },
  splitExpenses: { unsettledCount: 0, items: [] },
};

export const notificationDevice = {
  id: 'dev-1',
  platform: 'WEB' as const,
  label: 'Chrome',
  isActive: true,
  lastSeenAt: null,
  createdAt: '2026-08-01T12:00:00.000Z',
};

export const pantryShoppingListItem = {
  id: 'item-1',
  name: 'Leche',
  source: 'MANUAL' as const,
  quantityToBuy: 1,
  unit: 'UNITS' as const,
  checked: false,
  pantryProductId: null,
  isLowStock: false,
  isExpiringSoon: false,
};

export const paginatedEmpty = {
  items: [],
  total: 0,
  page: 1,
  limit: 50,
};
