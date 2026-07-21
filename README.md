# T://bendet

Personal portfolio of Tal Bendet — currently in the **blueprint phase**.

This repository is (for now) a decision workshop: an AI-assisted, mission-driven
process that produces a complete, reviewed blueprint before any application
code is written. The workshop machinery itself — ADR system, mission gates,
hooks, agents — is part of the portfolio's story.

## Layout

| Path | What it is |
|------|-----------|
| `CLAUDE.md` | Project constitution for AI agents |
| `missions/` | Mission plan + per-mission workspaces (STATUS + outputs) |
| `docs/decisions/` | ADRs — the single source of truth for what's decided |
| `.claude/` | Agents, skills (incl. `/m1`–`/m6` missions), settings |
| `scripts/` | TypeScript validators and hooks (Node ≥ 24, zero deps) |
| `assets/reference/` | Read-only source material |
| `app/` | Doesn't exist yet — created in Phase 2, per Mission 3's ADRs |

## Documentation

Full explanation of how everything works — phases, ADR lifecycle, mission
anatomy, enforcement hooks, operating manual — lives in
[`docs/HANDBOOK.md`](docs/HANDBOOK.md), with standalone diagram files in
[`docs/diagrams/`](docs/diagrams/).

## Status

Phase 0 (bootstrap): ADRs decomposed, awaiting status sign-off.
See `missions/00-mission-plan.md`.

## Requirements

Node ≥ 24 (scripts run via native type-stripping — no build step, no deps).
