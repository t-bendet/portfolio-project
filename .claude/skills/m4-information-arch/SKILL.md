---
name: m4-information-arch
description: Mission 4 — Information Architecture & Page Composition. Run only when Tal explicitly invokes /m4.
disable-model-invocation: true
---

# Mission 4 — Information Architecture

## PROJECT PARAMETERS
Workspace: missions/04-information-architecture/ · Agent: ia-planner ·
Skills: brand-voice, adr-keeper, mission-protocol · License: supersede ADRs
0009, 0010; write IA/content-model ADRs.

## Memory block
Binding: M1 identity, M2 design system, M3 architecture (all closed = law).
ADR 0011 (RTL behavior must be specified in the content model). ADR 0009's
recorded inconsistency (per-route themes vs global toggle) MUST be resolved
explicitly. Open: translated articles as tab vs subsection; what pages beyond
About/Contact/Articles/Projects a strong portfolio warrants (uses/now/colophon/
lab — evaluate honestly, reject freely).

## Starting state
M3 closed. ADRs 0009, 0010 `reopened`.

## Input manifest
missions/01-*/outputs/* · missions/02-*/outputs/* · missions/03-*/outputs/* ·
docs/decisions/*.md · docs/research/*.

## Output contract
1. sitemap.md — every route, purpose, theme behavior (consistent with 0002's fate)
2. content-model.md — collections, frontmatter schemas, translated-article
   model incl. RTL rendering + original-author credit, shaped to M3's stack
3. page-briefs/ — one brief per page: goal, sections, states, empty states
4. navigation-spec.md — nav, footer, eyebrow usage per page
5. ADR writes/flips (0009, 0010, new) committed and valid
6. review-verdict.md — APPROVED (fresh context)

## Scope boundaries
No visual design beyond applying M2 tokens conceptually; no copywriting beyond
placeholder intent; no implementation.

## Checkpoints
Checkpoint after sitemap.md (route set is the highest-leverage call) and
after the translated-articles model.

## Stop conditions
Contract met + APPROVED, max 3 cycles, then escalate.
