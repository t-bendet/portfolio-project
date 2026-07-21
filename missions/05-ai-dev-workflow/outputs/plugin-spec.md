# Plugin Spec — `portfolio-workshop` 0.1

Mission 5 · 2026-07-22
Recorded as ADR 0029.

**Status: specified, not published** (Tal, 2026-07-22). This document defines
the export boundary. Nothing ships: no marketplace entry, no version tag, no
distribution. §6 says why that is the decision rather than a delay.

Packaging facts verified against current Claude Code documentation on
2026-07-22. Per `tech-eval`'s standing rule, they are lookups, not
recollection — and they will still need re-checking if this is ever built.

---

## 1. The format, as it actually is

| Thing | Reality |
|---|---|
| Manifest | `.claude-plugin/plugin.json` at plugin root |
| Required fields | **`name` only** (kebab-case). Everything else optional |
| Skills | `skills/` — auto-discovered |
| Agents | `agents/` — auto-discovered |
| Hooks | `hooks/hooks.json`, or inline in the manifest |
| Script paths in hooks | `${CLAUDE_PLUGIN_ROOT}` resolves to the installed plugin directory |
| Distribution | `.claude-plugin/marketplace.json` (`name`, `owner`, `plugins`); sources may be GitHub `owner/repo`, a git URL, a remote URL, npm, or a local path |

**`${CLAUDE_PLUGIN_ROOT}` is the fact that makes this feasible at all.** Every
hook in this repo is wired as `node scripts/hooks/x.ts` — a repo-relative path
that would silently resolve to nothing in a consumer's tree. The variable is
the supported fix, and it is the difference between a portable plugin and a
broken one:

```json
{ "type": "command",
  "command": "node",
  "args": ["${CLAUDE_PLUGIN_ROOT}/scripts/hooks/decision-guard.ts"] }
```

---

## 2. What travels

```
portfolio-workshop/
  .claude-plugin/plugin.json
  skills/
    adr-keeper/          prompt-craft/        mission-protocol/
    tech-eval/           security-review/     performance-review/
    design-tokens/       review-work/
  agents/
    red-team-reviewer.md  docs-explorer.md
  hooks/hooks.json
  scripts/
    hooks/decision-guard.ts  hooks/docs-sync-check.ts  hooks/protect-reference.ts
    validate-adr.ts  reindex-decisions.ts  validate-workshop.ts  test-machinery.ts
    lib/frontmatter.ts
```

`name: portfolio-workshop`, `version: 0.1.0`, plus `description`, `author`,
`license`, `repository`. No other manifest fields are needed — `skills/` and
`agents/` are auto-discovered, so declaring them would be noise.

**Why these hooks and not the others.** The three that travel enforce
*generic* invariants: ADRs stay well-formed, docs stay in sync with the
machinery, declared read-only source material stays read-only.

---

## 3. What stays, and why

| Stays | Reason |
|---|---|
| `brand-voice` | **Reclassified** (ADR 0029). It is the `T://bendet` namespace, the eyebrow format and the Marauder's Map layer — a project brand book shelved as a capability. One reusable idea is buried in it (the anti-theme-soup rule); extracting it is a refactor in service of a plugin that is not shipping |
| `m1-identity` … `m6-blueprint-gate` | The **call site** in `prompt-craft`'s function/call-site split. Project specifics belong here by design; these were never the leak |
| `publish-translation` | Encodes one named author's licence terms. Not a method |
| `hooks/mission-gate.ts` | Depends on this repo's `missions/0N-*/STATUS.md` layout and its `depends-on` vocabulary |
| `hooks/protect-workshop.ts` | Encodes this project's phase model (ADR 0028) — "M5 in-progress", "M6 closed" |
| `hooks/inject-project-state.ts` | Injects this repo's index and mission statuses |
| `scripts/contrast.ts`, `sync-docs.ts` | `sync-docs.ts` hardcodes `docs/HANDBOOK.md` and a fixed diagram registry. Travelling would mean parameterising both, which is §6's rejected work |
| `missions/`, `docs/decisions/`, `assets/` | Instance data. A plugin ships the method, never the decisions |

`review-work` travels with a caveat: its method is generic, but its
propagation checklist names this project's live narrowings (0019/0023,
0020/0024) as worked examples. A consumer must replace those with their own.
Kept in rather than genericised, because the examples are what make the
checklist concrete, and §6 is a decision not to trade concreteness for reach.

---

## 4. The leakage, and what was actually fixed

`IMPROVEMENTS.md` #6's three-tier taxonomy held up under inspection. There are
**eight "Tal" references across seven capability skills** — five of them the
role-name class (4 skills, fixed) and three the domain-assumption class
(3 skills, left alone).

**The taxonomy spans eight skills, not seven.** `performance-review` carries a
domain assumption with **no proper noun in it at all**, so it appears in the
second table below without contributing a reference to the count. That gap
between "skills with a leak" and "skills a grep finds" is the finding, not a
bookkeeping wrinkle: it is precisely why the domain class is the dangerous one.

### Fixed now — role name (5 references, 4 skills)

`adr-keeper` (×2), `mission-protocol`, `prompt-craft` and `review-work` named
"Tal" as an **escalation target**: a role wearing a proper noun. Each now
carries a one-line project-parameters binding at the top declaring
`escalation target: Tal`, with the body text left direct.

(`review-work` is this mission's own skill and travels per §2, so it inherited
the same leak it was written alongside — caught in review, not by design.)

The body was deliberately *not* abstracted. "Escalate to Tal" is more
actionable than "escalate to the project owner defined in your profile", and
vague skills get ignored under context pressure — the exact failure the hook
layer exists to compensate for. The seam is marked; packaging substitutes
through it.

### Not fixed — domain assumption (3 of the eight references, 4 skills)

Three of these name "Tal" directly; `performance-review` carries the
assumption with no proper noun at all, which is precisely why this class is
harder to spot than a name.

| Skill | The assumption |
|---|---|
| `security-review` | "A portfolio is a low-value target; do not inflate" |
| `tech-eval` | "Tal's maintenance budget as a solo dev" |
| `design-tokens` | Hebrew coverage; "Tal's prototypes" as token ancestors |
| `performance-review` | Hebrew subsets in the font-loading budget |

**This is the dangerous class and it is deliberately left as-is.** A proper
noun is *visibly* wrong wherever it lands; a baked-in threat model reads as
calibration guidance and silently under-rates severity in a project whose
asset value is not low.

`security-review`'s line has a second reason to stay untouched: **Mission 6
runs that skill in design mode against this very blueprint.** The line is
load-bearing for this project's threat model right now, and editing it would
alter the calibration of a review that has not run yet. Sanitising it is not
free, and it is not this mission's call to make on M6's behalf.

Anyone extracting this later inherits an unfinished job. This section is the
handover: **the domain assumptions are the remaining work, and they are the
part that fails without announcing itself.**

---

## 5. If it were ever built

1. `plugin.json`; copy the §2 tree.
2. Rewrite the three travelling hooks' commands to `${CLAUDE_PLUGIN_ROOT}`
   paths in `hooks/hooks.json`.
3. Substitute the escalation-target binding (§4).
4. Re-decide the five domain assumptions per consuming project — not
   find-and-replace; they are judgement calls.
5. `test-machinery.ts` needs its phase table replaced: it encodes this
   project's mission phases (ADR 0028). Without that, the suite is
   meaningless in a consumer's repo — and a meaningless green suite is worse
   than none.
6. Re-verify the packaging format. These are 2026-07-22 facts.
7. `.claude-plugin/marketplace.json` only if actually distributing.

---

## 6. Why "specified, not published" rather than "not yet"

Publishing distributes skills whose domain assumptions are known to be wrong
outside this project, and §4 establishes that the wrong ones fail silently.
That is a sufficient reason on its own.

The positive case for extraction was weaker than it looks.
`docs/HANDBOOK.md` §1 says the machinery is "deliberately part of the
portfolio's story" — a workshop visibly built *for this project* is arguably
the better exhibit, and `IMPROVEMENTS.md` #6 warns plainly: *do not extract on
principle.*

**What specifying it bought, given nothing ships:** it forced the
`brand-voice` mis-classification into the open, and it identified which
skills carry silent calibration versus which carry a visible name. Both are
useful to this project regardless of whether anyone else ever installs
anything. That is the honest return, and it is why option (D) — reject
extraction outright and reword the handbook — was rejected in favour of
answering the question on the record.

`docs/HANDBOOK.md` §5's claim that eight capability skills "travel in the
future `portfolio-workshop` plugin" is now false in two ways. The travelling
set is still eight, but **a different eight**: `brand-voice` is reclassified
out and `review-work` joins (§2). And they do not travel — nothing ships.
Reworded there.
