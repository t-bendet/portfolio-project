# Mission Plan

Three phases. No phase begins before the previous one closes.

## Phase 0 — Bootstrap (owner: Tal + assistant, one session)

- [x] Decompose `portfolio-decisions.md` into ADRs 0001–0013 (drafted)
- [x] **Tal signed off on all initial ADR statuses** (2026-07-20).
      0007 and 0008 deferred to the design phase: both `reopened`,
      `reopened-by: mission-2`.
- [ ] Original decision log archived at `docs/decisions/archive/` (done)
- [ ] **Source material added by Tal:**
      - `docs/research/about-tal.md` — DONE (CV attached as
        Tal_Bendet_CV.pdf in the same folder)
      - `docs/research/greek-mythology-notes.md` — any existing instincts,
        figures, or references (optional but strongly recommended before /m1)
      - HTML prototypes into `assets/reference/prototypes/` — DONE
        (build-tools-overview.html, tooling-deepdive.html)
- [ ] Run `node scripts/reindex-decisions.ts` and commit

Phase 0 closes when the statuses are signed off.

## Phase 1 — Missions (strict sequence)

| # | Mission | Skill | Depends on | Core question |
|---|---------|-------|-----------|---------------|
| 1 | Product & Brand Identity | `/m1` | Phase 0 | Reconcile T://bendet ∪ Marauder's Map ∪ Greek mythology into ONE identity |
| 2 | Visual Design System | `/m2` | M1 closed | Palettes, typography, tokens serving the M1 identity |
| 3 | Technology & Architecture | `/m3` | M1 closed* | First-principles stack re-evaluation + showcase constraints + repo topology |
| 4 | Information Architecture | `/m4` | M2, M3 closed | Pages, routes, content model (incl. translated-articles placement) |
| 5 | AI Dev Workflow | `/m5` | M4 closed | Phase 2 workflow: agents, loops, hooks, plugin packaging, worktree call |
| 6 | Blueprint Gate | `/m6` | M5 closed | Coherence review of ALL ADRs + design-mode security & performance review |

*M3 depends on M1 (identity can shape technical choices, not vice versa) but not
on M2 — architecture must not be biased by aesthetics.

**Sequencing note:** although M3's only hard dependency is M1, we run strictly
sequentially (Tal's decision, 2026-07-20): 1 → 2 → 3 → 4 → 5 → 6.

### What "closed" means

A mission is closed if and only if ALL of:
1. Every item in its output contract exists in `missions/0N-*/outputs/`
2. `outputs/review-verdict.md` exists, written by `red-team-reviewer` running in a
   fresh/forked context, with verdict `APPROVED`
3. All ADR writes/flips declared in the contract are committed and valid
4. `STATUS.md` reads `closed` with handoff notes filled in

The `mission-gate` hook checks 1, 2, and 4 mechanically. Flipping `STATUS.md`
without the verdict artifact does not unlock anything.

### Loop cap

Maximum 3 revision cycles against red-team review. On the third rejection, stop
and escalate to Tal with the reviewer's outstanding objections verbatim.

## Phase 2 — Build (defined by Mission 5, gated by Mission 6)

Begins only after M6 closes. First act: scaffold `app/` per the architecture ADRs
(this is when the framework's create command runs — never earlier). Governed by
the workflow M5 designed. CI runs `security-review` and `performance-review`
skills in **code mode** continuously. Detailed Phase 2 plan is an M5 deliverable.
