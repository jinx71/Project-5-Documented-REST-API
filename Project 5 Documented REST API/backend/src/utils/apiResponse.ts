import { Response } from 'express';

interface Meta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export const ok = (
  res: Response,
  data: unknown,
  message = 'Success',
  status = 200,
  meta?: Meta
): Response => {
  return res.status(status).json({ success: true, data, message, ...(meta && { meta }) });
};

export const fail = (res: Response, message: string, status = 400, data: unknown = null): Response => {
  return res.status(status).json({ success: false, data, message });
};
