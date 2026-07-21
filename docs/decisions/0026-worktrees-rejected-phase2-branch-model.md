---
id: 0026
title: Worktrees rejected as the default; Phase 2 branch model is track-prefixed branches through PRs
status: active
date: 2026-07-22
decided-by: mission-5
mission: mission-5
reopened-by: null
superseded-by: null
---

## Context

`mission-protocol` has carried "worktrees optional (Mission 5 decides)" since
Phase 0. The question was deferred because worktrees only make sense against a
real development loop, and that loop was not designed until ADRs 0019 and
0021.

It now is. The local loop is two long-lived processes: a Docker Compose stack
running Postgres on a fixed port, and `astro dev` on the host. That detail is
what settles the question, and it was not available earlier.

## Decision

**No worktrees by default. One exception: a task that never runs the app.**

The test is a single question — *does this task start the dev stack or need
`node_modules`?* If yes, same working tree, branch normally. If no, a worktree
is free and occasionally useful: ADR writes, GitHub Actions authoring, review
of a branch, handbook edits. The supported way to take the exception is the
`Agent` tool's `isolation: "worktree"`, which scopes it to one delegated call
rather than to a state of the machine.

**Phase 2 branch model:**

| Branch | Shape | Merges to |
|---|---|---|
| `main` | always deployable; `deploy.yml` fires on it | — |
| `<track>/<slug>` | one work item, prefixed with its ADR 0025 track | `main` via PR |
| `fix/<slug>` | hotfix | `main` via PR, same CI |

Everything merges through a PR, including solo work, squash-merged. Mission
branches (`mission/mN-slug`) are never deleted.

## Consequences

- Switching contexts means `git switch` and restarting the dev stack, or
  stashing. That is the accepted cost, and it is small because ADR 0025 runs
  one track at a time anyway.
- The track prefix on every branch name makes the governing specs the first
  thing visible about a diff — which is the first thing a reviewer needs and
  the first thing that gets forgotten.
- Requiring a PR for solo work adds a step that produces two things nothing
  else does: a surface where `ci.yml` gates *before* `deploy.yml` runs, and a
  durable record for the declared review class and any scope-cap outcome.
- **`main` is protected by convention, not by configuration.** Branch
  protection is a GitHub setting this mission cannot make. Until Tal sets
  "require `ci.yml` green before merge", the gate is a habit — and habits fail
  under deadline pressure. Flagged for the Phase 2 open checkpoint.
- Keeping every mission branch forever adds clutter to `git branch -a` and is
  accepted for the same reason ADRs are never deleted.
- ADR 0027 adds a generated column to `INDEX.md`, so concurrent ADR work now
  conflicts there slightly more often. Remedy is unchanged: regenerate.

## Alternatives rejected

- **A permanent worktree per track.** Rejected on a mechanism, not a
  preference: three of the four tracks need the dev stack, and Compose project
  names derive from the directory. A second worktree does not merely collide
  on ports — it runs a second Postgres against a different named volume, or
  the same one. Two branches running `prisma migrate deploy` against one
  volume is not a merge conflict git will surface; it is silent state
  corruption discovered later as data matching neither branch's schema. The
  interference happens below git, where a worktree offers no protection.
- **A worktree per agent session.** Rejected for the above plus a specific
  cost: an agent that cannot run the stack cannot verify its own work, so it
  returns unverified changes and moves verification onto Tal — inflating
  exactly the review burden ADR 0025 bounds.
- **Worktrees for hotfixes**, keeping the feature branch's stack alive. The
  strongest case, and still rejected: a hotfix to a live site is precisely
  when skipping a local run of the app is least acceptable. `git stash` is the
  honest tool and the friction is doing real work.
- **Push straight to `main` for solo work.** Rejected: it makes the deploy
  workflow the first thing that evaluates a change.
- **Delete merged branches.** Rejected for mission branches (provenance);
  permitted but not required for Phase 2 work-item branches, whose history is
  preserved in the squash-merge commit.
