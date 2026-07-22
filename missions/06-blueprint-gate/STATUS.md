---
mission: m6
status: in-progress
depends-on: m5
opened: 2026-07-22
closed: null
revision-cycles: 0
---

# Status — Blueprint Gate

## Handoff notes

(filled at closure: what was decided, which ADRs were written/flipped,
what the next mission must know)

## ADR statuses observed at mission start (2026-07-22)

active: 0001, 0002, 0011, 0012, 0013, 0014, 0015, 0016, 0017, 0018, 0019
(narrowed-by 0023), 0020 (narrowed-by 0024), 0021, 0022, 0023, 0024, 0025,
0026, 0027, 0028, 0029 · superseded: 0003, 0004, 0005, 0006, 0007, 0008,
0009, 0010 · reopened: none · proposed: none. (21 active, 8 superseded.)

Gate check run before any work: M6 `depends-on: m5`; M5 STATUS reads `closed`
(2026-07-22, revision-cycles 1) and `missions/05-*/outputs/review-verdict.md`
frontmatter reads `verdict: APPROVED` (cycle 2). Verified by reading both
files. `node scripts/test-machinery.ts` run at open: 34 passed, 0 failed,
2 skipped.

## Inputs actually read

(recorded at closure: exact paths + ADR ids/statuses as of mission start)
