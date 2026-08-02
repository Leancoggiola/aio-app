import type {
  CompleteExpenseReminderPayload,
  CreateExpenseReminderPayload,
  CreatePersonalExpensePayload,
  ExpenseReminder,
  ExpensesSummary,
  ListExpensesParams,
  PersonalExpense,
  SnoozeExpenseReminderPayload,
  UpdateExpenseReminderPayload,
  UpdatePersonalExpensePayload,
} from '@omni/shared/expenses';
import { addOneMonthSameDay } from '@omni/shared/expenses';
import type {
  ExpenseReminder as PrismaExpenseReminder,
  PersonalExpense as PrismaPersonalExpense,
} from '../generated/prisma/client';
import { monthRange, parseIsoDateString, paginationSkipTake, startOfTodayInAppTz } from '@omni/shared/common';

import { prisma } from '../common/db';
import { decimalToNumber, toIsoDateString, toIsoDateTimeString } from '../common/utils/lifestyle';

function mapExpense(row: PrismaPersonalExpense): PersonalExpense {
  return {
    id: row.id,
    concept: row.concept,
    amount: decimalToNumber(row.amount) ?? 0,
    category: row.category,
    date: toIsoDateString(row.date),
    notes: row.notes,
    reminderId: row.reminderId,
    createdAt: toIsoDateTimeString(row.createdAt),
    updatedAt: toIsoDateTimeString(row.updatedAt),
  };
}

function reminderFlags(row: PrismaExpenseReminder, today: Date) {
  const dueTime = row.dueDate.getTime();
  const todayTime = today.getTime();
  const daysUntilDue = Math.round((dueTime - todayTime) / 86_400_000);
  return {
    isOverdue: row.status === 'PENDING' && row.dueDate < today,
    daysUntilDue,
  };
}

function mapReminder(row: PrismaExpenseReminder, today = startOfTodayInAppTz()): ExpenseReminder {
  const flags = reminderFlags(row, today);
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    dueDate: toIsoDateString(row.dueDate),
    priority: row.priority,
    recurrence: row.recurrence,
    status: row.status,
    isOverdue: flags.isOverdue,
    daysUntilDue: flags.daysUntilDue,
    createdAt: toIsoDateTimeString(row.createdAt),
    updatedAt: toIsoDateTimeString(row.updatedAt),
  };
}

async function getOwnedExpense(userId: string, expenseId: string) {
  const expense = await prisma.personalExpense.findFirst({ where: { id: expenseId, userId } });
  if (!expense) throw { status: 404, message: 'Gasto no encontrado' };
  return expense;
}

async function getOwnedReminder(userId: string, reminderId: string) {
  const reminder = await prisma.expenseReminder.findFirst({ where: { id: reminderId, userId } });
  if (!reminder) throw { status: 404, message: 'Recordatorio no encontrado' };
  return reminder;
}

function buildExpenseWhere(userId: string, params: ListExpensesParams) {
  const { start, end } = monthRange(params.month);
  return {
    userId,
    date: { gte: start, lte: end },
    ...(params.category && { category: params.category }),
  };
}

export async function getSummary(userId: string, params: ListExpensesParams): Promise<ExpensesSummary> {
  const where = buildExpenseWhere(userId, params);
  const expenses = await prisma.personalExpense.findMany({ where });
  const totalAmount = expenses.reduce((sum, e) => sum + (decimalToNumber(e.amount) ?? 0), 0);
  const byCategoryMap = new Map<string, number>();
  for (const e of expenses) {
    byCategoryMap.set(e.category, (byCategoryMap.get(e.category) ?? 0) + (decimalToNumber(e.amount) ?? 0));
  }
  const byCategory = [...byCategoryMap.entries()].map(([category, amount]) => ({
    category: category as PersonalExpense['category'],
    amount,
    count: expenses.filter(e => e.category === category).length,
  }));

  const today = startOfTodayInAppTz();
  const pendingReminders = await prisma.expenseReminder.findMany({
    where: { userId, status: 'PENDING' },
  });

  return {
    totalAmount,
    transactionCount: expenses.length,
    pendingRemindersCount: pendingReminders.length,
    overdueRemindersCount: pendingReminders.filter(r => r.dueDate < today).length,
    activeCategoriesCount: byCategoryMap.size,
    byCategory,
  };
}

export async function listExpenses(userId: string, params: ListExpensesParams) {
  const { skip, take } = paginationSkipTake(params);
  const where = buildExpenseWhere(userId, params);
  const [items, total] = await Promise.all([
    prisma.personalExpense.findMany({ where, skip, take, orderBy: { date: 'desc' } }),
    prisma.personalExpense.count({ where }),
  ]);
  return { items: items.map(mapExpense), total, page: params.page, limit: params.limit };
}

export async function createExpense(userId: string, dto: CreatePersonalExpensePayload) {
  const expense = await prisma.personalExpense.create({
    data: {
      userId,
      concept: dto.concept.trim(),
      amount: dto.amount,
      category: dto.category,
      date: parseIsoDateString(dto.date),
      notes: dto.notes ?? null,
    },
  });
  return mapExpense(expense);
}

export async function updateExpense(userId: string, expenseId: string, dto: UpdatePersonalExpensePayload) {
  await getOwnedExpense(userId, expenseId);
  const expense = await prisma.personalExpense.update({
    where: { id: expenseId },
    data: {
      ...(dto.concept !== undefined && { concept: dto.concept.trim() }),
      ...(dto.amount !== undefined && { amount: dto.amount }),
      ...(dto.category !== undefined && { category: dto.category }),
      ...(dto.date !== undefined && { date: parseIsoDateString(dto.date) }),
      ...(dto.notes !== undefined && { notes: dto.notes }),
    },
  });
  return mapExpense(expense);
}

export async function deleteExpense(userId: string, expenseId: string) {
  await getOwnedExpense(userId, expenseId);
  await prisma.personalExpense.delete({ where: { id: expenseId } });
}

export async function listReminders(userId: string, status?: 'PENDING' | 'COMPLETED') {
  const today = startOfTodayInAppTz();
  const items = await prisma.expenseReminder.findMany({
    where: { userId, ...(status && { status }) },
    orderBy: [{ status: 'asc' }, { dueDate: 'asc' }],
  });
  return items.map(r => mapReminder(r, today));
}

export async function createReminder(userId: string, dto: CreateExpenseReminderPayload) {
  const reminder = await prisma.expenseReminder.create({
    data: {
      userId,
      title: dto.title.trim(),
      description: dto.description ?? null,
      dueDate: parseIsoDateString(dto.dueDate),
      priority: dto.priority ?? 'MEDIUM',
      recurrence: dto.recurrence,
    },
  });
  return mapReminder(reminder);
}

export async function updateReminder(userId: string, reminderId: string, dto: UpdateExpenseReminderPayload) {
  const current = await getOwnedReminder(userId, reminderId);
  if (current.status === 'COMPLETED') {
    throw { status: 409, message: 'No se puede editar un recordatorio completado' };
  }
  const reminder = await prisma.expenseReminder.update({
    where: { id: reminderId },
    data: {
      ...(dto.title !== undefined && { title: dto.title.trim() }),
      ...(dto.dueDate !== undefined && { dueDate: parseIsoDateString(dto.dueDate) }),
      ...(dto.priority !== undefined && { priority: dto.priority }),
      ...(dto.recurrence !== undefined && { recurrence: dto.recurrence }),
      ...(dto.description !== undefined && { description: dto.description }),
    },
  });
  return mapReminder(reminder);
}

export async function deleteReminder(userId: string, reminderId: string) {
  await getOwnedReminder(userId, reminderId);
  await prisma.expenseReminder.delete({ where: { id: reminderId } });
}

export async function completeReminder(userId: string, reminderId: string, dto: CompleteExpenseReminderPayload) {
  const reminder = await getOwnedReminder(userId, reminderId);
  if (reminder.status !== 'PENDING') {
    throw { status: 409, message: 'El recordatorio ya está completado' };
  }

  const expenseDate = dto.expenseDate ? parseIsoDateString(dto.expenseDate) : startOfTodayInAppTz();

  const result = await prisma.$transaction(async tx => {
    const expense = await tx.personalExpense.create({
      data: {
        userId,
        concept: reminder.title,
        amount: dto.amount,
        category: dto.category,
        date: expenseDate,
        reminderId: reminder.id,
      },
    });

    let updatedReminder;
    if (reminder.recurrence === 'ONCE') {
      updatedReminder = await tx.expenseReminder.update({
        where: { id: reminderId },
        data: { status: 'COMPLETED' },
      });
    } else {
      updatedReminder = await tx.expenseReminder.update({
        where: { id: reminderId },
        data: { dueDate: addOneMonthSameDay(reminder.dueDate) },
      });
    }

    return { expense, reminder: updatedReminder };
  });

  return {
    expense: mapExpense(result.expense),
    reminder: mapReminder(result.reminder),
  };
}

export async function snoozeReminder(userId: string, reminderId: string, dto: SnoozeExpenseReminderPayload) {
  const reminder = await getOwnedReminder(userId, reminderId);
  if (reminder.status !== 'PENDING') {
    throw { status: 409, message: 'Solo se pueden posponer recordatorios pendientes' };
  }

  let dueDate: Date;
  if (dto.days != null) {
    dueDate = startOfTodayInAppTz();
    dueDate.setUTCDate(dueDate.getUTCDate() + dto.days);
  } else {
    dueDate = parseIsoDateString(dto.until!);
  }

  const updated = await prisma.expenseReminder.update({
    where: { id: reminderId },
    data: { dueDate },
  });
  return mapReminder(updated);
}
