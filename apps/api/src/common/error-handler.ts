import type { Request, Response, NextFunction } from "express";
import { config } from "../config";
import { logger } from "./logger";

export interface AppError {
  status?: number;
  message: string;
  errors?: Record<string, string[]>;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const status = err.status ?? 500;

  if (status === 500) {
    logger.error(err, "Unhandled error");
  }

  const message =
    status === 500 && config.isProduction
      ? "Internal Server Error"
      : (err.message ?? "Internal Server Error");

  res.status(status).json({
    statusCode: status,
    message,
    ...(err.errors && { errors: err.errors }),
  });
}
