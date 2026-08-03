import { useCallback } from 'react';
import { useSWRConfig } from 'swr';

import { api, API_KEYS } from '@/shared/api';

import type {
  CompleteExpenseReminderPayload,
  CreateExpenseReminderPayload,
  CreatePersonalExpensePayload,
  ExpenseReminder,
  PersonalExpense,
  SnoozeExpenseReminderPayload,
  UpdateExpenseReminderPayload,
  UpdatePersonalExpensePayload,
} from '@omni/shared/expenses';

export function useExpenseMutations() {
  const { mutate } = useSWRConfig();

  const invalidateExpenses = useCallback(async () => {
    await mutate(
      (key: unknown) =>
        typeof key === 'string' &&
        (key.startsWith(API_KEYS.expenses.list) || key.startsWith(API_KEYS.expenses.summary)),
      undefined,
      { revalidate: true }
    );
  }, [mutate]);

  const invalidateReminders = useCallback(async () => {
    await mutate((key: unknown) => typeof key === 'string' && key.startsWith(API_KEYS.expenses.reminders), undefined, {
      revalidate: true,
    });
  }, [mutate]);

  const invalidateAll = useCallback(async () => {
    await Promise.all([invalidateExpenses(), invalidateReminders()]);
  }, [invalidateExpenses, invalidateReminders]);

  const createExpense = useCallback(
    async (payload: CreatePersonalExpensePayload) => {
      const expense = await api.post<PersonalExpense>(API_KEYS.expenses.list, payload);
      await invalidateExpenses();
      return expense;
    },
    [invalidateExpenses]
  );

  const updateExpense = useCallback(
    async (expenseId: string, payload: UpdatePersonalExpensePayload) => {
      const expense = await api.patch<PersonalExpense>(API_KEYS.expenses.expense(expenseId), payload);
      await invalidateExpenses();
      return expense;
    },
    [invalidateExpenses]
  );

  const deleteExpense = useCallback(
    async (expenseId: string) => {
      await api.delete(API_KEYS.expenses.expense(expenseId));
      await invalidateExpenses();
    },
    [invalidateExpenses]
  );

  const createReminder = useCallback(
    async (payload: CreateExpenseReminderPayload) => {
      const reminder = await api.post<ExpenseReminder>(API_KEYS.expenses.reminders, payload);
      await invalidateReminders();
      return reminder;
    },
    [invalidateReminders]
  );

  const updateReminder = useCallback(
    async (reminderId: string, payload: UpdateExpenseReminderPayload) => {
      const reminder = await api.patch<ExpenseReminder>(API_KEYS.expenses.reminder(reminderId), payload);
      await invalidateReminders();
      return reminder;
    },
    [invalidateReminders]
  );

  const deleteReminder = useCallback(
    async (reminderId: string) => {
      await api.delete(API_KEYS.expenses.reminder(reminderId));
      await invalidateReminders();
    },
    [invalidateReminders]
  );

  const completeReminder = useCallback(
    async (reminderId: string, payload: CompleteExpenseReminderPayload) => {
      const result = await api.post<{ expense: PersonalExpense; reminder: ExpenseReminder }>(
        API_KEYS.expenses.reminderComplete(reminderId),
        payload
      );
      await invalidateAll();
      return result;
    },
    [invalidateAll]
  );

  const snoozeReminder = useCallback(
    async (reminderId: string, payload: SnoozeExpenseReminderPayload) => {
      const reminder = await api.post<ExpenseReminder>(API_KEYS.expenses.reminderSnooze(reminderId), payload);
      await invalidateReminders();
      return reminder;
    },
    [invalidateReminders]
  );

  return {
    createExpense,
    updateExpense,
    deleteExpense,
    createReminder,
    updateReminder,
    deleteReminder,
    completeReminder,
    snoozeReminder,
  };
}
