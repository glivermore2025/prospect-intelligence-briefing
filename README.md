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

- Homepage with briefing request form
- `POST /api/research` to queue new report requests
- `GET /api/research` to fetch recent reports
- Recent reports list with status badges and links
- Report detail placeholder page backed by DB
- Admin dashboard with DB-backed summary metrics and 10-day request volume chart

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
- External web research and AI generation are intentionally not implemented yet.
