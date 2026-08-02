import type { NextFunction, Request, Response } from 'express';
import passport from 'passport';

import { resolveUserIdFromDeviceToken } from './notifications.service';

/** JWT (cookie/Bearer) or Raspberry Pi device API key. */
export async function authenticateNotifications(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer omni_pi_')) {
    const token = authHeader.slice('Bearer '.length);
    const userId = await resolveUserIdFromDeviceToken(token);
    if (!userId) {
      next({ status: 401, message: 'Device token inválido' });
      return;
    }
    req.user = { userId, username: '', role: 'USER' };
    next();
    return;
  }

  passport.authenticate('jwt', { session: false }, (err: unknown, user: Express.User | false) => {
    if (err) return next(err);
    if (!user) {
      next({ status: 401, message: 'No autenticado' });
      return;
    }
    req.user = user;
    next();
  })(req, res, next);
}
