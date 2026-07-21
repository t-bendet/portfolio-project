---
name: m3-architecture
description: Mission 3 — Technology & Architecture. Run only when Tal explicitly invokes /m3.
disable-model-invocation: true
---

# Mission 3 — Technology & Architecture

## PROJECT PARAMETERS
Workspace: missions/03-technology-architecture/ · Agent: tech-architect (+ docs-explorer worker, spawned by THIS session,
not by tech-architect — subagents don't nest) ·
Skills: tech-eval, adr-keeper, mission-protocol · License: supersede or confirm
ADR 0003; decide ADR 0013 (repo topology); write architecture ADRs.

## Memory block
Binding: ADR 0012 — SQL, Docker, from-scratch CI/CD, cloud deploy, all
GENUINELY incorporated. M1 identity (may shape choices; M2 aesthetics may NOT —
do not read M2 outputs even though M2 is closed; architecture is not decided by
mood). Preserved gotchas listed in ADR 0003 and tech-eval.

## Starting state
M2 closed (strict sequence). ADR 0003 `reopened`, 0013 `proposed`.

## Input manifest
docs/decisions/*.md · docs/research/* · missions/01-*/outputs/* ·
web search for current versions/compat. EXPLICITLY EXCLUDED: missions/02-*/outputs/.

## Output contract
1. requirements-and-weights.md — named criteria BEFORE candidates (tech-eval §1)
2. evaluation.md — >=3 candidates incl. "keep Astro", honest tradeoffs, verified
   versions, what each forces on Docker/CI/deploy shape
3. architecture-decision.md — the chosen stack + WHERE THE DYNAMIC BOUNDARY SITS:
   what the SQL database honestly does, container strategy, pipeline stages
   (from scratch — name every stage), cloud target + deploy shape
4. repo-topology-decision.md — resolves ADR 0013 with consequences for CI/CD
5. phase2-scaffold-plan.md — exact commands/steps to create app/ later
   (NOT executed now)
6. ADR writes/flips (0003, 0013, new ones) committed and valid
7. review-verdict.md — APPROVED (fresh context)

## Scope boundaries
Do NOT create app/, run any scaffold command, or add dependencies. Do not read
M2 outputs. Paper only.

## Checkpoints
Checkpoint after requirements-and-weights (BEFORE evaluating candidates —
wrong weights poison everything downstream) and after the stack decision.

## Stop conditions
Contract met + APPROVED, max 3 cycles, then escalate.
