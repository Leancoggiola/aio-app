import type { Request, Response, NextFunction } from 'express';

export interface AppError {
  status?: number;
  message: string;
  errors?: Record<string, string[]>;
}

export function errorHandler(err: AppError, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status ?? 500;
  res.status(status).json({
    statusCode: status,
    message: err.message ?? 'Internal Server Error',
    ...(err.errors && { errors: err.errors }),
  });
}
