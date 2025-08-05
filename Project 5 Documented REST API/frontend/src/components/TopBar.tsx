import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { checkHealth } from '../api/pharmatrack';
import { TickScale } from './TickScale';

export const TopBar = () => {
  const [healthy, setHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    const ping = async () => {
      const up = await checkHealth();
      if (active) setHealthy(up);
    };
    ping();
    const interval = setInterval(ping, 30000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const label = healthy === null ? 'Checking API…' : healthy ? 'API online' : 'API unreachable';
  const dot = healthy === null ? 'bg-muted' : healthy ? 'bg-ok' : 'bg-danger';

  return (
    <header className="border-b border-line bg-panel">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            Pharma<span className="text-brand">Track</span>
          </span>
          <span className="hidden font-mono text-[11px] uppercase tracking-widest text-muted sm:inline">
            Instrument Registry
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dot} ${healthy ? 'animate-pulse-slow' : ''}`} />
          <span className="font-mono text-xs text-muted">{label}</span>
        </div>
      </div>
      <TickScale className="mx-auto max-w-6xl px-6 pb-2" />
    </header>
  );
};
