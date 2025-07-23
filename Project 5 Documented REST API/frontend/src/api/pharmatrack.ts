import { client, toApiError } from './client';
import type {
  ApiResponse,
  CalibrationRecord,
  CreateCalibrationPayload,
  CreateInstrumentPayload,
  Instrument,
  InstrumentStatus,
  PaginationMeta,
  UpdateInstrumentPayload,
} from '../types';

export interface ListParams {
  page?: number;
  limit?: number;
  status?: InstrumentStatus;
  category?: string;
  search?: string;
}

export interface InstrumentList {
  instruments: Instrument[];
  meta: PaginationMeta;
}

export const checkHealth = async (): Promise<boolean> => {
  try {
    await client.get('/health');
    return true;
  } catch {
    return false;
  }
};

export const listInstruments = async (params: ListParams): Promise<InstrumentList> => {
  try {
    const res = await client.get<ApiResponse<Instrument[]>>('/instruments', { params });
    return {
      instruments: res.data.data,
      meta:
        res.data.meta ??
        { page: 1, limit: params.limit ?? 10, total: res.data.data.length, totalPages: 1 },
    };
  } catch (err) {
    throw toApiError(err);
  }
};

export const getInstrument = async (id: string): Promise<Instrument> => {
  try {
    const res = await client.get<ApiResponse<Instrument>>(`/instruments/${id}`);
    return res.data.data;
  } catch (err) {
    throw toApiError(err);
  }
};

export const createInstrument = async (payload: CreateInstrumentPayload): Promise<Instrument> => {
  try {
    const res = await client.post<ApiResponse<Instrument>>('/instruments', payload);
    return res.data.data;
  } catch (err) {
    throw toApiError(err);
  }
};

export const updateInstrument = async (
  id: string,
  payload: UpdateInstrumentPayload
): Promise<Instrument> => {
  try {
    const res = await client.patch<ApiResponse<Instrument>>(`/instruments/${id}`, payload);
    return res.data.data;
  } catch (err) {
    throw toApiError(err);
  }
};

export const deleteInstrument = async (id: string): Promise<void> => {
  try {
    await client.delete(`/instruments/${id}`);
  } catch (err) {
    throw toApiError(err);
  }
};

export const listCalibrations = async (instrumentId: string): Promise<CalibrationRecord[]> => {
  try {
    const res = await client.get<ApiResponse<CalibrationRecord[]>>(
      `/instruments/${instrumentId}/calibrations`
    );
    return res.data.data;
  } catch (err) {
    throw toApiError(err);
  }
};

export const createCalibration = async (
  instrumentId: string,
  payload: CreateCalibrationPayload
): Promise<CalibrationRecord> => {
  try {
    const res = await client.post<ApiResponse<CalibrationRecord>>(
      `/instruments/${instrumentId}/calibrations`,
      payload
    );
    return res.data.data;
  } catch (err) {
    throw toApiError(err);
  }
};
