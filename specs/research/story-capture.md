# Story capture — Phase 2

Raw material for future writing (IMPROVEMENTS.md #5). One entry per moment
worth retelling; unpolished on purpose. The workshop-to-build transition is
itself writing material.

---

## 2026-07-22 — the first Phase 2 work item was deleting the workshop's own scaffolding

The blueprint gate closed with one HIGH finding, and it wasn't in the
blueprint — it was a cleanup TODO that quietly contradicted two active
decisions. The fix was the process working as designed: the contradiction
couldn't be executed until it was arbitrated (gate condition G-1), the
arbitration became three ADRs (0030–0032), and only then did the deletions
run.

Details worth keeping:

- The system caught its own author. The TODO was written the same day M5
  closed, outside any mission — and the coherence pass treated it exactly
  like any other document contradicting the record.
- "Retirement = file stays for provenance" lost to "provenance = git
  history + one findable log" once the cost was named correctly: six
  descriptions injected into every session forever, versus one hop to
  `docs/EVOLUTION.md`.
- The colophon question inverted the frame. The planned machinery (a
  staleness fingerprint) existed to defend a living page that tracked the
  current stack. Tal's call: the page's job is the *road* to production and
  the major decisions — append-only claims that can't go stale — so the
  enforcement wasn't replaced, its reason to exist was removed.
- The enforcement layer's own edit rule held during its own simplification:
  the session drafted replacements in a scratchpad; Tal reviewed and copied
  them in by hand. The checker was never edited by the checked, even while
  the checker was the thing being changed.
- Mid-cleanup, the still-installed docs-sync hook fired on every edit,
  complaining that its own diagrams were missing — machinery protesting its
  own funeral, and a live demonstration of why deletion order matters.
