import type { Request, Response, NextFunction } from 'express';

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req.user as { userId: string; username: string; role: string };

  if (!user || user.role !== 'ADMIN') {
    res.status(403).json({ message: 'Acceso denegado: se requiere rol ADMIN' });
    return;
  }

  next();
}
