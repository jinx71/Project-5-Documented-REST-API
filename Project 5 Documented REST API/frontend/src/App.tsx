import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { TopBar } from './components/TopBar';
import { ToastProvider } from './hooks/useToast';
import { InstrumentsPage } from './pages/InstrumentsPage';
import { InstrumentDetailPage } from './pages/InstrumentDetailPage';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1';
const DOCS_URL = API_BASE.replace(/\/api\/v1\/?$/, '/api-docs');

const NotFound = () => (
  <div className="mx-auto max-w-6xl px-6 py-24 text-center">
    <p className="font-display text-2xl font-bold text-ink">Page not found</p>
    <p className="mt-2 text-sm text-muted">That route isn’t part of the registry.</p>
    <Link to="/" className="mt-4 inline-block text-sm font-medium text-brand hover:underline">
      Back to instruments
    </Link>
  </div>
);

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col bg-paper">
          <TopBar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<InstrumentsPage />} />
              <Route path="/instruments/:id" element={<InstrumentDetailPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <footer className="border-t border-line bg-panel">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-4 text-xs text-muted sm:flex-row">
              <span className="font-mono">{API_BASE}</span>
              <a
                href={DOCS_URL}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-brand hover:underline"
              >
                OpenAPI docs ↗
              </a>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}
