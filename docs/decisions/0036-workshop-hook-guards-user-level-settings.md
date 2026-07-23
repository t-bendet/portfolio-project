---
id: 0036
title: The workshop hook guards user-level ~/.claude/settings*.json as a deliberate, ADR-unscoped over-reach
status: active
date: 2026-07-23
decided-by: tal
mission: phase-2
reopened-by: null
superseded-by: null
---

## Context

`scripts/hooks/protect-workshop.ts` currently blocks Write/Edit to the
user-level `~/.claude/settings.json` — and, by the same accident, to the
user-level memory directory — because its `/(^|\/)\.claude\//` regex matches any
`.claude/` segment against the absolute path Claude Code passes. The memory
block is the false positive the hook-anchor queue exists to remove; the settings
block is a separate question, because Q3's repo-scoping fix will exit 0 for every
path outside the project root and thereby drop user-level settings coverage
unless something re-guards it explicitly.

So a decision is forced: once the hook is repo-scoped, does it still guard the
user-level settings files, or does it let them through?

**What the enforcing ADRs actually claim.** Both scope to this repo's machinery
and are silent on the home directory:

- ADR 0028 decision 1: "agent sessions may edit `.claude/skills/**` and
  `.claude/agents/**`, and may never edit `scripts/hooks/**`, `scripts/*.ts`,
  `.claude/settings.json`, or `.claude/settings.local.json`." Its Context frames
  these as "the workshop's rules" / "the machinery" — repo-relative surfaces.
- ADR 0032 decision 1: "block `scripts/**` and both settings files always."
  "Both" is the two repo settings files.

Neither ADR mentions `~/.claude/`. Guarding user-level settings is therefore
authorized by no ADR; it is an artifact of the over-broad regex. CLAUDE.md's
invariant — "`.claude/settings.json` and `settings.local.json`: never, in any
phase — escalate" — reads unqualified, but in a project constitution enumerating
repo machinery it most naturally means the repo's files.

**Signal reliability.** The hook receives only `tool_input.file_path`, and
Claude Code passes absolute paths. A raw-path suffix match against
`(^|\/)\.claude\/settings(\.local)?\.json$` fires reliably on the user-level
path, the repo path, and the relative form. It cannot distinguish *which*
`.claude` it is — but for settings that distinction is moot, since the answer is
"block" for all of them. Being a pure string match with no filesystem I/O and no
project-root derivation, it is immune to the three fail-open paths the withdrawn
PR #5 introduced (unguarded `realpathSync` throwing → exit 1 → permit; a wrong
root plus `^`-anchoring silently disabling the hook; realpath applied
asymmetrically). It is the single most robust line the hook can carry.

## Decision

Resolved by Tal, 2026-07-23, ruling option (i) of the Q2 analysis:

**The hook keeps guarding user-level `~/.claude/settings*.json`.** In Q3's
repo-scoped rewrite, the settings guard matches
`(^|\/)\.claude\/settings(\.local)?\.json$` against the raw `file_path` and
`exit(2)` **before** any outside-root / repo-scope check, so it is
root-independent and survives every failure mode in objections O2–O4. This is
property 5 of the PR #5 fix specification, and it is a **required input to Q3.**

This guard is a **deliberate, ADR-unscoped over-reach** and must be recorded and
commented as such. The enforcement ADRs (0028, 0032) scope to repo machinery;
this extends one narrow surface — the settings files — beyond the project root
on purpose. The "No exception, ever" comment in `protect-workshop.ts` stays
truthful under this ruling and does not need the option-(ii) rewrite, but the
comment must state that the match is intentionally root-independent and covers
the user-level files, so the boundary is legible in the file it governs (O5/O7).

This is not a narrowing of ADR 0028 or 0032 (ADR 0027): neither clause is
reversed or corrected — repo settings and `scripts/**` stay blocked always,
exactly as written. This ADR decides a surface those ADRs left silent on, and so
stands alone.

## Consequences

- User-level settings writes from a session **cd'd into this repo** are blocked
  and must be escalated to Tal, who edits by hand (hooks bind sessions, not
  humans; a session in another project is unaffected — this hook is registered
  in this repo's project settings).
- The `update-config` skill's global-settings path ("add permission to global
  settings", "move permission to user settings") is blocked from within this
  repo. Accepted: it is a rare operation, and the escalation is mild.
- The privilege-escalation surface is closed. User-level settings wire hooks and
  grant permissions across *every* project — a strictly more powerful surface
  than the repo settings already treated as "never, escalate." Letting sessions
  edit the global ones while forbidding the local ones would be incoherent.
- Q3 inherits a hard constraint: the settings guard runs first and is
  root-independent, immune to O2–O4.

## Alternatives rejected

- **(ii) Drop it — go fully repo-scoped, rewrite the comment to say the
  user-level surface is unguarded and why.** The strongest case against this
  ADR, stated in full: a repo hook has no business dictating policy over files
  outside the repo. Exiting 2 on `~/.claude/settings.json` makes a
  portfolio-project artifact govern what Claude Code may do to Tal's home
  directory in any session cd'd into this repo — a global policy smuggled in
  through one project's local config, authorized by no ADR, silently breaking
  update-config's legitimate global path and reproducing in miniature the exact
  "`.claude/` segment reaching outside the repo" over-match this queue exists to
  eliminate. If global settings protection is genuinely wanted, the correct
  mechanism is a hook registered in `~/.claude/settings.json` itself, binding
  every project — not a rule hidden in one repo. Rejected by Tal: the cost of
  guarding is one rare escalation; the blast radius of not guarding is global
  privilege escalation; and the guard is the one line immune to every fail-open
  bug Q3 must design against. The over-reach is accepted consciously and recorded
  here and in the hook comment rather than left implicit — shipping (ii) silently
  under the existing "No exception, ever" comment was never on the table, as the
  reviewer flagged it as the legibility failure ADR 0032's Context objects to.
- **Leave the accident in place (guard everything under `~/.claude/` via the
  broad regex).** Rejected: that is the false positive on the memory directory —
  the defect the queue is fixing. The settings guard must be re-established
  narrowly and on purpose, not preserved as a side effect of the bug.
- **A user-level hook in `~/.claude/settings.json` that binds every project.**
  The "correct" mechanism named in the counter-argument, and not rejected on
  merit — but out of scope for this repo and this queue, and it does not exist.
  Given a binary choice for *this* hook, block. Tal may add the global hook
  later; it would supersede this guard's reach, not conflict with it.
