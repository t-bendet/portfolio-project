---
mission: m4
reviewer: red-team-reviewer
date: 2026-07-21
cycle: 3
verdict: APPROVED
---

# Red-team review — Mission 4 (Information Architecture), cycle 3

Reviewed in fresh context against the M4 output contract, CLAUDE.md, all 24
ADRs in `docs/decisions/`, the closed outputs of M1/M2/M3, and the
`adr-keeper`, `brand-voice` and `mission-protocol` skills. No
producing-conversation content was available to me and none was used. I read
the cycle-2 verdict first, as instructed, then re-checked every cycle-1 and
cycle-2 finding against the current artifacts rather than trusting the
revision, and swept specifically for the failure mode this mission has now
exhibited twice — a change made in one place and its consequences missed
elsewhere.

## Verdict summary

**APPROVED**, with six non-blocking findings, two of which must be fixed
before Mission 5 consumes these documents.

**F12, the cycle-2 blocking finding, is genuinely fixed.** The mission did
not propagate the reversal — it re-made the decision, and this time it
propagated. I checked all fifteen surfaces individually (every `sitemap.md`
§2 row, `content-model.md` §2 and §6, ADR 0024, and all eleven briefs'
headers, state tables and body prose). **They agree, with no exceptions and
no stale citations.** The two false citations of `content-model.md` §6 in
`home.md` §5 and `projects-index.md` are gone; the `sitemap.md` §1
"not a path" sentence and the view-event boundary no longer contradict each
other; the `page:` namespace dissolves F13 as claimed. F14, F16, F17 and F19
are fixed. This is the first cycle in which a change was carried to every
document it touches.

The findings that remain are of a different and smaller class. The largest
(F20) is that the corrected decision is defended with a factual claim that
`active` ADR 0002 and closed M2 law contradict: six routes are said to
"ship no script at all", when every public page must carry the theme
mechanism's inline head script. I considered blocking on it and decided not
to — §2 below states that reasoning in full, and states what would have
changed it.

---

## 0. What I could and could not run

**No shell** (Read / Grep / Glob / Write only), no `git` command, no network,
no docs tool. What I did instead:

- **ADR validation** — read `scripts/validate-adr.ts` and
  `scripts/lib/frontmatter.ts` and applied every rule by hand: filename
  regex, `id`/filename agreement, the four required keys, status enum,
  `YYYY-MM-DD`, `superseded-by` non-null on both superseded ADRs, flat scalar
  values, no indentation, no arrays, no duplicate keys. I inspected the
  frontmatter of all 24 files. **All 24 pass.** `null` on
  `reopened-by`/`superseded-by` for `active` ADRs is accepted by the parser
  and matches existing convention.
- **INDEX.md staleness** — read `scripts/reindex-decisions.ts` and
  reconstructed its output by hand from all 24 sources: every row's id,
  title, status and note string matches its file exactly; the sort is the
  filename sort 0001→0024; `Object.entries(counts).sort()` yields
  `active: 16 · superseded: 8`, and the files are exactly 16 active
  (0001, 0002, 0011–0024) and 8 superseded (0003–0010). **INDEX.md is
  consistent with a regeneration.** Run the script anyway for confirmation.
- **Commit state (contract item 5)** — `.git/logs/HEAD` records
  **`603ae66` "M4: cycle-2 rejection addressed — view-event scope re-decided
  and propagated to all 15 surfaces"** at HEAD, after `169e7f0` (cycle-1
  fixes) and `d0c1ec8` (briefs, nav spec, ADRs 0022–0024, 0009/0010
  superseded). Contract item 5's "committed" requirement is satisfied.
- **STATUS.md** — `revision-cycles: 2`, `status: in-progress`. Correct at
  this point in the loop (`mission-protocol` §6: increment on each
  rejection). Handoff notes and "inputs actually read" are still placeheld
  for closure, which is correct.

---

## 1. Status of every prior finding

### Cycle-1 findings

| # | Cycle-1 finding | Status now |
|---|---|---|
| 1 | BLOCKING — `/he/404` not propagated | **FIXED** (re-verified; see below) |
| 2 | BLOCKING — ADR 0023 vs `active` ADR 0019 on hreflang | **FIXED** |
| 3 | sitemap §1 "analytics `path` key" | **FIXED** — and now consistent with the view-event boundary |
| 4 | No view event on `/`, indexes, static pages | **RESOLVED** — decision re-made and propagated (see F12 below) |
| 5 | CI assertion did not test "states it is a translation" | **FIXED** |
| 6 | Stale pre-checkpoint conditionals in `content-model.md` §4.1/§4.4 | **FIXED** |
| 7 | "minimal" archetype not defined by M2 | **FIXED**, including at ADR level (F16) |
| 8 | `aria-current` on the duplicated Hebrew link | **STILL PARTIAL** — third location, see **F21** |
| 9 | `[slug]` vs `[id]` | **FIXED** (`grep` for `[slug]`: zero hits repo-wide) |
| 10 | `contact.md` sourcing overclaim | **FIXED** |
| 11 | "Three regions" over four rows | **FIXED** (F17) |

Re-verification of item 1, because a propagation pass is exactly where a
previously-fixed item gets re-broken: `/he/404` still appears in
`sitemap.md` §1 row 11b and §2 §11b, `content-model.md` §1 line 28 and §6,
`navigation-spec.md` §1/§2.3/§3.2/§3.4/§7.1, `not-found.md` §5 and §7, and
`translations-article.md` §3 and §6. Test N-6's eight distinct segments still
hold over the twelve route rows. ADR 0022's title still reads "twelve public
routes" and INDEX.md carries it. Nothing was lost.

### Cycle-2 findings

| # | Cycle-2 finding | Status now |
|---|---|---|
| F12 | **BLOCKING** — reversal applied in 3 places, contradicted in 10 | **FIXED** — verified surface by surface, §1.1 |
| F13 | static-page identifier under-specified; 404 justification undeliverable | **DISSOLVED** — verified, §1.2 |
| F14 | `navigation-spec.md` §4.1 footer cell "marked current" | **FIXED in §4.1** — but the same claim survives in `translations-index.md`: **F21** |
| F15 | 0023→0019 pointer one-directional | **RECORDED** as M5 handoff item (`content-model.md` §9 item 3) — correct treatment; no in-license fix inside M4 |
| F16 | "minimal" undefined in ADR 0022 | **FIXED** — 0022's Decision now carries the definition, the "adds no tokens/patterns/rules" clause, the pointer to `sitemap.md` §2, and the escape condition |
| F17 | "Three regions" over four rows | **FIXED** — `navigation-spec.md` §1 now reads "Four regions (a skip link, then three landmarks)" over a four-row table |
| F18 | CI assertions are M4 impositions, not M3 inheritance | **RECORDED** as M5 handoff item (`content-model.md` §9 item 4) |
| F19 | `not-found.md` header described only `/404` | **FIXED** — the header now scopes each route by prefix |

#### 1.1 F12 — fixed. Every surface, checked.

The decision now on the record: view events fire on `/writing/[id]/`,
`/he/writing/[id]/`, `/projects/[id]/` and `/`; nowhere else. I checked each
statement of it:

| Surface | Says |
|---|---|
| `content-model.md` §6 table | four write rows (`writing:<id>`, `translations:<id>`, `projects:<id>`, `page:home`); indexes read-only and off at launch; "every other public route" all-dashes |
| `sitemap.md` row 1 | beacon only, keyed `page:home`, "the only static page that emits an event" |
| `sitemap.md` rows 2, 4 | "**no view event**" / "same as `/writing/`" |
| `sitemap.md` rows 3, 7 | view event POST / "view events only" |
| `sitemap.md` rows 6, 8, 9, 10, 11, 11b | each carries an explicit dynamic-layer line saying no view event — including rows 8, 10, 11, 11b, which previously had none |
| ADR 0024 Consequences | "View events fire on the three content detail routes and on `/`, and nowhere else" |
| `home.md` | header row and §5 both `page:home`; the old false "§6 gives `/` no row" is gone |
| `projects-index.md` | header, §2.4 and §3 all consistent; the false §6 citation is gone |
| `about.md`, `contact.md`, `colophon.md`, `not-found.md` | "no view event" — now true |
| `writing-index.md`, `translations-index.md` | "No view event on the index" stated explicitly in both headers (previously unmentioned) |
| `writing-article.md`, `translations-article.md`, `project-detail.md` | unchanged and still correct |

`sitemap.md` §1's trailing-slash paragraph — the collision between the fix
for cycle-1 finding 3 and the fix for finding 4 — now reads "**Analytics keys
are never paths** — content pages use `<collection>:<id>` and the one static
page that emits events uses `page:home`", which is true under the current
decision rather than true-for-six-routes-only. The two fixes no longer
contradict each other.

`content-model.md` §6 also does something the protocol should want: it
records *both* over-corrections and why each was wrong, rather than
presenting the third answer as if it were the first. That is the right
treatment of a twice-reversed decision.

#### 1.2 F13 — dissolved, verified rather than accepted

Cycle-2's F13 had two halves. Both are gone, and for structural reasons, not
by assertion:

- **The route-path/request-path ambiguity** existed only because static pages
  were keyed by path. They are not: `/` is keyed `page:home`, an assigned
  name. `grep` finds no surviving claim that events carry a request path —
  `sitemap.md` §1's "carry the request path as an attribute" sentence is
  gone, and the only remaining occurrence of "request path" is
  `content-model.md` §6's *rejection* of storing them.
- **The 404 justification that the data model could not deliver** is gone
  with the 404 beacon, and §6 states plainly why the earlier draft's argument
  ("a spike of 404s with a referrer is how a broken inbound link announces
  itself") was not deliverable: ADR 0020 stores the referrer *host*, so the
  event records that *a* 404 happened, never which URL broke. Dropping the
  event on that ground also removes the unbounded-key-set and
  visitor-supplied-string risk against ADR 0020's "nothing stored identifies
  a visitor." This is a better answer than the one F13 asked for.

`not-found.md` §3 carries the same rule correctly ("keys every event by
content `id` or an assigned `page:` name, never by path").

#### 1.3 The `page:` namespace against ADR 0020's event schema

Checked, because the delegation flagged it. ADR 0020 decision 1 describes
view events as storing "article/path, timestamp, referrer host, coarse UA
class". ADR 0024 forbids path keys entirely. **This is not a contradiction:**
0020's "article/path" is an either/or enumeration of what identifies the
event's subject, and 0024 — which is the ADR whose job is to specify that
identifier, at 0020's own invitation ("Mission 4 should account for where
counts/reactions appear") — picks the article form and extends it to the one
static page that needs one. No markup or schema instruction points two ways.
Recorded so it is not re-litigated.

The namespace itself has one precision defect: F22.

---

## 2. Findings

All non-blocking. Ordered by cost if left.

### F20. NON-BLOCKING (must fix before Mission 5) — "zero JavaScript" is false for every route that claims it; `active` ADR 0002 and closed M2 law require an inline script on all twelve pages

**What I checked.** ADR 0002 (`active`): "Typing … **anywhere** transforms
the site … Global keydown buffer → `data-theme` on `<html>` → localStorage
persistence." `tokens-reference.md` §2 (M2, closed, LAW) implements it and is
explicit about the delivery mechanism: "**because the persisted theme is
applied by script, the attribute must be set before first paint (inline head
script — the standard pattern). Recorded here so it becomes an
implementation requirement, not a discovery.**" `sitemap.md` §2's own
preamble binds rows 1–11b to "renders in the visitor's active temperature …
persisted across navigation." On a fully static core with no adapter
(ADR 0019) there is no non-script way to satisfy that. **Every public page
ships a script. There are no zero-JS routes on this site.**

The claim to the contrary appears in fifteen places:

| File | Location | Text |
|---|---|---|
| ADR 0024 (**`active`**) | Consequences | "`/about/`, `/colophon/`, `/contact/`, `/projects/` and both 404s **ship none**"; "would give six zero-JS routes their first script" |
| `content-model.md` | §6 | "Six routes … **ship no script at all**"; "Everything else stays at **zero JavaScript**"; "six routes keep **zero-JS** static delivery"; "**`/projects/[id]/` gains its first script**" |
| `sitemap.md` | rows 2, 6, 8, 9, 10, 11 | "ships zero JavaScript" (×6) |
| `sitemap.md` | row 11b | "no view event or **JavaScript of any kind**" |
| `about.md` | header; §3 | "zero JavaScript"; "**there is nothing scripted on this page**" |
| `contact.md`, `colophon.md`, `projects-index.md`, `not-found.md` | headers | "zero JavaScript" (×4) |

**Why this matters beyond pedantry.** It is the *load-bearing* premise of the
re-made decision. §6 prices the excluded beacon as "their first script …
against the top-weighted requirement of M3's evaluation." That price is not
real: those pages already carry an inline head script that M2 requires before
first paint. The genuine remaining cost of a beacon is an outbound request
and a new dependency class — smaller, and worth naming accurately, because
this is the third time this boundary has moved and the next person to move it
will read this paragraph.

**Why I did not block.** Three reasons, and I want the record to show they
were weighed rather than assumed:

1. **No instruction points two ways.** The build that satisfies every
   document simultaneously is well-defined and correct: inline theme script
   on all twelve routes (M2), beacons on four (M4). Unlike cycle-1's blocking
   0019×0023 finding, an implementer is not asked to do opposite things; they
   are told a false fact *about* a build they would otherwise get right. The
   claims all sit inside "Dynamic layer" rows, the theme script is specified
   nowhere in M4 and entirely in M2, and `navigation-spec.md` §1 makes chrome
   "identical in structure on all twelve public routes."
2. **The decision survives the correction on an argument already present.**
   §6 gives a second, independent reason for the boundary — those pages are
   "navigational or terminal", and ADR 0020's dashboard consumes the shape of
   arrival plus the shape of consumption. That argument does not mention
   JavaScript and is untouched by this finding. So the correction is a
   re-pricing, not a re-decision; nothing downstream of the boundary changes.
3. **The failure mode it could cause is loud, not silent.** The only wrong
   build reachable from here is an implementer stripping the theme script
   from six pages — which produces a visible theme flash or a theme that
   stops persisting, contradicts an explicit M2 implementation requirement
   Phase 2 reads directly, and breaks the ADR 0002 easter egg on half the
   site the first time anyone tests it.

**What would have flipped me to BLOCKING:** if the boundary rested *only* on
the zero-JS argument, or if M4 had specified the theme script itself and
specified it inconsistently. Neither is the case.

**What fixed looks like.** Textual, and it must not change the decision:

1. Scope every "zero JavaScript" claim to what is actually meant — no
   dynamic-layer script, no API dependency. Suggested form: "no beacon, no
   reads; the only client script on this route is the global theme script
   (ADR 0002, `tokens-reference.md` §2)." Same for `sitemap.md` row 11b's "no
   JavaScript of any kind", and delete or scope `about.md` §3's "there is
   nothing scripted on this page."
2. Re-price the cost in `content-model.md` §6 honestly: the six routes are
   not zero-JS, so what a beacon spends is an outbound request per view and a
   new dependency class on pages that have none — then keep the conclusion on
   §6's second argument, which already carries it.
3. **ADR 0024's Consequences clause.** Correct the "ship none" parenthetical
   now, while M4 is open and 0024 is still this mission's own unclosed
   artifact (same basis as this cycle's other ADR edits — see §3). If the
   mission lead prefers not to touch it again, the alternative is to leave it
   and record the correction in the M5 handoff; after closure it takes a new
   ADR either way. Correcting it now is cleaner.
4. Root cause, cheap to close: `navigation-spec.md` §1's chrome model lists
   four regions and no script. One line there noting that every page carries
   the theme mechanism's inline head script from M2 is what would have
   prevented all fifteen occurrences.

### F21. NON-BLOCKING (must fix before Mission 5) — cycle-1 finding 8 has a third location: `translations-index.md` §2 row 7 still marks the footer's Hebrew link current

`navigation-spec.md` §4.1's cell is fixed ("same link, but **never marked
current** — the nav occurrence carries `aria-current`, this one carries
nothing"). But `translations-index.md` §2, section row 7 reads: "Footer |
`/he/rss.xml`, colophon, direct links, **the Hebrew link (marked current)**".
On `/he/writing/` — the exact page this brief governs — that is the naive
both-occurrences behaviour §2.3 exists to forbid, and it fails test N-4 ("at
most one `aria-current="page"` per document").

This is the same defect class as F12 in miniature: fixed where the reviewer
pointed, not where else it lived. It is non-blocking because the chrome
authority (`navigation-spec.md`) states the general rule with its reasoning,
the brief's mention is a parenthetical in a sections table, and N-4 is an
automated test that catches it. **Fixed looks like:** delete "(marked
current)" from that row, or replace it with "(not marked current —
`navigation-spec.md` §2.3)".

### F22. NON-BLOCKING — `content-model.md` §2 says the key rules "apply to both forms"; two of the five cannot

§2 introduces the reserved `page:` namespace and states "the rules below
apply to both forms." Rule 2 ("**Derived from the filename**, which is the
Astro `id`") and rule 4 ("**Renaming a file is a data migration**") have no
referent for `page:home`, which §6 correctly describes as "a name this
document assigns". Rules 1, 3 and 5 do apply. The contract itself is
unambiguous — `page:home` is stated identically in five places — so nothing
can be built wrong from it; but §2 is the cross-system contract between a
build artifact and a Postgres row, and it should be exactly right. **Fixed
looks like:** one clause — rules 1, 3 and 5 bind both forms; rules 2 and 4
are collection-specific, because a `page:` key is assigned rather than
derived, and retiring one is a data-migration decision of its own.

### F23. NON-BLOCKING — two enumeration slips inside `content-model.md` §6

Both are precision, not contradiction, and I flag them only because
enumeration drift is this mission's recurring failure:

- The headline sentence reads "**View events fire on content pages and the
  home page. Nowhere else.**" The table and ADR 0024 say *content detail
  routes*. `/writing/` and `/he/writing/` are content pages that emit
  nothing; a skimmer reading only the bold line gets it wrong. One word:
  "content detail routes".
- The named cost lists the blind spot as "`/about/`, `/colophon/`,
  `/contact/`, the two indexes, or the 404s" — **`/projects/` is missing**,
  though the sentence above it correctly counts `/projects/` among the six.

### F24. NON-BLOCKING — `sitemap.md` §2 row 5 is the only route row with no dynamic-layer line

`/he/writing/[id]/` (row 5) carries no "Dynamic layer:" bullet, while rows 1,
2, 3, 4, 6, 7, 8, 9, 10, 11 and 11b all do — including the four that gained
one this cycle. `content-model.md` §6 and `translations-article.md` both
specify the route correctly, so nothing is unspecified; the sitemap is simply
the one place a reader could look and find nothing. One line, matching row 3.

### F25. NON-BLOCKING (optional) — the 0020→0024 relationship is one-directional, like 0019→0023

Recorded for symmetry with F15 rather than as new work. ADR 0024 cites 0020
twice; 0020's "view events (article/path, …)" names nothing that would tell a
Phase 2 implementer reading 0020 alone that path keying is forbidden. §1.3
above explains why this is a narrowing and not a conflict, and editing 0020's
body is correctly off-limits (`adr-keeper` rule 1). If the mission lead wants
it covered, the cheapest move is one more line in `content-model.md` §9's
handoff item 3, which already tells M5 that ADR-to-ADR narrowings exist and
have no index representation.

---

## 3. ADR lifecycle check (`adr-keeper` rule 1)

ADRs 0022 and 0024 have now been edited in each of the three cycles. I
checked whether that is a rule-1 violation ("never edit a decision's
reasoning after the fact") and concluded **it is not, on this specific
record** — but the reasoning matters, so here it is:

- **What changed.** 0022: title and route table corrected eleven→twelve
  (cycle 1); the `minimal` definition clause added (cycle 3, F16). 0024: the
  view-event Consequences bullet rewritten twice — from excluding static
  pages, to "every public page", to the current boundary — plus the `page:`
  namespace clause.
- **What did not change.** Every decision Tal actually made is intact and
  matches STATUS.md's checkpoint log: checkpoint 1's three calls (locale
  subtree, colophon ships as a living page, contact stays), the per-route
  theme deletion as forced by 0002, and checkpoint 2's five calls in
  `content-model.md` §4. The view-event scope was never a checkpoint
  question. **No human decision was rewritten** — the edits corrected counts,
  supplied a definition, and re-stated a boundary the mission itself had got
  wrong twice.
- **Why it is in bounds.** Both ADRs were authored by this mission, the
  mission is `in-progress`, the branch is unmerged, and nothing downstream
  has consumed them. Contract item 5 makes the ADRs mission artifacts under
  revision until closure, and the `mission-protocol` review loop presupposes
  artifacts get revised in place. The alternative — superseding 0024 with a
  new ADR mid-loop because a reviewer found a contradiction — would produce a
  0024→0025→0026 chain recording nothing but the review's own iterations,
  which is the opposite of what rule 1 protects.
- **Standing rule from here.** Once M4 closes, 0022/0023/0024 are frozen:
  any later change is a new ADR plus a status flip, with no exceptions. And
  the history of the twice-reversed view-event boundary is not lost — it
  lives in `content-model.md` §6, which 0024 names as its full record. That
  arrangement is legitimate and should be stated in the handoff notes so a
  future reader knows where to look.

I could not diff 0009/0010 to prove the status flips touched only
frontmatter (see §4). Both bodies still read as untouched pre-workshop
records in the shapes `adr-keeper` allows, both retain `reopened-by:
mission-4` alongside `superseded` / `superseded-by`, and 0009's "Why
reopened" still carries the sentence that generated this mission's mandate.

---

## 4. Contract completeness

| # | Contract item | Present | Substantive |
|---|---|---|---|
| 1 | `sitemap.md` | yes | every route with purpose, archetype and theme behavior; §0 resolves ADR 0002 × 0009 explicitly and is untouched by this cycle's edits; every row now carries a dynamic-layer statement except row 5 (F24) |
| 2 | `content-model.md` | yes | three collections, full schemas, RTL contract §5, credit model §4 incl. §4.0 upstream terms, §6 dynamic-layer table, §9 handoff obligations (now four items) |
| 3 | `page-briefs/` | 11 files | all eleven carry Goal / Sections / States / Empty states — re-verified individually this cycle: `home` §1–4 · `writing-index` §1–4 · `writing-article` §1/2/3/5 · `translations-index` §1–4 · `translations-article` §1–4 · `projects-index` §1–4 · `project-detail` §1–4 · `about` §1–4 · `colophon` §1–4 · `contact` §1–4 · `not-found` §1–4. Twelve routes, eleven briefs (`not-found.md` governs both 404s) |
| 4 | `navigation-spec.md` | yes | nav, footer, eyebrow per route, RTL chrome, reachability invariants, 13 testable rules; §1 and §4.1 corrected this cycle |
| 5 | ADR writes/flips | 0022/0023/0024 written; 0009→0022 and 0010→0023 flipped with pointers; INDEX consistent with a regeneration; committed at `603ae66` | all valid against `validate-adr.ts` by hand; 0024 carries one factually wrong clause (F20 item 3) |
| 6 | `review-verdict.md` | this file | — |

**Scope boundaries.** No implementation, no copywriting beyond placeholder
intent (Hebrew strings flagged as placeholders in `navigation-spec.md` and
`translations-index.md`), no visual design beyond applying M2 tokens
conceptually — `minimal` remains the single edge case and is now honestly
declared in both `sitemap.md` §2 and ADR 0022. `app/` does not exist.
Deliverables are confined to `missions/04-information-architecture/outputs/`.

**Still sound, re-checked this cycle so a revision does not disturb them:**
ADR 0002 × 0009's resolution (§0) and the zero theme-hint leaks across all
eleven briefs; the translated-article model and its three enforcement layers;
the RTL contract and its five CI assertions; the page-rejection log with
per-page reasons and revisit thresholds; the brand invariants (mark never
translated, eyebrow everywhere, easter eggs unlabeled, "let's connect" banned
with a grep test on the page most likely to reach for it); reachability
R-1…R-6 including both `/he/404` paths; and the empty-state work in
`writing-index.md` §4 and `translations-index.md` §4, which remains the
strongest writing in this mission.

---

## 5. Could not verify

1. **Script execution** — no shell. `validate-adr.ts` and
   `reindex-decisions.ts` were applied by hand over all 24 ADRs; both pass by
   my reconstruction. Run them for confirmation.
2. **Whether the 0009/0010 flips, and this cycle's 0022/0024 edits, touched
   only what I believe** — no `git diff`. Recommended:
   `git diff 678ca70 -- docs/decisions/` and
   `git diff 169e7f0 603ae66 -- docs/decisions/`.
3. **The upstream `CONTRIBUTING.md` text** quoted in `content-model.md` §4.0
   — no network. My assessment of §4.0 remains conditional on the quote being
   accurate; the document is honest that Tal supplied it, reads it in plain
   language, and the `rights` field plus the scope-caution paragraph are
   proportionate to that uncertainty.
4. **`@astrojs/sitemap`'s `i18n` behaviour** — no docs tool. Does not change
   my acceptance of ADR 0023's hreflang narrowing: not emitting is safe
   either way and the ADR-level record exists.
5. **Whether ADR 0002's incantation listener and the theme-restore script are
   one script or two** — an implementation question. It does not affect F20:
   `tokens-reference.md` §2 requires at least the inline head script on every
   page either way.

---

## 6. What must be fixed before Mission 5, and what is optional

**Must fix before M5 consumes these documents:**

- **F20** — the "zero JavaScript" claims in fifteen places, including
  `active` ADR 0024's Consequences. Textual scoping plus one honest
  re-pricing paragraph. **The decision must not change as part of this fix**;
  if the mission lead comes to believe the corrected pricing changes the
  answer, that is Tal's call and a separate one, not a review requirement.
- **F21** — `translations-index.md` §2 row 7's "(marked current)".

**Optional (hygiene; safe to carry into Phase 2 as-is):** F22 (the "both
forms" clause in `content-model.md` §2), F23 (two enumeration slips in §6),
F24 (`sitemap.md` row 5's missing dynamic-layer line), F25 (the 0020→0024
pointer).

**Do not disturb** while making these edits: `sitemap.md` §0, §3 and §4;
`content-model.md` §4 and §5; §6's record of the two over-corrections; ADR
0023's hreflang paragraph; and the empty-state sections of
`writing-index.md` and `translations-index.md`.
