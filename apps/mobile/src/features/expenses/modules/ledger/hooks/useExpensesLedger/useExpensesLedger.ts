import useSWR from 'swr';

import { buildQueryString, API_KEYS } from '@/shared/api';

import type { PaginatedResponse } from '@omni/shared/common';
import type {
  ExpenseReminder,
  ExpenseReminderStatus,
  ExpensesSummary,
  ListExpensesParams,
  PersonalExpense,
} from '@omni/shared/expenses';

const DEFAULT_LIST_PARAMS: ListExpensesParams = { page: 1, limit: 50, month: '' };

export function useExpensesSummary(params: Pick<ListExpensesParams, 'month' | 'category'>) {
  const key = `${API_KEYS.expenses.summary}${buildQueryString(params)}`;
  const { data, error, isLoading } = useSWR<ExpensesSummary>(key);
  return { summary: data ?? null, isLoading, error };
}

export function useExpensesList(params: Partial<ListExpensesParams> & { month: string }) {
  const query = { ...DEFAULT_LIST_PARAMS, ...params };
  const key = `${API_KEYS.expenses.list}${buildQueryString(query)}`;
  const { data, error, isLoading } = useSWR<PaginatedResponse<PersonalExpense>>(key);

  return {
    items: data?.items ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? query.page,
    limit: data?.limit ?? query.limit,
    isLoading,
    error,
  };
}

export function useExpenseReminders(status?: ExpenseReminderStatus) {
  const key = `${API_KEYS.expenses.reminders}${buildQueryString({ status })}`;
  const { data, error, isLoading } = useSWR<ExpenseReminder[]>(key);
  return { items: data ?? [], isLoading, error };
}
