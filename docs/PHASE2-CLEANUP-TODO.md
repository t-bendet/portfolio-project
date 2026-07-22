# Phase 2 Cleanup — TODO

From the 2026-07-22 workshop audit. These land **after M6 closes** (Phase 2
open), when `protect-workshop` unlocks `.claude/skills/**` and
`.claude/agents/**` for sessions. Items touching `scripts/` or
`settings.json` stay blocked for agent sessions in every phase (ADR 0028) —
those are marked **[Tal, by hand]**.

Run as one `infra/workshop-cleanup` work item, review class Standard.
Nothing here changes any decision — it removes weight the decisions no
longer need.

## A. Deletions

- [ ] **[Tal, by hand]** Delete `scripts/sync-docs.ts` and
      `scripts/hooks/docs-sync-check.ts`; remove the docs-sync-check entry
      from `.claude/settings.json` (PostToolUse). Diagrams live only in
      `docs/HANDBOOK.md` from now on.
- [ ] Delete `docs/diagrams/` and `docs/.docs-fingerprint.json` (extraction
      targets of the deleted machinery).
- [ ] Delete the five retired agent files: `brand-strategist.md`,
      `design-systems.md`, `design-verifier.md`, `ia-planner.md`,
      `tech-architect.md`, and (now also retired) `workflow-engineer.md`.
      Git history keeps the provenance; add a one-line note to the handbook
      (§5) saying retirement = deletion, provenance = git. Their
      descriptions currently cost context in every session.
- [ ] **[Tal, by hand]** After the agent deletions, update
      `scripts/test-machinery.ts` if any assertion references a deleted
      file path (it probes `red-team-reviewer.md` — keep that one).

## B. Simplifications

- [ ] Strip the "**Project parameters** (ADR 0029) — escalation target: Tal"
      header blocks from `mission-protocol`, `adr-keeper`, `review-work`,
      `prompt-craft`, and `tech-eval` skills. The plugin was deliberately not
      published; parameterizing for a consumer that doesn't exist is
      overhead. (If the plugin ever ships, re-parameterize then — see
      `docs/NEXT-ITERATION-HANDOFF.md` §2.)
- [ ] **[Tal, by hand, optional]** Simplify `scripts/hooks/protect-workshop.ts`
      to the static Phase 2 rule (M5/M6 regimes are dead once M6 closes):
      block `scripts/**` and settings always; allow `.claude/skills/**` and
      `.claude/agents/**` always. Then trim the matching phase-table cases
      from `test-machinery.ts`. Low urgency — the current logic is correct,
      just carries dead branches.
- [ ] **[Tal, by hand, optional]** In `scripts/validate-workshop.ts`, drop
      the judgment/worker species contract (Operating contract / Workflow /
      Output format / pinned-model checks). Keep: SKILL.md exists, name
      matches folder, description present, mission skills carry
      `disable-model-invocation: true`.
- [ ] Update `docs/HANDBOOK.md` to match: remove §6's docs-sync-check bullet
      and the sync-docs paragraph, remove the mermaid-extraction claim,
      update the agents list in §5, update the hook count. (With
      docs-sync-check deleted, no ack is needed — HANDBOOK edits are plain
      edits.)

## C. Keep — decided, do not revisit

- All six mission skills (they are the process record).
- `red-team-reviewer` + `review-work` (`context: fork`).
- `docs-explorer` (though context7 MCP overlaps it; retire later if unused
  in practice — that's a friction-log call, not a today call).
- `mission-gate` backward freeze (closed outputs are Phase 2's specs).
- `narrows`/`narrowed-by` frontmatter + INDEX note. (The graph validator in
  `validate-adr.ts` stays too — removing it isn't worth a hand-edit.)
- `contrast.ts`, `test-machinery.ts`, `inject-project-state`,
  `decision-guard`, `protect-reference`.

## D. Model tiering (2026-07-22 call)

Rule: **reviewer model ≥ producer model, always.** The fresh-context reviewer
is the safety net that makes cheaper producers safe; downgrading it turns the
gate system into theater.

- M6: Fable — the mission *is* the adversarial coherence pass; last cheap
  point to catch a cross-ADR contradiction.
- Phase 2, by review class (ADR 0025):
  - Routine → Sonnet (Haiku acceptable for pure copy)
  - Standard → Sonnet + propagation checklist
  - Gated → producer Sonnet/Opus; `review-work` reviewer on Fable/Opus
- Workers (`docs-explorer`) stay pinned to Sonnet.
- Mechanical drafting from decided specs (ADR formatting, STATUS files,
  briefs post-decision) → Sonnet.

## E. Process (from IMPROVEMENTS.md, still open)

- [ ] Phase 2 work items carry the three-bullet friction note in the PR
      description (IMPROVEMENTS.md #4 — the mechanism that never happened).
- [ ] Start `docs/research/story-capture.md` on the first Phase 2 work item
      (IMPROVEMENTS.md #5) — the workshop-to-build transition is itself
      writing material.
- [ ] After cleanup: `node scripts/test-machinery.ts &&
      node scripts/validate-workshop.ts && node scripts/validate-adr.ts`
      all green before merging the cleanup PR.
