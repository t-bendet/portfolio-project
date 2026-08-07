# T://bendet

Personal portfolio of Tal Bendet.

Static Astro site + a hand-built Node/TS API + containerized Postgres,
deployed to AWS via a from-scratch GitHub Actions pipeline. English and
Hebrew (RTL) content.

## Layout

| Path | What it is |
|------|-----------|
| `specs/` | The blueprint — design system, routes, content model, architecture, budgets (`specs/README.md` is the map) |
| `web/` | Astro static site |
| `api/` | Node/TS service + Prisma |
| `deploy/` | Dockerfiles, compose, Caddyfile |
| `scripts/` | The design gates, and the two local entry points below |
| `CLAUDE.md` | Invariants for AI agent sessions |

## Checks

`ci.yml` is the authority; these are what run on a laptop.

| Command | What it covers |
|---------|----------------|
| `scripts/check.sh [all\|fast]` | Everything in CI that needs no services — design gates and typechecks, plus the build and the vocabulary gate under `all`. `fast` skips the build. |
| `scripts/sec.sh [all\|secrets\|deps]` | Secrets scan (SR-17) and dependency audit (SR-21). Needs Docker and the network. |

Neither is a substitute for a CI run: the API tests, the container builds and
the RTL stage need Postgres and Docker, and only `ci.yml` runs them all.

The blueprint was produced by an AI-assisted decision workshop (missions,
ADRs, adversarial reviews, enforcement hooks) that ran from 2026-07-20 to
2026-07-23; that machinery is preserved in git history before 2026-07-23.
