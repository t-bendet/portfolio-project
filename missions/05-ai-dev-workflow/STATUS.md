---
mission: m5
status: closed
depends-on: m4
opened: 2026-07-21
closed: 2026-07-22
revision-cycles: 1
---

# Status — AI Dev Workflow

## Handoff notes

**Verdict: APPROVED, cycle 2** (outputs/review-verdict.md), after one
rejection. Three non-blocking cycle-2 findings were all applied before this
flip — necessarily, because ADR 0028's own new freeze rule makes closed
missions' outputs unwritable.

**Decided (Tal, at three in-mission checkpoints):**
- **Plugin: specified at 0.1, not published** (ADR **0029**). `brand-voice`
  reclassified out as a project brand book. Cheap de-leaking done (role name
  → a parameter, 4 skills); the domain-assumption class deliberately left,
  because `security-review`'s "low-value target" line is load-bearing for
  **M6's own design-mode review** and editing it would alter that
  calibration before it runs.
- **`protect-workshop` splits by what the enforcement layer can check**
  (ADR **0028**): after M6 closes, sessions may edit `.claude/skills/**` and
  `.claude/agents/**`, never `scripts/hooks/**`, `scripts/*.ts`, or the
  settings files. *Edit what is checked, never the checker.* Without this the
  machinery froze permanently the moment M5 closed.
- **Scope cap: three sessions per Phase 2 work item; M6 exempt** (ADR 0025).
- **`app/` stays mechanically unenforced** — the hole expires when Phase 2
  opens, and closing it needs a `settings.json` edit only Tal can make.

**ADRs:** 0025–0029 new (all `active`). 0019, 0020, 0023, 0024 gained
reciprocal narrowing frontmatter — **no status flips, no body edits**.
INDEX.md regenerated: 21 active, 8 superseded.

**What Mission 6 must know:**
1. **You are not exempt from the machinery you audit.** `protect-workshop`
   blocks `.claude/` and `scripts/` writes while M6 is in-progress — the
   Phase 2 allowance opens only when M6 *closes*. Asserted in
   `test-machinery.ts` ("M6 auditing: skills blocked"). If M6 needs a
   machinery change, that is an escalation, not an edit.
2. **Closed missions' outputs are frozen** (ADR 0028). M1–M5 deliverables
   are read-only. A wrong closed deliverable is a new ADR.
3. **Run `node scripts/test-machinery.ts` first.** 36 assertions, six hooks.
   It is the coherence check for the enforcement layer that M6's coherence
   review would otherwise have to do by reading.
4. **`security-review` design mode is unchanged on purpose** — see above.
   Do not treat its "low-value target" line as leftover leakage.
5. **Two narrowings are now visible in `INDEX.md`** (0019←0023, 0020←0024).
   A coherence review that reads ADRs individually must read the `Note`
   column, or it will re-derive the contradiction M4 found.
6. **`phase2-scaffold-plan.md` §0's claim that a hook prevents `app/`
   existing is false** — recorded in `phase2-workflow.md` §9 and
   `hooks-plan.md` §7, since M3's output cannot be edited.

**For Phase 2:** `IMPROVEMENTS.md` #2, #3 and #7 are closed and can be
struck. **#4 (friction logs) was never implemented and that is the honest
gap in this mission** — its stated purpose was that M5 would design the
Phase 2 workflow *from that evidence*; five missions closed without one, so
the design rests on argument. ADR 0025 refuses new machinery "until real
friction demands it", and nothing currently produces that demand. Cheapest
fix on the list: three bullets in each Phase 2 PR description.

**Unverified, flagged rather than asserted:** `context: fork` is documented
to withhold parent conversation history, and `agent:` naming a
project-defined agent is the natural reading but is **not confirmed**. The
`red-team-reviewer` behavioural refuse-if-you-can-see-the-conversation rule
is therefore kept as the backstop that actually holds the invariant.

## ADR statuses observed at mission start (2026-07-21)

active: 0001, 0002, 0011, 0012, 0013, 0014, 0015, 0016, 0017, 0018, 0019,
0020, 0021, 0022, 0023, 0024 · superseded: 0003, 0004, 0005, 0006, 0007,
0008, 0009, 0010 · reopened: none · proposed: none.

Gate check run before any work: M4 `depends-on: m3`; M4 STATUS reads
`closed` (2026-07-21, revision-cycles 2) and
`missions/04-*/outputs/review-verdict.md` frontmatter reads
`verdict: APPROVED` (cycle 3). Verified by reading both files, not by
trusting the injected mission-status line.

## Inputs actually read

- `missions/03-technology-architecture/outputs/`: architecture-decision.md
  (§1–8), phase2-scaffold-plan.md (all — §0's five open verifications and
  §5's pipeline are load-bearing for `phase2-workflow.md`)
- `missions/04-information-architecture/outputs/`: content-model.md (§1, §4,
  §4.0 the upstream grant, §6, §9 — the two obligations handed to M5 and the
  two ADR narrowings), STATUS.md handoff notes, review-verdict.md (cycle 3,
  read for the defect-class evidence used in `phase2-workflow.md` §1)
- `missions/00-mission-plan.md`; `missions/0N-*/STATUS.md` for all six
- `docs/decisions/`: INDEX.md; frontmatter of 0019, 0020, 0023, 0024
- `docs/HANDBOOK.md` (all), `docs/IMPROVEMENTS.md` (all — items 1, 2, 3, 6, 7
  are directly actioned; 4 and 5 are recorded as not done)
- `.claude/settings.json`; every `.claude/agents/*.md`;
  `.claude/skills/`: prompt-craft, mission-protocol, adr-keeper,
  performance-review, security-review
- `scripts/`: all six hooks, validate-adr.ts, validate-workshop.ts,
  reindex-decisions.ts, sync-docs.ts, lib/frontmatter.ts
- **Verified by lookup, not memory (2026-07-22):** the Claude Code plugin
  manifest format (`.claude-plugin/plugin.json`, `name` the only required
  field), plugin hook declaration and `${CLAUDE_PLUGIN_ROOT}` path
  resolution, the marketplace manifest, and — decisive for
  `IMPROVEMENTS.md` #3 — that `context: fork` is a real current SKILL.md
  frontmatter field whose forked context does not receive parent
  conversation history.
- Not read: M1 and M2 outputs. Nothing in this mission's contract turns on
  identity or design-token content, and reading them would have invited
  workflow decisions justified by aesthetics.
