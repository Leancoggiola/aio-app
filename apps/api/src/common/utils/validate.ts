import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

type ValidationTarget = 'body' | 'query' | 'params';

export function validate(schema: z.ZodType, target: ValidationTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req[target] = schema.parse(req[target]);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        next({
          status: 400,
          message: 'Error de validación',
          errors: z.flattenError(err).fieldErrors,
        });
      } else {
        next(err);
      }
    }
  };
}
