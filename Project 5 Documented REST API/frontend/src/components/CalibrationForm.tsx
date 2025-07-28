import { useState, type FormEvent } from 'react';
import type { CalibrationResult, CreateCalibrationPayload, ValidationDetail } from '../types';
import { RESULT_LABELS } from '../lib/format';
import { Button, Field, Select, Textarea, TextInput } from './ui';

const RESULTS: CalibrationResult[] = ['PASS', 'CONDITIONAL', 'FAIL'];

const toIso = (value: string): string | undefined => (value ? new Date(value).toISOString() : undefined);

// Default "performed at" = now, formatted for a datetime-local input (YYYY-MM-DDTHH:mm)
const nowLocal = (): string => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

interface Props {
  submitting: boolean;
  serverErrors?: ValidationDetail[];
  onSubmit: (payload: CreateCalibrationPayload) => void;
}

export const CalibrationForm = ({ submitting, serverErrors, onSubmit }: Props) => {
  const [performedBy, setPerformedBy] = useState('');
  const [performedAt, setPerformedAt] = useState(nowLocal());
  const [result, setResult] = useState<CalibrationResult>('PASS');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [nextDueDate, setNextDueDate] = useState('');

  const errorFor = (field: string) =>
    serverErrors?.find((e) => e.field === `body.${field}` || e.field === field)?.message;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      performedBy: performedBy.trim(),
      performedAt: toIso(performedAt) ?? new Date().toISOString(),
      result,
      certificateNumber: certificateNumber.trim() || undefined,
      notes: notes.trim() || undefined,
      nextDueDate: toIso(nextDueDate),
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Performed by" htmlFor="performedBy" required error={errorFor('performedBy')}>
          <TextInput
            id="performedBy"
            value={performedBy}
            onChange={(e) => setPerformedBy(e.target.value)}
            placeholder="S. Karim"
            required
          />
        </Field>
        <Field label="Performed at" htmlFor="performedAt" required error={errorFor('performedAt')}>
          <TextInput
            id="performedAt"
            type="datetime-local"
            value={performedAt}
            onChange={(e) => setPerformedAt(e.target.value)}
            required
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Result" htmlFor="result">
          <Select id="result" value={result} onChange={(e) => setResult(e.target.value as CalibrationResult)}>
            {RESULTS.map((r) => (
              <option key={r} value={r}>
                {RESULT_LABELS[r]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Certificate number" htmlFor="cert" error={errorFor('certificateNumber')}>
          <TextInput
            id="cert"
            value={certificateNumber}
            onChange={(e) => setCertificateNumber(e.target.value)}
            placeholder="CAL-2026-0117"
            className="font-mono"
          />
        </Field>
      </div>

      <Field label="Next due date" htmlFor="nextDue" error={errorFor('nextDueDate')}>
        <TextInput
          id="nextDue"
          type="date"
          value={nextDueDate}
          onChange={(e) => setNextDueDate(e.target.value)}
        />
      </Field>
      <p className="-mt-2 font-mono text-[11px] text-muted">
        Setting a next due date advances the instrument’s calibration due date.
      </p>

      <Field label="Notes" htmlFor="notes" error={errorFor('notes')}>
        <Textarea
          id="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Calibrated against NIST-traceable reference."
        />
      </Field>

      <div className="flex justify-end">
        <Button type="submit" loading={submitting}>
          Log calibration
        </Button>
      </div>
    </form>
  );
};
