# Coherence Report — Mission 6, Blueprint Gate

Mission 6 · 2026-07-22 · adversarial pass over every active ADR (21), all
M1–M5 outputs, CLAUDE.md, `.claude/*`, `scripts/*`, and the two post-M5
documents on `main` (`docs/PHASE2-CLEANUP-TODO.md`,
`docs/NEXT-ITERATION-HANDOFF.md`).

Method: every active ADR read in full; every mission output read in full
(all eleven page briefs included); claims cross-checked against each other
rather than against their own citations; numeric claims recounted;
mechanical claims re-verified (`node scripts/test-machinery.ts`: 34 passed,
0 failed, 2 intentionally skipped — both skips are phase-dependent fixtures
that cannot run while M5 is closed and M6 is open, per `hooks-plan.md` §5.1).

Findings are ordered by severity. Per this mission's license, nothing is
fixed here and no ADR is flipped; each finding names its owner.

---

## Findings

### C1 — HIGH — `docs/PHASE2-CLEANUP-TODO.md` §A/§B contradicts active ADRs 0025 and 0028 without any ADR

The cleanup TODO (written 2026-07-22, after M5 closed, outside any mission
and any review) instructs Phase 2 actions that active ADRs decided the other
way:

1. **"Delete the five retired agent files"** directly reverses ADR 0025
   decision 5, which defines retirement as *the file stays on disk with a
   retirement description* — and "Delete retired agents" is a **named
   rejected alternative** in that same ADR, with reasoning (provenance is
   what the workshop exhibits).
2. **"Delete `scripts/sync-docs.ts` and `scripts/hooks/docs-sync-check.ts`;
   remove the settings entry"** reverses ADR 0028 decision 3 ("no hooks
   retire and no hooks are added") and deletes the machinery that
   `hooks-plan.md` §4.3 and `phase2-workflow.md` §6.2 commit to reusing for
   the **colophon staleness check** — the one mechanization of the
   maintenance contract Tal accepted at M4 checkpoint 1 (ADR 0022
   consequence: "a stale colophon actively misinforms"). The TODO deletes
   the planned enforcement and names no replacement.
3. §B's simplifications of `protect-workshop.ts` and
   `validate-workshop.ts` are correctly marked [Tal, by hand], but the
   *decisions* they encode (drop the phase regimes, drop the species lint)
   are reversals of reasoning recorded in ADR 0028 and M5 outputs, made in
   a TODO file rather than in ADRs.

The contradiction is live, not hypothetical: a Phase 2 session's first
`infra/workshop-cleanup` work item (the TODO's own framing) would execute
instructions that the injected decision index says are decided the opposite
way. Whichever document the session happens to weight wins — which is
exactly the "silent divergence" failure ADR 0025 names as Phase 2's enemy.

**Involved:** ADRs 0025, 0028, 0022 (colophon contract); M5 `hooks-plan.md`,
`phase2-workflow.md` §6.2. **Owner: Tal.** If the cleanup is wanted, it
needs new ADRs narrowing/superseding the relevant clauses of 0025 and 0028
(and a decided replacement or explicit abandonment of the colophon check);
otherwise the TODO should be amended to match the ADRs. The blueprint is
not internally coherent while both texts stand.

*(Note: `docs/NEXT-ITERATION-HANDOFF.md` recommends the same reversals but
scopes them explicitly to a future template, not this repo — it is not
itself a contradiction. The TODO is where the advice crossed into
instruction for this repo.)*

### C2 — HIGH — `phase2-scaffold-plan.md` §2 instructs the hreflang configuration ADR 0023 forbids, and no correction covers it

`missions/03-technology-architecture/outputs/phase2-scaffold-plan.md` line
84 instructs the scaffolder to configure "sitemap i18n hreflang (Q9)". ADR
0023 (narrowing 0019) forbids emitting hreflang alternates — there are no
valid pairs to declare, and emitting them asserts a false equivalence to
search engines.

This is precisely the failure ADR 0027's context paragraph predicts ("a
Phase 2 scaffolder reading ADR 0019 alone will configure @astrojs/sitemap
to emit exactly the hreflang alternates ADR 0023 forbids") — except it is
worse than predicted: the instruction is not only in ADR 0019, it is in the
**executable scaffold plan that is Phase 2's named first act**. The
existing mitigations (the INDEX `Note` column, propagation checklist item
2) protect a reader of *ADRs*; nothing corrects the *plan*, and
`phase2-workflow.md` §9's corrections-to-inherited-documents list corrects
three other errors in this same document but not this one.

**Involved:** ADRs 0019, 0023, 0027; M3 `phase2-scaffold-plan.md` (frozen).
**Owner:** the scaffold plan cannot be edited (closed mission, ADR 0028
freeze). The correction is recorded here and must be carried into
`gate-verdict.md` and `completeness-report.md` as a standing correction the
scaffold checkpoint (`phase2-workflow.md` §7.1) reads before §2 executes:
**do not pass an `i18n` option to @astrojs/sitemap; emit no hreflang
alternates** (they become valid only if Tal's own bilingual-article case,
content-model §4.5, ever lands).

### C3 — MEDIUM — `typography-spec.md` §9 miscounts the warm theme's font payload ("3 families"; it is 4)

`typography-spec.md` §9 states "per-theme payload is 3 families." Dark is 3
(Syne, DM Mono, Heebo). Warm is **4**: Fraunces, IBM Plex Mono, Frank Ruhl
Libre, **and IBM Plex Sans Hebrew** (the warm theme has two Hebrew
companions — §1's own table). The document's "4 variable + 3 static = 7"
total is correct; the per-theme claim is the miscount.

Consequence if uncaught: a font-loading strategy or performance budget
built on "3 per theme" under-counts the hidden theme's payload, and the
lazy-load-on-first-toggle option §9 itself raises would be mis-sized.
`performance-budgets.md` (this mission's deliverable 4) must count 4 for
warm; recorded here because the spec is frozen.

**Involved:** M2 `typography-spec.md` §9 (frozen; ADR 0016 itself does not
repeat the miscount). **Owner:** correction recorded here; Phase 2's `web`
track inherits it via the gate documents.

### C4 — LOW — `page-briefs/home.md` §5 contradicts `content-model.md` §6 on what the beacon costs

`content-model.md` §6 (the corrected, third-draft boundary) prices a view
beacon as "a **new dependency class** — a relationship with a service that
can be down, blocked, or slow", explicitly distinct from self-contained
local scripts. `home.md` §5 justifies the `page:home` beacon partly by
claiming it "adds **no new dependency class** to a page that had none"
because the hero already ships script. Under the content model's own
definition that claim is false — the hero script is local; the beacon is
the outbound class regardless.

The *decision* is unaffected (both documents fire the beacon on `/`, and
the boundary rests on the who-consumes-the-data argument, not the JS
accounting). Only the brief's justification is wrong, and this boundary
"has now moved three times" (content-model §6's own warning) — a wrong
recorded reason is how it moves a fourth time.

**Involved:** M4 `home.md` §5 vs `content-model.md` §6 / ADR 0024 (both
frozen). **Owner:** correction recorded here; content-model §6 governs.

### C5 — LOW — `PHASE2-CLEANUP-TODO.md` §B names five skills for header-stripping; only four carry the header

Verified by grep: the "Project parameters (ADR 0029)" header exists in
`adr-keeper`, `mission-protocol`, `prompt-craft`, `review-work` — the four
ADR 0029 names. `tech-eval` carries none (it is in the
deliberately-untouched domain-assumption class, ADR 0029 / `plugin-spec.md`
§4). The TODO lists five including `tech-eval`. Same un-reviewed document
as C1; folded into C1's remedy.

**Involved:** ADR 0029, `plugin-spec.md` §4, `PHASE2-CLEANUP-TODO.md` §B.
**Owner: Tal** (with C1).

### C6 — LOW — the colophon fingerprint includes all of `INDEX.md`, so unrelated ADR writes will trip the colophon check

`hooks-plan.md` §4.3 fingerprints the colophon's surface as compose image
tags + manifest dependency blocks + `sha(docs/decisions/INDEX.md)`. The
third component makes **every** ADR write — including pure process ADRs
that change nothing the colophon describes (e.g., the ADRs C1 will
require) — fail the colophon check until re-acked. Over-triggering is the
documented death of checks ("a check that fails on day one... gets
disabled" — hooks-plan's own words about a different check). Not a
contradiction; a calibration risk in a decided design, recorded so the
`infra` work item that implements it (deliberately deferred to
post-scaffold) can narrow the fingerprint to the index rows that describe
shipped stack, or accept the noise knowingly.

**Involved:** `hooks-plan.md` §4.3, ADR 0022's maintenance contract.
**Owner:** the Phase 2 `infra` work item that lands the check.

### C7 — INFO — the incantation string necessarily ships in page source; no rule says in what form

`tokens-reference.md` §1's banned-vocabulary rule covers identifiers
(selectors, properties, attribute values, storage keys, comments, asset
names) — deliberately not JS string literals. The ADR 0002 keydown buffer
must compare typed input against the incantation, so the phrase (or a
hash/encoding of it) necessarily ships in the inline theme script and is one
view-source away. "Discoverable by the attentive" is arguably the point
(M1: "the ones who notice will notice"), and a console log already fires on
toggle — but no document records whether a plain-text literal is the
intended discoverability level or an accident of mechanism. Flagged so the
theme-mechanism work item (Gated by ADR 0025 — ADR 0002's territory)
decides it deliberately rather than inherits it.

**Involved:** ADR 0002, `tokens-reference.md` §1/§2. **Owner:** Phase 2
theme-mechanism Gated review.

---

## Contradictions hunted and NOT found

Checked deliberately, recorded so the absence is a result, not an omission:

- **Theme model × IA.** ADR 0022's global-theme resolution against 0002 and
  the deleted 0009 per-route model is consistent everywhere downstream:
  every brief's theme behavior, the nav spec's no-acknowledgment rules, and
  the tokens-reference switching model agree; no second source of truth for
  `data-theme` appears anywhere.
- **Showcase constraints × hosting.** Each ADR 0012 constraint has exactly
  one visible owner in 0019–0021 (SQL: Postgres + admin aggregation; Docker:
  three-container deploy unit; CI/CD: three authored workflows; cloud:
  EC2/VPC/OIDC/ECR/Route 53), the G3 deletion test survives 0020's widening,
  and the colophon (0022) makes the exhibit visitor-visible. No constraint
  is satisfied by vendor magic anywhere in the chain.
- **RTL × typography × IA.** ADR 0011 threads coherently: verified Hebrew
  companions (0016) → locale-derived `lang`/`dir` with one source of truth
  (0023, content-model §5) → route-level CI assertions (five, with the
  credit-position tightening) → logical-properties law at token, chrome, and
  content layers. The no-Hebrew-monospace asymmetry is consistently recorded
  as accepted in all three places it surfaces.
- **Narrowings.** Exactly two exist (0023→0019, 0020→0024 — reciprocal,
  indexed, validator-enforced). Sweep for a third unrecorded narrowing came
  up empty: no other active ADR corrects a clause of another. C2 is a frozen
  *output* contradicting an ADR, not an ADR-to-ADR narrowing.
- **Mythology register (0014).** No figure name appears in any site-facing
  copy specified by M4's briefs or nav spec (grep test run); the register is
  correctly deferred to artifact-creation time; the colophon brief correctly
  refuses to gloss register names.
- **Hidden theme discipline.** No brief, nav element, feed, title pattern,
  or 404 acknowledges the second theme; the favicon is dark-prepared (0018);
  the colophon brief carries the sharpest instance of the rule explicitly.
- **Numbers.** Twelve public routes (0022) ✓; eight eyebrow segments
  (navigation-spec §3.2) ✓ against the route inventory; eight travelling
  skills after the brand-voice/review-work swap (0029, plugin-spec §2,
  HANDBOOK §5 — all three agree) ✓; 36 machinery assertions = 34 + 2
  phase-skips ✓; six palette nudges consistent between ADR 0015 and
  palette-spec §4 ✓; `--subtle`/`--muted` collapse consistently recorded in
  both ✓.
- **Known inherited errors** (scaffold plan's false `app/` enforcement
  claim; the CI RTL stage's M4 additions; "no zero-JS routes") are each
  corrected consistently in the places M5 said they are — no drift between
  the correction sites.

## Disposition summary

| # | Severity | One line | Fix owner |
|---|---|---|---|
| C1 | HIGH | Cleanup TODO reverses ADRs 0025/0028 + colophon check with no ADR | Tal |
| C2 | HIGH | Frozen scaffold plan instructs forbidden hreflang; no correction on record | gate docs → scaffold checkpoint |
| C3 | MEDIUM | Warm font payload is 4 families, spec says 3 | gate docs → `web` track |
| C4 | LOW | Home brief's beacon justification contradicts content-model §6 | recorded; content-model governs |
| C5 | LOW | Cleanup TODO strips a header `tech-eval` doesn't have | Tal (with C1) |
| C6 | LOW | Colophon fingerprint over-triggers on unrelated ADR writes | Phase 2 `infra` item |
| C7 | INFO | Incantation literal's shipped form undecided | theme-mechanism Gated review |

No finding invalidates a decision. C1 requires Tal's arbitration before the
gate verdict can be GO, because it is a standing contradiction between the
decision record and a live instruction document. C2 and C3 are corrections
this mission's remaining deliverables carry forward. C4–C7 are recorded and
routed.

**Checkpoint 1 disposition (Tal, 2026-07-22): C1 deferred to Phase 2 open.**
Both documents stand as written; the contradiction is carried into
`gate-verdict.md` as a **condition**: the `infra/workshop-cleanup` work item
may not run until the conflict is resolved by new ADRs or by amending the
TODO. The gate may be GO with that condition attached.
