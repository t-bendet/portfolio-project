---
name: m2-design-system
description: Mission 2 — Visual Design System. Run only when Tal explicitly invokes /m2.
disable-model-invocation: true
---

# Mission 2 — Visual Design System

## PROJECT PARAMETERS
Workspace: missions/02-visual-design-system/ · Agent: design-systems ·
Skills: design-tokens, brand-voice, adr-keeper, mission-protocol · License:
supersede ADRs 0004, 0005, 0006 with new palette/typography ADRs; resolve
0007 (hero concept: confirm, evolve, or supersede the terminal animation) and
0008 (illustration placement/treatment) — both deferred to this mission by Tal.

## Memory block
Binding: M1's closed outputs (the identity thesis and design brief are LAW for
this mission); restraint rules and through-line from design-tokens skill;
ADR 0011 (RTL/Hebrew — font coverage is a hard check).

## Starting state
M1 closed with APPROVED verdict. Palettes/typography ADRs are `reopened`.

## Input manifest
missions/01-*/outputs/* · docs/decisions/*.md · docs/research/* ·
assets/reference/prototypes/*.

## Output contract
1. palette-spec.md — full token sets (one or two themes per M1's reconciliation
   outcome), WCAG AA ratios recorded for every text/bg pair
2. typography-spec.md — families, weights, scale, eyebrow treatment, Hebrew
   coverage verification per family (web-searched, not assumed)
3. tokens-reference.md — semantic CSS custom property naming, theme switching
   model consistent with whatever happened to ADR 0002
4. motion-and-texture.md — glow, transitions, any mythology-derived gesture,
   each justified against restraint rules
4b. hero-and-illustration.md — resolves ADR 0007 (terminal animation: keep /
   evolve / supersede, with the replacement specified if superseded) and
   ADR 0008 (illustration placement and treatment)
5. New ADRs superseding 0004/0005/0006; flips committed and valid
6. review-verdict.md — APPROVED (fresh context)

## Scope boundaries
No routes/IA, no framework opinions, no component implementation. Specs, not
code. Do not modify M1 outputs.

## Checkpoints
Checkpoint to Tal after palette-spec and after the hero/illustration
resolution — visual taste calls get reactions before they harden into ADRs.

## Stop conditions
Contract met + APPROVED, max 3 cycles, then escalate.
