import { z } from 'zod';

export const calibrationResultEnum = z.enum(['PASS', 'FAIL', 'CONDITIONAL']);

export const createCalibrationSchema = z.object({
  params: z.object({ instrumentId: z.string().uuid() }),
  body: z.object({
    performedBy: z.string().min(2).max(120),
    performedAt: z.string().datetime(),
    result: calibrationResultEnum,
    certificateNumber: z.string().max(80).optional(),
    notes: z.string().max(1000).optional(),
    nextDueDate: z.string().datetime().optional(),
  }),
});

export const listCalibrationsSchema = z.object({
  params: z.object({ instrumentId: z.string().uuid() }),
});

export type CreateCalibrationInput = z.infer<typeof createCalibrationSchema>['body'];
