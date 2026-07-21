---
name: prompt-craft
description: The template and rules for writing mission prompts and any high-stakes agent prompt in this project. Use when authoring or revising mission skills or delegation prompts.
---

# Prompt Craft

**Project parameters** (ADR 0029) — `escalation target: Tal`. The proper noun
below is this binding, not part of the method; packaging substitutes it.

## Mission prompt template (every mission skill follows this)
1. **Role** — which specialist agent(s), what expertise register
2. **Memory block** — carry-forward: closed ADR ids + one-line summaries,
   binding invariants. Prevents contradicting settled decisions.
3. **Starting state** — what exists in the repo when this mission begins
4. **Input manifest** — exact paths this mission MAY read. References, not
   copies. Reading outside the manifest = scope violation.
5. **Target state / output contract** — exact files that must exist in
   outputs/ at closure, plus ADR writes/flips this mission is licensed to make
6. **Scope boundaries** — do-not-touch list (hooks enforce part of it;
   state the rest)
7. **Stop conditions** — done when the contract is met AND red-team verdict is
   APPROVED. Max 3 revision cycles, then escalate to Tal (mission-protocol).
8. **Checkpoints** — report after each major deliverable, not only at the end

## Portability discipline (for the future plugin)
Each mission skill separates:
- the REUSABLE PATTERN (how to run this type of mission — travels to future
  projects), and
- a PROJECT PARAMETERS block at the top (T://bendet specifics — swapped per
  project)

## Style rules
- Every word load-bearing; strip anything that doesn't change the output
- Vague adjectives → concrete criteria
- One task per prompt; sequenced prompts over compound ones
- Provenance note: agentic patterns adapted from
  https://github.com/nidhinjs/prompt-master (starting/target state, stop
  conditions, scope boundaries, memory block)
