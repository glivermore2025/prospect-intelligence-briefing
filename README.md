# Prospect Intelligence Briefing (MVP Foundation)

Initial runnable foundation for a take-home MVP that will evolve into an AI-assisted prospect intelligence workflow for sales reps.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui-style components
- Prisma + SQLite
- Zod validation
- Recharts (admin placeholder chart)
- Docker

## Project Structure

- `app/` – routes and pages
- `components/` – reusable UI and feature components
- `lib/` – utilities, constants, validators, Prisma client
- `services/` – app-level data/service helpers
- `prisma/` – schema, migration, and seed script

## Local Setup

1. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run migrations:

   ```bash
   npx prisma migrate dev
   ```

4. (Optional) Seed local data:

   ```bash
   npm run db:seed
   ```

5. Start development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

## Useful Commands

- `npm run lint` – lint checks
- `npm run build` – production build
- `npm run prisma:generate` – regenerate Prisma client
- `npm run prisma:migrate` – run dev migrations

## Docker

Build and run the app:

```bash
docker build -t prospect-intelligence-briefing .
docker run --rm -p 3000:3000 --env-file .env prospect-intelligence-briefing
```

## Current MVP Scope

- Homepage with search form and recent report list
- Admin page shell with metric cards and chart area
- Report detail placeholder page
- API endpoint (`POST /api/research`) to validate and queue a report request

No external search or AI generation is implemented yet.
