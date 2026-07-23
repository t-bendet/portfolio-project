# T://bendet — personal portfolio

A portfolio for Tal Bendet that feels like the person, not a template:
typography-driven, restrained, curious, technically deep. It rewards
attentive visitors and showcases real infrastructure capability.

## Source of truth

`specs/` — the complete blueprint (see `specs/README.md` for the map).
Specs are ordinary documents: when reality disagrees, edit them. The Phase 1
decision workshop that produced them lives in git history (pre-2026-07-23);
never resurrect its process.

## Hard requirements

- **Genuine showcase** of SQL, Docker, a from-scratch CI/CD pipeline, and
  cloud deployment (AWS). Demonstrated capabilities, not conveniences.
- **RTL/Hebrew support** for translated articles is first-class, not bolted
  on.
- **Honest tradeoff analysis always.** No promotional framing of any
  technology, including ones already chosen.

## Brand invariants (full vocabulary + tests in `specs/brand.md`)

- The `T://bendet` namespace: the mark, and `T://bendet · section` eyebrow
  labels everywhere. Never altered, themed, or transliterated.
- Easter eggs stay unlabeled, unhinted, unexplained — everywhere, forever.
- **Never** the phrase "let's connect" or its cousins; no template phrasing.
- Restraint over decoration. Greek mythology only as names on real infra
  artifacts, never in site content.
- Published translations must satisfy `specs/translations-checklist.md`
  (licence conditions, credit placement, upstream back-link PR).

## Working rules

- The repo root is the pnpm workspace: `web/` (Astro), `api/` (Node/TS +
  Prisma), `deploy/` (Docker/Caddy/compose).
- Branches + PRs to `main`; no direct pushes once `ci.yml` exists.
- Pin dependency versions from fresh lookups, never from memory.
- Never commit secrets; `.env` on-instance and GitHub environment secrets
  only.
- `specs/design/prototypes/` holds Tal's design prototypes — the normative
  source of every design value. Read, don't edit.
- Waiting on Tal before cloud provisioning: domain choice + region pricing
  check (`specs/scaffold-plan.md` §6).
