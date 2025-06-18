import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { fail } from '../utils/apiResponse';

export class AppError extends Error {
  constructor(public message: string, public statusCode = 400) {
    super(message);
    this.name = 'AppError';
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return fail(res, err.message, err.statusCode);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return fail(res, 'A record with this unique value already exists (serialNumber)', 409);
    }
    if (err.code === 'P2025') {
      return fail(res, 'Record not found', 404);
    }
  }

  console.error('[UNHANDLED ERROR]', err);
  return fail(res, 'Internal server error', 500);
};
