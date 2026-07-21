---
name: m1-identity
description: Mission 1 — Product & Brand Identity. Run only when Tal explicitly invokes /m1.
disable-model-invocation: true
---

# Mission 1 — Product & Brand Identity

## PROJECT PARAMETERS
Workspace: missions/01-product-brand-identity/ · Agent: brand-strategist ·
Skills: brand-voice, adr-keeper, mission-protocol · License: may flip/supersede
ADRs 0001, 0002 (and write new identity ADRs). 0007/0008 belong to M2
(deferred to design phase, Tal 2026-07-20) — flag conflicts, do not flip.

## Memory block
Binding: CLAUDE.md invariants; ADR 0001 (T://bendet, active), 0002 (Marauder's
Map, active — defend or reopen), 0011 (RTL), 0012 (showcase constraints).
0007 (hero) and 0008 (illustration) are reopened FOR MISSION 2 — treat their
prior decisions as context, leave their resolution to the design phase.
Open question: Greek mythology integration (typography, colors, shapes, or
concept-level).

## Starting state
Phase 0 closed (ADR statuses signed off by Tal). No identity work in outputs/.

## Checkpoint 0 — mythology input (MANDATORY, before any exploration)
Check for docs/research/greek-mythology-notes.md.
- Present → treat it as Tal's steering input for the mythology question.
- Absent → STOP and ask Tal directly, before diverging: does Tal want to
  (a) jot instincts now (figures, aesthetics, references — three bullets
  suffice; offer to interview him briefly to draw them out), or
  (b) have the mission explore candidate directions cold and present 2-3
  distinct options for Tal's reaction at a mid-mission checkpoint?
Record the choice in the mission's outputs. Do not skip this by assuming (b).

## Input manifest
docs/decisions/*.md (per INDEX) · docs/research/* · assets/reference/prototypes/*
· CLAUDE.md. Nothing else. Note: Tal_Bendet_CV.pdf is gitignored and may be
absent on fresh clones — about-tal.md is the committed source and suffices;
never treat the CV as a hard dependency.

## Output contract (all must exist in outputs/)
1. identity-thesis.md — one page: who this site says Tal is, in what voice
2. reconciliation-decision.md — the REQUIRED choice per brand-voice skill:
   mythology as spine / subordinate layer / rejected. Explicit consequence for
   ADR 0002 (defended with reasons, or formally reopened/superseded).
3. symbol-and-language-map.md — the symbolic vocabulary the site may use, and
   what is banned (anti-theme-soup list)
4. design-brief-for-m2.md — what the visual system must express, WITHOUT
   prescribing colors/fonts (that is M2's job)
5. ADR writes/flips per the license, committed and valid
6. review-verdict.md — APPROVED by red-team-reviewer (fresh context)

## Scope boundaries
No palette hex values, no font selections, no page/route decisions, no tech
opinions. Do not touch other missions' workspaces or app/ (does not exist).

## Checkpoints
After each contract deliverable, checkpoint to Tal with a 3-line summary
and the mythology-direction status. The reconciliation decision itself gets a
dedicated checkpoint BEFORE being written as ADRs — Tal reacts first.

## Stop conditions
Contract met + APPROVED, max 3 cycles, then escalate. This mission gates
everything downstream — depth over speed.
