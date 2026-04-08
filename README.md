# Prospect Intelligence Briefing (MVP Foundation)

A lightweight MVP foundation for generating prospect intelligence briefings for sales reps.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui-style component base
- Prisma + SQLite
- Zod validation
- Recharts
- Docker

## Project Structure

- `app/` – routes, layouts, API handlers
- `components/` – reusable UI and page components
- `lib/` – utility functions, constants, validators, Prisma client
- `services/` – database-backed app services
- `prisma/` – schema, migration files, and seed script

## Features in this Lite MVP

- Homepage with briefing request form and recent report history
- Report lifecycle statuses: `QUEUED`, `RESEARCHING`, `DRAFTED`, `COMPLETED`, `FAILED`
- Report detail sections for Company Snapshot, Risk Signals, Growth Signals, and Suggested Talking Points
- `POST /api/research` to queue and generate an AI-assisted briefing
- `PATCH /api/research` to move a report through lifecycle statuses
- `GET /api/research` to fetch recent reports
- Admin dashboard with:
  - status KPI cards (click-through filtering)
  - date/city/state/status filters
  - daily volume chart + day-level drill-down links
  - filtered report list

## Local Setup

1. Copy env values:

   ```bash
   cp .env.example .env
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Apply migrations:

   ```bash
   npx prisma migrate dev
   ```

4. Seed local data:

   ```bash
   npm run db:seed
   ```

5. Start development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Useful Commands

- `npm run lint`
- `npm run build`
- `npm run prisma:generate`
- `npm run prisma:migrate`

## Docker

```bash
docker build -t prospect-intelligence-briefing .
docker run --rm -p 3000:3000 --env-file .env prospect-intelligence-briefing
```

## Notes

- SQLite is the default local database.
- If `OPENAI_API_KEY` is set, generation uses OpenAI Responses API; otherwise a deterministic local fallback generator is used.

## Troubleshooting

### Prisma enum mismatch (`Value 'QUEUED' not found in enum 'ReportStatus'`)

This means your generated Prisma client and local database schema are out of sync after pulling merged changes.

Run:

```bash
git pull
cp .env.example .env
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev -- --hostname 0.0.0.0 --port 3000
```

If needed, do a full local reset:

```bash
npm run db:reset
```

