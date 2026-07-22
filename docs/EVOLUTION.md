# Project Evolution

The living record of how this workshop changed shape — who worked here,
what they answered, and where their output lives now. Provenance that used
to sit in retired files sits here instead (ADR 0030): git history keeps
every byte; this page keeps it findable.

## Phase 1 — the decision workshop (2026, Missions 1–6)

Six missions, strictly sequenced, each led by a specialist agent and closed
by fresh-context adversarial review. The blueprint they produced is ADRs
0001–0029 plus each mission's `outputs/`. Mission 6 audited the whole and
issued the GO verdict (`missions/06-blueprint-gate/outputs/gate-verdict.md`)
that opened Phase 2.

### Retired agents (deleted at Phase 2 open — ADR 0030)

Retirement means deletion; each agent's question is answered and the ADRs
are the durable output. Files recoverable from git history at tag/commit of
the Phase 2 open.

| Agent | Was | Led | Durable output |
|---|---|---|---|
| `brand-strategist` | identity, naming, symbolic systems, voice | Mission 1 | ADRs 0001, 0002, 0014; `brand-voice` skill |
| `design-systems` | palettes, typography, tokens, motion | Mission 2 | ADRs 0015–0018; `tokens-reference.md`; `design-tokens` skill |
| `design-verifier` | verification worker for font facts (Hebrew/glyph coverage, licensing, axes, subsetting) | M2 support | `typography-spec.md` — facts verified once, recorded |
| `tech-architect` | stack evaluation, system boundaries, infrastructure shape | Mission 3 | ADRs 0019–0021; `architecture-decision.md`, `phase2-scaffold-plan.md` |
| `ia-planner` | sitemaps, content models, navigation, page composition | Mission 4 | ADRs 0022–0024; `sitemap.md`, `content-model.md`, page briefs |
| `workflow-engineer` | agent workflows, hooks, plugin packaging, dev-loop design | Mission 5 | ADRs 0025–0029; `phase2-workflow.md`, `hooks-plan.md` |

Still active: `red-team-reviewer` (adversarial review, always fresh
context) and `docs-explorer` (documentation lookups). No new agents
(ADR 0025 decision 6).

## Phase 2 open — workshop cleanup (2026-07-22)

Gate condition G-1 resolved by ADRs 0030–0032: retired agents deleted
(0030); docs-sync machinery retired and the colophon re-scoped to a static
road-to-production page generated at first deploy (0031); enforcement layer
simplified to the static Phase 2 rule, species lint and skill parameter
headers dropped (0032). Executed as the `infra/workshop-cleanup` work item.

---

*Append new eras below as they happen: what changed shape, which ADRs
carry the reasoning, where the old form lives in history.*
