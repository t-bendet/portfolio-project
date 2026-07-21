# Identity Thesis — T://bendet

Mission 1, Stage A · 2026-07-21
Grounding: `docs/research/about-tal.md`, `docs/research/greek-mythology-notes.md`,
`assets/reference/prototypes/*`, ADRs 0001, 0002, 0011, 0012.

## Thesis

T://bendet is the personal namespace of a systems craftsman who carries
knowledge across boundaries: from platform infrastructure into a design system
other teams build on, from English into Hebrew, from "how it works" into
"now you know it too." The site is not a brochure about that person — it is a
working artifact *by* that person. Its own infrastructure is part of the
exhibit (ADR 0012), and its details reward the visitor who reads closely.

## Who this site says Tal is

Three facets, each grounded in the record, not in portfolio tropes:

1. **The craftsman of systems.** Four years building the shared React/TS
   design system consumed across Amdocs product teams; precision about specs
   and patterns is professional habit, not affectation. On the site this reads
   as: consistency treated as a feature, the `T://bendet` eyebrow namespace
   carried everywhere, and infrastructure (SQL, Docker, from-scratch CI/CD,
   cloud) genuinely built and visible in the work — never name-dropped.

2. **The carrier.** Tal translates English technical writing into Hebrew for
   the Israeli dev community, with original-author credit. The site's primary
   goal is community standing, not lead generation: the writing and
   translations are the point; the projects are the proof. Knowledge transfer
   is the identity's center of gravity.

3. **The dual-tempered builder.** Order-oriented AND experimentative — proven
   in his own prototypes: the same tooling material built twice, once as a
   dark systematized map, once as a warm editorial deep-dive. The identity
   expresses this duality through exactly one mechanism: the hidden Marauder's
   Map switch (ADR 0002). Never as two visible sites, never explained.

## The voice

- **Warm-precise.** Explains like a strong senior colleague: exact, unhurried,
  never condescending, never hyped. Human warmth set against technical
  precision — a person lives here.
- **Honest.** Tradeoffs over pitches. No promotional framing of any
  technology, including our own choices. No buzzword filler.
- **Attentive-rewarding.** Easter eggs and references are woven, unlabeled,
  unhinted. If a reference needs explaining, it fails. The ones who notice
  will notice.
- **Bilingual.** Hebrew is native, not a feature. Translated writing renders
  RTL as a first-class citizen (ADR 0011). The site speaks two languages the
  way its author does.

**Never:** "let's connect" or its cousins · template phrasing ("passionate
about", "crafting delightful experiences") · labeling or hinting at hidden
things · decoration that does not carry meaning.

## Symbolic architecture (the anti-soup rule)

Each symbolic layer has exactly one bounded home:

| Layer | Role | Home |
|---|---|---|
| `T://bendet` protocol | Spine — the organizing identity | Mark, eyebrow namespace, everywhere (ADR 0001) |
| HP (Jekyll/Hyde duality) | One hidden feature | The Marauder's Map switch, nowhere else (ADR 0002) |
| Greek mythology | Decided: narrowed naming register | Names on real infra/repo artifacts + at most one M2-licensed inscription gesture; never in site content (ADR 0014; `reconciliation-decision.md`) |

No layer appears in another layer's home. No layer is ever explained.

## For Mission 2 and Mission 4 — the single answer

The site's personality in one line: **a precise craftsman's workshop with a
person visibly living in it.**

The test for any design or IA decision: *if it could appear on any competent
developer's portfolio unchanged, it fails.* The sensibility is
typography-driven and restrained (existing invariant; specific faces, colors,
and layouts are Mission 2's to decide). Structure is generous to skimmers but
holds depth for readers — the prototypes' pattern of structured reference
plus editorial depth is the native register. Warmth comes from voice and
craft, not ornament.
