# PharmaTrack API 🔬

A fully documented REST API for tracking pharmaceutical instruments and their calibration records — built with GMP audit-trail thinking in mind. Every instrument carries a calibration due date, and every calibration event is logged with the performer, result, and certificate number, mirroring real FDA/MHRA documentation expectations.

**Live API:** _[demo link placeholder]_
**Live Swagger Docs:** _[demo link placeholder]/api-docs_

![Swagger UI screenshot](docs/screenshot.png) <!-- screenshot placeholder -->

## Tech Stack

- **Runtime:** Node.js + Express 4 (TypeScript, strict mode)
- **Database:** PostgreSQL via Prisma ORM
- **Validation:** Zod (body, params, and query validated per route)
- **Documentation:** OpenAPI 3.0 spec served through Swagger UI
- **Architecture:** Routes → Controllers → Services layering with a central error handler

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/instruments` | List instruments (pagination, status/category filters, search) |
| POST | `/api/v1/instruments` | Create an instrument |
| GET | `/api/v1/instruments/:id` | Get an instrument + recent calibrations |
| PATCH | `/api/v1/instruments/:id` | Partial update |
| DELETE | `/api/v1/instruments/:id` | Delete (cascades calibrations) |
| GET | `/api/v1/instruments/:id/calibrations` | List calibration records |
| POST | `/api/v1/instruments/:id/calibrations` | Log a calibration (atomically updates the instrument's due date) |

All responses follow a consistent `{ success, data, message }` envelope; list endpoints add a `meta` pagination object.

Full interactive documentation lives at **`/api-docs`**.

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env   # then set DATABASE_URL

# 3. Create the database schema
npx prisma migrate dev --name init

# 4. Run in development
npm run dev
```

The API starts at `http://localhost:4000` with Swagger UI at `http://localhost:4000/api-docs`.

### Production build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app.ts                  # Express app, middleware, Swagger mounting
├── server.ts               # Entry point
├── docs/openapi.yaml       # OpenAPI 3.0 contract
├── routes/                 # Route definitions + validation wiring
├── controllers/            # HTTP layer (req/res only)
├── services/               # Business logic + Prisma queries
├── schemas/                # Zod validation schemas
├── middleware/             # validate, errorHandler, notFound
└── utils/                  # apiResponse helpers, Prisma client
```

## Design Decisions

- **Static OpenAPI spec over generated annotations** — the YAML file is the API contract, reviewable in PRs and usable by client codegen tools.
- **Nested calibration resource** (`/instruments/:id/calibrations`) — calibrations have no meaning outside an instrument, so the URL reflects ownership.
- **Transactional due-date update** — logging a calibration with `nextDueDate` updates the parent instrument in the same database transaction, preventing drift between records.

## License

MIT
