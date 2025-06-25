import { Router } from 'express';
import * as instrumentController from '../controllers/instrument.controller';
import { validate } from '../middleware/validate';
import {
  createInstrumentSchema,
  updateInstrumentSchema,
  instrumentIdSchema,
  listInstrumentsSchema,
} from '../schemas/instrument.schema';
import calibrationRoutes from './calibration.routes';

const router = Router();

router.get('/', validate(listInstrumentsSchema), instrumentController.list);
router.post('/', validate(createInstrumentSchema), instrumentController.create);
router.get('/:id', validate(instrumentIdSchema), instrumentController.getById);
router.patch('/:id', validate(updateInstrumentSchema), instrumentController.update);
router.delete('/:id', validate(instrumentIdSchema), instrumentController.remove);

// Nested resource: /instruments/:instrumentId/calibrations
router.use('/:instrumentId/calibrations', calibrationRoutes);

export default router;
