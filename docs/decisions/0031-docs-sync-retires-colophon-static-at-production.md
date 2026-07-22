---
id: 0031
title: The docs-sync machinery retires; the colophon becomes a static road-to-production page generated at first deploy
status: active
date: 2026-07-22
decided-by: tal
mission: phase-2
reopened-by: null
superseded-by: null
narrows: 0022, 0028
---

## Context

Two decisions held the docs-sync machinery in place. ADR 0028 decision 3
said no hooks retire and no hooks are added, so Phase 2 needs zero
`settings.json` edits. And `hooks-plan.md` §4.3 planned the colophon
staleness check — the mechanization of ADR 0022's colophon maintenance
contract ("a stale colophon actively misinforms") — as a reuse of
`sync-docs.ts`, which already implements the fingerprint-and-ack pattern
for the handbook.

`docs/PHASE2-CLEANUP-TODO.md` instructed deleting that machinery
(`sync-docs.ts`, `scripts/hooks/docs-sync-check.ts`, its settings entry,
`docs/diagrams/`, `docs/.docs-fingerprint.json`), with diagrams living only
in `docs/HANDBOOK.md` from now on. Coherence finding C1 flagged the
contradiction: deleting the machinery kills the planned colophon
enforcement and names no replacement.

Resolving it forced the real question: what is the colophon *for*? ADR 0022
chose a living page over a dated article because "a colophon describes the
current stack, an article is a snapshot" — which is what created the
maintenance contract and the need for a staleness check.

## Decision

Resolved by Tal, 2026-07-22, at the Phase 2 open checkpoint:

**1. The colophon's contract changes: it is a road-to-production narrative,
not a live stack inventory.** `/colophon/` presents the road to production
and the major decisions (ADR-level) — not every dependency bump or content
change along the way or after. Frameworks and tools are the facts least
likely to move; content churn is real but not what the page is for.

**2. Until first production deploy, `/colophon/` shows the project map
only.** At the first production deploy, an agent work item generates the
**static** colophon from the decision record. It updates when a major
decision lands (a new ADR of consequence), which is an editorial act, not a
sync obligation.

**3. The fingerprint staleness check (hooks-plan §4.3) is abandoned, not
deferred.** A page that does not claim volatile facts cannot go stale the
way ADR 0022 feared; the enforcement was priced against a contract that no
longer exists. Gate-verdict finding C6 (fingerprint over-breadth) is
resolved by the same stroke — the fingerprint it critiqued no longer ships.

**4. The docs-sync machinery retires**: `scripts/sync-docs.ts`,
`scripts/hooks/docs-sync-check.ts`, and the docs-sync-check `PostToolUse`
entry in `.claude/settings.json` — removed by Tal by hand, per ADR 0028's
unchanged rule that sessions never edit the checker. `docs/diagrams/` and
`docs/.docs-fingerprint.json` (the machinery's extraction targets) are
deleted; diagrams live only in `docs/HANDBOOK.md`, edited as plain text.

**5. Narrowings.** This narrows ADR 0022's colophon clause (living page +
maintenance contract; the route, its footer-only placement, and everything
else in 0022 stand) and ADR 0028 decision 3 (one hook retires, with
exactly one hand-made `settings.json` edit to remove its entry; no hooks
are *added*, and decisions 1, 2, 4, 6 stand). ADR 0028 decision 5 —
sync-docs id-binding — becomes moot with the machinery it describes.

## Consequences

- The colophon can no longer misinform by staleness in the way 0022's
  consequence named: it claims a story and decisions, both of which are
  append-only, rather than a current stack, which drifts. The residual
  risk — a major decision lands and the page is not updated — is accepted
  as an editorial obligation on Tal, unenforced.
- The handbook loses its mermaid-extraction pipeline; HANDBOOK.md diagrams
  are edited in place with no ack step. A diagram that drifts from the
  machinery it depicts is now caught by reading, not by a hook.
- `scripts/test-machinery.ts` loses its docs-sync-check assertions (Tal, by
  hand, same pass as the deletion).
- The `content` track's colophon work item changes shape: from "living page
  + fingerprint check as infra's last item" to "static generation at first
  production deploy."
- One `settings.json` edit happens after all — the cost ADR 0028 decision 3
  was designed to avoid. It is paid once, by hand, to remove a process
  spawn on every write; the trade reverses because the hook's one planned
  future consumer (the colophon check) disappeared.

## Alternatives rejected

- **Keep the machinery dormant until the colophon check lands.** Rejected:
  under this decision no colophon check ever lands, so dormant means dead
  code plus a live hook spawn on every write, kept for nothing.
- **Delete now, rebuild by hand when the colophon check is needed.**
  Rejected as moot for the same reason — but it was the fallback if the
  living-page contract had been kept.
- **Keep the living-page colophon and its staleness check** (ADR 0022's
  original call, hooks-plan §4.3). Rejected by Tal: the page's value is
  showing the road and the major calls, not tracking minor drift; a live
  inventory buys precision nobody asked for at the price of a permanent
  maintenance contract plus enforcement machinery.
- **Colophon as a dated article** (already rejected in ADR 0022). Not
  revisited: the route and placement stand; only the update contract
  changed.
