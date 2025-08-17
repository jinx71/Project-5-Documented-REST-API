import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../api/client';
import {
  createInstrument,
  listInstruments,
  type ListParams,
} from '../api/pharmatrack';
import type {
  CreateInstrumentPayload,
  Instrument,
  InstrumentStatus,
  PaginationMeta,
  ValidationDetail,
} from '../types';
import { STATUS_LABELS } from '../lib/format';
import { useToast } from '../hooks/useToast';
import { InstrumentTable } from '../components/InstrumentTable';
import { InstrumentForm } from '../components/InstrumentForm';
import { Modal } from '../components/Modal';
import { Button, EmptyState, Select, Spinner, TextInput } from '../components/ui';

const LIMIT = 10;
const STATUS_OPTIONS: InstrumentStatus[] = [
  'ACTIVE',
  'UNDER_MAINTENANCE',
  'OUT_OF_SERVICE',
  'RETIRED',
];

const SearchIcon = () => (
  <svg
    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
  </svg>
);

export const InstrumentsPage = () => {
  const { notify } = useToast();

  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: LIMIT, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<InstrumentStatus | ''>('');
  const [category, setCategory] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState<ValidationDetail[] | undefined>();

  // Debounce free-text search so we aren't firing a request per keystroke
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params: ListParams = {
      page,
      limit: LIMIT,
      status: status || undefined,
      category: category.trim() || undefined,
      search: search || undefined,
    };
    try {
      const res = await listInstruments(params);
      setInstruments(res.instruments);
      setMeta(res.meta);
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setLoading(false);
    }
  }, [page, status, category, search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (payload: CreateInstrumentPayload) => {
    setSubmitting(true);
    setServerErrors(undefined);
    try {
      const created = await createInstrument(payload);
      notify(`Added ${created.name}`);
      setModalOpen(false);
      setPage(1);
      await load();
    } catch (err) {
      const apiErr = err as ApiError;
      setServerErrors(apiErr.details);
      notify(apiErr.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const openCreate = () => {
    setServerErrors(undefined);
    setModalOpen(true);
  };

  const filtersActive = Boolean(status || category.trim() || search);
  const clearFilters = () => {
    setStatus('');
    setCategory('');
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Instruments</h1>
          <p className="mt-1 text-sm text-muted">
            {meta.total} {meta.total === 1 ? 'instrument' : 'instruments'} on record
          </p>
        </div>
        <Button onClick={openCreate} className="mt-4 sm:mt-0">
          <span className="text-base leading-none">+</span> Add instrument
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon />
          <TextInput
            aria-label="Search by name or serial number"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name or serial…"
            className="pl-9"
          />
        </div>
        <Select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as InstrumentStatus | '');
            setPage(1);
          }}
          className="sm:w-52"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
        <TextInput
          aria-label="Filter by category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          placeholder="Category"
          className="sm:w-40"
        />
        {filtersActive && (
          <Button variant="ghost" onClick={clearFilters} className="px-2">
            Clear
          </Button>
        )}
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="flex items-center justify-center gap-2 rounded-lg border border-line bg-panel py-20 text-sm text-muted">
            <Spinner className="h-5 w-5 text-brand" /> Loading instruments…
          </div>
        ) : error ? (
          <div className="rounded-lg border border-danger/30 bg-danger/5 px-6 py-10 text-center">
            <p className="font-display text-base font-semibold text-ink">Couldn’t reach the API</p>
            <p className="mx-auto mt-1 max-w-md font-mono text-xs text-danger">{error}</p>
            <p className="mt-2 text-xs text-muted">
              Make sure the PharmaTrack API is running and CORS allows this origin.
            </p>
            <Button variant="secondary" onClick={load} className="mt-4">
              Try again
            </Button>
          </div>
        ) : instruments.length === 0 ? (
          <EmptyState
            title={filtersActive ? 'No instruments match these filters' : 'No instruments yet'}
            hint={
              filtersActive
                ? 'Adjust or clear the filters to see more of the registry.'
                : 'Add your first instrument to start tracking calibrations.'
            }
            action={
              filtersActive ? (
                <Button variant="secondary" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : (
                <Button onClick={openCreate}>Add instrument</Button>
              )
            }
          />
        ) : (
          <>
            <InstrumentTable instruments={instruments} />
            <div className="mt-4 flex items-center justify-between">
              <p className="font-mono text-xs text-muted">
                Page {meta.page} of {meta.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  disabled={meta.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <Modal open={modalOpen} title="Add instrument" onClose={() => setModalOpen(false)}>
        <InstrumentForm
          submitting={submitting}
          serverErrors={serverErrors}
          onSubmit={handleCreate}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
