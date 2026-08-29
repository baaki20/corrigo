# Corrigo evidence desk

Corrigo is a research platform for the evidence behind the Corrigo YouTube channel. It is a Next.js + Prisma full-stack app with a public evidence library and a private author dashboard.

## Local development

Install dependencies and create a local PostgreSQL database, then configure:

```text
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/corrigo
CORRIGO_ADMIN_EMAIL=you@example.com
CORRIGO_ADMIN_PASSWORD=change-this
AUTH_SECRET=use-a-long-random-string
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Run the database setup and app:

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`. The private author desk is at `/admin`.

## Available scripts

- `npm run dev` — local development
- `npm run build` — Prisma generation and production build
- `npm run typecheck` — TypeScript validation
- `npm run db:push` — apply the Prisma schema to a database
- `npm run db:seed` — add the development fixture
- `npm run db:studio` — open Prisma Studio

## Content model

Each dossier contains a claim, evidence grade, conclusion, visual evidence body, YouTube URL, topic, structured source cards, review metadata, and optional publication scheduling. Drafts remain private until published.

The development fixture is intentionally not a real investigation. Replace it with the first Corrigo dossier before launch.

## Scheduling

Choose **Schedule publication** in the admin editor and select a future time in your local timezone. A GitHub Actions workflow checks every five minutes and publishes dossiers that are due. Add these GitHub repository secrets:

- `CORRIGO_SITE_URL` — the deployed Prisma production app URL, without a trailing slash. It must point to the same deployment whose `DATABASE_URL` contains your dossiers.
- `CRON_SECRET` — a long random value that must also be present in the Prisma production environment

Prisma Compute does not currently provide native cron scheduling, so the protected endpoint and GitHub schedule provide the scheduler while the app remains hosted on Prisma.

## Prisma Compute deployment

Prisma Compute deploys from GitHub after a one-time connection between the Prisma project and this repository:

```bash
npx @prisma/cli@next auth login
npx @prisma/cli@next init
npx @prisma/cli@next project create corrigo
npx @prisma/cli@next git connect https://github.com/baaki20/corrigo
```

Add the production variables in Prisma Compute, especially `DATABASE_URL`, `CORRIGO_ADMIN_EMAIL`, `CORRIGO_ADMIN_PASSWORD`, `AUTH_SECRET`, and `NEXT_PUBLIC_SITE_URL`. After the GitHub connection is complete, pushes to `main` deploy production and other branches deploy previews. See the [Prisma Compute GitHub integration](https://www.prisma.io/docs/compute/github).
