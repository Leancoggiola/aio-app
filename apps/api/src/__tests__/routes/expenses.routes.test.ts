import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

import { createTestApp } from '../../test/createTestApp';
import { AUTH_HEADER, TEST_USER } from '../../test/constants';
import { expenseReminder, expensesSummary, paginatedEmpty } from '../../test/fixtures/lifestyle';
import * as expensesService from '../../expenses/expenses.service';

vi.mock('../../expenses/expenses.service');

const mockedExpenses = vi.mocked(expensesService);

describe('expenses routes', () => {
  const app = createTestApp();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedExpenses.getSummary.mockResolvedValue(expensesSummary);
    mockedExpenses.listReminders.mockResolvedValue([expenseReminder]);
    mockedExpenses.createReminder.mockResolvedValue(expenseReminder);
    mockedExpenses.updateReminder.mockResolvedValue(expenseReminder);
    mockedExpenses.completeReminder.mockResolvedValue({
      expense: {
        id: 'exp-1',
        concept: 'Alquiler',
        amount: 150000,
        category: 'HOME',
        date: '2026-08-05',
        notes: null,
        reminderId: 'rem-1',
        createdAt: '2026-08-01T12:00:00.000Z',
        updatedAt: '2026-08-01T12:00:00.000Z',
      },
      reminder: expenseReminder,
    });
    mockedExpenses.snoozeReminder.mockResolvedValue(expenseReminder);
    mockedExpenses.deleteReminder.mockResolvedValue(undefined);
    mockedExpenses.listExpenses.mockResolvedValue(paginatedEmpty);
    mockedExpenses.createExpense.mockResolvedValue({
      id: 'exp-1',
      concept: 'Supermercado',
      amount: 5000,
      category: 'FOOD',
      date: '2026-08-02',
      notes: null,
      reminderId: null,
      createdAt: '2026-08-02T12:00:00.000Z',
      updatedAt: '2026-08-02T12:00:00.000Z',
    });
    mockedExpenses.updateExpense.mockResolvedValue({
      id: 'exp-1',
      concept: 'Supermercado',
      amount: 5500,
      category: 'FOOD',
      date: '2026-08-02',
      notes: null,
      reminderId: null,
      createdAt: '2026-08-02T12:00:00.000Z',
      updatedAt: '2026-08-02T12:00:00.000Z',
    });
    mockedExpenses.deleteExpense.mockResolvedValue(undefined);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/expenses/summary?month=2026-08');
    expect(res.status).toBe(401);
  });

  it('GET /summary requires month query', async () => {
    const res = await request(app).get('/api/expenses/summary').set('Authorization', AUTH_HEADER);
    expect(res.status).toBe(400);
  });

  it('GET /summary returns summary for month', async () => {
    const res = await request(app).get('/api/expenses/summary?month=2026-08').set('Authorization', AUTH_HEADER);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(expensesSummary);
    expect(mockedExpenses.getSummary).toHaveBeenCalledWith(
      TEST_USER.userId,
      expect.objectContaining({ month: '2026-08' })
    );
  });

  it('GET /reminders lists reminders', async () => {
    const res = await request(app).get('/api/expenses/reminders').set('Authorization', AUTH_HEADER);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([expenseReminder]);
  });

  it('POST /reminders creates reminder', async () => {
    const payload = {
      title: 'Alquiler',
      dueDate: '2026-08-05',
      recurrence: 'MONTHLY',
    };
    const res = await request(app).post('/api/expenses/reminders').set('Authorization', AUTH_HEADER).send(payload);
    expect(res.status).toBe(201);
    expect(mockedExpenses.createReminder).toHaveBeenCalledWith(TEST_USER.userId, expect.objectContaining(payload));
  });

  it('GET / requires month in query', async () => {
    const res = await request(app).get('/api/expenses').set('Authorization', AUTH_HEADER);
    expect(res.status).toBe(400);
  });

  it('GET / lists expenses for month', async () => {
    const res = await request(app).get('/api/expenses?month=2026-08').set('Authorization', AUTH_HEADER);
    expect(res.status).toBe(200);
    expect(mockedExpenses.listExpenses).toHaveBeenCalledWith(
      TEST_USER.userId,
      expect.objectContaining({ month: '2026-08' })
    );
  });

  it('POST / creates expense', async () => {
    const payload = {
      concept: 'Supermercado',
      amount: 5000,
      category: 'FOOD',
      date: '2026-08-02',
    };
    const res = await request(app).post('/api/expenses').set('Authorization', AUTH_HEADER).send(payload);
    expect(res.status).toBe(201);
    expect(mockedExpenses.createExpense).toHaveBeenCalledWith(TEST_USER.userId, payload);
  });

  it('DELETE /:expenseId returns 204', async () => {
    const res = await request(app).delete('/api/expenses/exp-1').set('Authorization', AUTH_HEADER);
    expect(res.status).toBe(204);
    expect(mockedExpenses.deleteExpense).toHaveBeenCalledWith(TEST_USER.userId, 'exp-1');
  });

  it('DELETE /reminders/:id returns 204', async () => {
    const res = await request(app).delete('/api/expenses/reminders/rem-1').set('Authorization', AUTH_HEADER);
    expect(res.status).toBe(204);
    expect(mockedExpenses.deleteReminder).toHaveBeenCalledWith(TEST_USER.userId, 'rem-1');
  });
});
