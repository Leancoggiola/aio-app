import type { ExpenseReminderPriority } from '../expenses/constants';

export interface NotificationDigest {
  generatedAt: string;
  userId: string;
  notificationsDisabled?: true;
  expenses: {
    overdueCount: number;
    dueTodayCount: number;
    items: { id: string; title: string; dueDate: string; priority: ExpenseReminderPriority }[];
  };
  pantry: {
    lowStockCount: number;
    expiringSoonCount: number;
    items: { id: string; name: string; reason: 'LOW_STOCK' | 'EXPIRING' }[];
  };
  splitExpenses: {
    unsettledCount: number;
    items: { id: string; name: string; totalAmount: number }[];
  };
}

export interface NotificationDeviceSummary {
  id: string;
  platform: 'WEB' | 'MOBILE' | 'RASPBERRY_PI';
  label: string | null;
  apiKey?: string;
}
