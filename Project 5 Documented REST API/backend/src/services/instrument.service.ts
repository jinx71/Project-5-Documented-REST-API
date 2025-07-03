import { Prisma } from '@prisma/client';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import {
  CreateInstrumentInput,
  UpdateInstrumentInput,
  ListInstrumentsQuery,
} from '../schemas/instrument.schema';

export const listInstruments = async (query: ListInstrumentsQuery) => {
  const { page, limit, status, category, search } = query;

  const where: Prisma.InstrumentWhereInput = {
    ...(status && { status }),
    ...(category && { category: { equals: category, mode: 'insensitive' } }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { serialNumber: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const [total, instruments] = await prisma.$transaction([
    prisma.instrument.count({ where }),
    prisma.instrument.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    instruments,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getInstrumentById = async (id: string) => {
  const instrument = await prisma.instrument.findUnique({
    where: { id },
    include: { calibrations: { orderBy: { performedAt: 'desc' }, take: 5 } },
  });
  if (!instrument) throw new AppError('Instrument not found', 404);
  return instrument;
};

export const createInstrument = async (input: CreateInstrumentInput) => {
  return prisma.instrument.create({
    data: {
      ...input,
      calibrationDueDate: input.calibrationDueDate ? new Date(input.calibrationDueDate) : null,
    },
  });
};

export const updateInstrument = async (id: string, input: UpdateInstrumentInput) => {
  return prisma.instrument.update({
    where: { id },
    data: {
      ...input,
      ...(input.calibrationDueDate !== undefined && {
        calibrationDueDate: input.calibrationDueDate ? new Date(input.calibrationDueDate) : null,
      }),
    },
  });
};

export const deleteInstrument = async (id: string) => {
  await prisma.instrument.delete({ where: { id } });
};
