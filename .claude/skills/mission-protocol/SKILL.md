---
name: mission-protocol
description: How any mission runs — gate check, input manifest, loop, review, closure. Use at the start of every mission and whenever mission mechanics are in question.
---

# Mission Protocol

## Run sequence
1. **Gate check.** Read this mission's STATUS.md `depends-on`. Every dependency
   must be genuinely closed: STATUS `closed` + outputs/review-verdict.md with
   `verdict: APPROVED`. The mission-gate hook enforces this on writes; check it
   yourself BEFORE starting work, and refuse to proceed if unmet.
2. **Load state.** Read CLAUDE.md (auto), the decision index, and this mission's
   input manifest (declared in its skill). Record in STATUS.md which ADR
   statuses you observed at start.
3. **Set STATUS to in-progress** with `opened` date.
4. **Work** via the mission's specialist agents. Deliverables go ONLY to this
   mission's outputs/. ADR changes only within the mission's declared license.
   When delegating to an agent, satisfy its Operating contract: pass the task,
   the relevant output-contract slice, and explicit file paths — agents run in
   isolated context and will (correctly) refuse underspecified delegations.
5. **Review loop.** When the output contract is met, invoke `red-team-reviewer`
   as a SUBAGENT IN FRESH/FORKED CONTEXT — it receives only the contract and
   the artifacts, never this conversation. It writes outputs/review-verdict.md
   with `verdict: APPROVED` or `verdict: REJECTED` + objections.
6. **Loop cap: 3.** Increment `revision-cycles` in STATUS.md each rejection.
   On the third rejection, STOP. Escalate to Tal with the objections verbatim.
7. **Close.** Fill handoff notes, set STATUS `closed` + `closed` date, commit.

## Hard rules
- Never flip your own review verdict. Never write review-verdict.md from the
  mission's own context.
- Never begin the next mission in the same session "while we're here."
- Branch-per-mission; merge on close. Worktrees optional (Mission 5 decides).
- INDEX.md conflicts on merge: regenerate via script.
