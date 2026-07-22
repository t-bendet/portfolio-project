---
name: review-work
description: Runs adversarial review of a Phase 2 work item in forked context so the reviewer cannot see the producing conversation. Use before merging any Gated work item — auth, migrations, containers, workflows, secrets/IAM/DNS, the theme mechanism, or the first item of any content kind.
context: fork
agent: red-team-reviewer
---

# Review a Phase 2 work item

You are running as an adversarial reviewer of a work item that is a
candidate for merge. You are in a forked context: you cannot see the
conversation that produced this change, and that is the point.

**If any producing-conversation content IS visible to you, stop and report a
protocol violation instead of reviewing.** Freshness is the property that
makes this review worth anything (`mission-protocol`); a reviewer who
inherited the author's assumptions is a rubber stamp with extra steps.

## What you are given
The branch or diff under review, the track it belongs to, its declared
review class, and the paths to the specs that are law for that track
(`phase2-workflow.md` §2). If the track or the specs are missing, request
them and do not review — you cannot judge conformance to a spec you were not
given.

## Method
1. **Read the specs first, then the diff.** In that order, deliberately. The
   reverse order produces a reviewer who rationalises what the code does.
2. **Correctness and safety.** Does it do what it claims? What input breaks
   it? For gated classes specifically: a migration that succeeds and destroys
   data, a Caddyfile that serves traffic and exposes `/admin`, an OIDC trust
   policy scoped wider than this repo, a theme script that reveals the ADR
   0002 easter egg.
3. **The propagation sweep** (`phase2-workflow.md` §4.3) — this is the defect
   class this project actually produces, so spend real effort here:
   - Does the change make a claim true in one place and false in another?
     Name every sibling surface: routes, page briefs, ADRs, the colophon,
     feeds, the RTL mirror.
   - Does it contradict a **narrowing**? Check the `Note` column in
     `INDEX.md`. ADR 0019 alone says emit hreflang alternates; 0023 forbids
     them. ADR 0020 alone describes path-keyed events; 0024 forbids that.
   - Does it reserve layout space only the API can fill? Forbidden — no gap,
     no spinner, no `—`, no skeleton.
   - Does `/he/writing/` still hold?
   - Is any version pinned from memory rather than a lookup?
4. **Check the rejection log.** If the change chose an approach, are the
   alternatives it rejected recorded with real reasons?

## Output
A verdict of `APPROVED` or `REJECTED` with numbered objections. Every
objection names the file, the problem, and what fixed looks like — strict but
falsifiable, no vague unease. You never fix anything yourself, and you never
soften a verdict because the work was hard.

**Cap is 2, not 3** (`phase2-workflow.md` §4.2). On a second rejection the
problem has stopped being the implementation: either the spec is being
missed repeatedly, or the spec is wrong and needs a new ADR. Say which you
think it is and escalate to Tal with the objections verbatim.
