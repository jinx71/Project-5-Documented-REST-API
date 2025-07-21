import axios, { AxiosError } from 'axios';
import type { ApiResponse, ValidationDetail } from '../types';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1';

export const client = axios.create({ baseURL, timeout: 10000 });

// Carries the server's message plus any per-field validation errors so the UI can render them
export class ApiError extends Error {
  status?: number;
  details?: ValidationDetail[];

  constructor(message: string, status?: number, details?: ValidationDetail[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

// Why: the API always answers with { success, data, message }, so failures carry a usable
// message (and a details array on 422) — we surface those instead of a raw axios string.
export const toApiError = (err: unknown): ApiError => {
  if (axios.isAxiosError(err)) {
    const axErr = err as AxiosError<ApiResponse<unknown>>;
    const body = axErr.response?.data;
    const message = body?.message ?? axErr.message ?? 'Request failed';
    const details = Array.isArray(body?.data) ? (body?.data as ValidationDetail[]) : undefined;
    return new ApiError(message, axErr.response?.status, details);
  }
  return new ApiError('Unexpected error');
};
