# Repo Topology — Mission 3 resolution of ADR 0013's question

Date: 2026-07-21
Status: **RECOMMENDED, PENDING TAL** (as written). CLAUDE.md lists repo
topology changes under escalate-to-Tal; ADR 0013 therefore stayed untouched
(`proposed`) until Tal confirmed.
*(Addendum 2026-07-21: Tal CONFIRMED the monorepo recommendation at the
escalation checkpoint later the same day; ADR 0013 is now `active` with the
consequences below recorded in it. This document is the analysis record.)*

## The question (ADR 0013)

Does `app/` live in this repo (monorepo: workshop + product) or in its own
repo (separate CI/Docker/deploy story)?

## Recommendation: **monorepo** — `app/` lives in this repository

Argued on the five axes the question turns on:

1. **CI/CD.** GitHub Actions `paths:` filters cleanly scope the three
   authored workflows (`ci.yml`, `deploy.yml` on `app/**`; workshop checks
   on `docs/**`/`.claude/**`), so docs churn never builds images and app
   pushes never run workshop lint. The from-scratch pipeline story (ADR
   0012c) is not diluted — the workflow files are the same hand-written
   artifacts either way, and path-filtering is itself honest pipeline
   design worth exhibiting, not a workaround. Cost accepted: filters are
   one more thing to get right, and a misconfigured filter fails silently
   (mitigated by a workflow-lint check in CI).
2. **Docker context.** `app/` as the build context works without friction —
   Dockerfiles live under `app/`, builds run with `context: app/...`.
   Nothing in the container strategy (architecture-decision.md §4) needs
   repo-root context. No forcing either direction; slight verbosity cost
   in build commands.
3. **Mission-gate hooks and the Phase 2 workflow.** The workshop's
   machinery — mission-gate, decision-guard, skills, and the M5-designed
   agent workflow — lives in this repo's `.claude/` and `scripts/`. A
   separate app repo would either fork that machinery (drift, double
   maintenance — a direct R4 violation) or leave the app ungoverned by the
   workflow that Mission 5 exists to design. Monorepo means the same hooks
   that governed the decisions govern the build. This is the strongest
   technical argument.
4. **Secrets.** Actions secrets are repo-scoped either way; deploy
   credentials (OIDC role reference, SSH key) attach to this repo. The
   honest monorepo cost: a wider set of contributors/agents touching the
   repo share proximity to deploy-capable workflows. Mitigation, stated as
   a requirement not a hope: `deploy.yml` and `backup.yml` bind to a
   GitHub **environment** with protection rules, so only main-branch runs
   (plus manual approval if Tal wants it) can reach the deploy
   credentials; the OIDC trust policy is scoped to this repo + environment.
   No secret ever lives in the tree in either topology.
5. **Identity — "the workshop is part of the exhibit."** ADR 0013's own
   question text names the showcase value; the identity thesis makes the
   site "a working artifact" whose infrastructure is part of the work. One
   public repo holding the decision record, the agent workflow, AND the
   product it produced is the strongest possible proof-of-process artifact
   — a visitor can trace an ADR to the commit that implemented it. Two
   repos sever that trace. Public visibility also keeps Actions minutes
   free (Q34) and is already assumed by ADR 0014 ("names are discoverable
   in the open repo").

**The honest case for the losing option, so Tal sees it:** a separate app
repo gives simpler workflow triggers (no filters), a smaller clone, a
cleaner "conventional" repo for casual reviewers who just want to read app
code, and blast-radius separation — a bad workshop-side push can never
touch a deploy workflow. If Tal weighs conventional-reviewer legibility
above process-exhibit value, separate-repo is the right answer; the
recommendation judges the exhibit value higher because community standing
through demonstrated process is the site's stated primary goal.

## Consequences for the pipeline if confirmed

- Workflows: `ci.yml`/`deploy.yml` trigger on `paths: [app/**]`;
  `backup.yml` is cron-only; workshop checks keep their own workflow.
  Concurrency groups prevent overlapping deploys.
- `deploy.yml`/`backup.yml` bind to a protected `production` environment
  (secrets scoped there, not repo-wide).
- `app/` is its own pnpm workspace (its lockfile and toolchain do not
  entangle `scripts/`, which stays on the repo's Node-24-direct-run rules).
- Branch protection on `main` covers both worlds; the mission-gate hook
  continues to block `app/` creation until Phase 2 legitimately opens.
- ADR write after Tal confirms: 0013 flips per adr-keeper (new active ADR
  with the four sections; 0013 superseded or resolved per keeper
  convention at that moment) — not before.
