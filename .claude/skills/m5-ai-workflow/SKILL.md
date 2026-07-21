---
name: m5-ai-workflow
description: Mission 5 — AI Development Workflow for Phase 2. Run only when Tal explicitly invokes /m5.
disable-model-invocation: true
---

# Mission 5 — AI Dev Workflow

## PROJECT PARAMETERS

Workspace: missions/05-ai-dev-workflow/ · Agent: workflow-engineer ·
Skills: prompt-craft, mission-protocol, adr-keeper · License: write workflow
ADRs; extend .claude/ (new agents/skills/hooks for Phase 2) — the ONE mission
allowed to modify .claude/.

## Memory block

Binding: M3's architecture + repo topology (workflow must fit the real CI/CD
and container story, ADR 0012); mission-protocol conventions; TS-only scripts,
erasable syntax, Node >= 24. Open: worktree usage (demoted to optional — this
mission makes the final call), tmux layout (optional), plugin packaging. Also
open: the ADR lifecycle has no representation for PARTIAL NARROWING — one
active ADR correcting a clause of another without superseding it. Live
instances: 0023→0019 (hreflang), 0024→0020 (path keying). See M4's
content-model.md §9 items 3–4.

## Starting state

M4 closed. .claude/ contains the workshop-phase agents/skills/hooks.

## Input manifest

All closed mission outputs · docs/decisions/_.md · .claude/_ · scripts/\*.

## Output contract

1. phase2-workflow.md — how build work runs: agent roles, delegation patterns,
   loop + review conventions with caps, checkpoint cadence
2. worktree-and-branching.md — the final call on worktrees, with reasons;
   branch strategy for feature work vs the mission-era branch model
3. hooks-plan.md — Phase 2 hook set (e.g., test-before-commit, budget checks
   wiring performance-review code mode) + which workshop hooks retire
4. plugin-spec.md — packaging .claude/ as the portfolio-workshop plugin:
   what travels (skills/agents/hooks), what stays (missions/, docs/), version 0.1
5. tmux-layout.md — optional; if skipped, one line saying why
6. New/updated .claude/ assets for Phase 2, each following prompt-craft
7. ADR writes committed and valid — INCLUDING the ADR-narrowing fix: today
   `reindex-decisions.ts` emits a note only for `reopened` and `superseded`,
   so a narrowing is invisible in INDEX.md and a Phase 2 reader of the older
   ADR alone builds the wrong thing (0019 alone → emits exactly the hreflang
   alternates 0023 forbids, and nothing in CI catches it). Resolve it either
   as a `narrowed-by` frontmatter key threaded through adr-keeper +
   validate-adr.ts + reindex-decisions.ts, or as a workflow step that
   surfaces the relationship. State which and why; a deliberate "leave it,
   here is the reasoning" is an acceptable outcome, silence is not.
8. review-verdict.md — APPROVED (fresh context)

## Scope boundaries

No app/ creation, no application code. Workflow machinery only.

## Checkpoints

Checkpoint after phase2-workflow.md and before any .claude/ modification
lands — machinery changes get a look before they're live.

## Stop conditions

Contract met + APPROVED, max 3 cycles, then escalate.
