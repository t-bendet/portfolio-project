---
mission: m3
status: closed
depends-on: m2
opened: 2026-07-21
closed: 2026-07-21
revision-cycles: 0
---

# Status — Technology & Architecture

## Handoff notes

**Verdict: APPROVED, cycle 1** (outputs/review-verdict.md). Four non-blocking
findings; the two the reviewer asked to fix before M4 were applied
post-approval (stale "pending Tal" status lines given dated addenda; ADR 0021
budget rephrased to assert no unverified dollar figure). No substantive change.

**Decided (Tal at three in-mission decision points):**
- **Stack: C1 — keep the incumbent framework on an upgraded premise: Astro
  7.x** (Astro 6 is no longer current; 7.0.9 verified 2026-07-21). Static
  content core (no adapter) + hand-built Node 24/TS API + containerized
  Postgres 18 + Caddy, Docker Compose. Scored 416/500 vs RR v8 340, Next 16
  296; TanStack Start eliminated at G5 (still RC-quality). ADR 0019.
- **Dynamic layer (the honest SQL role):** first-party tracker-free
  view-event analytics + per-article reactions + a private admin dashboard
  (session-cookie auth, not JWT — reasoned, not resume-driven). Comments
  DEFERRED but designed-for (stable content ids, /api/v1/ prefix, additive
  migrations); moderation cost unpriced until it lands. ADR 0020.
- **Cloud/deploy:** EC2 t4g.micro + ECR (OIDC, no long-lived keys) +
  Route 53 + Caddy auto-TLS; eight named from-scratch pipeline stages across
  three authored workflows incl. Playwright RTL check (ADR 0011) and
  pg_dump→S3 backups. ≈$6.63/mo verified; IPv4 billing unquantified —
  scaffold-time check. ADR 0021.
- **Repo topology (ADR 0013, escalated per CLAUDE.md, Tal confirmed):
  MONOREPO** — app/ lives here when Phase 2 opens; path-filtered workflows;
  deploy secrets behind a protected `production` environment.

**ADRs:** 0019, 0020, 0021 new (`active`); 0013 completed in place
(`proposed`→`active`, decided-by: tal); 0003 flipped `superseded` by 0019
(frontmatter only). Checkpoint 1 also tightened the G6 cost ceiling $30→$15.

**For M4 (IA):** may assume one repo, the five-route question is its own
(0009/0010 still reopened); content model must carry translation pairing,
per-entry lang/dir, original-author credit; reactions/analytics touchpoints
and the admin dashboard are IA surfaces; comments are NOT an IA deliverable
(deferred). Astro i18n is writing-direction-agnostic — RTL dir wiring is
manual (verification-report Q10).

**For M5 (workflow):** monorepo consequences are binding (path filters,
workflow-lint, protected environment); scripts/ stays Node-24-direct-run,
app/ is its own pnpm workspace; the three workflow files are hand-authored
Phase 2 artifacts.

**Residual risks (reviewer findings 3–4):** Astro 7.x integration compat
ranges unconfirmed (Q9) — scaffold-time §0 verification pass is mandatory;
analytics dedupe design must keep the "no raw IP retention" promise testable
in Phase 2. Also carried: prisma migrate CI guidance (Q24), QEMU arm64 build
times, GHCR free-tier softness (Q35).

## Inputs actually read

- docs/decisions/: 0003 (reopened), 0011, 0012, 0014 (active), 0013
  (proposed), INDEX.md — plus adr-keeper/tech-eval/mission-protocol skills
- missions/00-mission-plan.md
- missions/01-product-brand-identity/outputs/identity-thesis.md,
  reconciliation-decision.md
- docs/research/about-tal.md
- Web verification: one batched docs-explorer run (39 sourced facts →
  outputs/verification-report.md) + targeted primary fetches by the
  tech-architect (Astro scaffold command, RR v8 release, TanStack status)
- NOT read: missions/02-visual-design-system/outputs/ (excluded by the input
  manifest — architecture must not be biased by aesthetics; reviewer verified
  zero M2 material in outputs)

### ADR statuses observed at mission start (2026-07-21)

active: 0001, 0002, 0011, 0012, 0014, 0015, 0016, 0017, 0018 ·
reopened: 0003 (by mission-3), 0009, 0010 (by mission-4) ·
proposed: 0013 · superseded: 0004, 0005, 0006, 0007, 0008.
M2 outputs explicitly excluded from this mission's inputs (architecture must
not be biased by aesthetics).
