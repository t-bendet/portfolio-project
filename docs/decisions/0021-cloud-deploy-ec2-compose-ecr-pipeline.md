---
id: 0021
title: Cloud and deploy — EC2 t4g.micro with Docker Compose, ECR via OIDC, Route 53, Caddy TLS, hand-written GitHub Actions pipeline
status: active
date: 2026-07-21
decided-by: mission-3
mission: mission-3
reopened-by: null
superseded-by: null
---

## Context

ADR 0012 requires containerized deploy on AWS or equivalent with a CI/CD
pipeline built from scratch; Mission 3's G6 gate caps steady-state cost at
$15/month (Tal, checkpoint 1). Tal locked the C1 architecture at checkpoint
2; the specific instance, registry, and pipeline shape are the mission's
call within that envelope. All pricing/capability facts cite
missions/03-technology-architecture/outputs/verification-report.md
(2026-07-21).

## Decision

- **Compute:** one EC2 `t4g.micro` (arm64, 1GiB, ~$6.13/mo, Q29) running
  Docker Engine + Compose V2 with the three-container stack of ADR 0019.
- **Registry:** AWS ECR (near-$0 at one-small-image scale, same-region
  pulls free, Q36), authenticated from GitHub Actions via OIDC federation —
  no long-lived AWS keys.
- **DNS/TLS:** Route 53 hosted zone ($0.50/mo, Q31); TLS by Caddy's
  automatic HTTPS with zero-config renewal (Q37).
- **Pipeline — three hand-written workflow files** (full stage detail:
  outputs/architecture-decision.md §5): `ci.yml` (typecheck; tests against
  an ephemeral postgres:18 service container with migrations applied;
  builds; Playwright RTL check per ADR 0011, Q38), `deploy.yml` (buildx
  arm64 image build; push to ECR; `prisma migrate deploy`; SSH compose
  pull/up; health check; rollback by previous SHA tag), `backup.yml`
  (scheduled `pg_dump` to a versioned S3 bucket).
- **Database fallback:** Neon free tier (real Postgres, scale-to-zero,
  sub-second resume, Q33) is the named escape hatch if instance memory
  forces the DB off-box; not primary, because operating the database is
  part of what ADR 0012 demonstrates.
- **Budget:** ≈ $6.63/mo verified. One item is unquantified pending
  verification: AWS public-IPv4 billing was not covered by the verification
  report, and no dollar figure is asserted for it here — it must be confirmed
  at scaffold time (phase2-scaffold-plan.md §0.3), and the G6 $15 ceiling
  must be re-checked with it included before any resource is provisioned.

## Consequences

- The four ADR 0012 constraints are each visibly owned: the database is
  operated (with tested backups — the scaffold plan requires one restore
  drill), the containers are the deploy unit, every pipeline stage is
  authored, and the cloud footprint (VPC/SG/IAM/OIDC/ECR/S3/Route 53) is
  Tal's to explain on the site.
- Honest ops cost accepted: instance patching, Postgres care, and backup
  custody are recurring solo-dev work; the architecture bounds the blast
  radius (static site survives dynamic failure, ADR 0019) but does not
  eliminate the work.
- ARM64 images are built with QEMU/buildx on free x86 runners because
  GitHub's hosted ARM runners bill $0.005/min even on public repos (Q34);
  if build times prove painful, that tradeoff is revisited at scaffold.
- GHCR's free tier is an explicitly revisable policy, not a contract
  (Q35) — recorded as fallback registry only.
- Actions minutes are free on public repos (Q34); repo visibility interacts
  with the topology question (repo-topology-decision.md, pending Tal).

## Alternatives rejected

- **Lightsail nano ($3.50–5/mo, Q28).** Cheaper, but 512MB is genuinely
  tight for Node + Postgres + Caddy, and Lightsail abstracts away the VPC/
  SG/IAM surface that makes the deployment worth exhibiting. The $1.13/mo
  delta buys both headroom and representativeness.
- **RDS.** Dominated at this scale: a second managed bill (~$14/mo
  reported at db.t4g.micro + storage, Q30 — secondary-sourced,
  corroborating not decisive) to run the same Postgres a $0 container
  runs, while removing the DB-ops demonstration. Revisitable only as a
  deliberate new decision with a new budget.
- **Hetzner CAX11 / DigitalOcean ($4–5.50/mo, Q32).** Comparable or
  cheaper and honestly noted as such; rejected because AWS is the named
  skill being demonstrated (ADR 0012, about-tal.md) — "or equivalent"
  remains the documented escape hatch if AWS terms worsen.
- **GHCR as primary registry.** Free today, but explicitly policy-not-
  contract (Q35); ECR's near-$0 with contractual pricing wins for the
  load-bearing path.
- **Managed push-to-deploy platforms (PaaS/static hosts).** Fail ADR
  0012(c)/(d) as gated in requirements-and-weights.md G2: "the platform
  does it" leaves no pipeline to build and no deployment under Tal's
  control.
- **SQLite-class storage on the instance.** Set aside on verification
  grounds: node:sqlite is RC and documented as unsuited to production HTTP
  servers (Q26); the Litestream replication story's version and cost were
  unverified this pass (Q27). Revisitable with primary verification.
