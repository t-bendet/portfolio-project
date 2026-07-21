---
mission: m4
reviewer: red-team-reviewer
date: 2026-07-21
cycle: 1
verdict: REJECTED
---

# Red-team review — Mission 4 (Information Architecture), cycle 1

Reviewed in fresh context against the M4 output contract, CLAUDE.md, all 24
ADRs in `docs/decisions/`, and the closed outputs of M1, M2, M3. No
producing-conversation content was available to me and none was used.

## Verdict summary

**REJECTED** on two blocking findings. Both are cheap to fix and **neither
requires reversing a decision**: one is a late route (`/he/404`) that was
added to `sitemap.md` and ADR 0022 but never propagated to
`navigation-spec.md`, `content-model.md`, or `translations-article.md` —
where it is actively contradicted; the other is an unrecorded conflict
between new ADR 0023 and `active` ADR 0019 on hreflang emission.

The body of work is otherwise strong and I could not break its core: the ADR
0002 × 0009 resolution is explicit, correct, and consistently applied across
all fifteen documents (no brief, no chrome element, no `/404` copy
reintroduces a theme control, label, or hint); the translated-article model
is genuinely enforced at three layers; the page rejections are reasoned
rather than performative; there is no promotional framing anywhere.

---

## Contract completeness (checked item by item)

| # | Contract item | Present | Substantive |
|---|---|---|---|
| 1 | `sitemap.md` | yes | yes — every route, purpose, theme behavior, §0 resolves 0002 explicitly |
| 2 | `content-model.md` | yes | yes — 3 collections, full schemas, RTL contract §5, credit model §4 |
| 3 | `page-briefs/` | 11 files | all 11 carry Goal / Sections / **States** / **Empty states** — verified individually; none is thin, including `contact.md` (which converts thinness into a stated word budget and a retirement condition) |
| 4 | `navigation-spec.md` | yes | yes — nav, footer, eyebrow per route, RTL chrome, testable rules index — **but incomplete for `/he/404`** (finding 1) |
| 5 | ADR writes/flips | 0022, 0023, 0024 written; 0009, 0010 flipped `superseded` with pointers; INDEX regenerated | valid (see ADR audit) — **but see finding 2** |
| 6 | `review-verdict.md` | this file | — |

Empty-state check per brief (the item most likely to be skipped): `home` §4
structural-not-textual; `writing-index` §4 (the deepest, correctly — it is
the launch-empty page); `writing-article` §5 absences-inside; `translations-
index` §4 written natively, not translated; `translations-article` §4;
`projects-index` §4 (explicitly thin, and the asymmetry with `/writing/` is
named); `project-detail` §4 no-empty-state-by-construction with a build
guard behind it; `about` §4 hard statement; `colophon` §4 aspiration, not
emptiness; `contact` §4 none + the signal it would represent; `not-found` §4
none, with the structural reason. All four required elements exist in all
eleven briefs.

---

## BLOCKING findings

### 1. BLOCKING — `/he/404` exists in law but not in three of the five deliverables, and one brief states the opposite

**What I checked.** `rg "he/404"` across `missions/04-information-architecture/`
returns hits in exactly two files: `sitemap.md` (row 11b, §11b) and
`page-briefs/not-found.md` (§5, §7). ADR 0022's Decision table lists
`/404 · /he/404` and its Consequences record the Caddy `handle_errors` seam,
so `/he/404` is **active law**. Then:

- `navigation-spec.md` §1 states the chrome is identical on "all **eleven**
  public routes" (post-`/he/404` the count is twelve); §3.2's eyebrow table
  has no `/he/404` row and asserts "the set of distinct segments equals …
  eight, forever, until a route is added" with test N-6 enumerating rendered
  eyebrows; §3.4's `<title>` table has no `/he/404` row; §7.1's link
  inventory has no `/he/404` row; R-3 names `/404` only.
- `content-model.md` §1 enumerates the collection-less static pages as
  "`/`, `/about/`, `/colophon/`, `/contact/`, `/404`" — `/he/404` missing.
- `page-briefs/translations-article.md` **contradicts the sitemap outright**:
  §3 "Error | bad `id` | never generated → `/404`, **which is English**"
  and §6 "A mistyped Hebrew URL lands on the English `/404`. `sitemap.md` §1
  authorizes **exactly one 404 route and M4 does not invent a second one**."

So a Phase 2 implementer reading the nav spec and the translated-article
brief builds one English 404 and no Hebrew chrome for the second one, in
direct violation of `active` ADR 0022; and contract item 4 ("eyebrow usage
per page") is unmet for a route the mission's own ADR mandates.

**What fixed looks like.**
1. `translations-article.md` §3 and §6 updated to state that a mistyped
   Hebrew URL resolves to `/he/404` (Hebrew, RTL, per `not-found.md` §5),
   with the stale "M4 does not invent a second one" sentence corrected —
   struck through or rewritten, not silently deleted, matching the way
   `not-found.md` §7 already handled its own superseded rejection.
2. `navigation-spec.md`: add `/he/404` rows to §3.2 (eyebrow segment and its
   language — and either confirm the segment stays `404`, keeping the
   eight-segment test true, or update N-6's count) and §3.4 (title pattern);
   add it to §7.1's inventory; fix "eleven public routes" in §1; state
   whether R-3's one-click Hebrew return applies from `/he/404` (it should
   be trivially satisfied by the same footer).
3. `content-model.md` §1: add `/he/404` to the collection-less static list.
4. ADR 0022's title says "eleven public routes" while its own table lists
   twelve; correct the title (frontmatter metadata, not reasoning) and
   regenerate INDEX.md, or state in the body which eleven are counted.

### 2. BLOCKING — ADR 0023 contradicts `active` ADR 0019 on hreflang, and the conflict is recorded only in a mission output, not at ADR level

**What I checked.** ADR 0019 (`active`, M3) Decision, verbatim: "Static
core: all public pages prebuilt; MDX via @astrojs/mdx; typed content
collections; built-in i18n with manual RTL wiring per ADR 0011; **hreflang
via @astrojs/sitemap**; Tailwind 4 via @tailwindcss/vite."
ADR 0023 (`active`, M4) decision 4: "Self-canonical, **no hreflang
alternates**." `sitemap.md` §2 row 13 explains the correction well and calls
it "the one place M4 diverges from an M3 implementation note" — but it cites
`architecture-decision.md` §1 only. It never notes that the same claim sits
in the Decision section of an `active` ADR, and ADR 0023's Consequences say
nothing about 0019.

CLAUDE.md: "Only ADRs with `status: active` are binding." Two active ADRs now
give opposite instructions about markup the build emits, with no pointer
between them. A Phase 2 implementer working from 0019 configures
`@astrojs/sitemap`'s `i18n` option; one working from 0023 does not. Mission
outputs are not the binding layer; ADRs are.

I am not objecting to the substance — the reasoning (a Hebrew translation of
a **third-party** article has no on-site alternate to declare) is sound, and
declining to emit is the safe direction. The objection is that the conflict
is unrecorded where it binds.

**What fixed looks like.** One of:
- a Consequences line in ADR 0023 naming ADR 0019's "hreflang via
  @astrojs/sitemap" clause, recording that it is **not exercised** for
  `/writing/*` ↔ `/he/writing/*` and why, and that the mechanism stays
  available for the one valid future case (Tal's own bilingual article,
  §4.5); or
- escalation to Tal if the mission judges that narrowing an active ADR from
  another mission exceeds its license (CLAUDE.md: "Flipping any ADR status
  outside a mission's declared scope" → escalate). No status flip is needed
  for the note itself.

---

## NON-BLOCKING findings

Ordered by what would cost most later. **Findings 3, 4 and 5 should be fixed
before Mission 5 consumes these documents**; the rest are hygiene.

### 3. NON-BLOCKING — `sitemap.md` §1 names an "analytics `path` key" that `content-model.md` §2 and ADR 0024 forbid

`sitemap.md` §1: "both the RSS feed and the analytics `path` key (ADR 0020)
use the URL as an identifier and two spellings of the same page would split
its counts." `content-model.md` §2 rule 3 and ADR 0024 rule 3: the key is
`<collection>:<id>` and is "**never** the URL path", because a path-keyed row
breaks when the locale prefix or `trailingSlash` changes. `not-found.md` §3
gets this exactly right ("`content-model.md` §2 keys rows by content `id`
precisely to avoid path-shaped keys, but the ADR 0020 event still records a
`path`"); `content-model.md` §2 rule 3 politely re-reads the sitemap sentence
instead of correcting it. Fix: reword sitemap §1 to rest the
trailing-slash-consistency requirement on the feed's absolute links and on
ADR 0020's recorded `path` **field**, not on a "path key" that no longer
exists. Left as-is, the sitemap is the document a Phase 2 implementer is most
likely to read first about analytics identity.

### 4. NON-BLOCKING — no view event on `/`, on any index, or on any static page, justified by a reason the mission's own briefs contradict

`content-model.md` §6's table gives write events only to `/writing/[id]/`,
`/he/writing/[id]/`, `/projects/[id]/`; "everything else" writes nothing.
The stated reason (`sitemap.md` §2 row 1, `home.md` §5) is that "the home
page must not depend on the API". But `writing-article.md` §4 defines a view
event as "POSTed on load, no visible effect, no consequence on failure" — by
the mission's own definition a view event creates **no** dependency, so it
cannot be what makes `/` API-dependent. The real consequence is unstated: ADR
0020's dashboard aggregates "per-article, per-day, **per-referrer**,
per-language", and under this model the site's most-linked page and every
section index contribute nothing — referrer data for the site's actual entry
point is never collected. Fix: either record the exclusion as a deliberate
tradeoff with its real cost (analytics blind on non-entry pages), or give
non-article pages the fire-and-forget event and keep "no API-fed content
rendered" as the actual invariant. The read-side rule (no counts on `/`) is
sound either way and is not in question.

### 5. NON-BLOCKING — the CI assertion does not test the part of the grant's condition 3 that the mission calls binding

`content-model.md` §4.0 condition 3 (quoted from upstream): "at the beginning
of your translation, you **explain that it is a translation** of the original
post **and link back** to the original post." §5 assertion 2 asserts: "the
original author's name and a link to `original.url` both appear … before the
first element of the article content." The position tightening is a genuine
improvement over M3's presence-only check and I credit it. But the assertion
tests author-name + link + order; it does not test that the block *states it
is a translation*, which is the first half of the condition and the part the
document calls a compliance requirement rather than a preference. Fix: assert
the credit component itself renders (a stable component/element hook)
before the body, so the notice cannot be reduced to a bare link and still
pass. This is also the cheapest way to keep the assertion honest without
asserting on Tal's Hebrew copy.

### 6. NON-BLOCKING — stale pre-checkpoint conditionals inside a document marked "hardened"

`content-model.md` §4.1: "Credits the original article and its author (same).
Placement and prominence are **OPEN 2.1**." — `OPEN 2.1` no longer exists;
§4.3 decided it. §4.4: "**If allowed**, it ships as a named MDX component"
appears three paragraphs after the same section states "DECIDED: allowed".
Both read as leftovers from the pre-checkpoint draft, in the file's most
legally consequential section. Fix: point §4.1 at §4.3 and drop the
conditional in §4.4.

### 7. NON-BLOCKING — a third archetype ("minimal") is coined that M2's system does not define

`sitemap.md` §2 rows 10/11, ADR 0022's table, and `contact.md` assign
`/contact/`, `/404`, `/he/404` an archetype called **minimal**. `palette-spec.md`
§1 fixes exactly two archetypes, each rendering in both temperatures, with
shared structure. The mission flags the coinage honestly ("a deliberate third,
reduced composition"), but nothing in M2 defines what "minimal" is made of,
and `writing-article.md` §3 already establishes that the deep-dive archetype
renders sidebar-less for short entries — i.e. the same composition is
reachable inside M2's system. Risk: Phase 2 builds a third pattern set that
no design-system document governs. Fix (cheap): describe these pages as the
deep-dive archetype without the sidebar, or state explicitly that "minimal"
is a composition of existing archetype primitives with no new tokens or
patterns.

### 8. NON-BLOCKING — `aria-current` on the duplicated Hebrew link is ambiguous against test N-4

`navigation-spec.md` §2.3: `aria-current="page"` "only on an exact URL match —
at most one per document"; N-4 tests it. §4.1 says the footer's Hebrew link on
Hebrew pages is "same, **marked current**" — and on `/he/writing/` the nav
item is already the exact match. Two elements marked current on the same
document is either a second `aria-current="page"` (N-4 fails) or an unstated
visual-only treatment. Fix: state that the nav item carries
`aria-current="page"` and the footer duplicate carries none, or the reverse —
one sentence. (The `/colophon/` case is already specified correctly.)

### 9. NON-BLOCKING — `[slug]` vs `[id]` route notation

`sitemap.md` §1–2 writes `/writing/[slug]/`, `/he/writing/[slug]/`,
`/projects/[slug]/`. Every other artifact — `content-model.md`, all briefs,
ADR 0022, ADR 0024 — writes `[id]`, and `content-model.md`'s intro
specifically records that Astro entries expose `id`, **not** `slug` (M3
verification-report Q6, which I read and confirmed). The sitemap is the one
document still using the term the content model corrects. Fix: normalize the
sitemap to `[id]`.

### 10. NON-BLOCKING — small sourcing overclaim in `contact.md`

`contact.md` §6 rejects "social links beyond the three" because "the three
are the ones `about-tal.md` records". `docs/research/about-tal.md` line 29
records **two**: `github.com/t-bendet` and `linkedin.com/in/tal-bendet`. No
email address appears in that source. The decision is fine; the citation
overstates what the source contains. Fix: drop the citation or say the email
is Tal's to supply.

### 11. NON-BLOCKING — `navigation-spec.md` §1 labels four rows "three regions"

The table lists rows 0–3 (skip link, header, main, footer) under "Three
regions". Cosmetic; noted only because §1 is the file's structural contract.

---

## What I verified and found sound (so a revision does not re-litigate it)

- **ADR 0002 × 0009 resolution.** §0 of `sitemap.md` deletes per-route
  temperature with three independent reasons, all of which check out against
  source: ADR 0002's "one dark design to all visitors"; `tokens-reference.md`
  §2's single `data-theme` source of truth with `localStorage` persistence,
  600ms transition and the total-coverage parity rule; and
  `symbol-and-language-map.md` §2's binary test. The salvage onto the
  archetype axis is faithful to `palette-spec.md` §1. Applied consistently:
  `sitemap.md` §2 states the theme rule once for all public rows;
  `navigation-spec.md` §2.1 ("Any theme control. There is none"), §4.2, §6;
  `not-found.md` §6 (no hint, no label, no console message, no markup
  comment); `colophon.md` §2.4 (correctly identified as the sharpest leak
  risk on the site); `about.md` §5. I grep-checked every occurrence of
  "warm", "dark", "temperature", "data-theme" in the M4 outputs: zero
  reintroductions.
- **ADR audit.** I could not execute `node scripts/validate-adr.ts` (no shell
  in this session), so I read `scripts/validate-adr.ts` and
  `scripts/lib/frontmatter.ts` and applied every rule by hand to all 24 ADRs:
  filename regex, `id`/filename agreement, required keys, status enum, date
  format, `superseded-by` present on both superseded ADRs, flat frontmatter
  with no nesting, arrays, or duplicate keys. All pass. 0022/0023/0024 carry
  all four body sections required of `active` ADRs, and their "Alternatives
  rejected" sections contain real reasons, not decoration (0023 lists nine,
  including Tal's own reopening proposal with the reason it lost).
- **INDEX.md is generated, not hand-edited.** I reconstructed
  `reindex-decisions.ts`'s output by hand: filename sort order, note strings
  ("superseded by NNNN"), and the summary line. `active: 16 · superseded: 8`
  matches the 24 files exactly.
- **0009/0010 flips.** Both keep `reopened-by: mission-4` alongside
  `superseded`/`superseded-by`, which preserves history and passes the
  validator. Bodies read as untouched pre-workshop records
  (`## Decision (as originally made)`, `## Why reopened`, and 0010's
  `## Preserved requirement`), and 0010's preserved requirement is carried
  forward intact and strengthened. See "could not verify" below.
- **M2 obligations.** Portrait: About only, explicitly refused on `/`
  (`home.md` §2), on `/404` (`not-found.md` §6) and re-refused in
  `about.md` §6 — matches ADR 0018 and `hero-and-illustration.md` §3.
  Eyebrow on every page (`navigation-spec.md` §3) — matches
  `symbol-and-language-map.md` §1's test, modulo finding 1. Code blocks LTR
  unconditionally in both article templates. Logical properties restated at
  content and chrome level. Links not accent-coloured, no `--link` token
  (`writing-article.md` §2.1) — matches `palette-spec.md` §7 rule 4.
  **Exactly one glow site-wide**: I grepped `glow` across all M4 outputs —
  it appears only in the hero description (`sitemap.md` row 1, `home.md` §2
  and §3), consistent with ADR 0017 and `hero-and-illustration.md` §1,
  including the reduced-motion clause ("glow included; it is static
  decoration, not motion") which is quoted accurately.
- **M3 fit.** Collections API matches current Astro (`src/content.config.ts`,
  `defineCollection`, `glob` from `astro/loaders`, `astro/zod`, entries expose
  `id`) and matches verification-report Q6, which I read. The i18n shape
  (`prefixDefaultLocale: false`) produces exactly the tree in the sitemap.
  The Caddy claim in §11b is accurate — `architecture-decision.md` §4 does
  already route `/api/*` and `/admin/*` — and the `/he/404` mechanism is
  flagged as owed verification rather than asserted, per M3's discipline.
  The "no layout may reserve space that only the API can fill" invariant is
  real (it is the IA-level form of ADR 0019's "degrade to absence", and ADR
  0024 says so rather than pretending it is quoted law) and it is restated in
  all five briefs it governs, each with a test.
- **Honest evaluation of extra pages.** `/uses`, `/now`, `/lab`, `/resume`,
  `/speaking`, `/newsletter`, `/testimonials`, search, and tag routes are
  each rejected or deferred with a specific reason and, where relevant, a
  revisit threshold (tags: five entries under one tag). The two accepted
  pages are not held to a weaker standard: `/colophon/` is accepted on an
  ADR 0012 argument the rejected pages have no equivalent of, and it carries
  a maintenance contract, a visible review date, a stated deletion condition
  ("if it cannot be written in the tradeoff register, it should not exist"),
  and a named drift failure mode; `/contact/` is accepted with a word budget,
  a retirement condition, and an acknowledged overlap
  (`translations-index.md` §7). No promotional framing anywhere — I grepped
  for the usual superlatives; the only hits are `project-detail.md` §2 and
  `colophon.md` §2.1 **banning** them.
- **Translation compliance derivation.** Given the quoted text, the
  derivation is sound and appropriately bounded: condition 3 → credit above
  the body (a compliance condition, not taste); condition 2 → not a content
  field, handed to M5; the "scope caution" paragraph explicitly refuses to
  extend the grant to other authors and disclaims legal advice; the `rights`
  field with `consultedAt` is a proportionate response to a grant that lives
  in an editable repo file. I found no overreach. The one gap is finding 5.
- **Reachability invariants R-1…R-6.** I checked R-1 and R-2 against the
  actual nav/footer inventory: every index and static page is one click from
  everywhere (nav five items + footer colophon + eyebrow mark), and every
  leaf is two (no pagination, no tag routes). They hold.

---

## Checked but could NOT verify

1. **No shell in this review session.** I could not execute
   `node scripts/validate-adr.ts`, `node scripts/reindex-decisions.ts`, or
   `git diff`. Everything above marked "by hand" was verified by reading the
   scripts and applying their rules manually. A revision cycle should still
   run the validator for confirmation.
2. **Whether 0009/0010 changed only in frontmatter.** Without `git diff` I
   cannot prove no reasoning was edited. Their bodies are internally
   consistent with untouched pre-workshop records, and 0009's "Why reopened"
   still contains the sentence that generated this mission's mandate, which
   an editor would have been tempted to update. Recommend the mission lead
   confirm with `git diff main -- docs/decisions/0009-*.md docs/decisions/0010-*.md`.
3. **Commit state** of the ADRs, briefs, and `navigation-spec.md` (contract
   item 5 says "committed"). The session-start git snapshot showed a clean
   tree whose two most recent commits cover `sitemap.md` and
   `content-model.md` only; I cannot tell whether the later artifacts were
   committed after that snapshot.
4. **The upstream `CONTRIBUTING.md` text.** I have no network or fetch tool,
   so I could not confirm the three conditions quoted in `content-model.md`
   §4.0 verbatim. My assessment of the derivation is conditional on the quote
   being accurate. The document is honest that the source was supplied by Tal
   and reads it in plain language.
5. **`@astrojs/sitemap`'s actual `i18n` behaviour** (whether it would emit
   alternates for URLs that do not exist). No docs tool was available to me.
   This does not change finding 2: the decision not to emit is safe in either
   case; what is missing is the ADR-level record of the conflict.

---

## Re-review scope

A cycle-2 review should be limited to findings 1 and 2 plus whichever of
3–5 the mission chooses to fix. Nothing in the decisions themselves needs to
change, and I would not want the revision to disturb §0 of `sitemap.md`, §4
of `content-model.md`, or the empty-state work in `writing-index.md`, which
are the strongest parts of this mission.
