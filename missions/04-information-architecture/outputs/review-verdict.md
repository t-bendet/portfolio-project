---
mission: m4
reviewer: red-team-reviewer
date: 2026-07-21
cycle: 2
verdict: REJECTED
---

# Red-team review — Mission 4 (Information Architecture), cycle 2

Reviewed in fresh context against the M4 output contract, CLAUDE.md, all 24
ADRs in `docs/decisions/`, the closed outputs of M1/M2/M3, and the
`adr-keeper`, `brand-voice`, and `mission-protocol` skills. No
producing-conversation content was available to me and none was used. I read
the cycle-1 verdict first, as instructed, and re-checked each of its eleven
findings against the current artifacts rather than trusting the revision.

## Verdict summary

**REJECTED on one blocking finding, which is a direct product of the cycle-1
revision.**

Both cycle-1 blocking findings are genuinely fixed — `/he/404` is now
consistent across all five deliverables, both ADRs, and every route count
(finding 1), and ADR 0023 now records its divergence from `active` ADR 0019
at ADR level with a defensible lifecycle argument (finding 2). Seven of the
nine non-blocking findings are fixed as well.

The failure is elsewhere. Cycle-1 finding **4** (non-blocking) invited the
mission to either record the no-view-events-on-static-pages exclusion as a
tradeoff *or* reverse it. The mission reversed it — correctly, on the
merits — in `content-model.md` §6, `sitemap.md` §2 row 1, and ADR 0024's
Consequences, and then **did not propagate the reversal to the six page
briefs and the four sitemap rows that still assert the opposite.** `ADR
0024` is `active` and says view events fire on every public page;
`not-found.md` says "**none** — no view event, no counts, nothing";
`projects-index.md` and `home.md` cite `content-model.md` §6 for rows that
§6 now contains. This is the same defect class the cycle-1 reviewer rejected
on — law in one document, contradicted in the documents Phase 2 builds
from — relocated rather than avoided.

Nothing in the decisions themselves needs to change. The fix is propagation
plus one un-stated cost.

---

## 0. What I could and could not run

**I had no shell in this session** (Read / Grep / Glob / Write only), so I
could not execute `node scripts/validate-adr.ts`, `node
scripts/reindex-decisions.ts`, or `git diff`, and no docs tool was available
either. This repeats cycle 1's limitation and the revision should still run
the validator. What I did instead, and what it establishes:

- **ADR validation** — read `scripts/validate-adr.ts` and
  `scripts/lib/frontmatter.ts` and applied every rule by hand to all 24 ADR
  files (filename regex, `id`/filename agreement, required keys, status
  enum, `YYYY-MM-DD`, `superseded-by` non-null on both superseded ADRs, flat
  scalar frontmatter, no duplicate keys). All 24 pass. `null` values on
  `reopened-by`/`superseded-by` for `active` ADRs are accepted by the parser
  and match the existing convention in 0013/0019/0020/0021.
- **INDEX.md staleness** — read `scripts/reindex-decisions.ts` and
  reconstructed its output by hand: `readdirSync().sort()` gives 0001→0024;
  every row's id, title, status, and note string matches its source file;
  `Object.entries(counts).sort()` yields `active: 16 · superseded: 8`, and
  the files are exactly 16 active and 8 superseded (0003–0010). **INDEX.md
  is byte-consistent with a regeneration.** ADR 0022's corrected title
  ("twelve public routes") is present in the index, so the index was
  regenerated after the cycle-1 fix.
- **Commit state (contract item 5)** — I could not run `git`, but
  `.git/logs/HEAD` is readable and records the mission's commits:
  `ab89bcf` (sitemap), `5de1134` (content-model), **`d0c1ec8` "M4: page
  briefs, navigation spec, ADRs 0022-0024; 0009/0010 superseded"**, and
  **`169e7f0` "M4: cycle-1 red-team rejection addressed"** at HEAD. Contract
  item 5's "committed" requirement is satisfied. (The git snapshot supplied
  to me was stale — it showed HEAD at `5de1134`. The reflog is
  authoritative.)
- **0009/0010 frontmatter-only change** — still **unverified**. Without
  `git diff` I cannot prove no reasoning was edited. Both bodies read as
  untouched pre-workshop records in the shapes `adr-keeper` allows for
  `reopened` records (`## Decision (as originally made)`, `## Why reopened`,
  0010's `## Preserved requirement`), and 0009's "Why reopened" still
  carries the sentence that generated this mission's mandate — the sentence
  an editor would most likely have updated. Both retain `reopened-by:
  mission-4` alongside `superseded` / `superseded-by`, which preserves
  history and passes the validator. Recommend the mission lead run
  `git diff 678ca70 -- docs/decisions/0009-*.md docs/decisions/0010-*.md`.
- **Not verifiable by me:** the upstream `CONTRIBUTING.md` quote in
  `content-model.md` §4.0 (no network), and `@astrojs/sitemap`'s actual
  `i18n` behaviour (no docs tool). See §5.

---

## 1. Cycle-1 findings — current status

| # | Cycle-1 finding | Status |
|---|---|---|
| 1 | BLOCKING — `/he/404` not propagated | **FIXED** |
| 2 | BLOCKING — ADR 0023 vs `active` ADR 0019 on hreflang | **FIXED** (residual note, F15) |
| 3 | sitemap §1 "analytics `path` key" | **FIXED**, but the replacement text is now false for static pages — see F12 |
| 4 | No view event on `/`, indexes, static pages | **FIX INTRODUCED A NEW PROBLEM — see F12 (BLOCKING)** |
| 5 | CI assertion did not test "states it is a translation" | **FIXED** |
| 6 | Stale pre-checkpoint conditionals in `content-model.md` §4.1/§4.4 | **FIXED** |
| 7 | "minimal" archetype not defined by M2 | **FIXED in the mission outputs; not at ADR level** — F16 |
| 8 | `aria-current` on the duplicated Hebrew link | **PARTIALLY FIXED** — F14 |
| 9 | `[slug]` vs `[id]` | **FIXED** |
| 10 | `contact.md` sourcing overclaim | **FIXED** |
| 11 | "Three regions" over four rows | **NOT FIXED** — F17 (cosmetic) |

### 1 — FIXED. What I checked.

`/he/404` now appears in: `sitemap.md` §1 row 11b and §2 §11b;
`content-model.md` §1's collection-less list (line 28) and §6's table (line
550); `navigation-spec.md` §1 ("all **twelve** public routes"), §2.3 (no
owning nav item), §3.2 (eyebrow row + the explicit statement that `/404` and
`/he/404` **share** the `404` segment, which keeps test N-6's eight-segment
count true), §3.4 (`<title>` row), §7.1 (link inventory row);
`page-briefs/not-found.md` §5 and §7; `page-briefs/translations-article.md`
§3 and §6. Test N-6's eight segments are {home, writing, תרגומים, projects,
about, colophon, contact, 404} — I counted the §3.2 table: twelve route rows,
eight distinct segments. Correct.

`translations-article.md` §6 no longer contradicts the sitemap: the stale
"M4 does not invent a second one" sentence has been **rewritten in place with
the correction narrated** ("This brief originally recorded the opposite …
Corrected here rather than deleted, so the change is legible"), matching how
`not-found.md` §7 handles its own superseded rejection (`~~struck~~` +
"Accepted, not rejected"). That is the right treatment.

ADR 0022's title now reads "twelve public routes" and its Decision table
lists exactly twelve public routes; INDEX.md carries the corrected title.
`grep` for `eleven` across the repo returns only ADR 0022's "the eleven
briefs in `outputs/page-briefs/`" (there are exactly 11 brief files — twelve
routes, eleven briefs, because `not-found.md` governs both 404s) and
`colophon.md` §3's "all eleven sections" (its §2 table has exactly 11 rows).
Both correct. `grep` for `[slug]` returns zero hits anywhere.

### 2 — FIXED. What I checked, and why I accept the mechanism.

ADR 0023's Consequences now carry a dedicated paragraph that quotes ADR
0019's clause verbatim ("hreflang via @astrojs/sitemap"), states that both
are `active` and "instruct opposite markup", states the relationship ("0019
chose the mechanism, 0023 finds it has nothing valid to declare"), states
explicitly that 0019 is **not** superseded and its status is untouched, and
names the one future case (Tal's own bilingual article) where 0019's
mechanism becomes usable.

**Is "narrowing without superseding" lifecycle-legitimate?** I pushed on
this because it was flagged as the most likely place for prose cover. I find
it legitimate, for three independent reasons:

1. `adr-keeper` rule 2 attaches to a **new conclusion** displacing an old
   one. ADR 0019's conclusion is the framework and architecture; the
   hreflang clause is one item in a bulleted stack description, and 0023
   reverses none of the rest. Flipping 0019 to `superseded` would retire the
   Astro 7.x decision, the container topology, and the API split over one
   clause — that destroys more history than it preserves, which is the
   opposite of what the rule protects.
2. CLAUDE.md: "Flipping any ADR status outside a mission's declared scope →
   escalate." M4's license is 0009/0010 plus new IA ADRs. Superseding 0019
   was not available to this mission without escalation, and the cycle-1
   verdict offered the Consequences note as the alternative remedy. The
   mission took it and executed it fully rather than minimally.
3. The substance is a factual correction, not a preference: the option pairs
   translations *of the same page*, and this site has none. I could not
   verify `@astrojs/sitemap`'s behaviour (no docs tool), but the direction is
   safe either way, and I note independently that the pairing the option
   *would* find — `/writing/` ↔ `/he/writing/` — is precisely a false
   equivalence, since one indexes Tal's English originals and the other
   indexes Hebrew translations of third-party work. Declining to emit is
   correct on the mission's own facts.

Residual, non-blocking: the pointer is one-directional (F15).

---

## 2. BLOCKING findings

### F12. BLOCKING — the view-event reversal was applied in three places and contradicted in ten; `active` ADR 0024 is contradicted by six of the eleven page briefs and four sitemap rows

**What I checked.** I grepped `Dynamic layer|view event|view-event`,
`touches the API|nothing scripted|no dynamic surface`, and read every
occurrence in context.

**The new law.** `content-model.md` §6 (lines 545–571) now gives **every**
public route a write row — `/`, `/projects/`, `/about/`, `/colophon/`,
`/contact/` (line 549) and `/404`, `/he/404` (line 550) — and states "**View
events fire on every public page.**" `sitemap.md` §2 row 1 was updated to
match ("a view-event beacon only"). ADR 0024 — `active` — records it in
Consequences: "**View events fire on every public page, not only content
pages**", and adds that static pages "are identified in view events by their
route path."

**What still says the opposite.** These are not ambiguous phrasings; they are
flat denials, and three of them cite the very section that now contradicts
them:

*In `page-briefs/` (contract item 3 — the per-page spec Phase 2 builds from):*

| File | Line / § | Text |
|---|---|---|
| `not-found.md` | header, line 11 | "Dynamic layer \| **none** — no view event, no counts, nothing" |
| `home.md` | header, line 11 | "Dynamic layer \| **none**" |
| `home.md` | §5, line 143 | "`content-model.md` §6's table gives `/` no row" — **false**; §6 line 549 lists `/` |
| `projects-index.md` | header, line 11 | "**none** — `content-model.md` §6 gives this route no row" — **false**; §6 line 549 lists `/projects/` |
| `projects-index.md` | §2.4, §3 | "`content-model.md` §6: no dynamic surface on this route at all"; "this page never touches the API" |
| `about.md` | header line 11; §3 lines 101–102 | "**none**"; "this page never touches the API"; "**there is nothing scripted on this page**" |
| `contact.md` | header line 11; §3 line 99 | "**none**"; "no dynamic surface exists here" |
| `colophon.md` | header, line 11 | "**none, and this is load-bearing**" |
| `writing-index.md` / `translations-index.md` | headers | describe reads only; the view-event write is unmentioned |

*In `sitemap.md` — which `content-model.md` names as its own basis (law):*

- §2 row 6 (`/projects/`): "**Dynamic layer:** none."
- §2 row 9 (`/colophon/`): "**Dynamic layer:** none."
- §2 rows 8, 10, 11, 11b (`/about/`, `/contact/`, `/404`, `/he/404`): no
  dynamic-layer statement at all, so `not-found.md`'s "none" is the only
  thing a reader is told about the 404s.
- §1's rewritten trailing-slash paragraph — the fix for cycle-1 finding 3 —
  now asserts "**The analytics key itself is not a path** — it is
  `<collection>:<id>` … chosen precisely so that presentation decisions like
  this one cannot split a page's history." Under ADR 0024's own Consequences
  that is **false for six of the twelve public routes**, whose key *is* a
  path and *would* be split by exactly the presentation decision that
  sentence is about. The fix for finding 3 and the fix for finding 4 now
  contradict each other inside one document.

**Why this is blocking, not cosmetic.** CLAUDE.md: only `active` ADRs are
binding, and ADR 0024 is active. A Phase 2 implementer working from
`not-found.md`, `about.md`, `contact.md`, `colophon.md`, `projects-index.md`,
or `home.md` ships no beacon on half the site and writes an `about.md` test
asserting "there is nothing scripted on this page" — which the content model
now requires to fail. An implementer working from ADR 0024 ships the beacon
and leaves six briefs' Degraded-state rows untrue. Either way something is
built wrong, and the analytics dataset the reversal exists to obtain is the
thing that silently does not arrive.

**The un-stated cost, which is a second half of the same finding.**
`content-model.md` §6 argues the reversal in one direction only (per-referrer
value at the entry point) and never prices it. The price is concrete: a
fire-and-forget beacon is client JavaScript, so **every public page now ships
a script**, including `/404` and `/colophon/` — the page whose brief calls
"no dynamic layer" *load-bearing*. Before the reversal, six routes had no
script at all. R1 ("near-zero JS") was M3's top-weighted requirement and
`navigation-spec.md` §2.4 rejects a hamburger menu by citing it. CLAUDE.md
requires honest tradeoff analysis always; this reversal currently has none.
Note also that ADR 0024 records the decision in **Consequences** while its
Decision section's rule 3 still reads, unqualified, "**Never the URL
path.**" A reader of the Decision alone gets the wrong rule.

**What fixed looks like.** All four, and none requires changing the
decision:

1. Update the six brief header rows and the state tables so every public page
   reads "writes a view event; reads nothing; degrades to absence", with the
   no-JS/API-down rows using the wording `project-detail.md` §3 and
   `writing-article.md` §3 already use — "the view event is simply not
   recorded" — and delete "there is nothing scripted on this page" from
   `about.md`. Correct the two false citations of `content-model.md` §6 in
   `home.md` §5 and `projects-index.md` (header, §2.4).
2. Update `sitemap.md` §2 rows 6 and 9 from "Dynamic layer: none", and give
   rows 8, 10, 11, 11b an explicit dynamic-layer line. `/colophon/`'s "none"
   must be restated as what it actually means — **no reads, no live status**
   — since that is the part that is load-bearing.
3. Reword `sitemap.md` §1 so the "not a path" claim is scoped to
   collection-backed pages, matching ADR 0024's Consequences.
4. State the cost once, where the reversal is argued (`content-model.md` §6):
   every public page now carries a beacon script; name what that spends
   against R1 and why it is accepted. If instead the mission concludes the
   cost is not worth it, withdrawing the reversal and recording the
   exclusion as a priced tradeoff — cycle-1 finding 4's other branch — is
   equally acceptable and needs the same propagation pass in reverse.

---

## 3. NON-BLOCKING findings

Ordered by cost if left. **F13 and F14 should be fixed before Mission 5
consumes these documents**; the rest are hygiene.

### F13. NON-BLOCKING — the static-page identifier is under-specified exactly where the reversal's stated benefit lives

ADR 0024 and `content-model.md` §6 identify static pages by "their **route**
path". `sitemap.md` §1 says view events "carry the **request** path as an
attribute (ADR 0020)". For eleven routes these coincide; for the 404s they do
not, and nothing says which is aggregated. Follow the literal rule and every
404 event is keyed `/404`, which means the broken URL is never recorded.
Follow the other and the static key set becomes unbounded and
visitor-supplied, which destroys the justification the same paragraph gives
for allowing path keys at all ("the static route set is small, enumerated in
`sitemap.md` §1, and changes only by an explicit sitemap decision").

This matters because §6 justifies the 404 event specifically: "a spike of
404s with a referrer is how a broken inbound link announces itself." Under
the literal rule it cannot announce itself — ADR 0020 stores only the
**referrer host**, not the referring URL, so the dashboard would show "N
404s from `news.ycombinator.com`" and neither which page linked wrong nor
which URL was requested. The decision is defended by a capability the data
model as written does not deliver.

Related, and the reason I checked ADR 0020's privacy stance: on the
unbounded reading, a mistyped or rewritten inbound URL can carry
visitor-identifying material (a token, an address) into a stored string,
which is the one way this change could brush ADR 0020's "nothing stored
identifies a visitor." On the literal (route-path) reading it cannot. Fix:
say which path is stored, and if it is the requested one, bound it (record
it truncated/normalized, or store only a `404` identifier plus a separate
capped field).

### F14. NON-BLOCKING — cycle-1 finding 8's fix is partial: `navigation-spec.md` §4.1 still says the footer's Hebrew link is "marked current"

§2.3 now resolves the duplicated-link case correctly and generally ("the
nav item wins … the footer occurrence carries no current-state attribute …
when one URL appears in more than one chrome region, the primary nav
occurrence is the one marked"). But §4.1's footer table cell was not
updated: "Hebrew translations | … | **same, marked current**". A reader who
reaches §4.1 first implements the thing §2.3 forbids, and test N-4 fails.
(If "marked current" was meant visually only, it collides with §2.3's own
"the current state must not be carried by color alone.") One cell.

### F15. NON-BLOCKING — the 0023→0019 pointer is one-directional, and the reader most at risk starts from 0019

ADR 0023 names 0019; 0019 names nothing, and INDEX.md's generator has no
field that could surface the relationship (I read
`reindex-decisions.ts` — the note column only carries reopened/superseded
strings). Editing 0019's body is correctly off-limits (`adr-keeper` rule 1)
and modifying the script is outside M4's license (`scripts/` is
hook-protected outside Mission 5). So the residual risk is real but has no
in-license fix inside M4. Flag it into M5's input manifest instead: a Phase 2
scaffolder configuring `@astrojs/sitemap` from ADR 0019 must be told to read
0023 first. Recording it here so it is a handoff item rather than a
discovery.

### F16. NON-BLOCKING — "minimal" is now honest in the mission outputs but undefined in the ADR that binds

`sitemap.md` §2's new paragraph is the right fix and answers cycle-1
finding 7 squarely: "**an M4 addition, not an M2 one**", named rather than
smuggled, "a *reduction* of the deep-dive archetype", "introduces no new
tokens, no new patterns, and no new composition rules", with the escape
condition ("if Phase 2 finds it needs anything the two archetypes do not
already provide, that is … a new ADR"). I checked it against
`palette-spec.md` §1 and ADR 0015's Decision ("The two prototypes are two
page archetypes … each rendering in both temperatures") — neither forbids a
third label, so this is an honest scope call and not M2's job being redone.

What is missing is one layer up: **ADR 0022's Decision table assigns
`minimal` to three routes with no definition and no pointer.** ADRs are the
binding layer; a Phase 2 reader who consults 0022 and `palette-spec.md`
finds three archetype names and two definitions. Fix: one clause in ADR 0022
noting that `minimal` is an M4 label for the deep-dive archetype without its
sidebar, adding no tokens or patterns, defined in `sitemap.md` §2.

### F17. NON-BLOCKING — `navigation-spec.md` §1 still labels four rows "Three regions"

Not fixed from cycle 1. Rows 0–3 (skip link, header, main, footer) sit under
"Three regions". Cosmetic; noted only because §1 is the file's structural
contract.

### F18. NON-BLOCKING — minor scope asymmetry on CI content

`content-model.md` §4.7 hands the upstream back-link PR to M5 on the
principle that "pre-empting it here would be M4 legislating outside its
brief", while §5 fixes three new assertions into M3's CI RTL stage (items 2,
3, 5, marked as M4 additions). I think the CI additions are defensible —
they assert properties of the rendered content model, which is contract item
2, and item 2's ordering clause is genuinely forced by the grant — but M5
owns the pipeline and should be told these are M4 impositions rather than
M3 inheritance. §5 does label them; make sure the handoff notes repeat it.

### F19. NON-BLOCKING — `not-found.md`'s header describes only `/404` while the brief governs both

"Route | `/404` — served for any unresolved path". Post-`/he/404` that is
true only outside the `/he/*` prefix. §5 gets it right; the header table
does not. Trivial, but it is the first thing a reader of that brief sees.

---

## 4. Contract completeness (re-checked after the edits)

| # | Contract item | Present | Substantive |
|---|---|---|---|
| 1 | `sitemap.md` | yes | every route, purpose, theme behavior; §0 resolves ADR 0002 × 0009 explicitly — **but four rows contradict ADR 0024 (F12)** |
| 2 | `content-model.md` | yes | 3 collections, full schemas, RTL contract §5, credit model §4, §4.0 upstream terms |
| 3 | `page-briefs/` | 11 files | all 11 carry Goal / Sections / States / Empty states — re-verified individually after the edits — **but six carry a dynamic-layer statement the content model contradicts (F12)** |
| 4 | `navigation-spec.md` | yes | nav, footer, eyebrow per route (now including `/he/404`), RTL chrome, testable rules index; one stale cell (F14) |
| 5 | ADR writes/flips | 0022/0023/0024 written, 0009/0010 flipped with pointers, INDEX regenerated, all committed (`d0c1ec8`, `169e7f0`) | valid; 0024's Decision rule 3 needs the qualifier its own Consequences add (F12) |
| 6 | `review-verdict.md` | this file | — |

**Goal / Sections / States / Empty states, verified per brief after the
revision** (the four elements most likely to be lost in an edit pass):
`home` §1/§2/§3/§4 · `writing-index` §1/§2/§3/§4 · `writing-article`
§1/§2/§3/§5 · `translations-index` §1/§2/§3/§4 · `translations-article`
§1/§2/§3/§4 · `projects-index` §1/§2/§3/§4 · `project-detail` §1/§2/§3/§4 ·
`about` §1/§2/§3/§4 · `colophon` §1/§2/§3/§4 · `contact` §1/§2/§3/§4 ·
`not-found` §1/§2/§3/§4. All eleven intact. `translations-article.md`'s
§3 Error row and §6 were both correctly updated to `/he/404` without losing
the empty-state work in §4.

**Scope boundaries.** No implementation, no copywriting beyond placeholder
intent (Hebrew strings are explicitly flagged as placeholders in
`navigation-spec.md` and `translations-index.md`), no visual design beyond
applying M2 tokens conceptually — with the "minimal" label as the single
edge case, honestly declared (F16). `app/` does not exist; deliverables are
confined to `missions/04-information-architecture/outputs/`. STATUS.md
carries `revision-cycles: 1`, correct after one rejection under
`mission-protocol` §6, and `status: in-progress` with handoff notes still
placeheld for closure, which is correct at this point in the loop.

---

## 5. Verified sound this cycle (so a revision does not re-litigate it)

- **ADR 0002 × 0009 resolution — unchanged and still clean.** I re-grepped
  `warm|data-theme|temperature|easter|incantation` across all M4 outputs: 37
  hits in 11 files, and every one is either §0's resolution argument, a M2
  token/callout reference, or an explicit *prohibition* (`navigation-spec.md`
  §4.2 and §6, `colophon.md` §2.4 — correctly identified as the sharpest
  leak risk on the site, `not-found.md` §6, `about.md` §5, both index briefs'
  empty-state exclusion lists). Zero reintroductions. The cycle-2 edits did
  not disturb this.
- **The translated-article model.** Attribution is enforced at three layers
  and the CI assertion now tests all three parts of the obligation —
  cycle-1 finding 5's fix (`content-model.md` §5, assertion 2a: "the block
  **states that this is a translation** — the condition's first half, and the
  part a name-and-link check silently omits") is exactly the remedy asked
  for, and `translations-article.md` §2.1 restates it. §4.1's "OPEN 2.1" and
  §4.4's "If allowed" leftovers are gone (finding 6).
- **RTL / ADR 0011.** One source of truth for direction (the locale), the two
  documented exceptions, logical properties restated at content and chrome
  level, Hebrew eyebrow tracking rules, five CI assertions, and the `/he/404`
  row spelling out that the shared `404` segment renders under the Hebrew
  stack inside `dir="rtl"`. Consistent across `content-model.md` §5,
  `navigation-spec.md` §5, `translations-article.md` §2.3, and
  `translations-index.md` §2.2.
- **Page rejections.** `/uses`, `/now`, `/lab`, `/resume`, `/speaking`,
  `/newsletter`, `/testimonials`, search, and tag routes each carry a
  specific reason and, where relevant, a revisit threshold. The two accepted
  extra pages carry harder conditions than the rejected ones (colophon: a
  register test, a visible review date, a deletion condition; contact: a word
  budget and a retirement condition). No promotional framing anywhere — the
  only superlatives in the corpus appear in sentences banning them
  (`project-detail.md` §2, `colophon.md` §2.1).
- **Brand invariants.** `T://bendet` never translated or transliterated
  (rule + test N-5); eyebrow on every route; easter eggs unlabeled and
  unhinted; "let's connect" banned with a grep test on the one page most
  likely to reach for it; portrait scoped to About + favicon and re-refused
  on `/` and `/404`.
- **Reachability R-1…R-6** re-checked against the updated §7.1 inventory,
  including the two new `/he/404` paths. They hold. R-3's "every page …
  including `/404`" covers `/he/404` trivially via the same footer.

## 6. Could not verify

1. **Script execution** — no shell (see §0). `validate-adr.ts` and
   `reindex-decisions.ts` were applied by hand; both pass, and INDEX.md
   matches a regeneration byte-for-byte by my reconstruction. Run them for
   confirmation.
2. **Whether 0009/0010 changed only in frontmatter** — no `git diff`. See §0
   for the recommended command and the circumstantial evidence.
3. **The upstream `CONTRIBUTING.md` text** — no network. My assessment of
   the §4.0 derivation remains conditional on the quote being accurate; the
   document is honest that Tal supplied it and reads it in plain language,
   and the `rights` field plus the scope-caution paragraph are proportionate
   to that uncertainty.
4. **`@astrojs/sitemap`'s `i18n` behaviour** — no docs tool. This does not
   change my finding on cycle-1 item 2: the decision not to emit is safe
   either way, and the ADR-level record now exists.

---

## 7. Re-review scope for cycle 3

Limit it to **F12**, plus whichever of F13/F14 the mission chooses to fix.
Nothing in the decisions needs to change — F12 is a propagation pass and one
paragraph of cost. I would not want a revision to disturb §0 of `sitemap.md`,
§4 and §5 of `content-model.md`, ADR 0023's hreflang paragraph, or the
empty-state work in `writing-index.md` and `translations-index.md`, which are
the strongest parts of this mission and are all now correct.
