---
id: 0034
title: Workshop checks run unfiltered — a required status check may not be path-scoped
status: active
date: 2026-07-22
decided-by: tal
mission: phase-2
reopened-by: null
superseded-by: null
narrows: 0013
---

## Context

ADR 0013 settled the monorepo and, in the same clause, settled how the
pipeline would be scoped: `ci.yml`/`deploy.yml` on `paths: [app/**]`,
workshop checks in their own workflow, "path-filtering treated as honest
pipeline design (exhibited, linted in CI), not a workaround." Mission 3's
`repo-topology-decision.md` lines 20-23 spelled the second half out —
workshop checks on `paths: docs/**` / `.claude/**`, reasoning that "docs
churn never builds images and app pushes never run workshop lint."

That reasoning is sound and remains sound **for a workflow that only
reports**. It was decided before any workflow was a *required status check*,
because branch protection did not exist yet: ADR 0026 recorded `main` as
"protected by convention, not by configuration" and left the configuration
to Tal.

Requiring a check changes the meaning of not running it. GitHub's merge gate
distinguishes only *reported* from *not yet reported*; there is no third
state for "this check has decided it does not apply." A required check that
a `paths:` filter skips is indistinguishable from one still running, so the
pull request blocks until someone with admin bypass overrides it. The filter
that costs nothing on an unrequired workflow costs the merge gate on a
required one.

This was not theoretical. PR #3 sat `BLOCKED` with `no checks reported`
purely because `workshop.yml` was not yet on `main`, which is the same
failure through a different door.

## Decision

**A workflow that is a required status check on `main` runs unfiltered.**

`workshop.yml` carries no `paths:` filter. It runs on every pull request and
every push to `main`, including changes that touch only `app/**`. This
corrects `repo-topology-decision.md` lines 20-23 for that workflow only.

ADR 0013's path-scoping of `ci.yml` and `deploy.yml` is untouched and still
binding. Those workflows are not required contexts today, and the ordering
rule that follows from this decision is what governs if they ever become
one: **the skip-shim that reports success on non-matching paths must land in
the same commit that adds the workflow as a required context, never after.**
A second ordering rule falls out of PR #3: **the workflow must already be on
`main` before its context is made required**, or every branch cut from `main`
blocks with nothing to report.

The cost of running unfiltered is bounded and small in this specific case,
which is why the correction is scoped to this workflow rather than to the
principle: `scripts/` has no `package.json`, so the job has no install step
and finishes in 7-13 seconds on a free public-repo runner.

## Consequences

- ADR 0013's accepted cost — "a misconfigured filter fails silently,
  mitigated by a workflow-lint check in CI" — becomes **more** load-bearing,
  not less. The mitigation still does not exist. It cannot be built by an
  agent session: a linter belongs in `scripts/`, which ADR 0028 freezes
  against agent edits as the enforcement layer, and writing it into
  `workshop.yml` instead would be routing a checker around that freeze.
  Owner: Tal. Trigger: the commit that authors `ci.yml`, when a second
  filtered workflow makes silent misconfiguration reachable again.
- Workshop checks now run on `app/**`-only pull requests, which Mission 3
  explicitly did not want. Accepted: seconds of a free runner against a
  merge gate that otherwise deadlocks.
- The distinction this ADR draws — filtered workflows are fine, filtered
  *required* workflows are not — has to survive in the reader's head,
  because GitHub surfaces nothing that would enforce it. It is written into
  `workshop.yml`'s header comment and into the remaining-half item of
  `PHASE2-CLEANUP-TODO.md` §E.
- Two Mission 3 artifacts now say something false in isolation. They are
  frozen (ADR 0028) and are corrected, not edited, via
  `docs/STANDING-CORRECTIONS.md` — SC-1 for `repo-topology-decision.md`
  lines 20-23, SC-2 for `phase2-workflow.md` §2's "three GitHub Actions
  workflows", which is four now that `workshop.yml` exists.

## Alternatives rejected

- **Keep the `paths:` filter and add a skip-shim job to `workshop.yml`.**
  The mechanism that makes `ci.yml` requirable later. Rejected here because
  it buys nothing: a shim is a second job that always reports success, so
  the workflow runs on every PR regardless, and the only difference is that
  the real steps are skipped on some of them. That trades seconds of runner
  time for a permanently more confusing workflow file and a second place for
  the filter and the shim to disagree. The trade is worth it for `ci.yml`,
  whose skipped work is minutes of Docker builds and a Postgres service
  container; it is not worth it for a job with no install step.
- **Do nothing and rely on admin bypass when a PR deadlocks.** Rejected:
  `enforce_admins: false` exists as an escape hatch for a wedged check, not
  as the routine merge path. A gate that must be bypassed on ordinary work
  trains the reflex that makes the gate worthless, which is the failure ADR
  0026 already named about habits.
- **Leave the reversal recorded only in `workshop.yml`'s header comment.**
  How this shipped in PR #2, and rejected on review: the comment cited the
  half of `repo-topology-decision.md` that agreed with it and not the lines
  it contradicted, so a future session reading the frozen spec would restore
  the filter and rediscover the deadlock.
- **Write no ADR, on the grounds that ADR 0013's `## Decision` asserts
  `paths: [app/**]` for `ci.yml`/`deploy.yml` only.** Narrowly true, and the
  reason this is a narrowing rather than a supersession. Rejected as a reason
  to record nothing: `phase2-workflow.md` §7.4 makes a wrong blueprint
  document a checkpoint whose output is a new ADR, and Mission 3's output is
  a blueprint document by TODO §C. The session that first declined to write
  this ADR decided that on its own authority, which is the part that was
  wrong.
