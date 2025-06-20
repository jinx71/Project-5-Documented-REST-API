import { Request, Response } from 'express';
import { fail } from '../utils/apiResponse';

export const notFound = (req: Request, res: Response) => {
  return fail(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
};
