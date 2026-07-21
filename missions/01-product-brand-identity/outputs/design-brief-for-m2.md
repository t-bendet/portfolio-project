# Design Brief for Mission 2 — from the Mission 1 Identity

Mission 1, Stage B · 2026-07-21
Basis: `identity-thesis.md`, `reconciliation-decision.md`,
`symbol-and-language-map.md`, ADRs 0001, 0002, 0011, 0014.

This brief expresses qualities and constraints only. It deliberately contains
no colors, no hex values, no font names, and no route/page decisions — those
are Mission 2 and Mission 4 territory. Where it says "must", the source is an
active ADR or brand invariant; where it says "licensed", Mission 2 may
decline.

## What the visual system must express

1. **A workshop with a person visibly living in it.** Precision is the
   default register; warmth comes from voice, craft, and the human details —
   never from ornament. The anti-test: if a pattern could ship on any
   competent developer's portfolio unchanged, it fails.
2. **Typography-driven restraint.** Type carries the identity; decoration
   does not. The preserved principle from the reopened palette ADRs still
   binds: accents are never backgrounds. Consistency itself should read as a
   feature — this is a design-system builder's own site.
3. **Attentive-visitor reward.** The system must leave room for quiet detail:
   things that are findable but never labeled, hinted at, or explained. The
   Map mechanism (ADR 0002) is active and untouched — the design must
   support two full temperature treatments behind one hidden switch, with no
   visible acknowledgment that a second theme exists.
4. **The protocol spine everywhere.** The `T://bendet` mark and the
   `T://bendet · section` eyebrow pattern are identity, not decoration; every
   page carries them, unaltered and unthemed (ADR 0001).
5. **RTL/Hebrew as first-class (ADR 0011 — hard constraint).** The system
   must be designed bidirectionally from the start, not mirrored after the
   fact: layout primitives, type hierarchy, and reading-flow patterns must
   hold in `dir="rtl"` with the same care as LTR. Translated writing is core
   content, not an edge case. Any candidate pattern that degrades in RTL is
   rejected at the pattern level, not patched.

## The one licensed exploration (may be declined)

ADR 0014 licenses **at most one inscription/lapidary typographic gesture** —
the engraved-text, lapidary-capitals direction Tal named in his steer.
Mission 2 may explore it or decline it; zero gestures is a valid outcome.
If pursued:

- It is one gesture, in one role. Not a motif, not a family of treatments.
- **The hero cannot blend registers.** The terminal idiom (ADR 0007,
  reopened — prior decision is input, not law) and a lapidary idiom cannot
  share the hero space. If the gesture lives near the mark, pick one register
  for the mark's presentation — terminal or inscription — not a hybrid.
- It must survive the resonance test: no explanation, no Greek labeling, no
  ornament riding along with it.

## The ADR 0008 caution

The hand-drawn caricature (reopened — placement/treatment is Mission 2's) is
the human-warmth layer and must stay strictly personal. **Never mythologize
the portrait:** no laurels, no Greek framing devices, no inscription
treatment applied to or around it. It is orthogonal to the naming register by
design. Also watch accumulation: wherever illustration, bio, and quiet
details meet on one surface, keep the reference density near zero — the
person carries that surface, not the symbols.

## Hard exclusions (from ADR 0014 and the banned list)

- No mythological references in site copy, chrome, the mark, or imagery.
  Binary test: grep site content for figure names → zero matches.
- No Greek geometry or ornament: meander, amphora, columns, laurel,
  decorative borders.
- No second inscription/lapidary gesture.
- No Greek mapping onto the dark/warm duality (no Apollo/Dionysus framing);
  the duality's only expression is the Map.
- No labeled or hinted easter eggs, anywhere.
- No "let's connect" or its register; no template phrasing or promotional
  framing in any copy the design system carries as specimen text.

## Where Mission 2's freedom is total

Palettes, typefaces, spacing, iconography (within the exclusions), motion,
the fate of the terminal hero (0007) and portrait treatment (0008) — all
reopened and Mission 2's to decide, so long as the qualities above survive.
The single sentence to design against: **a precise craftsman's workshop with
a person visibly living in it.**
