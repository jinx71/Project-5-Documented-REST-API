import { z } from 'zod';

export const instrumentStatusEnum = z.enum([
  'ACTIVE',
  'UNDER_MAINTENANCE',
  'OUT_OF_SERVICE',
  'RETIRED',
]);

export const createInstrumentSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    serialNumber: z.string().min(1).max(60),
    category: z.string().min(2).max(80),
    manufacturer: z.string().max(120).optional(),
    location: z.string().min(1).max(120),
    status: instrumentStatusEnum.optional(),
    calibrationDueDate: z.string().datetime().optional(),
  }),
});

export const updateInstrumentSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z
    .object({
      name: z.string().min(2).max(120),
      serialNumber: z.string().min(1).max(60),
      category: z.string().min(2).max(80),
      manufacturer: z.string().max(120).nullable(),
      location: z.string().min(1).max(120),
      status: instrumentStatusEnum,
      calibrationDueDate: z.string().datetime().nullable(),
    })
    .partial()
    .refine((b) => Object.keys(b).length > 0, { message: 'At least one field is required' }),
});

export const instrumentIdSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export const listInstrumentsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    status: instrumentStatusEnum.optional(),
    category: z.string().optional(),
    search: z.string().optional(),
  }),
});

export type CreateInstrumentInput = z.infer<typeof createInstrumentSchema>['body'];
export type UpdateInstrumentInput = z.infer<typeof updateInstrumentSchema>['body'];
export type ListInstrumentsQuery = z.infer<typeof listInstrumentsSchema>['query'];
