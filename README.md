# T://bendet

Personal portfolio of Tal Bendet.

Static Astro site + a hand-built Node/TS API + containerized Postgres,
deployed to AWS via a from-scratch GitHub Actions pipeline. English and
Hebrew (RTL) content.

## Layout

| Path | What it is |
|------|-----------|
| `specs/` | The blueprint — design system, routes, content model, architecture, budgets (`specs/README.md` is the map) |
| `app/` | The application: `web/` (Astro), `api/` (Node/TS + Prisma), `deploy/` (Docker/Caddy/compose) |
| `CLAUDE.md` | Invariants for AI agent sessions |

The blueprint was produced by an AI-assisted decision workshop (missions,
ADRs, adversarial reviews, enforcement hooks) that ran from 2026-07-20 to
2026-07-23; that machinery is preserved in git history before 2026-07-23.
