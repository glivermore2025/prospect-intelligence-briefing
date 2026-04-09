# Prospect Intelligence Briefing (MVP Foundation)

A lightweight MVP foundation for generating prospect intelligence briefings for sales reps.

## Table of Contents

- [What this app does](#what-this-app-does)
- [Prerequisites](#prerequisites)
- [Quickstart (local)](#quickstart-local)
- [Detailed local setup](#detailed-local-setup)
- [Environment variables](#environment-variables)
- [How to use the app (end-to-end)](#how-to-use-the-app-end-to-end)
- [API quick reference](#api-quick-reference)
- [Useful commands](#useful-commands)
- [Docker](#docker)
- [Demo walkthrough (2-3 minutes)](#demo-walkthrough-2-3-minutes)
- [Known limitations](#known-limitations)
- [Codespaces secret wiring (OpenAI)](#codespaces-secret-wiring-openai)
- [Troubleshooting](#troubleshooting)

## What this app does

This project is an MVP workflow for creating and reviewing prospect intelligence briefings:

1. Sales user submits a prospect (agency name + location).
2. System creates a report record and processes generation.
3. Report detail shows:
   - lifecycle status,
   - generated content sections,
   - generation metadata (mode/model),
   - source links (when available).
4. Admin dashboard supports volume and status monitoring with filter/drill-down tools.

If no OpenAI key is configured, generation uses a deterministic fallback so the app still functions for demos and development.

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

## Prerequisites

Before running locally, ensure you have:

- **Node.js 20+** (recommended: latest LTS)
- **npm 10+**
- **Git**
- Optional:
  - **Docker** (for containerized run)
  - **OpenAI API key** (for live model generation instead of fallback)

You can verify your tooling:

```bash
node -v
npm -v
git --version
```

## Features in this Lite MVP

- Homepage with briefing request form and recent report history
- Report lifecycle statuses: `QUEUED`, `RESEARCHING`, `DRAFTED`, `COMPLETED`, `FAILED`
- Report detail sections for Company Snapshot, Risk Signals, Growth Signals, and Suggested Talking Points
- Report detail includes generation mode indicator and a one-click regenerate action
- `POST /api/research` to queue and generate an AI-assisted briefing
- AI guardrail logging with fallback reasons when live generation fails
- `PATCH /api/research` to move a report through lifecycle statuses
- `GET /api/research` to fetch recent reports
- Admin dashboard with:
  - status KPI cards (click-through filtering)
  - date/city/state/status filters
  - daily volume chart + day-level drill-down links
  - filtered report list

## Quickstart (local)

Use this path if you want to get running in a few minutes:

```bash
cp .env.example .env
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Detailed local setup

### 1) Clone and enter the repository

```bash
git clone <your-repo-url>
cd prospect-intelligence-briefing
```

### 2) Configure environment

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

### 3) Optional: enable live OpenAI generation

Edit `.env`:

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini
```

Without `OPENAI_API_KEY`, the app automatically uses fallback generation.

### 4) Verify the setup worked

After startup:

1. Visit `/` and submit a new briefing.
2. Confirm redirect to `/report/:id`.
3. Confirm sections render and status is visible.
4. Visit `/admin` and confirm:
   - KPI cards render,
   - chart renders,
   - filter form works.

## Environment variables

Current variables (see `.env.example`):

- `DATABASE_URL`: Prisma datasource connection string (SQLite by default).
- `OPENAI_API_KEY`: Optional; enables OpenAI generation path.
- `OPENAI_MODEL`: Optional; defaults to `gpt-4.1-mini`.

## How to use the app (end-to-end)

### Sales flow

1. Open **Home** page.
2. Fill **Agency Name**, **City**, **State**.
3. Click **Generate Briefing**.
4. Wait for status/update and review generated sections on report detail.
5. If needed, click **Regenerate Briefing**.

### Admin flow

1. Open **Admin Dashboard** (`/admin`).
2. Click KPI cards to quickly filter by status.
3. Use city/state/date/status filters for targeted views.
4. Use chart day pills to drill into a specific day.
5. Review filtered report list for recent activity.

## API quick reference

### `POST /api/research`

Creates a new report request and triggers generation.

Example body:

```json
{
  "agencyName": "Acme Risk Advisors",
  "city": "Austin",
  "state": "TX"
}
```

### `GET /api/research`

Returns recent reports.

### `PATCH /api/research`

Updates a report status.

Example body:

```json
{
  "id": "report_id_here",
  "status": "COMPLETED"
}
```

### `POST /api/research/[id]/regenerate`

Regenerates a specific report by id.

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

## Demo Walkthrough (2-3 minutes)

1. Open the home page and submit a new briefing request with Agency, City, and State.
2. Confirm the new report appears in **Recent Reports**, then open report detail.
3. On report detail, highlight:
   - lifecycle status
   - generated timestamp
   - generation mode (`OpenAI` or local fallback)
   - model metadata when available
4. Click **Regenerate Report** and confirm the page refreshes with updated output.
5. Open **Admin Dashboard** and demonstrate:
   - KPI card filtering by status
   - city/state/date/status filters
   - chart day links that drill into matching reports

## Known Limitations

- `POST /api/research` currently performs generation in-request; a production deployment should move this to an async worker queue.
- Source enrichment remains basic and currently relies on generated/seeded data.
- Fallback mode is deterministic and intended for reliability/testing, not for high-quality external research.
- Authentication and authorization are intentionally out of scope for this MVP foundation.

## Codespaces Secret Wiring (OpenAI)

To use real OpenAI generation in GitHub Codespaces without committing keys:

1. In GitHub, go to **Repository Settings -> Secrets and variables -> Codespaces**.
2. Add secret:
   - `OPENAI_API_KEY` = your API key
   - (optional) `OPENAI_MODEL` = `gpt-4.1-mini`
3. Rebuild or create a new Codespace.

This repo includes `.devcontainer/devcontainer.json` and `.devcontainer/post-create.sh` to:
- copy `.env.example` to `.env` if needed,
- inject Codespaces secret values into `.env`,
- run install/migrate/seed bootstrap commands.

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
