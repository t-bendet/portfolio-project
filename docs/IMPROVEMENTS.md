# Improvements Backlog

Five improvements identified at the end of the scaffolding session (2026-07-20),
deliberately NOT implemented — to be folded in by Tal while working, once real
mission experience confirms or corrects them. Ranked by leverage.

---

## 1. Timebox every mission — protect the project from its own process ⭐

**Problem.** The workshop has a loop cap but no scope cap. Nothing stops a
mission from becoming a three-week odyssey. For a solo dev with limited hours,
elaborate process is the most respectable form of procrastination: it feels
like progress and ships nothing. A blueprint that is 85% right and *finished*
beats a perfect one that delays the site into irrelevance.

**Fix.** In `missions/00-mission-plan.md`, add a timebox per mission
(suggested: 2–3 working sessions each). Hitting the box triggers a
**"decide with what we have"** checkpoint — not more exploration. Record the
timebox in each mission's STATUS.md frontmatter (e.g. `timebox-sessions: 3`)
and count sessions in the handoff notes.

**Effort:** ~3 lines of markdown. Highest leverage on this list.

---

## 2. A test suite for the machinery itself

**Problem.** Every hook was verified by hand (piped JSON, checked exit codes)
during the build session. None of that is reproducible from the repo. If a
future edit breaks a hook, nothing notices — enforcement fails *open*, silently.

**Fix.** `scripts/test-machinery.ts` encoding the smoke suite:

- protect-reference: write to `assets/reference/**` → expect exit 2
- mission-gate: write to M2 outputs while M1 open → exit 2; M1 closed
  WITH approved verdict → exit 0; M1 closed WITHOUT verdict → exit 2
  (the rubber-stamp case)
- protect-workshop: `.claude/**` write outside M5 → exit 2; during M5
  in-progress → exit 0; `settings.json` always → exit 2
- decision-guard: valid ADR → exit 0 + INDEX regenerated; malformed → exit 2
- docs-sync: add a dummy machinery file → check fails; remove → passes
- validators: all green on a clean tree

Make it the first thing Phase 2 CI runs. Simulate hook stdin exactly as the
session did: `echo '{"tool_input":{"file_path":"..."}}' | node scripts/hooks/X.ts`.

**Effort:** one focused session. Do before or during Mission 1.

---

## 3. Mechanize reviewer freshness (`context: fork`)

**Problem.** "Red-team runs in fresh context" is the last unenforced promise
in the project — pure instruction, no mechanism. Everything else got converted
from behavioral to mechanical; the reviewer's isolation didn't.

**Fix.** Skill frontmatter supports `context: fork` (runs the skill in an
isolated subagent). Create a `review-mission` skill with `context: fork` that
wraps the red-team-reviewer invocation: it receives only the output contract +
artifact paths and writes `review-verdict.md`. The reviewer's
"refuse if conversation context is visible" rule stays as a backstop.

**Caveat:** `context: fork` is a newer field — run one behavior test (can the
forked context actually see the parent conversation or not?) before trusting
it. If it doesn't hold, keep the behavioral rule and note it as a known gap.

**Effort:** small skill + one experiment. Do before Mission 1's closure
(that's the first real review).

---

## 4. Friction log — make the machinery learn

**Problem.** Missions will hit rough edges: a gate blocking something
reasonable, a contract item that turned out to be theater, a checkpoint that
should exist. That experience currently evaporates between sessions — and
Mission 5 is supposed to design the Phase 2 workflow from exactly this
evidence.

**Fix.** Add `friction-log.md` to every mission's output contract (update the
six mission skills + the linter's required outputs if you want it enforced).
Even three bullets per mission suffices:

```
- [what happened] → [what it cost] → [suggested change, if any]
```

M5's input manifest then explicitly includes all friction logs.

**Effort:** cheapest change on this list; compounds the most.

---

## 5. The workshop is content — capture the story as it happens

**Problem.** The ranked goal is community standing. This repo — ADR-driven
portfolio development, adversarial AI review, hook-enforced discipline — is
more distinctive writing material than most portfolios' actual content. But
the raw material ("the gate blocked me here", the red-team's second rejection,
the reconciliation decision) only exists *while it's happening*. Retrofitted
war stories lose the texture.

**Fix.** `docs/research/story-capture.md` with a running log: screenshots of
gate blocks, verdict excerpts, before/after of decisions that changed.
Candidate articles that fall out naturally:

- "I built my portfolio like production software" (the whole arc)
- "Making an AI review its own work honestly" (fresh-context red-teaming)
- "ADRs for a side project — overkill that wasn't" (the decision system)
- Hebrew translations of the above for the Israeli dev community

Zero machinery needed — just the habit, and the discipline of capturing in
the moment.

**Effort:** ongoing habit, ~2 minutes per notable event.

---

## Deliberately rejected

More hooks, more validators, more agent sophistication. The enforcement layer
is **done** — past this point every addition costs more in weight than it buys
in safety. Items 2–3 are the only exceptions because they *verify what already
exists* rather than adding surface. If a future idea adds machinery, the bar
it must clear: does a real friction-log entry demand it?

---

## Suggested sequencing

| When | Do |
|---|---|
| Before /m1 | #1 (timeboxes — 5 minutes), #3 (fork experiment) |
| During /m1 | #4 (first friction log), #5 (start the story capture) |
| Before Phase 2 | #2 (test suite — becomes CI's first job) |

Note: implementing #2–#4 touches the machinery surface — the docs-sync hook
will (correctly) demand a HANDBOOK update + `node scripts/sync-docs.ts ack`,
and #4's skill edits must keep the linter green. The machinery policing your
improvements to it is the system working.
