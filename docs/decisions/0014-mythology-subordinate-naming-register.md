---
id: 0014
title: Greek mythology enters only as a bounded naming register over real infrastructure
status: active
date: 2026-07-21
decided-by: tal
mission: mission-1
reopened-by: null
superseded-by: null
---

## Context
Tal's Checkpoint-0 steer (docs/research/greek-mythology-notes.md) named three
resonant figures (Prometheus, Odysseus, Daedalus), three attractive textures
(naming/epithets, inscription lettering, ideas/archetypes — geometry offered
and not chosen), a prominence instinct of "between subtle and visible", and an
unconfirmed lean toward mapping mythology onto the Jekyll/Hyde duality. The
brand-voice skill requires an explicit reconciliation: mythology as spine,
subordinate layer, or rejected — coexistence-of-equals is not an option, and
the identity already carries two layers (T://bendet protocol, ADR 0001; the
Marauder's Map, ADR 0002). Mission 1's Stage A proposal recommended a
subordinate "epithet register"; at the 2026-07-21 checkpoint Tal asked whether
that stays policeable if reduced to typography/inscription plus naming in
scripts and pipelines, was told the narrowing makes every rule
binary-checkable, and locked the narrowed form. Full record:
missions/01-product-brand-identity/outputs/reconciliation-decision.md.

## Decision
Greek mythology is a subordinate layer, narrowed to exactly two entry points:

1. **Naming of real infrastructure/repo artifacts** — scripts, pipelines,
   services — and only where a thing genuinely needs a name. Names are
   discoverable in the open repo, never pointed at.
2. **At most ONE inscription/lapidary typographic gesture**, licensed to
   Mission 2 to explore or decline; zero is a valid outcome.

Binding bounds, each binary-testable:

- **No mythological references in site copy, chrome, or content.** Test:
  grepping site content for figure names finds nothing.
- The figure-to-facet reservoir (Prometheus ↔ translation work, Daedalus ↔
  built infrastructure, Odysseus/polytropos ↔ versatility) survives **only as
  naming rationale** — it guides which names go where in the infrastructure
  and is never surfaced in content.
- Every mythological name maps to an artifact that exists and would need a
  name regardless; no artifact is invented to carry a name.
- Inscription/lapidary gestures in the shipped design system: count ≤ 1.
- Layer hierarchy: protocol spine (0001) → one hidden HP feature (0002) →
  this naming register. No layer is explained, labeled, or hinted.

## Consequences
- **ADR 0002 remains active — defended, untouched.** No Greek mapping onto
  the Jekyll/Hyde duality (no Apollonian/Dionysian framing). Tal accepted the
  Stage A pushback on his "lean to yes": one concept gets one reference; his
  chosen figures are not duality poles; the Map is lived fandom while the
  Greek reading is a critic's frame.
- Mission 2 is **licensed** to explore at most one inscription/lapidary
  gesture and may decline it. If pursued, the hero cannot blend terminal and
  lapidary registers — one register for the mark's presentation, not a
  hybrid (flagged against reopened ADR 0007; M2 resolves).
- Mission 2 is **forbidden**: mythology in chrome, the mark, imagery, or the
  Map's territory; Greek geometry/ornament (meander, amphora, columns,
  laurel); a second typographic gesture; mythologizing the ADR 0008 portrait.
- The content rule is mechanically enforceable: a grep of site content for
  reservoir figure names (and Apollo, Dionysus, Hermes, or any later
  addition) must return zero matches. Reviews of Missions 2–6 outputs should
  run this test.
- Actual names are chosen only when the artifacts exist (build/CI/CD work in
  later missions), guided by the reservoir. This ADR licenses the register,
  not a name list.
- The mythology question is closed for Mission 1. Widening the register
  (e.g., surfacing the reservoir in content) requires a new ADR and Tal's
  decision, not a reinterpretation of this one.

## Alternatives rejected
- **Mythology as spine (Candidate A).** Would have reframed the duality as
  Apollonian/Dionysian and superseded 0002, recontextualizing 0001. Rejected:
  directly fails Tal's prominence steer ("between subtle and visible" is less
  than a spine); fails resonance-without-explanation for most visitors; is
  built from figures Tal never chose (Apollo/Dionysus absent from his list,
  Hermes offered and declined); and trades a lived personal reference for a
  hypothesis he himself rated "not 100%". Honest credit: it was the only
  option yielding a single symbolic system with no layering discipline
  required.
- **Full Candidate B (register including content-adjacent epithet use).**
  The Stage A recommendation. Rejected in favor of the narrowed form at Tal's
  checkpoint: its bounds relied on judgment ("sparing", "one surfaced
  reference at a time") and were acknowledged in the proposal itself as the
  hardest to police — subordinate layers drift. The narrowing converts every
  rule to a binary check at the cost of some expressive room Tal was willing
  to give up.
- **Rejection of mythology entirely (Candidate C).** Safest against theme
  soup and nothing in the site's goals requires mythology. Rejected as
  over-correction: it ignores tested resonance (Prometheus-as-carrier is the
  strongest external symbol for the translation work, the site's center of
  gravity), contradicts the steer (which was not zero), and misapplies
  restraint — the mythology Tal wants is naming, which the protocol identity
  natively accommodates, not decoration.
