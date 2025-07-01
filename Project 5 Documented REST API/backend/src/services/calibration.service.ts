import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { CreateCalibrationInput } from '../schemas/calibration.schema';

const assertInstrumentExists = async (instrumentId: string) => {
  const exists = await prisma.instrument.findUnique({ where: { id: instrumentId } });
  if (!exists) throw new AppError('Instrument not found', 404);
};

export const listCalibrations = async (instrumentId: string) => {
  await assertInstrumentExists(instrumentId);
  return prisma.calibrationRecord.findMany({
    where: { instrumentId },
    orderBy: { performedAt: 'desc' },
  });
};

export const createCalibration = async (instrumentId: string, input: CreateCalibrationInput) => {
  await assertInstrumentExists(instrumentId);

  // Logging a calibration also advances the instrument's due date — one atomic transaction
  const [record] = await prisma.$transaction([
    prisma.calibrationRecord.create({
      data: {
        instrumentId,
        performedBy: input.performedBy,
        performedAt: new Date(input.performedAt),
        result: input.result,
        certificateNumber: input.certificateNumber,
        notes: input.notes,
        nextDueDate: input.nextDueDate ? new Date(input.nextDueDate) : null,
      },
    }),
    ...(input.nextDueDate
      ? [
          prisma.instrument.update({
            where: { id: instrumentId },
            data: { calibrationDueDate: new Date(input.nextDueDate) },
          }),
        ]
      : []),
  ]);

  return record;
};
