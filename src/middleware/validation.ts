import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

export const validateQuery = <T extends ZodSchema>(schema: T) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const result = schema.parse(req.query);
      req.query = result as typeof req.query;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        next(new ApiError(400, `Invalid query parameters: ${message}`));
      } else {
        next(error);
      }
    }
  };
};

export const validateParams = <T extends ZodSchema>(schema: T) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const result = schema.parse(req.params);
      req.params = result as typeof req.params;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        next(new ApiError(400, `Invalid parameters: ${message}`));
      } else {
        next(error);
      }
    }
  };
};

// Slug validation - only allows alphanumeric and hyphens
export const slugSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
});

// Pagination query schema
export const paginationSchema = z.object({
  page: z.string().optional().transform((val) => (val ? Math.max(1, parseInt(val, 10)) : 1)),
  limit: z.string().optional().transform((val) => (val ? Math.min(50, Math.max(1, parseInt(val, 10))) : 10)),
  sort: z.enum(['latest', 'popular', 'trending']).optional().default('latest'),
});

// Infer types from schemas
export type SlugParams = z.infer<typeof slugSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
