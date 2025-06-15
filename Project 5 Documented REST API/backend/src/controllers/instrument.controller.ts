import { Request, Response, NextFunction } from 'express';
import * as instrumentService from '../services/instrument.service';
import { ok } from '../utils/apiResponse';
import { ListInstrumentsQuery } from '../schemas/instrument.schema';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query as unknown as ListInstrumentsQuery;
    const { instruments, meta } = await instrumentService.listInstruments(query);
    return ok(res, instruments, 'Instruments retrieved', 200, meta);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const instrument = await instrumentService.getInstrumentById(req.params.id);
    return ok(res, instrument, 'Instrument retrieved');
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const instrument = await instrumentService.createInstrument(req.body);
    return ok(res, instrument, 'Instrument created', 201);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const instrument = await instrumentService.updateInstrument(req.params.id, req.body);
    return ok(res, instrument, 'Instrument updated');
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await instrumentService.deleteInstrument(req.params.id);
    return ok(res, null, 'Instrument deleted');
  } catch (err) {
    next(err);
  }
};
