export type InstrumentStatus = 'ACTIVE' | 'UNDER_MAINTENANCE' | 'OUT_OF_SERVICE' | 'RETIRED';

export type CalibrationResult = 'PASS' | 'FAIL' | 'CONDITIONAL';

export interface CalibrationRecord {
  id: string;
  instrumentId: string;
  performedBy: string;
  performedAt: string;
  result: CalibrationResult;
  certificateNumber: string | null;
  notes: string | null;
  nextDueDate: string | null;
  createdAt: string;
}

export interface Instrument {
  id: string;
  name: string;
  serialNumber: string;
  category: string;
  manufacturer: string | null;
  location: string;
  status: InstrumentStatus;
  calibrationDueDate: string | null;
  createdAt: string;
  updatedAt: string;
  calibrations?: CalibrationRecord[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  meta?: PaginationMeta;
}

export interface ValidationDetail {
  field: string;
  message: string;
}

export interface CreateInstrumentPayload {
  name: string;
  serialNumber: string;
  category: string;
  manufacturer?: string;
  location: string;
  status?: InstrumentStatus;
  calibrationDueDate?: string;
}

export type UpdateInstrumentPayload = Partial<CreateInstrumentPayload>;

export interface CreateCalibrationPayload {
  performedBy: string;
  performedAt: string;
  result: CalibrationResult;
  certificateNumber?: string;
  notes?: string;
  nextDueDate?: string;
}
