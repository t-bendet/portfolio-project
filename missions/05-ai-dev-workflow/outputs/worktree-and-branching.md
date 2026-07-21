# Worktrees and Branching — the final call

Mission 5 · 2026-07-22
Recorded as ADR 0026.

`mission-protocol` has carried "worktrees optional (Mission 5 decides)"
since Phase 0. This is the decision. It is made against the real Phase 2
architecture (ADRs 0019, 0021; `architecture-decision.md` §4), not against
worktrees in the abstract.

---

## 1. The call

**No worktrees by default. One narrow, named exception: a task that never
runs the app.**

The operative test is a single question, and it is deliberately mechanical
enough to answer without judgement:

> Does this task start the dev stack or need `node_modules`?

- **Yes** → same working tree, branch normally. This is almost everything.
- **No** → a worktree is free, and occasionally useful.

---

## 2. Why not, concretely

The generic case for worktrees is parallel work without stashing. Three
specific properties of this system take that benefit away.

### 2.1 The dev loop is a running stack, and it is a singleton

`architecture-decision.md` §4 puts the local loop on two long-lived
processes: `docker compose -f deploy/compose.dev.yaml up` (Postgres, fixed
port) and `pnpm astro dev` on the host (port 4321). Compose project names
derive from the directory, so a second worktree does not simply collide on
ports — it starts a *second* Postgres against a *different* named volume, or
worse, the same one.

That second failure is the one that matters. Two branches running
`prisma migrate deploy` against one volume is not a merge conflict that git
will surface at merge time; it is **silent state corruption**, discovered
later as data that does not match either branch's schema. The whole point
of a worktree is that the two checkouts do not interfere, and here the
interference happens below git, in Docker's namespace.

### 2.2 `node_modules` is not cheap here

`app/` is its own pnpm workspace with two packages. A second worktree means
a second install of the Astro 7 / Vite 8 / Rolldown toolchain, Prisma's
generated client and engines, and Playwright's browser binaries — the last
of which are downloaded per-install and are the single largest artifact in
the tree. pnpm's content-addressed store softens the disk cost; it does not
soften the Prisma generate step, the Playwright download, or the cold Vite
optimise on first `astro dev` in the new tree.

For a solo developer on one machine this is a real, repeated tax paid for a
benefit §2.3 shows is not being collected.

### 2.3 Nothing in the Phase 2 model wants two live checkouts

`phase2-workflow.md` §2 sets one track at a time — not because parallelism
is impossible, but because Tal is one person and a change he has not looked
at has not been reviewed. Worktrees solve *contention for a checkout between
concurrent workstreams*. There are no concurrent workstreams. The Phase 1
model (branch per mission, strictly sequential, merge on close) ran six
missions without once needing one, and Phase 2's unit of work is smaller and
shorter-lived than a mission, not larger.

Adopting worktrees here would be adopting a tool for a problem the workflow
was deliberately designed not to have.

---

## 3. Why the exception is real, not a face-saver

Every cost in §2 is a cost of *running the application*. Some genuine Phase 2
work does not run it:

- writing or flipping ADRs;
- authoring GitHub Actions YAML (it executes on a runner, never locally);
- red-team review of a branch — reading a diff, not building it;
- handbook and colophon edits.

For these, all three objections evaluate to zero: no compose stack, no
`node_modules`, no contention. The concrete payoff is the one case that
actually recurs: **reviewing branch A while branch B stays checked out and
its dev server stays up.** Stashing to review, then unstashing and waiting
for Vite to re-optimise, is the friction this removes.

**Tooling note.** The `Agent` tool exposes `isolation: "worktree"`, which
gives a subagent its own worktree and cleans it up if unchanged. That is the
supported way to take the exception: it fits review delegation exactly, and
it makes the worktree an implementation detail of one agent call rather than
a state of the developer's machine that must be remembered and torn down.

---

## 4. What was rejected, and why

**Worktree per track** (`infra`, `api`, `web`, `content` each permanently
checked out). Rejected: three of the four need the stack, so §2.1 applies to
every pair of them; and it institutionalises the parallelism §2.3 says does
not exist. It also quadruples the `node_modules` tax to make switching
cheaper than `git switch`, which is already instant.

**Worktree per agent session.** Rejected on the same grounds plus a
specific one: an agent that cannot run the stack cannot verify its own work,
so it would hand back unverified changes and move verification to Tal. That
trades a small convenience for the review burden `phase2-workflow.md` §4 is
built to bound.

**Worktrees for hotfixes** — keep the feature branch's stack running,
worktree the fix. Rejected, though it is the strongest case: a hotfix to a
deployed site is exactly when you least want to skip running the app before
pushing. `git stash` is the honest tool, and the friction is a feature.

---

## 5. Branch model

### 5.1 Phase 1 (recorded, now closed)

`mission/mN-slug`, one per mission, merged to `main` at closure. Five exist:
`mission/m1-identity` … `mission/m4-information-architecture`, plus this
mission's. **They are never deleted.** They are the provenance of a workshop
whose visible process is part of the exhibit, and deleting them would
discard the same history the ADR rules exist to preserve.

### 5.2 Phase 2

| Branch | Shape | Merges to |
|---|---|---|
| `main` | always deployable — `deploy.yml` fires on it (ADR 0021 §5) | — |
| `<track>/<slug>` | one work item | `main` via PR |
| `fix/<slug>` | hotfix | `main` via PR, same CI |

Track prefixes are exactly the four from `phase2-workflow.md` §2:
`infra/deploy-workflow`, `api/reactions-endpoint`, `web/writing-index`,
`content/kcd-usememo-he`. The prefix is not decoration — it names which
specs are law for the diff, which is the first thing a reviewer needs and
the first thing that gets forgotten.

### 5.3 Everything merges through a PR, including solo work

This looks like ceremony for one person. It is not, for two reasons:

1. **The PR is where CI gates live.** ADR 0021 §5 runs `ci.yml` on pull
   requests; `deploy.yml` runs on `main`. Pushing straight to `main` means
   the first thing that evaluates the change is the thing that deploys it.
2. **The PR is the record.** `phase2-workflow.md` §4.4 puts the scope-cap
   outcome in the PR description, and §4.1's declared review class belongs
   with the diff it applies to. Both need a durable surface that is not a
   chat log.

Squash-merge, so `main` reads as one commit per work item. The branch keeps
the granular history and is not deleted.

### 5.4 `main` is protected by convention, not by settings

Branch protection rules are a GitHub setting, not a repo artifact, and this
mission does not have Tal's console. Recommended when Phase 2 opens: require
`ci.yml` green before merge. **Honest limitation:** until he sets that, "CI
gates the merge" is a habit rather than a rule, and a habit under deadline
pressure is the first thing to go. Flagged for the Phase 2 open checkpoint
(`phase2-workflow.md` §7.2), where the console is already being opened for
DNS and OIDC.

### 5.5 INDEX.md conflicts

Unchanged from `mission-protocol`: regenerate with
`node scripts/reindex-decisions.ts`, never hand-merge. This gets more
likely in Phase 2, not less — ADR 0027 adds `narrows` / `narrowed-by` to
the generated `Note` column, so two branches that each touch an ADR now
produce a conflicting INDEX.md more often. The remedy is the same one line.
