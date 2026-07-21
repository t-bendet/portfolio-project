# Phase 2 Workflow — how build work runs

Mission 5 · opened 2026-07-21, final 2026-07-22

Basis (law): ADRs 0011, 0012, 0013, 0019, 0020, 0021, 0022, 0023, 0024;
`missions/03-*/outputs/architecture-decision.md` §1–6 and
`phase2-scaffold-plan.md`; `missions/04-*/outputs/content-model.md` §9;
`mission-protocol`, `prompt-craft`, `adr-keeper`. Recorded as ADR 0025.

Phase 2 begins when Mission 6 closes GO. Its first act is executing
`phase2-scaffold-plan.md`. Everything below governs what happens after
that command finishes.

---

## 1. Why the Phase 1 workflow cannot simply continue

The mission model was built for a specific shape of work: **few large
questions, each answered once, each expensive to get wrong.** Six missions,
one specialist each, one adversarial review each, a mechanical gate between
them. That shape justified its overhead — a wrong identity decision or a
wrong dynamic boundary would have propagated into everything.

Phase 2 is the opposite shape: **many small changes against a blueprint
that is already fixed.** Writing `/writing/[id].astro` is not a decision;
it is an execution of `writing-article.md` and `tokens-reference.md`. Six
of those a session is normal. Running a fresh-context adversarial review
and a status-file gate on each one would cost more than the work.

So the unit changes, and three things change with it.

| | Phase 1 | Phase 2 |
|---|---|---|
| Unit of work | mission (a question) | work item (a shippable change) |
| Gate | `mission-gate` hook: dependency closed + APPROVED verdict | CI: the pipeline in ADR 0021 |
| Review | red-team, every mission, cap 3 | tiered by risk (§4), cap 2 |
| Failure it guards against | deciding wrong | **drifting from what was decided** |

That last row is the important one and it drives the rest of this
document. In Phase 1 the enemy was a bad decision. In Phase 2 the decisions
are law and the enemy is silent divergence from them — a token hardcoded
instead of referenced, an hreflang tag emitted that ADR 0023 forbids, a
credit block placed after the article body when the upstream grant makes
placement a condition. Nothing about a passing build catches any of those.

**Evidence this is the right thing to fear.** M4's review log records that
all three of its cycles found the same defect class — *a change made
correctly in one place and not followed to its consequences* — and **both**
of its rejections were propagation failures rather than reasoning failures.
The third cycle approved, and still raised six findings of the same shape.
That was in a paper mission with fifteen surfaces. Phase 2 has more
surfaces, and they are code.

*(M4 had two rejections, not three: `revision-cycles: 2`, cycle 3 APPROVED.
Its own handoff note says "two of the three rejections", which is the count
this document originally inherited. Both of two is the stronger fact and the
one that is actually true.)*

---

## 2. Tracks

Four long-lived areas. A track is not a branch and not a milestone; it is
an ownership boundary that decides which specs are law for a given change
and what "done" means.

| Track | Owns | Law it must satisfy |
|---|---|---|
| `infra` | Dockerfiles, `compose.yaml` / `compose.dev.yaml`, `Caddyfile`, the three GitHub Actions workflows, AWS provisioning | ADR 0021, `architecture-decision.md` §4–6 |
| `api` | Node/TS service, Prisma schema + migrations, `/api/v1/` endpoints, `/admin` dashboard, auth | ADR 0019 §API, ADR 0020, `architecture-decision.md` §2–3 |
| `web` | Astro static core: layouts, tokens, routes, collections, RTL, hero, theme mechanism | ADRs 0002, 0011, 0015–0018, 0022; all of M2 and M4 outputs |
| `content` | Actual entries: articles, translations, projects, the colophon | ADRs 0023, 0024; `content-model.md` §4 and §9 |

**`content` is a real track, not a folder.** It carries the only two
recurring per-item obligations in the whole build (§6), and they are
compliance conditions, not chores.

**Order.** `infra` scaffolds first (the scaffold plan's §1–4 are
preconditions for everything else), then `api` and `web` proceed against a
running local stack, then `content` fills them. After that the four
interleave freely. This ordering is a dependency fact, not a preference:
`web` cannot render a reaction count until `api` serves one, and `api`
cannot be tested until `compose.dev.yaml` runs Postgres.

**One track at a time.** Not a rule about what is possible — a rule about
what is reviewable. Tal is one person, and a change he has not looked at is
not a change that has been reviewed. This is also the load-bearing input to
the worktree decision (`worktree-and-branching.md`).

---

## 3. Agent roles

The Phase 1 roster was six judgment agents and two workers. Most of them
answered their question and are done. Carrying them forward would be cargo
cult.

**Retired at Phase 2 open** — question answered, ADRs are the durable
output:

| Agent | Why it retires |
|---|---|
| `brand-strategist` | Identity settled: ADRs 0001, 0002, 0014 |
| `design-systems` | Palette/type/tokens settled: ADRs 0015–0018 |
| `tech-architect` | Stack and boundary settled: ADRs 0019–0021 |
| `ia-planner` | Routes and content model settled: ADRs 0022–0024 |
| `design-verifier` | Font facts verified once; the answers are in `typography-spec.md`. Re-verifying settled facts is how you reopen closed questions by accident |
| `workflow-engineer` | This mission is its question. See the caveat below |

Retiring means: the file stays in `.claude/agents/` (deletion loses the
provenance the workshop exists to show), and its `description` gains a
one-line retirement note naming the ADRs that superseded it. An agent whose
description says "retired — see ADR 00NN" will not be selected for work, and
a reader learns why it existed. This is the same instinct as never deleting
an ADR.

**Kept:**

- **`red-team-reviewer`** — kept, scope widened from mission outputs to
  work-item diffs. Still fresh context, still writes its own verdict, still
  never invoked from the session that produced the work. §4 defines when.
- **`docs-explorer`** — kept, and it gets *more* important, not less. Every
  version pin in Phase 2 comes from a lookup at execution time, never from
  memory: `phase2-scaffold-plan.md` §0 lists five open verifications and §8
  states plainly that its versions "WILL be stale". This is the agent that
  closes them.

**No new agents.** This is a deliberate refusal and it costs something, so
here is the reasoning. The obvious candidate was a `blueprint-auditor` —
an agent that checks an implementation against the frozen specs, which is
exactly the §1 failure mode. It is not created, because the check it would
perform is a *question the reviewer must already ask*, and splitting it out
would produce two reviews per gated item, which halves the attention each
gets. It becomes a mandatory step inside the review instead (§4.3).

`IMPROVEMENTS.md`'s "Deliberately rejected" section sets the bar: past this
point every addition costs more in weight than it buys in safety, and the
test is whether real friction demands it. No friction evidence exists yet
for a second reviewer, because Phase 2 has not run. If it appears, the
honest response is a new ADR, not a pre-emptive agent.

**The `workflow-engineer` caveat.** Once M5 closes, no mission is
in-progress, and `protect-workshop.ts` currently permits `.claude/` and
`scripts/` writes *only* while M5 is in-progress. Read literally, the
machinery becomes frozen to every agent session forever. That is a real
consequence of a rule written when M5 was the only foreseeable editor, and
`hooks-plan.md` resolves it.

---

## 4. Review tiers

### 4.1 The three classes

Review effort is keyed to what a mistake costs, not to how large the diff
is. Every work item is one of three classes, declared by the session before
work starts — declaring it afterwards invites choosing the tier that
matches the outcome.

| Class | Examples | Review |
|---|---|---|
| **Routine** | copy edit; a content entry with no new field; a token value changed to the value `tokens-reference.md` already specifies; a dependency patch bump | CI only |
| **Standard** | a new route, component, or endpoint; a page assembled from an existing brief; a new collection field already specified in `content-model.md` | CI + self-review against the propagation checklist (§4.3) |
| **Gated** | auth; any Prisma migration; Dockerfile / compose / Caddyfile; any of the three workflows; anything touching secrets, IAM, or DNS; the first article in each collection; the first RTL translation; the theme mechanism (ADR 0002) | CI + **mandatory `red-team-reviewer` in fresh context**, cap 2 |

**Why those specific things are gated.** Each is a case where a passing
build and a broken system are compatible: a migration can succeed and
destroy data; a Caddyfile can serve traffic and leak `/admin`; an OIDC
trust policy can deploy correctly and be scoped to every repo in the
account; the theme script can render perfectly and reveal the easter egg
ADR 0002 requires stay hidden. CI proves the code runs. Gated review asks
whether it should.

**The first-of-each-kind rule** is doing specific work. The first article
establishes the pattern that the next thirty copy. Reviewing item #1
adversarially and items #2–30 routinely is the only allocation of attention
that scales.

### 4.2 Cap 2, not 3

Phase 1's cap was 3 because a rejection meant re-reasoning an open
question, and questions deserve a few passes. In Phase 2 the blueprint is
fixed, so a second rejection means one of two things, both of which stop
being an implementation problem:

- the implementation keeps missing a spec that is stated clearly — a
  competence or context failure, and grinding a third cycle will not fix it;
  or
- **the spec itself is wrong**, which is Tal's call and needs a new ADR, not
  another revision.

Either way the third cycle burns effort on the wrong layer. On the second
rejection: stop, and escalate with the objections verbatim, exactly as
`mission-protocol` §6 does.

### 4.3 The propagation checklist

Mandatory for Gated review, and the self-review content for Standard. It
exists because §1's evidence says this is the failure that actually
happens.

1. **Did this change make a claim true in one place and false in another?**
   Name every other surface stating the same fact — sibling routes, the
   page brief, the ADR, the colophon, the feed, the RTL mirror.
2. **Does it contradict a narrowing?** ADR 0019 alone tells you to emit
   hreflang alternates; ADR 0023 forbids them. ADR 0020 alone describes
   events keyed by path; ADR 0024 forbids path keying. Check the `Note`
   column in `INDEX.md`, which now carries these relationships (ADR 0027).
3. **Does it reserve space only the API can fill?** `content-model.md`'s
   composition invariant: a count that fails to load leaves no gap, no
   spinner, no `—`, no skeleton.
4. **Does the RTL mirror still hold?** Every `web` and `content` change
   gets checked against `/he/writing/` too, or the CI RTL stage is the only
   thing standing between a broken Hebrew subtree and production.
5. **Is a version pinned from memory anywhere?** If yes, it is wrong until
   `docs-explorer` confirms it.

### 4.4 Scope cap

The loop cap bounds disagreement. Nothing currently bounds *scope*, which
`IMPROVEMENTS.md` #1 identifies as the higher-leverage gap: "elaborate
process is the most respectable form of procrastination."

**A work item that has not shipped after three working sessions triggers a
"decide with what we have" checkpoint** — not more exploration. The
outcomes are: ship the reduced version, split the item, or drop it. Recorded
in the PR description, because that is where the record already lives.

**Mission 6 is deliberately exempt** (Tal, 2026-07-22). It is the blueprint
gate — the last point at which a coherence failure across six missions can
be caught while it is still cheap, because no code exists yet. It is the one
place where more thoroughness is still cheaper than the alternative, and
capping it would optimise the schedule at the expense of the thing the gate
exists to do. The cap applies to Phase 2 work items only.

---

## 5. Delegation patterns

Phase 1 delegated by role: a mission handed its question to one specialist.
Phase 2 has one implementer — the session — and delegation earns its
overhead in only three shapes.

**Delegate when the work is genuinely parallel and independent.** The real
instance is `phase2-scaffold-plan.md` §0: five open verifications (Astro 7
integration compatibility ranges, current `prisma migrate` CI guidance,
public-IPv4 billing, QEMU arm64 build times, current patch versions of six
packages). They are independent lookups with no shared reasoning. One
`docs-explorer` call handles them in parallel; five sequential lookups in
the main session waste an hour.

**Delegate when isolation is the point.** `red-team-reviewer` is
delegated *because* it must not see the producing conversation. This is
the one non-negotiable delegation in the project, and it is required
precisely where it is least convenient.

Until now that isolation was the last purely behavioural promise in the
project — every other rule got converted from instruction to mechanism, and
the reviewer's freshness did not (`IMPROVEMENTS.md` #3). **It is now
mechanical.** `context: fork` is a real, current SKILL.md frontmatter field
(verified against Claude Code documentation, 2026-07-22): it runs the skill
in a forked subagent that receives the skill body, CLAUDE.md and preloaded
skills, but **not the parent conversation history**. The `review-work`
skill (`hooks-plan.md`) carries it.

**The behavioural rule stays as a backstop, deliberately.** The mechanism is
documented rather than tested here, and `IMPROVEMENTS.md` #3 asked for one
behaviour test before trusting it. Until that test runs,
`red-team-reviewer`'s standing order to refuse if it can see the producing
conversation is what actually guarantees the property; `context: fork` is
belt to its braces. Two mechanisms for one invariant is redundancy where
the invariant is load-bearing, not duplication.

**Do not delegate implementation.** Handing "build the writing index" to a
subagent means briefing it with the page brief, the tokens, the collection
schema, the navigation spec and the RTL rules — a brief nearly as long as
the deliverable, produced by re-deriving context the session already holds.
The specialist agents earned their overhead in Phase 1 because each held a
*method* the lead did not. No Phase 2 agent holds a method; they hold specs,
and specs are files.

**Briefing rule, unchanged from `mission-protocol` §4:** a delegation must
carry the task, the relevant contract slice, and explicit file paths.
Agents run isolated and are instructed to refuse underspecified work.

---

## 6. The two standing content obligations

`content-model.md` §9 hands Mission 5 two per-translation obligations. They
are not solved by the content model and they are not solvable by taste.

### 6.1 The upstream back-link PR

Every translation of a Kent C. Dodds article owes a PR to that repo adding
the translation to the post's `translations:` frontmatter. This is
**condition 2 of the grant that makes the translations legal** — not
etiquette. M4 named it "the obligation most likely to be skipped at article
#7, and nothing in the content model will catch it."

**It is not mechanically verifiable, and this document will not pretend
otherwise.** Confirming the PR exists requires querying an external repo's
state; CI has no business making network calls to a third party to decide
whether a build passes, and a check that can fail because someone else's
repo is unreachable is a check that gets disabled.

What it gets instead: **a place in the definition of done for every
`content` work item that adds a translation**, carried by the
`publish-translation` skill (`hooks-plan.md`), which lists the grant's
conditions in order and is invoked at the moment of publication. The
honest limitation: a skill only fires when invoked. That is weaker than a
hook and it is stated rather than hidden.

M4 recorded the rejected alternative — a required content field admitting
`pending` — so it can be revisited. If a translation ever ships without its
PR, that rejection should be revisited immediately; that is the friction
evidence which would justify the field.

### 6.2 Keeping `/colophon/` current

Tal chose a living colophon over a dated article and accepted the
maintenance contract: a stale colophon actively misinforms, and on a site
whose whole claim is technical honesty it misinforms about the one thing
visitors came to check.

**This one *is* mechanizable, and cheaply, by reusing machinery that
already exists.** `sync-docs.ts` already implements exactly this pattern
for the handbook: fingerprint a surface, record the fingerprint when docs
are confirmed current, fail when the surface moves. The colophon's surface
is the stack it describes — the pinned image tags in `compose.yaml`, the
dependency versions in the `web` and `api` manifests, and the ADR index.

Specified in `hooks-plan.md` §4.3. It needs no
`settings.json` change, because `docs-sync-check` is already wired.

---

## 7. Checkpoint cadence

Phase 1 checkpointed per deliverable, because every deliverable was a
decision. Phase 2 checkpoints on **irreversibility and on drift**, which is
a different trigger and a much rarer one.

**Mandatory checkpoints — stop and ask Tal:**

1. **Scaffold verification results.** After `phase2-scaffold-plan.md` §0's
   five verifications resolve, before anything is installed. Two of them can
   change the design, not just the versions: public-IPv4 billing moves the
   monthly cost (ADR 0021's budget against G6's $15 ceiling), and QEMU arm64
   build times may force paid ARM runners or on-instance builds.
2. **Before the first deploy to real infrastructure.** Domain, DNS, a
   public IP and a bill. Nothing before this point spends money or is
   visible; everything after it is both.
3. **Before any migration runs against production data.** `prisma migrate
   deploy` on an empty database is a formality. On a populated one it is the
   only genuinely destructive operation in the system.
4. **When a blueprint document turns out to be wrong.** This will happen —
   the blueprint was written on paper against unverified facts, and §8 of
   the architecture decision says so. Implementation contradicting a spec is
   not a licence to quietly follow the code; it is a checkpoint, and its
   output is a new ADR.
5. **When measured monthly cost crosses $15** (G6's ceiling, ADR 0021).

**Not checkpoints:** a route rendering, an endpoint returning, a test
failing, a version pinned differently than the plan guessed. Those are
work.

---

## 8. What a work item looks like end to end

```
1. declare the track and the review class (§2, §4.1)
2. branch  <track>/<slug>            (worktree-and-branching.md)
3. build   against the specs that are law for that track
4. verify  locally: compose.dev.yaml up, tests, astro build
5. push    -> PR -> ci.yml gates (ADR 0021 §5)
6. review  per class:
     Routine  -> CI only
     Standard -> self-review, propagation checklist (§4.3)
     Gated    -> red-team-reviewer, fresh context, cap 2 (§4.2)
7. merge   to main -> deploy.yml -> health check -> rollback-by-SHA on fail
8. if content: publish-translation obligations (§6.1) before the item closes
```

Steps 5 and 7 are ADR 0021's pipeline, not new machinery. The workflow's
contribution is steps 1, 6 and 8 — which is deliberately small. **Most of
Phase 2's discipline is already mechanical and already decided; this
document adds the judgment the pipeline cannot encode, and nothing else.**

---

## 9. Corrections to inherited documents

Recorded here because the documents themselves are closed-mission outputs
and cannot be edited.

1. **`phase2-scaffold-plan.md` §0 (lines 4–5) is factually wrong.** It
   states: "`app/` must not exist before Phase 2; the mission-gate hook
   enforces this." It does not. `mission-gate.ts` matches only
   `missions/(\d{2})-[^/]+/outputs/` and has no knowledge of `app/`. Nothing
   currently prevents an agent session from creating `app/` — and the
   realistic path, `pnpm create astro`, runs through Bash, which no
   `Write|Edit` hook could intercept in any case. The rule in CLAUDE.md is
   real; the claim that a hook enforces it is not. **Decided (Tal,
   2026-07-22): leave it unenforced and record it.** Two paper-only missions
   remain, closing the hole would require a `settings.json` edit that only
   Tal can make, and `IMPROVEMENTS.md`'s bar for new enforcement is not met
   by a hypothetical. Phase 2 opens with `app/` legitimate, at which point
   the hole closes by expiry.

2. **`architecture-decision.md` §5's CI RTL stage** describes assertions
   that are partly M4 impositions rather than M3 inheritance
   (`content-model.md` §9 item 4). The `infra` track receives assertions 2,
   3 and 5 as **new requirements**, and assertion 2 specifically must check
   that the credit *precedes the article body* and *states that it is a
   translation* — a compliance condition of the upstream grant, not a style
   preference.

3. **There are no zero-JS routes on this site.** ADR 0002's theme mechanism
   puts an inline head script on every page. Where any brief says a route
   has "no JavaScript" it means no dynamic-layer script. Carried from M4's
   standing correction; it will be tempting to re-introduce the false claim
   in the colophon.
