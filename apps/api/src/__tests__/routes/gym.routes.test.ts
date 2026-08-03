import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

import { createTestApp } from '../../test/createTestApp';
import { AUTH_HEADER, TEST_USER } from '../../test/constants';
import { gymPlanDetail, paginatedEmpty } from '../../test/fixtures/lifestyle';
import * as gymService from '../../gym/gym.service';

vi.mock('../../gym/gym.service');

const mockedGym = vi.mocked(gymService);

describe('gym routes', () => {
  const app = createTestApp();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedGym.listPlans.mockResolvedValue(paginatedEmpty);
    mockedGym.getPlan.mockResolvedValue(gymPlanDetail);
    mockedGym.createPlan.mockResolvedValue(gymPlanDetail);
    mockedGym.archivePlan.mockResolvedValue({ ...gymPlanDetail, status: 'ARCHIVED' });
    mockedGym.addExercise.mockResolvedValue(gymPlanDetail);
    mockedGym.updateExercise.mockResolvedValue(gymPlanDetail);
    mockedGym.updateExerciseWeight.mockResolvedValue(gymPlanDetail.days[0]!.exercises[0]!);
    mockedGym.deleteExercise.mockResolvedValue(undefined);
  });

  it('returns 401 without auth on GET /plans', async () => {
    const res = await request(app).get('/api/gym/plans');
    expect(res.status).toBe(401);
  });

  it('GET /plans returns paginated plans', async () => {
    const res = await request(app).get('/api/gym/plans').set('Authorization', AUTH_HEADER);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(paginatedEmpty);
    expect(mockedGym.listPlans).toHaveBeenCalledWith(TEST_USER.userId, expect.any(Object));
  });

  it('GET /plans/:planId returns plan detail', async () => {
    const res = await request(app).get('/api/gym/plans/plan-1').set('Authorization', AUTH_HEADER);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(gymPlanDetail);
    expect(mockedGym.getPlan).toHaveBeenCalledWith(TEST_USER.userId, 'plan-1');
  });

  it('POST /plans creates a plan', async () => {
    const res = await request(app)
      .post('/api/gym/plans')
      .set('Authorization', AUTH_HEADER)
      .send({ name: 'Nuevo plan' });
    expect(res.status).toBe(201);
    expect(mockedGym.createPlan).toHaveBeenCalledWith(TEST_USER.userId, { name: 'Nuevo plan' });
  });

  it('POST /plans rejects invalid body', async () => {
    const res = await request(app).post('/api/gym/plans').set('Authorization', AUTH_HEADER).send({ name: '' });
    expect(res.status).toBe(400);
    expect(mockedGym.createPlan).not.toHaveBeenCalled();
  });

  it('POST /plans/:planId/archive archives plan', async () => {
    const res = await request(app).post('/api/gym/plans/plan-1/archive').set('Authorization', AUTH_HEADER);
    expect(res.status).toBe(200);
    expect(mockedGym.archivePlan).toHaveBeenCalledWith(TEST_USER.userId, 'plan-1');
  });

  it('POST /exercises adds exercise to plan', async () => {
    const payload = {
      planId: 'plan-1',
      dayLabel: 'Lunes',
      name: 'Sentadilla',
      sets: 4,
      reps: '6',
    };
    const res = await request(app).post('/api/gym/exercises').set('Authorization', AUTH_HEADER).send(payload);
    expect(res.status).toBe(201);
    expect(mockedGym.addExercise).toHaveBeenCalledWith(TEST_USER.userId, payload);
  });

  it('PATCH /exercises/:id updates exercise', async () => {
    const res = await request(app)
      .patch('/api/gym/exercises/ex-1')
      .set('Authorization', AUTH_HEADER)
      .send({ name: 'Press inclinado' });
    expect(res.status).toBe(200);
    expect(mockedGym.updateExercise).toHaveBeenCalledWith(TEST_USER.userId, 'ex-1', { name: 'Press inclinado' });
  });

  it('PATCH /exercises/:id/weight updates weight', async () => {
    const res = await request(app)
      .patch('/api/gym/exercises/ex-1/weight')
      .set('Authorization', AUTH_HEADER)
      .send({ weightKg: 62.5 });
    expect(res.status).toBe(200);
    expect(mockedGym.updateExerciseWeight).toHaveBeenCalledWith(TEST_USER.userId, 'ex-1', { weightKg: 62.5 });
  });

  it('DELETE /exercises/:id returns 204', async () => {
    const res = await request(app).delete('/api/gym/exercises/ex-1').set('Authorization', AUTH_HEADER);
    expect(res.status).toBe(204);
    expect(mockedGym.deleteExercise).toHaveBeenCalledWith(TEST_USER.userId, 'ex-1');
  });

  it('propagates service errors with status', async () => {
    mockedGym.getPlan.mockRejectedValue({ status: 404, message: 'Plan no encontrado' });
    const res = await request(app).get('/api/gym/plans/missing').set('Authorization', AUTH_HEADER);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Plan no encontrado');
  });
});
