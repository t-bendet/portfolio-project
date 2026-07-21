---
id: 0027
title: The ADR lifecycle gains a partial-narrowing relation, threaded through the validator and the index
status: active
date: 2026-07-22
decided-by: mission-5
mission: mission-5
reopened-by: null
superseded-by: null
---

## Context

The ADR lifecycle models two relationships between decisions: `superseded-by`
(wholly replaced) and `reopened-by` (the question is open again). It has no
representation for a third that has now occurred twice — **one active ADR
correcting a single clause of another active ADR, without replacing it.**

Two live instances, both found in Mission 4's red-team review:

- **ADR 0023 narrows ADR 0019 on hreflang.** 0019 specifies hreflang
  alternates via `@astrojs/sitemap`'s i18n option. 0023 forbids them, because
  the English counterpart of a translated article is not on this site.
- **ADR 0024 narrows ADR 0020 on analytics keying.** 0020 describes view
  events as "article/path"; 0024 forbids path keying entirely in favour of a
  namespaced key contract.

Neither is a conflict and neither is a supersession: 0019 and 0020 remain
correct and binding in every other respect. Flipping them to `superseded`
would be false, and editing their bodies is forbidden by the adr-keeper rule
that protects a decision's reasoning.

The consequence is concrete and was stated as a risk in `content-model.md` §9:
**a Phase 2 scaffolder reading ADR 0019 alone will configure `@astrojs/sitemap`
to emit exactly the hreflang alternates ADR 0023 forbids, and nothing in CI
catches it.** Before this decision, `reindex-decisions.ts` emitted a `Note`
only for `reopened` and `superseded`, so a narrowing was invisible in
`INDEX.md` — and `INDEX.md` is what every session actually sees.

Mission 4 could not fix this: `scripts/` is hook-protected outside Mission 5.

## Decision

**Add a reciprocal frontmatter relation, and thread it through the validator,
the index generator, and the adr-keeper skill.**

- `narrows: 0019` on the newer ADR that corrects a clause.
- `narrowed-by: 0023` on the older ADR, whose status stays `active`.
- Both accept comma-separated ids (`narrowed-by: 0023, 0027`) — a flat scalar,
  so the frontmatter parser's no-arrays constraint is untouched.
- `reindex-decisions.ts` composes notes, so a row can carry a status note and
  a narrowing note. The narrowed side renders in bold with "read together",
  and `INDEX.md` gains a legend explaining what the note means.
- `validate-adr.ts` checks **shape** per-file (well-formed id, no
  self-reference, no duplicates, target exists) and **reciprocity** in the
  full-repo pass, which is what CI runs.

**This is not an exception to "never edit an ADR after the fact."** That rule
protects a decision's *reasoning*. Relational frontmatter is metadata, and the
lifecycle already requires writing it into an old ADR post-hoc — that is
exactly what `superseded-by` is. `adr-keeper` now says so explicitly, because
the rule is remembered in its short form.

The mechanism is chosen over a workflow step **because of how it reaches
readers**: `inject-project-state.ts` prints `INDEX.md` verbatim into every
session. A generated note therefore arrives in front of every future reader
with no discipline required, whereas a workflow step reaches only sessions
that follow the workflow — and the failure being fixed is precisely a reader
consulting one ADR in isolation.

## Consequences

- Both live narrowings are now visible in `INDEX.md`, and the relationship is
  legible from either row.
- A fifth relational key enters a deliberately minimal schema. Every future
  ADR author has one more thing to know, and the reciprocal write is a step
  that can be forgotten — which is why the full-repo validator fails on a
  one-directional relation.
- **Reciprocity cannot be enforced per-file, and this is a deliberate hole.**
  The `decision-guard` hook validates one file per write; requiring both sides
  there would deadlock, since whichever side is written first is invalid until
  the other exists. Reciprocity therefore fails only in the full-repo pass, so
  a one-directional narrowing can sit in a working tree until CI or a manual
  `node scripts/validate-adr.ts` runs. Covered by `test-machinery.ts`.
- The validator flags a narrowing whose narrower has since been superseded,
  which would otherwise become a pointer to a dead decision.
- `INDEX.md` now changes on more ADR writes, making merge conflicts there
  marginally more frequent. Regeneration remains the fix.

## Alternatives rejected

- **Leave it; surface narrowings in the workflow instead** (a checklist step:
  "check whether any ADR you are acting on is narrowed"). Rejected: it is a
  behavioural fix for a failure whose entire mechanism is that someone reads
  one file and stops. It also puts the knowledge in the workflow document
  rather than next to the decision, so anyone consulting `docs/decisions/`
  directly — the stated source of truth — still gets it wrong.
- **Flip 0019 and 0020 to `superseded`.** Rejected as simply false: both
  remain binding in every respect except one clause, and superseding them
  would tell readers to ignore the framework and dynamic-layer decisions the
  whole build rests on.
- **Edit the bodies of 0019 and 0020 to add pointers.** Rejected: it violates
  the never-edit-reasoning rule, which is load-bearing for a project whose
  decision history is part of what it exhibits.
- **A single `related: <id>` key** with the meaning carried in prose.
  Rejected: untyped and undirected, so neither the generator nor the validator
  can say anything useful about it, and it degrades into a "see also" that
  reads as optional.
- **A separate `NARROWINGS.md` document.** Rejected: a second source of truth
  about ADR relationships, which is the problem it claims to solve.
