import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Instrument } from '../types';
import { StatusBadge } from './Badge';
import { daysUntil, formatDate } from '../lib/format';

const Th = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <th className={`px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-muted ${className}`}>
    {children}
  </th>
);

export const InstrumentTable = ({ instruments }: { instruments: Instrument[] }) => (
  <div className="overflow-x-auto rounded-lg border border-line bg-panel">
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-line bg-paper/60 text-left">
          <Th>Instrument</Th>
          <Th>Serial</Th>
          <Th className="hidden md:table-cell">Category</Th>
          <Th className="hidden lg:table-cell">Location</Th>
          <Th>Status</Th>
          <Th>Calibration due</Th>
        </tr>
      </thead>
      <tbody>
        {instruments.map((it) => {
          const days = daysUntil(it.calibrationDueDate);
          const overdue = days !== null && days < 0 && it.status !== 'RETIRED';
          const soon = days !== null && days >= 0 && days <= 30 && it.status !== 'RETIRED';
          return (
            <tr
              key={it.id}
              className="group border-b border-line transition last:border-0 hover:bg-paper/50"
            >
              <td className="px-4 py-3">
                <Link
                  to={`/instruments/${it.id}`}
                  className="font-medium text-ink underline-offset-2 group-hover:text-brand group-hover:underline"
                >
                  {it.name}
                </Link>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted">{it.serialNumber}</td>
              <td className="hidden px-4 py-3 text-muted md:table-cell">{it.category}</td>
              <td className="hidden px-4 py-3 text-muted lg:table-cell">{it.location}</td>
              <td className="px-4 py-3">
                <StatusBadge status={it.status} />
              </td>
              <td className="px-4 py-3">
                <span
                  className={`font-mono text-xs ${
                    overdue ? 'font-semibold text-danger' : soon ? 'text-warn' : 'text-muted'
                  }`}
                >
                  {formatDate(it.calibrationDueDate)}
                  {overdue && ' · overdue'}
                  {soon && ` · ${days}d`}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
