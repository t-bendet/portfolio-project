---
id: 0013
title: Repository topology — workshop and app live in one monorepo
status: active
date: 2026-07-21
decided-by: tal
mission: mission-3
reopened-by: null
superseded-by: null
---

## Context
Proposed 2026-07-20 with the question: "Does `app/` live in this repo
(monorepo: workshop + product, publicly showcasing the AI workflow itself) or
in its own repo (cleaner CI/CD, Docker, and deploy story per ADR 0012)?"
Owned by Mission 3; CLAUDE.md lists repo topology under escalate-to-Tal, so
the mission's recommendation went to Tal, who confirmed it on 2026-07-21.
Full analysis: missions/03-technology-architecture/outputs/repo-topology-decision.md.

## Decision
Monorepo: `app/` lives in this repository, created only when Phase 2 opens.

- CI/CD: the hand-written workflows scope by path — `ci.yml`/`deploy.yml`
  trigger on `paths: [app/**]`; workshop checks keep their own workflow;
  concurrency groups prevent overlapping deploys. Path-filtering is treated
  as honest pipeline design (exhibited, linted in CI), not a workaround.
- Secrets: `deploy.yml`/`backup.yml` bind to a protected GitHub `production`
  environment; the AWS OIDC trust policy is scoped to this repo + environment.
  No long-lived cloud keys; no secret in the tree.
- `app/` is its own pnpm workspace — its lockfile and toolchain do not
  entangle `scripts/`, which keeps the repo's Node-24-direct-run rules.
- The mission-gate hook continues to block `app/` creation until Phase 2
  legitimately opens.

## Consequences
- The same `.claude/` machinery (mission-gate, decision-guard, skills, and the
  Mission 5 workflow to come) that governed the decisions governs the build —
  no fork, no drift, no second maintenance surface (ADR 0012's from-scratch
  pipeline and the R4 maintenance budget both benefit).
- The public repo holds the full trace — ADR → commit → shipped product —
  which is the strongest process-exhibit available to the identity thesis,
  and is already assumed by ADR 0014 (names discoverable in the open repo).
  Actions minutes stay free on the public repo.
- Accepted costs: path filters are one more thing to get right (a
  misconfigured filter fails silently — mitigated by a workflow-lint check in
  CI); deploy-capable workflows share a repo with workshop churn (mitigated by
  the protected environment above); the repo reads as a workshop wrapping a
  product rather than a conventional app repo.
- Mission 5 designs the Phase 2 workflow against this topology; Mission 4 may
  assume one repo when referencing content/infra paths.

## Alternatives rejected
- **Separate app repo.** Real advantages, stated honestly: trigger simplicity
  (no path filters), smaller clone, a cleaner "conventional" repo for casual
  reviewers who just want app code, and blast-radius separation (a bad
  workshop-side push can never touch a deploy workflow). Rejected because it
  would either fork the workshop's `.claude/` workflow machinery (drift,
  double maintenance) or leave the app ungoverned by the workflow the
  workshop exists to design, and because it severs the public ADR→commit→
  product trace — community standing through demonstrated process is the
  site's stated primary goal, and Tal weighed exhibit value above
  conventional-reviewer legibility at the 2026-07-21 sign-off.
