import type { CalibrationResult, InstrumentStatus } from '../types';

export const STATUS_LABELS: Record<InstrumentStatus, string> = {
  ACTIVE: 'Active',
  UNDER_MAINTENANCE: 'Under maintenance',
  OUT_OF_SERVICE: 'Out of service',
  RETIRED: 'Retired',
};

export const RESULT_LABELS: Record<CalibrationResult, string> = {
  PASS: 'Pass',
  FAIL: 'Fail',
  CONDITIONAL: 'Conditional',
};

export const formatDate = (iso: string | null | undefined): string => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
};

export const formatDateTime = (iso: string | null | undefined): string => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Whole days until the date; negative means overdue
export const daysUntil = (iso: string | null | undefined): number | null => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
};
