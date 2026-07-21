---
mission: m4
status: closed
depends-on: m3
opened: 2026-07-21
closed: 2026-07-21
revision-cycles: 2
---

# Status — Information Architecture

## Handoff notes

**Verdict: APPROVED, cycle 3** (outputs/review-verdict.md), after two
rejections. Six non-blocking findings from cycle 3 were all applied
post-approval, including both marked must-fix-before-M5 (F20, F21); no
decision changed.

**Decided (Tal at two in-mission checkpoints):**
- **Route set: twelve public routes** (ADR **0022**, supersedes 0009).
  `/` · `/writing/` + `/writing/[id]/` · `/he/writing/` + `/he/writing/[id]/`
  · `/projects/` + `/projects/[id]/` (conditional) · `/about/` ·
  `/colophon/` · `/contact/` · `/404` + `/he/404`. Plus two feeds, the
  generated sitemap, and `/he/` as a redirect.
- **ADR 0009's per-route themes are DELETED** — forced, not preferred: they
  cannot coexist with `active` ADR 0002 (every visitor would see the hidden
  theme on first click, and `data-theme` would need a second competing
  source of truth). Put to Tal that way; he did not object. What 0009 was
  reaching for survives on the **archetype** axis (M2 §1), which is the axis
  that does not collide.
- **Translations: locale subtree `/he/writing/`** (ADR **0023**, supersedes
  0010). Tal answered the framing question — the Hebrew work is *its own
  front door*, not a section inside the English site. Rejected: tabs (0010
  as written), `/writing/translations/`, one merged list.
- **`/colophon/` ships** as a living page, footer-linked (rejected: dated
  article, fold into About, no page). **`/contact/` stays a route** (thin by
  nature, kept for the openness sentence the footer cannot carry).
- **Rejected freely, with reasons on the record:** `/uses`, `/now`, `/lab`,
  `/resume`, `/speaking`, `/newsletter`, `/testimonials`, search. Tag
  indexes deferred with a five-entry threshold (`tags` carried now).

**ADRs:** 0022, 0023, 0024 new (`active`); 0009 → `superseded by 0022`,
0010 → `superseded by 0023` (frontmatter only — verified by git diff that no
reasoning changed). INDEX.md regenerated: 16 active, 8 superseded, 0
reopened.

**What Mission 5 must know:**
1. **Two per-translation publish obligations** (`content-model.md` §9):
   the upstream back-link PR required by the translation grant, and keeping
   `/colophon/` current — Tal chose a living page, and a stale colophon
   actively misinforms.
2. **Two one-directional ADR narrowings with no index representation:**
   0023 narrows 0019 (hreflang), 0024 narrows 0020 (path keying). A Phase 2
   scaffolder reading only the older ADR will build the wrong thing.
   Editing `active` ADR bodies is forbidden and `scripts/` is hook-protected
   outside M5 — so M5 either surfaces this in the workflow or extends the
   index generator.
3. **CI RTL stage assertions 2, 3 and 5 are M4 impositions, not M3
   inheritance.** Assertion 2 in particular must check the credit *precedes
   the article body* and *states that it is a translation* — that is a
   compliance condition of the upstream grant, not a style preference.
4. ADRs 0022 and 0024 were edited across the review loop while the mission
   was open; **they freeze at closure** — further changes need a new ADR.

**For Phase 2:** owed scaffold-time verifications are the `caseStudy`
build guard (whether the glob loader exposes raw `body` at
`getStaticPaths` time) and `/he/404`'s Caddy `handle_errors` matcher. The
contact page's email address is **not** in the research file and must be
confirmed by Tal before that page ships.

**Standing correction worth carrying:** there are **no zero-JS routes** on
this site — ADR 0002's theme mechanism requires an inline head script on
every page (`tokens-reference.md` §2). Where a brief says a route has "no
JavaScript" it means no dynamic-layer script. Recorded in
`navigation-spec.md` §1 after the cycle-3 review found the false claim in
fifteen places.

## ADR statuses observed at mission start (2026-07-21)

active: 0001, 0002, 0011, 0012, 0013, 0014, 0015, 0016, 0017, 0018, 0019,
0020, 0021 · reopened: 0009 (by mission-4), 0010 (by mission-4) ·
superseded: 0003, 0004, 0005, 0006, 0007, 0008.

Gate check run before any work: M2 `closed` + `verdict: APPROVED`, M3
`closed` + `verdict: APPROVED` (M4 `depends-on: m3`). Both verified by
reading STATUS.md frontmatter and outputs/review-verdict.md frontmatter.

## Inputs actually read

- `missions/01-product-brand-identity/outputs/`: identity-thesis.md,
  reconciliation-decision.md, symbol-and-language-map.md,
  design-brief-for-m2.md
- `missions/02-visual-design-system/outputs/`: palette-spec.md (§1
  archetypes, §7 usage, §8 RTL), typography-spec.md (§4–7, eyebrow + RTL),
  tokens-reference.md (§2 switching, §3 registry, §5 RTL),
  hero-and-illustration.md, motion-and-texture.md
- `missions/03-technology-architecture/outputs/`: architecture-decision.md,
  phase2-scaffold-plan.md, verification-report.md, evaluation.md,
  requirements-and-weights.md
- `docs/decisions/`: 0001, 0002, 0009, 0010, 0011, 0012, 0013, 0014, 0017,
  0018, 0019, 0020, 0021, INDEX.md
- `docs/research/about-tal.md`
- `missions/00-mission-plan.md`; `.claude/skills/`: mission-protocol,
  adr-keeper, m4-information-arch; `.claude/agents/ia-planner.md`;
  `scripts/validate-adr.ts`, `scripts/reindex-decisions.ts`
- **Primary source supplied by Tal at checkpoint 2:** the upstream blog's
  `CONTRIBUTING.md` translation grant (recorded as `content-model.md` §4.0)
- **Web verification:** Astro content-collections and i18n APIs re-verified
  against current docs (Context7, `/withastro/docs`, 2026-07-21) rather than
  inherited from M3 — confirmed `defineCollection`, `glob` from
  `astro/loaders`, `astro/zod`, `render()` from `astro:content`, entries
  expose `id` not `slug`, and `routing.prefixDefaultLocale`

## Checkpoint log

- **CHECKPOINT 1 RESOLVED (2026-07-21, Tal, in-session)** — route set.
  `sitemap.md` v1 was written as a recommendation with three calls flagged
  OPEN, then hardened on Tal's answers. Tal asked for the route structure
  to be re-explained with concrete example URLs before answering, and for
  the colophon/contact tradeoffs to be unpacked with real page content;
  both were done and the questions re-put.
  1. **Translated articles: candidate C — locale subtree `/he/writing/`.**
     Decided against tabs (ADR 0010 as written), path subsection
     `/writing/translations/`, and one merged list. Framing question
     answered: the Hebrew work is its own front door, not a section inside
     the English site. Accepted cost: the `he` locale is a partial
     localization covering the writing section only; the seam is shown, not
     hidden. Surfaced and settled in passing: Hebrew-subtree slugs are
     Latin (derived from the original English article), titles are Hebrew.
  2. **`/colophon/` ships** as a living page, footer-linked. Decided
     against a fourth option surfaced mid-checkpoint (ship as a dated
     article at `/writing/how-this-site-is-built/`), against folding into
     `/about/`, and against no page. Accepted cost: a maintenance contract
     — a stale colophon actively misinforms, so keeping it current is an
     M5 workflow obligation.
  3. **`/contact/` stays a route.** Decided against folding into `/about/`
     and against footer-only. Accepted cost: a thin page (~50 words + three
     links), kept because "open to translation requests and article
     suggestions from the Israeli dev community" needs a surface the footer
     cannot carry.
  - **Not a checkpoint question — resolved as forced:** ADR 0009's
    per-route theme assignment is deleted, because it contradicts `active`
    ADR 0002 (it would show every visitor the hidden theme on first click,
    and needs a second competing source of truth for `data-theme`). Put to
    Tal as forced-not-preferred, with the note that overriding it means
    reopening 0002 and escalating. He did not object. What 0009 was
    reaching for survives on the archetype axis (M2 §1).
  - Tal asked twice for clarification before answering: first for the route
    structure as concrete example URLs, then for the colophon/contact
    tradeoffs as real page content. Both were re-put. The second exchange
    surfaced a fourth colophon option (dated article) that would not
    otherwise have been offered.

- **CHECKPOINT 2 RESOLVED (2026-07-21, Tal, in-session)** — translated-
  article model. `content-model.md` written with §4 open, then hardened.
  **Tal supplied the upstream primary source mid-checkpoint** (Kent C.
  Dodds's `CONTRIBUTING.md`), which materially changed two answers rather
  than confirming them — recorded as `content-model.md` §4.0.
  1. **Credit block: above the body + fuller credit at the end.** The
     upstream grant makes the opening notice a *condition of the
     permission*, not an editorial preference — so this placement is no
     longer revisitable on taste.
  2. **Translator's notes allowed**, visually distinct and explicitly
     labelled; ships as an MDX component scoped to `translations` so the
     boundary is enforced by import. Does not collide with the
     no-explained-references rule (that bans explaining symbolic
     references; editorial apparatus is the opposite case).
  3. **Tal's own articles in both languages: designed for, not built** —
     M3's comments posture. The only case where hreflang alternates would
     be valid. Route shape already accommodates it.
  4. **`rights`: small structured field** — `basis` enum
     (standing-grant / licence / direct-permission), `url`, `consultedAt` —
     required, not rendered. Structured rather than free text *because* the
     dominant case turned out to be one standing grant covering many
     entries, which free text would describe inconsistently. `consultedAt`
     matters because a grant in a repo can be edited or withdrawn.
  5. **Upstream back-link PR: NOT a content field** — handed to Mission 5
     as publish-time workflow (`content-model.md` §4.7, §9). The rejected
     alternative (required field admitting `pending`) is recorded so it can
     be revisited.
  - **Settled without asking, determinate:** translations are
    self-canonical — no `rel="canonical"` to the original (a Hebrew
    translation is not a duplicate of an English article; canonicalizing
    would ask search engines to drop the Hebrew page from Hebrew results,
    defeating the section). Translations carry reactions and view counts
    exactly as English articles do.
  - **Forced tightening:** M3 scoped the CI RTL stage to check the credit
    "is present"; it must assert the credit *precedes the article body*, or
    it does not test the actual obligation (`content-model.md` §5).

## Review log

- **Cycle 1 — REJECTED.** 2 blocking: `/he/404` (added by the mission lead
  after the `ia-planner` correctly flagged the gap but declined to invent
  the route) was propagated to only two of five deliverables; and ADRs 0023
  and 0019 instructed opposite hreflang markup with no pointer between them.
  Plus 9 non-blocking.
- **Cycle 2 — REJECTED.** 1 blocking: the cycle-1 fix to a *non-blocking*
  finding — extending view events to every public page — was applied in
  three places and contradicted in ten. Rather than propagate it, the
  decision was re-made: the reversal had over-corrected, and the boundary
  now rests on which consumers ADR 0020 actually names. Plus F13–F19.
- **Cycle 3 — APPROVED**, 6 non-blocking, all applied. The most valuable was
  **F20**: the re-made decision had been priced on a false premise — "six
  routes ship zero JS" — when ADR 0002's theme mechanism puts an inline
  script on every page. The decision survived on its second argument; the
  price was corrected in fifteen places and the root cause closed by adding
  the theme script to `navigation-spec.md` §1's chrome model.
- **Pattern worth carrying into M5:** all three cycles found the same defect
  class — a change made correctly in one place and not followed to its
  consequences. Two of the three rejections were propagation failures, not
  reasoning failures.
