# Improvements Backlog

Improvements identified but deliberately NOT implemented — to be folded in by
Tal while working, once real mission experience confirms or corrects them.
Ranked by leverage. Items 1–5 come from the scaffolding session (2026-07-20);
items 6–7 were added 2026-07-21.

## Status after Mission 5 (2026-07-22)

Mission 5 held the only license to modify `.claude/` and `scripts/`, so it was
the last chance to act on the machinery items before Phase 2.

| # | Outcome |
|---|---|
| 1 | **Partially done.** A three-session scope cap per Phase 2 work item is in ADR 0025, not as per-mission timeboxes. Mission 6 is deliberately exempt (Tal) |
| 2 | **Done.** `scripts/test-machinery.ts` — 36 assertions across all six hooks, phase-aware, CI's first job. Covers the rubber-stamp case this item named. ADR 0028 |
| 3 | **Done, with the caveat kept.** `context: fork` was verified real (2026-07-22) and the `review-work` skill carries it. The behavioural refuse-if-you-can-see-the-conversation rule **stays as a backstop** until the one behaviour test this item asks for actually runs |
| 4 | **Not done.** Friction logs were never added to the six mission contracts, and five missions have now closed without one. This is why several M5 decisions rest on argument rather than evidence — see the note below |
| 5 | **Not done.** No `story-capture.md` exists; four missions' worth of texture is already only in git history |
| 6 | **Decided, not fully executed.** ADR 0029: boundary specified at 0.1, not published; `brand-voice` reclassified out; role-name leakage parameterised in four skills; the domain-assumption class deliberately left alone. `plugin-spec.md` §4 |
| 7 | **Done.** `sync-docs.ts` binds diagrams by `%% id:` instead of array position. ADR 0028 |

**The gap worth naming: item 4 never happened, and it was the cheapest thing
on this list.** Its stated purpose was that "Mission 5 is supposed to design
the Phase 2 workflow from exactly this evidence." Mission 5 designed it
without that evidence, from argument and from what the review logs happened to
record. Where ADR 0025 refuses new machinery "until real friction demands it",
there is now no mechanism that would ever produce the demand. **Phase 2 work
items should carry the three-bullet friction note this item describes** — the
PR description is the obvious home, and it costs nothing.

**Items 2, 3 and 7 are now closed and can be struck.** The bar in
"Deliberately rejected" stands unchanged: the enforcement layer is done, and
ADR 0028 added no new hooks — every Phase 2 change landed in `scripts/`,
requiring zero `settings.json` escalations.

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

## 6. Decide the plugin extraction boundary before M5 packages anything

*(Added 2026-07-21, from reading the handbook — not yet tested against mission
experience.)*

**Problem.** `docs/HANDBOOK.md` §5 promises the eight capability skills
"travel in the future `portfolio-workshop` plugin." All eight currently carry
T://bendet specifics, so that promise cannot be kept as written. The mission
skills (`m1-identity` … `m6-blueprint-gate`) are **not** the issue — they are
the call site in the function/call-site split, and project specifics belong
there by design. The leakage is in the half that ships.

Three kinds of leakage, in ascending severity:

| Kind | Where | Why it matters |
|---|---|---|
| **Role name** | `adr-keeper:29,35` · `mission-protocol:27` · `prompt-craft:20` · `tech-eval:20` · `security-review:28` | "Escalate to Tal" is a *role* (the human who arbitrates) wearing a proper noun. Visibly wrong to any reader; find-and-replaceable. |
| **Identity content** | `brand-voice:9,10,20` — `T://bendet` namespace, eyebrow format, Marauder's Map / HP layer | Suggests **mis-classification, not contamination**: strip the specifics and one reusable idea remains (the anti-theme-soup rule for adding a symbolic layer). The rest is a project brand book shelved as a capability. |
| **Domain assumption** | `security-review:27` ("a portfolio is a low-value target; do not inflate") · `performance-review:15` (Hebrew subsets) · `design-tokens:15,28` (Hebrew coverage; "Tal's prototypes") · `tech-eval:20` (solo-dev maintenance budget) | The dangerous class. A name is *visibly* wrong; a baked-in threat model reads as **calibration guidance** and silently under-rates severity in a project where the asset value is not low. |

**Fix.** This is a decision, not a cleanup — it wants an ADR (M5's, distinct
from ADR 0013, which asks where the *app* lives; this asks what the *workshop*
exports). Candidate directions:

- **(A) Parameterize in place.** Give each capability skill a project-profile
  header — owner/escalation target, asset-value tier for security calibration,
  script/RTL requirements, team size — with the generic method below it, and
  ship placeholders in the plugin. The seam already exists and is already
  specified: `prompt-craft:27` prescribes "a PROJECT PARAMETERS block at the
  top (T://bendet specifics — swapped per project)," and every mission skill
  carries one. This applies the existing pattern to the other half.
- **(B) One profile file.** A single `docs/PROJECT-PROFILE.md` that skills
  point at. No drift across eight files, but it costs an indirection at exactly
  the moment a skill needs the value — and skills that read cleanly
  top-to-bottom get followed more reliably under context pressure.
- **(C) Reclassify `brand-voice`.** Split the thin reusable method from the
  thick project brand book, or accept it as a project artifact and drop it from
  the plugin set. Cheapest honest resolution of the middle row.
- **(D) Don't ship a plugin.** `docs/HANDBOOK.md` §1 says the machinery is
  "deliberately part of the portfolio's story." A workshop visibly built *for
  this project* is arguably the better portfolio artifact; extraction only pays
  if reuse or publication is genuinely intended. Rejecting extraction is a
  legitimate outcome — but then §5's plugin claim should be reworded.

**Honest tradeoff.** Parameterizing has a real cost. "Escalate to Tal" is more
actionable than "escalate to the project owner defined in your profile."
Abstraction is how skills become vague, and vague skills get ignored under
context pressure — the exact failure mode the hook layer exists to compensate
for. Do not extract on principle; extract only if (D) is actually rejected.

**Sequencing note.** Nothing here can be acted on now: M5 is the only mission
licensed to modify `.claude/`, and `protect-workshop.ts` blocks the writes
mechanically. Recorded here so M5 inherits the finding instead of
rediscovering it. Note also that M6 runs `security-review` in **design mode**
against this very blueprint — so `security-review:27`'s "low-value target"
line is load-bearing for *this* project's threat model too, not only for
hypothetical plugin consumers. Sanitizing it is not free.

**Effort:** the ADR is one session of judgment; the mechanical edits are
perhaps an hour, but only in M5, and only for whichever direction wins.

---

## 7. Bind diagrams to the handbook by id, not by array position

*(Added 2026-07-21, from reading the handbook.)*

**Problem.** `scripts/sync-docs.ts` pairs each ` ```mermaid ` block in
`docs/HANDBOOK.md` with a file in `docs/diagrams/` **positionally**:

```ts
for (const [i, name] of DIAGRAM_NAMES.entries()) {
  if (readFileSync(join(DIAGRAMS_DIR, `${name}.mmd`)) !== blocks[i]) …
```

`DIAGRAM_NAMES` (`sync-docs.ts:29`) is a hardcoded array; index `i` binds to
the `i`-th mermaid block in document order. The handbook blocks carry **no
identifier at all** — no anchor, no `%%` comment, no heading capture. Nothing
connects the string `"adr-lifecycle"` to the `stateDiagram-v2` block except
that both happen to be third. The filenames are labels that exist only inside
the script; the handbook has never heard of them.

So the invariant actually enforced is *"the bytes at index i match the file
named `DIAGRAM_NAMES[i]`"* — **not** *"each file's name describes its
contents."* Two consequences:

- **Insert or delete a diagram** → count mismatch → `check()` fails loudly and
  `ack()` refuses outright. Safe, because it's caught mechanically.
- **Reorder two sections in the handbook** → `check()` reports
  `adr-lifecycle.mmd differs from its handbook block — run ack (handbook is
  the source)`. You run `ack`, as instructed. It faithfully writes the
  *mission-run* diagram into `adr-lifecycle.mmd`. The check then passes, the
  filenames lie permanently, and nothing will ever notice — the enforced
  invariant is still true. **Silent mislabeling, with the tool's own
  remediation message as the trigger.**

Worst case is live in the current file: blocks 1 and 3 (`file-relations`,
`mission-run`) are both `flowchart TB`, so even a diagram-type sanity check
would not distinguish them if they swapped.

**Fix.** Put the identity in the source, as a mermaid comment (renders as
nothing) on the first line of each block:

```
%% id: adr-lifecycle
stateDiagram-v2
```

Then match by parsed id instead of index. Diagram order in the handbook
becomes free; missing, duplicate, or unknown ids become loud errors; and
`DIAGRAM_NAMES` stops being a positional contract that is invisible from the
handbook side. Keep the existing count check as a backstop.

**Note.** This *strengthens* an existing check rather than adding machinery
surface, so it clears the bar set in "Deliberately rejected" for the same
reason items 2–3 do — it verifies what already exists. It is also a plain
correctness fix with no real counter-argument, which is why it carries no
tradeoff section (unlike #6).

**Effort:** ~10 lines in `sync-docs.ts` + 5 one-line comment insertions in
the handbook + one `ack`. But `scripts/` is under `protect-workshop`, so it
lands in **Mission 5's** license.

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
| During /m5 | #6 (plugin boundary — M5 owns `.claude/`; decide before packaging), #7 (diagram ids — same license) |

Note: implementing #2–#4 touches the machinery surface — the docs-sync hook
will (correctly) demand a HANDBOOK update + `node scripts/sync-docs.ts ack`,
and #4's skill edits must keep the linter green. The machinery policing your
improvements to it is the system working.
