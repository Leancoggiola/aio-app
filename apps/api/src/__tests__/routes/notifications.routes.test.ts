import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

import { createTestApp } from '../../test/createTestApp';
import { AUTH_HEADER, TEST_USER } from '../../test/constants';
import { notificationDevice, notificationDigest } from '../../test/fixtures/lifestyle';
import * as notificationsService from '../../notifications/notifications.service';

vi.mock('../../notifications/notifications.service');

const mockedNotifications = vi.mocked(notificationsService);

describe('notifications routes', () => {
  const app = createTestApp();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedNotifications.getDigestForUser.mockResolvedValue(notificationDigest);
    mockedNotifications.listDevices.mockResolvedValue([notificationDevice]);
    mockedNotifications.registerDevice.mockResolvedValue({
      id: 'dev-1',
      platform: 'WEB',
      label: 'Chrome',
      apiKey: undefined,
    });
    mockedNotifications.deleteDevice.mockResolvedValue(undefined);
  });

  it('returns 401 without auth on GET /digest', async () => {
    const res = await request(app).get('/api/notifications/digest');
    expect(res.status).toBe(401);
  });

  it('GET /digest returns digest for authenticated user', async () => {
    const res = await request(app).get('/api/notifications/digest').set('Authorization', AUTH_HEADER);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(notificationDigest);
    expect(mockedNotifications.getDigestForUser).toHaveBeenCalledWith(TEST_USER.userId);
  });

  it('GET /digest accepts Pi bearer token via notifications auth', async () => {
    const res = await request(app).get('/api/notifications/digest').set('Authorization', 'Bearer omni_pi_test-token');
    expect(res.status).toBe(200);
  });

  it('GET /devices lists devices without secrets', async () => {
    const res = await request(app).get('/api/notifications/devices').set('Authorization', AUTH_HEADER);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([notificationDevice]);
    expect(mockedNotifications.listDevices).toHaveBeenCalledWith(TEST_USER.userId);
  });

  it('POST /devices registers device', async () => {
    const res = await request(app)
      .post('/api/notifications/devices')
      .set('Authorization', AUTH_HEADER)
      .send({ platform: 'WEB', label: 'Chrome' });
    expect(res.status).toBe(201);
    expect(mockedNotifications.registerDevice).toHaveBeenCalledWith(TEST_USER.userId, {
      platform: 'WEB',
      label: 'Chrome',
    });
  });

  it('POST /devices rejects invalid platform', async () => {
    const res = await request(app)
      .post('/api/notifications/devices')
      .set('Authorization', AUTH_HEADER)
      .send({ platform: 'INVALID' });
    expect(res.status).toBe(400);
    expect(mockedNotifications.registerDevice).not.toHaveBeenCalled();
  });

  it('DELETE /devices/:id returns 204', async () => {
    const res = await request(app).delete('/api/notifications/devices/dev-1').set('Authorization', AUTH_HEADER);
    expect(res.status).toBe(204);
    expect(mockedNotifications.deleteDevice).toHaveBeenCalledWith(TEST_USER.userId, 'dev-1');
  });
});
