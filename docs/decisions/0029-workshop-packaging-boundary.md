---
id: 0029
title: The workshop's export boundary is specified at version 0.1 but not published; brand-voice is reclassified as a project artifact
status: active
date: 2026-07-22
decided-by: tal
mission: mission-5
reopened-by: null
superseded-by: null
---

## Context

`docs/HANDBOOK.md` §5 promises that eight capability skills "travel in the
future `portfolio-workshop` plugin." That promise cannot be kept as written:
all eight carry T://bendet specifics. `IMPROVEMENTS.md` #6 catalogues three
kinds of leakage in ascending severity:

- **Role name.** "Escalate to Tal" appears in five skills. A role — the human
  who arbitrates — wearing a proper noun. Visibly wrong to any reader, and
  find-and-replaceable.
- **Identity content.** `brand-voice` is the `T://bendet` namespace, the
  eyebrow format, and the Marauder's Map layer. This reads as
  mis-classification rather than contamination: strip the specifics and one
  reusable idea remains (the anti-theme-soup rule for adding a symbolic
  layer). The rest is a project brand book shelved as a capability.
- **Domain assumption** — the dangerous class. `security-review` says "a
  portfolio is a low-value target; do not inflate"; `performance-review`
  assumes Hebrew subsets; `tech-eval` assumes a solo-dev maintenance budget. A
  name is *visibly* wrong wherever it lands. A baked-in threat model reads as
  **calibration guidance** and silently under-rates severity in a project
  whose asset value is not low.

The question is genuinely open in both directions. `docs/HANDBOOK.md` §1 says
the machinery is "deliberately part of the portfolio's story", and a workshop
visibly built *for this project* is arguably the better exhibit. Extraction
only pays if reuse or publication is actually intended, and abstraction has a
real cost: "escalate to the project owner defined in your profile" is less
actionable than "escalate to Tal", and vague skills get ignored under context
pressure — the exact failure the hook layer exists to compensate for.

## Decision

**Specify the export boundary at version 0.1. Do not publish it** (Tal,
2026-07-22).

- **`plugin-spec.md` records what travels and what stays**, against the real
  packaging format (verified 2026-07-22): `.claude-plugin/plugin.json` with
  `name` as the only required field; `skills/` and `agents/` auto-discovered;
  hooks via `hooks/hooks.json` with `${CLAUDE_PLUGIN_ROOT}` resolving script
  paths inside the installed plugin; distribution via
  `.claude-plugin/marketplace.json`.
- **The cheap de-leaking is done now:** the escalation target becomes a named
  parameter rather than a proper noun, applying the seam `prompt-craft`
  already prescribes for mission skills to the half that would ship.
- **`brand-voice` is reclassified out of the capability set** and recorded as a
  project artifact. It is a brand book, not a method.
- **The expensive parameterisation is not done.** Domain assumptions stay
  written as this project's assumptions, and the spec states which ones a
  future consumer must re-decide rather than pretending they are neutral.
- **Nothing is published**: no marketplace entry, no version tag, no
  distribution. The spec is the deliverable.

## Consequences

- The handbook's §5 claim becomes true in a weaker, honest form: the boundary
  is defined and the plugin is specified, but it does not ship. HANDBOOK.md is
  reworded accordingly.
- `security-review`'s "low-value target" line stays exactly as written. That is
  deliberate and it has a second reason: Mission 6 runs `security-review` in
  **design mode against this very blueprint**, so the line is load-bearing for
  *this* project's threat model, not only a hypothetical consumer's.
  Sanitising it now would alter the calibration of a review that has not run
  yet.
- Anyone who does extract this later inherits an unfinished job, and the spec
  names it: the domain assumptions are the remaining work, and they are the
  part that fails silently.
- The de-leaked escalation target makes four skills marginally less direct
  (`adr-keeper`, `mission-protocol`, `prompt-craft`, `review-work`). Accepted
  as the smallest version of a cost that gets worse the further abstraction
  goes. `tech-eval`, `security-review` and `design-tokens` were deliberately
  left alone — theirs is the domain-assumption class, not the role-name class.
- Deciding not to publish is reversible at any time; the reverse would not have
  been. Nothing depends on the plugin existing.

## Alternatives rejected

- **Full parameterisation now** (`IMPROVEMENTS.md` #6 option A): a
  project-profile header on all eight skills with the generic method below it.
  Rejected as paying abstraction's cost — vaguer instructions, followed less
  reliably under context pressure — for reuse that is not yet real, and for
  consumers who do not exist. The seam is documented, so this remains available
  the moment a second project actually needs it.
- **One `PROJECT-PROFILE.md` that skills point at** (option B). Rejected: it
  costs an indirection at exactly the moment a skill needs the value, and
  skills that read cleanly top-to-bottom get followed more reliably. It also
  splits a skill's meaning across two files for a drift problem that eight
  files do not yet have.
- **Reject extraction outright and reword the handbook** (option D). Genuinely
  defensible and nearly chosen. Rejected because the boundary question is worth
  answering on the record even if nothing ships: it forced the `brand-voice`
  mis-classification into the open and identified which skills carry silent
  calibration, both of which are useful to *this* project regardless of reuse.
- **Publish 0.1 to a marketplace.** Rejected: publishing distributes skills
  whose domain assumptions are known to be wrong outside this project, and the
  dangerous class is the one that fails without announcing itself.
- **Split `brand-voice` into a thin reusable method plus a thick brand book**
  (option C). Rejected for now as a refactor in service of a plugin that is not
  shipping; reclassification records the finding at zero cost.
