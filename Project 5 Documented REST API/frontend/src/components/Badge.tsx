import type { CalibrationResult, InstrumentStatus } from '../types';
import { RESULT_LABELS, STATUS_LABELS } from '../lib/format';

const base =
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset';

const STATUS_STYLES: Record<InstrumentStatus, string> = {
  ACTIVE: 'bg-ok/10 text-ok ring-ok/30',
  UNDER_MAINTENANCE: 'bg-warn/10 text-warn ring-warn/30',
  OUT_OF_SERVICE: 'bg-danger/10 text-danger ring-danger/30',
  RETIRED: 'bg-retired/10 text-retired ring-retired/30',
};

const RESULT_STYLES: Record<CalibrationResult, string> = {
  PASS: 'bg-ok/10 text-ok ring-ok/30',
  FAIL: 'bg-danger/10 text-danger ring-danger/30',
  CONDITIONAL: 'bg-warn/10 text-warn ring-warn/30',
};

export const StatusBadge = ({ status }: { status: InstrumentStatus }) => (
  <span className={`${base} ${STATUS_STYLES[status]}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {STATUS_LABELS[status]}
  </span>
);

export const ResultBadge = ({ result }: { result: CalibrationResult }) => (
  <span className={`${base} ${RESULT_STYLES[result]}`}>{RESULT_LABELS[result]}</span>
);
