# PharmaTrack Web

A React + TypeScript test client for the [PharmaTrack API](../pharmatrack-api) — a registry for
pharmaceutical instruments and their calibration records. It exercises every endpoint the API
exposes: listing with filters and pagination, creating and editing instruments, deleting them, and
logging calibrations against an instrument.

The interface is themed around **metrology** rather than a generic admin panel: a measurement-scale
(tick) motif as the recurring signature, monospace "readings" for serial numbers, certificate
numbers and dates, and status as the primary visual signal — because the question this tool answers
is "is this instrument safe to use, and is it in calibration?"

## Stack

- **React 18** + **TypeScript** (strict)
- **Vite** for dev server and production build
- **Tailwind CSS** for styling
- **Axios** for HTTP
- **React Router** for the two routes (list + detail)

No data-fetching library is used; requests run through a small typed API layer with plain
`async/await` and local component state, which keeps the data flow easy to read in an interview.

## Prerequisites

The PharmaTrack API must be running and reachable. By default this client points at
`http://localhost:4000/api/v1`. The API's own `.env.example` already allows `http://localhost:5173`
(this app's dev port) via `CORS_ORIGIN`, so the two work together out of the box.

## Getting started

```bash
npm install
cp .env.example .env   # optional — only needed to point at a non-default API URL
npm run dev            # http://localhost:5173
```

The top bar shows a live **API health indicator** (it polls `GET /health` every 30s), so you can
immediately tell whether the backend is reachable.

### Try it

1. Start the API (`npm run dev` in `pharmatrack-api`), then start this client.
2. Add an instrument — e.g. an HPLC with serial `HPLC-2024-0042`.
3. Open it and log a calibration with a **next due date**; note the instrument's calibration due
   date advances to match (the API does this atomically).
4. Filter by status, search by name or serial, and page through the list.

## Configuration

| Variable            | Default                          | Purpose                          |
| ------------------- | -------------------------------- | -------------------------------- |
| `VITE_API_BASE_URL` | `http://localhost:4000/api/v1`   | Base URL of the PharmaTrack API. |

## Scripts

| Script            | Description                                       |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Start the Vite dev server on port 5173.           |
| `npm run build`   | Type-check (`tsc`) then build for production.     |
| `npm run preview` | Serve the production build locally.               |

## Project structure

```
src/
├── api/
│   ├── client.ts          Axios instance + ApiError normalisation
│   └── pharmatrack.ts      Typed wrappers for every endpoint
├── components/
│   ├── Badge.tsx           Status + calibration-result badges
│   ├── CalibrationForm.tsx Log a calibration
│   ├── InstrumentForm.tsx  Create / edit an instrument
│   ├── InstrumentTable.tsx List table with due-date highlighting
│   ├── Modal.tsx           Accessible dialog
│   ├── TickScale.tsx       Signature measurement-scale motif
│   ├── TopBar.tsx          Wordmark + live API health dot
│   └── ui.tsx              Field, inputs, Button, Spinner, EmptyState
├── hooks/
│   └── useToast.tsx        Toast context + hook
├── lib/
│   └── format.ts           Date formatting, labels, days-until-due
├── pages/
│   ├── InstrumentsPage.tsx List + filters + create
│   └── InstrumentDetailPage.tsx  Detail + edit/delete + calibration history
├── types.ts                Types mirroring the API contract
├── App.tsx                 Router, layout, footer
└── main.tsx                Entry point
```

## Design decisions

- **API responses are unwrapped in one place.** The API always answers with
  `{ success, data, message, meta? }`. The Axios layer reads `data.data` for the payload and, on
  failure, normalises everything into an `ApiError` carrying the server's `message` plus the 422
  validation `details` array — so forms can show per-field errors and toasts show a useful message.
- **Dates are converted to full ISO 8601 before sending.** The API validates timestamps strictly;
  native `date` / `datetime-local` inputs don't produce a compliant string, so the forms convert via
  `toISOString()` on submit.
- **Status drives the colour system.** Active / under-maintenance / out-of-service / retired each map
  to a fixed semantic colour reused across badges, table rows, and the detail header.
- **Calibration due dates surface risk.** Overdue dates render in red, dates within 30 days in amber,
  in both the table and the detail view.

## Deployment

Deployable as a static site (e.g. Vercel). Set `VITE_API_BASE_URL` to the deployed API's URL at
build time, and make sure that API's `CORS_ORIGIN` includes this site's origin.

## License

MIT
