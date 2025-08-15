import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ApiError } from '../api/client';
import {
  createCalibration,
  deleteInstrument,
  getInstrument,
  listCalibrations,
  updateInstrument,
} from '../api/pharmatrack';
import type {
  CalibrationRecord,
  CreateCalibrationPayload,
  CreateInstrumentPayload,
  Instrument,
  ValidationDetail,
} from '../types';
import { daysUntil, formatDate, formatDateTime } from '../lib/format';
import { useToast } from '../hooks/useToast';
import { ResultBadge, StatusBadge } from '../components/Badge';
import { InstrumentForm } from '../components/InstrumentForm';
import { CalibrationForm } from '../components/CalibrationForm';
import { Modal } from '../components/Modal';
import { TickScale } from '../components/TickScale';
import { Button, EmptyState, Spinner } from '../components/ui';

const Meta = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col gap-1 border-l-2 border-line pl-3">
    <dt className="text-[11px] font-medium uppercase tracking-wide text-muted">{label}</dt>
    <dd className="text-sm text-ink">{children}</dd>
  </div>
);

export const InstrumentDetailPage = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { notify } = useToast();

  const [instrument, setInstrument] = useState<Instrument | null>(null);
  const [calibrations, setCalibrations] = useState<CalibrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editErrors, setEditErrors] = useState<ValidationDetail[] | undefined>();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [calSubmitting, setCalSubmitting] = useState(false);
  const [calErrors, setCalErrors] = useState<ValidationDetail[] | undefined>();
  const [calFormKey, setCalFormKey] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [inst, cals] = await Promise.all([getInstrument(id), listCalibrations(id)]);
      setInstrument(inst);
      setCalibrations(cals);
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleEdit = async (payload: CreateInstrumentPayload) => {
    setEditing(true);
    setEditErrors(undefined);
    try {
      const updated = await updateInstrument(id, payload);
      setInstrument(updated);
      setEditOpen(false);
      notify('Instrument updated');
      await load();
    } catch (err) {
      const apiErr = err as ApiError;
      setEditErrors(apiErr.details);
      notify(apiErr.message, 'error');
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteInstrument(id);
      notify('Instrument deleted');
      navigate('/');
    } catch (err) {
      notify((err as ApiError).message, 'error');
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const handleLogCalibration = async (payload: CreateCalibrationPayload) => {
    setCalSubmitting(true);
    setCalErrors(undefined);
    try {
      await createCalibration(id, payload);
      notify('Calibration logged');
      setCalFormKey((k) => k + 1); // remount the form to reset its fields
      await load();
    } catch (err) {
      const apiErr = err as ApiError;
      setCalErrors(apiErr.details);
      notify(apiErr.message, 'error');
    } finally {
      setCalSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="flex items-center justify-center gap-2 text-sm text-muted">
          <Spinner className="h-5 w-5 text-brand" /> Loading instrument…
        </div>
      </div>
    );
  }

  if (error || !instrument) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="font-display text-lg font-semibold text-ink">Instrument unavailable</p>
        <p className="mx-auto mt-1 max-w-md font-mono text-xs text-danger">
          {error ?? 'Not found'}
        </p>
        <Link to="/" className="mt-4 inline-block text-sm font-medium text-brand hover:underline">
          Back to instruments
        </Link>
      </div>
    );
  }

  const days = daysUntil(instrument.calibrationDueDate);
  const overdue = days !== null && days < 0 && instrument.status !== 'RETIRED';
  const soon = days !== null && days >= 0 && days <= 30 && instrument.status !== 'RETIRED';

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-muted transition hover:text-ink"
      >
        ← Instruments
      </Link>

      <div className="mt-4 rounded-lg border border-line bg-panel">
        <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
                {instrument.name}
              </h1>
              <StatusBadge status={instrument.status} />
            </div>
            <p className="font-mono text-xs text-muted">{instrument.serialNumber}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setEditErrors(undefined);
                setEditOpen(true);
              }}
            >
              Edit
            </Button>
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>
              Delete
            </Button>
          </div>
        </div>

        <TickScale className="px-6" />

        <dl className="grid grid-cols-2 gap-5 px-6 py-5 sm:grid-cols-3">
          <Meta label="Category">{instrument.category}</Meta>
          <Meta label="Manufacturer">{instrument.manufacturer ?? '—'}</Meta>
          <Meta label="Location">{instrument.location}</Meta>
          <Meta label="Calibration due">
            <span
              className={`font-mono text-xs ${
                overdue ? 'font-semibold text-danger' : soon ? 'text-warn' : 'text-ink'
              }`}
            >
              {formatDate(instrument.calibrationDueDate)}
              {overdue && ' · overdue'}
              {soon && ` · ${days}d`}
            </span>
          </Meta>
          <Meta label="Added">{formatDate(instrument.createdAt)}</Meta>
          <Meta label="Updated">{formatDate(instrument.updatedAt)}</Meta>
        </dl>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <h2 className="font-display text-lg font-semibold text-ink">
            Calibration history
            <span className="ml-2 font-mono text-xs font-normal text-muted">
              {calibrations.length} {calibrations.length === 1 ? 'record' : 'records'}
            </span>
          </h2>
          <div className="mt-3 flex flex-col gap-3">
            {calibrations.length === 0 ? (
              <EmptyState
                title="No calibrations logged"
                hint="Record the first calibration using the form."
              />
            ) : (
              calibrations.map((c) => (
                <div key={c.id} className="rounded-lg border border-line bg-panel px-4 py-3">
                  <div className="flex items-center justify-between">
                    <ResultBadge result={c.result} />
                    <span className="font-mono text-[11px] text-muted">
                      {formatDateTime(c.performedAt)}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                    <span>
                      By <span className="text-ink">{c.performedBy}</span>
                    </span>
                    {c.certificateNumber && (
                      <span className="font-mono">Cert {c.certificateNumber}</span>
                    )}
                    {c.nextDueDate && <span>Next due {formatDate(c.nextDueDate)}</span>}
                  </div>
                  {c.notes && <p className="mt-2 text-sm text-ink">{c.notes}</p>}
                </div>
              ))
            )}
          </div>
        </section>

        <section className="lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-ink">Log calibration</h2>
          <div className="mt-3 rounded-lg border border-line bg-panel px-4 py-4">
            <CalibrationForm
              key={calFormKey}
              submitting={calSubmitting}
              serverErrors={calErrors}
              onSubmit={handleLogCalibration}
            />
          </div>
        </section>
      </div>

      <Modal open={editOpen} title="Edit instrument" onClose={() => setEditOpen(false)}>
        <InstrumentForm
          initial={instrument}
          submitting={editing}
          serverErrors={editErrors}
          onSubmit={handleEdit}
          onCancel={() => setEditOpen(false)}
        />
      </Modal>

      <Modal open={confirmOpen} title="Delete instrument" onClose={() => setConfirmOpen(false)}>
        <p className="text-sm text-ink">
          Delete <span className="font-medium">{instrument.name}</span>? This also removes its{' '}
          {calibrations.length} calibration {calibrations.length === 1 ? 'record' : 'records'} and
          can’t be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>
            Delete instrument
          </Button>
        </div>
      </Modal>
    </div>
  );
};
