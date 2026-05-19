import type { Request, Response, NextFunction } from 'express';
import { getConfig } from '../../config';
import { logger } from './logger';

export interface AppError {
  status?: number;
  message: string;
  errors?: Record<string, string[]>;
}

export function errorHandler(err: AppError, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status ?? 500;

  if (status === 500) {
    logger.error(err, 'Unhandled error');
  }

  const config = getConfig();
  const message =
    status === 500 && config.isProduction
      ? 'Error interno del servidor'
      : (err.message ?? 'Error interno del servidor');

  res.status(status).json({
    statusCode: status,
    message,
    ...(err.errors && { errors: err.errors }),
  });
}
