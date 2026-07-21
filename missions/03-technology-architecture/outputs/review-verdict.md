---
mission: m3
reviewer: red-team-reviewer
date: 2026-07-21
cycle: 1
verdict: APPROVED
---

# Red-team review — Mission 3 (Technology & Architecture), cycle 1

Scope of review: the seven contract items, method integrity against the frozen
yardstick, ADR 0012 "genuinely" honesty, verification discipline, the §4
poison list, adr-keeper validity, pipeline genuineness, and scope boundaries.
All checks were run against the artifacts alone; no producing-conversation
context was available or used.

## Findings

1. **NON-BLOCKING — Stale "pending Tal" topology status contradicts ADR 0013.**
   `repo-topology-decision.md` (status line: "RECOMMENDED, PENDING TAL…
   The ADR write happens only after his sign-off") and
   `architecture-decision.md` (header: "Repo topology is NOT decided here…
   recommended, pending Tal") and `phase2-scaffold-plan.md` (header:
   "pending Tal") all predate the confirmation commit, while
   `docs/decisions/0013-repo-topology.md` is now `active` with Tal's
   2026-07-21 sign-off recorded. A reader of the outputs alone would believe
   the question is open. The decision chain itself is sound (recommendation →
   escalation → confirmation → ADR), and the ADR is the source of truth, so
   this is not blocking — but fixed looks like: a one-line dated addendum at
   the top of `repo-topology-decision.md` ("Confirmed by Tal 2026-07-21; see
   ADR 0013") and matching one-line updates to the two referencing headers.
   Do not touch the analysis body.

2. **NON-BLOCKING — An unverified, memory-derived pricing figure leaks into an
   active ADR's budget line.** `architecture-decision.md` §6 and ADR 0021
   ("Budget: ≈ $10–11/mo pessimistic") derive the pessimistic bound from a
   "~$3–4/mo" AWS public-IPv4 estimate that the document itself admits was
   NOT covered by verification-report.md. The poison list bans memory-based
   pricing claims; this one is honestly flagged, the verified floor ($6.63,
   Q29/Q31) is sourced, and phase2-scaffold-plan.md §0.3 owns the re-check
   with an instruction to update the budget — so it is handled, not hidden.
   But the "$10–11" number has no source and should not read as a bound.
   Fixed looks like: ADR 0021 phrasing the pessimistic case as "unquantified
   pending scaffold-time verification of IPv4 billing; G6 check re-run then"
   rather than quoting an unverified dollar range.

3. **NON-BLOCKING — The winner's content-model premise partially rests on
   unconfirmed Astro 7.x integration compatibility.** Q9 could not confirm
   @astrojs/mdx / @astrojs/sitemap / @tailwindcss/vite compatibility ranges
   against Astro 7 (npm 403s), and Q5's Astro-7 facts cite the third-party
   domain "astrobuild.eu" alongside the official blog at medium confidence.
   C1's G1 pass and R2=4 assume these integrations work on 7.x. No rule was
   broken — the report's load-bearing prohibition applies to *low*-confidence
   entries, and the gap is printed in C1's gotchas, ADR 0019's consequences,
   and phase2-scaffold-plan §0.1 as a mandatory pre-install verification.
   Recorded so the residual risk is on the record: if scaffold-time checks
   find a 7.x incompatibility in the MDX/sitemap path, the R2 and G1
   arguments must be revisited, not patched around.

4. **NON-BLOCKING — Analytics privacy dedupe is deferred with an open edge.**
   `architecture-decision.md` §2 states "no raw IP retention (dedupe approach
   finalized in Phase 2)". Deduplication without an identifier is exactly
   where identifying data quietly re-enters (hashed IPs, fingerprints). The
   deferral is explicit and Phase 2 CI's security review is named in ADR
   0020, so this is acceptable now; fixed looks like the Phase 2 design
   treating "nothing stored identifies a visitor" as a testable constraint,
   not a slogan.

## Checks that passed (attacked, not merely read)

- **Contract completeness:** all seven items exist at the declared paths and
  are substantive. Pipeline stages are individually named (typecheck; tests
  against an ephemeral postgres:18 with migrations applied; builds; Playwright
  RTL check asserting `html[lang="he"][dir="rtl"]`, author credit, and a
  screenshot baseline; buildx/OIDC push; migrate; SSH deploy with health check
  and rollback-by-tag; scheduled pg_dump backup). The scaffold plan is
  explicitly not executed and gates itself on M6 closing.
- **Method integrity:** requirements-and-weights.md names no candidate
  technology; the two checkpoint revisions ($30→$15 ceiling, R6 anchor
  rescale) are documented in the file with rationale per its own rule 5, not
  silently renumbered. I recomputed all four weighted totals against the
  frozen weights: 416, 340, 296, 278 — all correct; the 76-point gap
  correctly does not trigger the tie-break. The incumbent carries its own
  weaknesses in print (6→7 replatform churn, unconfirmed compat ranges), R5
  deliberately refuses credit for prior Astro familiarity, and §6's "wins by
  making the server small" argument-against is a genuine adversarial case,
  correctly routed to a checkpoint rather than a rescore. C4's old rejection
  was re-verified with 2026 citations, not inherited.
- **Dynamic-boundary honesty (ADR 0012/G3):** the deletion test has
  observable consequences on both sides (visitor-visible counts/reactions;
  Tal's analytics and the admin login itself), the data is runtime-written
  and cannot be a build-time file, the sessions table and aggregation
  dashboard make SQL do query-shaped work rather than write-only checkbox
  work, and future extensions are explicitly non-load-bearing. The set-wide
  R3 deduction admitting the capability co-evolved with the requirement is
  the honest move, not a dodge.
- **Verification discipline:** every flagged item (Q27, Q30, Q31, Q35) has
  its non-load-bearing structure argued in evaluation.md's header, and the
  arguments hold: RDS loses on domination independent of the $14 figure;
  SQLite is set aside *because* its facts are unverified; Q31 sits under
  ≥$8 headroom; every budget prices the ECR path so nothing depends on GHCR
  staying free. Finding 2 is the one leak, and it is flagged at the source.
- **ADR validity:** 0019/0020/0021/0013 have flat frontmatter, required keys,
  legal statuses, and four substantive body sections; alternatives-rejected
  sections carry real cited reasons including honest cases for the losers
  (Hetzner cheaper than AWS; separate-repo's genuine advantages). 0013's
  in-place completion from `proposed` matches adr-keeper's "Question + Owner
  suffice *until decided*" convention, preserves the original question text
  verbatim in Context, and records Tal as decider per the escalation rule.
  0003 is `superseded` with `superseded-by: 0019` and `reopened-by:
  mission-3`; its body reads entirely as the reopen-era record with no
  reference to the new outcome — consistent with a frontmatter-only flip
  (a byte-level historical diff was not possible with this review's
  read-only toolset; content inspection found no reasoning edits).
  INDEX.md's summary counts (13 active, 2 reopened, 6 superseded) match the
  21 listed ADRs, and the final M3 commit records "index regenerated."
- **Scope:** no `app/` directory exists; no package.json, lockfile, or
  node_modules anywhere in the repo; the only grep hit for design-system
  vocabulary across all six outputs and three new ADRs is the poison-list
  entry itself, and the Tailwind wiring references trace to ADR 0003's
  preserved gotchas, which predate Mission 2. No aesthetic leakage found.
- **Commits:** git logs confirm the ADR package and the 0013 resolution are
  committed on `mission/m3-technology-architecture` (commits 40522eb,
  695b933), with the topology ADR written only after Tal's confirmation —
  matching the escalation discipline the outputs describe.

## Verdict justification

APPROVED. Every contract item is present, substantive, and at its declared
path; the evaluation mechanically applies a yardstick that was demonstrably
frozen first (arithmetic independently verified); the SQL layer passes the
deletion test with observable consequences rather than checkbox dynamism; the
pipeline is named stage-by-stage as authored work including the ADR 0011 RTL
check; the ADRs are keeper-valid with honest rejection logs and a clean 0003
supersession; and the scope boundaries (no app/, no dependencies, no M2
material) hold under direct inspection. The four findings are real but none
undermines a decision: two are stale-status/phrasing fixes, and two are
residual risks the artifacts themselves already flag and assign to
scaffold-time verification. Findings 1 and 2 should be fixed before Mission 4
builds on these documents, but neither changes any gate outcome, score, or
decision.
