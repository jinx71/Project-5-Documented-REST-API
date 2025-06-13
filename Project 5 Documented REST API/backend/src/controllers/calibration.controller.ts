import { Request, Response, NextFunction } from 'express';
import * as calibrationService from '../services/calibration.service';
import { ok } from '../utils/apiResponse';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const records = await calibrationService.listCalibrations(req.params.instrumentId);
    return ok(res, records, 'Calibration records retrieved');
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await calibrationService.createCalibration(req.params.instrumentId, req.body);
    return ok(res, record, 'Calibration record created', 201);
  } catch (err) {
    next(err);
  }
};
