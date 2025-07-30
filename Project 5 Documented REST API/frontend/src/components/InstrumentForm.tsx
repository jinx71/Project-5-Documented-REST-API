import { useState, type FormEvent } from 'react';
import type {
  CreateInstrumentPayload,
  Instrument,
  InstrumentStatus,
  ValidationDetail,
} from '../types';
import { STATUS_LABELS } from '../lib/format';
import { Button, Field, Select, TextInput } from './ui';

const STATUSES: InstrumentStatus[] = ['ACTIVE', 'UNDER_MAINTENANCE', 'OUT_OF_SERVICE', 'RETIRED'];

// The API validates dates as full ISO 8601; a <input type="date"> yields YYYY-MM-DD
const toIso = (value: string): string | undefined => (value ? new Date(value).toISOString() : undefined);
const toDateInput = (iso: string | null | undefined): string =>
  iso ? new Date(iso).toISOString().slice(0, 10) : '';

interface Props {
  initial?: Instrument;
  submitting: boolean;
  serverErrors?: ValidationDetail[];
  onSubmit: (payload: CreateInstrumentPayload) => void;
  onCancel: () => void;
}

export const InstrumentForm = ({ initial, submitting, serverErrors, onSubmit, onCancel }: Props) => {
  const [name, setName] = useState(initial?.name ?? '');
  const [serialNumber, setSerialNumber] = useState(initial?.serialNumber ?? '');
  const [category, setCategory] = useState(initial?.category ?? '');
  const [manufacturer, setManufacturer] = useState(initial?.manufacturer ?? '');
  const [location, setLocation] = useState(initial?.location ?? 'Dublin — QC Lab');
  const [status, setStatus] = useState<InstrumentStatus>(initial?.status ?? 'ACTIVE');
  const [calibrationDueDate, setCalibrationDueDate] = useState(toDateInput(initial?.calibrationDueDate));

  // Server validation paths arrive prefixed with "body." — match either form
  const errorFor = (field: string) =>
    serverErrors?.find((e) => e.field === `body.${field}` || e.field === field)?.message;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      serialNumber: serialNumber.trim(),
      category: category.trim(),
      manufacturer: manufacturer.trim() || undefined,
      location: location.trim(),
      status,
      calibrationDueDate: toIso(calibrationDueDate),
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label="Instrument name" htmlFor="name" required error={errorFor('name')}>
        <TextInput
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Agilent 1260 Infinity II"
          required
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Serial number" htmlFor="serial" required error={errorFor('serialNumber')}>
          <TextInput
            id="serial"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            placeholder="HPLC-2024-0042"
            className="font-mono"
            required
          />
        </Field>
        <Field label="Category" htmlFor="category" required error={errorFor('category')}>
          <TextInput
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="HPLC"
            required
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Manufacturer" htmlFor="manufacturer" error={errorFor('manufacturer')}>
          <TextInput
            id="manufacturer"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            placeholder="Agilent Technologies"
          />
        </Field>
        <Field label="Location" htmlFor="location" required error={errorFor('location')}>
          <TextInput id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Status" htmlFor="status">
          <Select id="status" value={status} onChange={(e) => setStatus(e.target.value as InstrumentStatus)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Calibration due" htmlFor="due" error={errorFor('calibrationDueDate')}>
          <TextInput
            id="due"
            type="date"
            value={calibrationDueDate}
            onChange={(e) => setCalibrationDueDate(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {initial ? 'Save changes' : 'Add instrument'}
        </Button>
      </div>
    </form>
  );
};
