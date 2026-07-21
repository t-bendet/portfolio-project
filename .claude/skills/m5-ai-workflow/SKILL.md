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
mission makes the final call), tmux layout (optional), plugin packaging.

## Starting state
M4 closed. .claude/ contains the workshop-phase agents/skills/hooks.

## Input manifest
All closed mission outputs · docs/decisions/*.md · .claude/* · scripts/*.

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
7. ADR writes committed and valid
8. review-verdict.md — APPROVED (fresh context)

## Scope boundaries
No app/ creation, no application code. Workflow machinery only.

## Checkpoints
Checkpoint after phase2-workflow.md and before any .claude/ modification
lands — machinery changes get a look before they're live.

## Stop conditions
Contract met + APPROVED, max 3 cycles, then escalate.
