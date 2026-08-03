import type { NextFunction, Request, Response } from 'express';
import { vi } from 'vitest';

import { AUTH_HEADER, TEST_USER } from './constants';

function authenticateTestUser(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header === AUTH_HEADER || header === 'Bearer omni_pi_test-token') {
    req.user = TEST_USER;
    next();
    return;
  }
  next({ status: 401, message: 'No autorizado' });
}

vi.mock('../auth/middleware/auth.middleware', () => ({
  authenticateJwt: authenticateTestUser,
  authenticateLocal: (_req: Request, _res: Response, next: NextFunction) => next(),
  authenticateJwtRefresh: (_req: Request, _res: Response, next: NextFunction) => next(),
}));

vi.mock('../notifications/notifications.middleware', () => ({
  authenticateNotifications: authenticateTestUser,
}));
