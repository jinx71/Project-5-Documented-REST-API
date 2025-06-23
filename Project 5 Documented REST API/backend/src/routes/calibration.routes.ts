import { Router } from 'express';
import * as calibrationController from '../controllers/calibration.controller';
import { validate } from '../middleware/validate';
import {
  createCalibrationSchema,
  listCalibrationsSchema,
} from '../schemas/calibration.schema';

// mergeParams gives access to :instrumentId from the parent router
const router = Router({ mergeParams: true });

router.get('/', validate(listCalibrationsSchema), calibrationController.list);
router.post('/', validate(createCalibrationSchema), calibrationController.create);

export default router;
