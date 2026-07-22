---
id: 0033
title: ARM images build on native GitHub runners; the cloud budget is ≈$10.28/mo with public IPv4 confirmed
status: active
date: 2026-07-22
decided-by: tal
mission: phase-2
reopened-by: null
superseded-by: null
narrows: 0021
---

## Context

ADR 0021 left two items explicitly unresolved and pointed both at the
scaffold-time verification pass:

1. Its consequences state that arm64 images are built with QEMU/buildx on
   free x86 runners **because** GitHub's hosted ARM runners bill $0.005/min
   even on public repos (Q34), with the tradeoff to be revisited at scaffold
   if build times proved painful. `phase2-scaffold-plan.md` §0.4 owed the
   measurement and the follow-on choice (paid ARM runners vs building on the
   instance).
2. Its budget asserts ≈$6.63/mo and names one unquantified item: AWS
   public-IPv4 billing, which `verification-report.md` never covered. ADR
   0021 requires that figure be confirmed and the G6 $15 ceiling re-checked
   with it included **before any resource is provisioned**.

The seven-item scaffold verification batch ran 2026-07-22 on branch
`infra/scaffold-verification`; full findings and sources are in
`docs/SCAFFOLD-VERIFICATION.md` §3 and §4. Both items resolved, and the
first resolved against ADR 0021's stated reasoning rather than within it.

Everything else ADR 0021 decides — EC2 `t4g.micro`, Compose, ECR via OIDC,
Route 53, Caddy TLS, three hand-written workflow files, the Neon fallback,
every rejected alternative — is untouched and still binding. This is a
narrowing of two clauses, not a supersession (ADR 0027).

## Decision

**1. arm64 images build on native GitHub-hosted ARM runners, not under QEMU
emulation.** The workflows use `runs-on: ubuntu-24.04-arm`; no
`docker/setup-qemu-action`, no buildx cross-emulation step. GitHub made
native arm64 runners generally available for public repositories on
2025-08-07 and for private ones on 2026-01-29; this repository is public, so
the builds fall inside standard included minutes at no additional cost.

Q34's premise — that hosted ARM runners bill $0.005/min *even on public
repos* — was true when Mission 3 verified it and is no longer true. The
$0.005/min figure itself remains correct for the 2-core arm64 runner where
it does bill (private repos, and larger runners at $0.008–$0.098/min).

`phase2-scaffold-plan.md` §0.4's follow-on choice is void: there is no
emulation penalty to measure, and neither paid ARM runners nor on-instance
builds are needed.

**2. The steady-state cloud budget is ≈$10.28/mo.** Public IPv4 is confirmed
at $0.005/hr ≈ $3.65/mo, charged whether the address is idle or in use and
identically for an auto-assigned public IP or an Elastic IP, across all
commercial regions. The 750 hrs/mo free-tier allowance applies only to
accounts in their first twelve months and is therefore not assumed.

| Line | Monthly |
|---|---|
| EC2 `t4g.micro` on-demand (us-east-1) | $6.13 |
| Route 53 hosted zone | $0.50 |
| Public IPv4 | $3.65 |
| **Total** | **≈$10.28** + S3 backup and ECR pennies |

ADR 0021's ≈$6.63 stands as what was verifiable on 2026-07-21; it is not the
provisioning figure. G6's $15 ceiling holds with ≈$4.70 of headroom, and ADR
0021's precondition for provisioning — re-check the ceiling with IPv4
included — is hereby satisfied for us-east-1 only. `eu-central-1` pricing
could not be fetched (JS-rendered calculator) and must be checked by hand if
G-4 selects that region.

## Consequences

- The pipeline gets simpler than designed: one runner label replaces an
  emulation toolchain. The "from scratch" claim of ADR 0012(c) is unaffected
  — stage logic, ordering and gating are still authored; only the machine
  underneath changes architecture.
- Build times stop being a design risk, which removes the one variable that
  could have pushed image builds onto the production instance — an outcome
  that would have coupled deploy to instance health.
- Native arm64 runners are a GitHub capability, not a contract. If they are
  withdrawn or start billing for public repos, QEMU/buildx on x86 is the
  documented fallback and ADR 0021's original reasoning becomes live again
  as written. Nothing else in the design depends on this choice.
- Budget headroom narrows from ≈$8.37 to ≈$4.70 against G6. Any future
  addition with a recurring cost (a second instance, a managed service, a
  second IPv4) now has a materially smaller envelope, and the $15 ceiling
  becomes a real constraint rather than a distant one.
- The IPv4 charge is unavoidable while the instance is internet-facing; it
  is a cost of the ADR 0012(d) demonstration, not an inefficiency to
  optimize away.
- Verified at a point in time. Both figures are 2026-07-22 facts and are
  re-checked at provisioning, per the scaffold plan's standing rule.

## Alternatives rejected

- **Keep QEMU/buildx as designed.** Rejected: it is strictly slower (4–5×
  reported; one documented case 15 min → 2 min once emulation was dropped)
  and buys nothing now that the native runner is free for this repo. Keeping
  it would mean preserving a workaround for a constraint that no longer
  exists, purely because a document said so.
- **Build arm64 images on the EC2 instance itself.** Was the plan's escape
  hatch if emulation proved slow. Rejected: it makes the production host a
  build host, competes with the running stack for 1GiB of RAM, and couples
  deployment to instance health — the exact coupling the registry-based
  deploy exists to avoid.
- **Pay for ARM runners.** Moot for a public repo, and it was only ever the
  cheaper of two bad options.
- **Move to a provider without IPv4 charges** (Hetzner, DigitalOcean —
  $4–5.50/mo per Q32). Rejected for the same reason ADR 0021 rejected them
  originally: AWS is the named skill being demonstrated (ADR 0012). $3.65/mo
  does not change that calculus, and the total stays under the ceiling.
- **IPv6-only instance to avoid the charge.** Rejected: IPv6-only reachability
  excludes a real fraction of visitors and of CI/CD egress paths, and would
  trade a $3.65/mo line item for an availability defect on a portfolio whose
  entire purpose is being reachable.
- **Assume the 12-month free-tier IPv4 allowance.** Rejected: it expires
  inside the site's expected lifetime, so budgeting on it would design in a
  cost cliff and a ceiling breach at exactly the moment nobody is looking.
