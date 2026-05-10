import type { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

type ValidationTarget = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req[target] = schema.parse(req[target]);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        next({ status: 400, message: 'Validation error', errors: err.flatten().fieldErrors });
      } else {
        next(err);
      }
    }
  };
}
