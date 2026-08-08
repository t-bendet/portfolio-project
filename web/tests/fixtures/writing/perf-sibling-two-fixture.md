---
# TEST FIXTURE — not content, never published. See perf-article-fixture.md
# (ci-obligations.md §10). Short, two h2s, below the contents threshold, for
# the same reasons as perf-sibling-one-fixture.md.
title: 'Deleting the abstraction'
description: 'Two call sites, one interface, and the six months it took to admit the shape was wrong.'
pubDate: 2026-07-16
tags: ['design']
---

The interface had two implementations. One was used everywhere. The other was
used once, in a test, to prove that two implementations were possible.

## The argument for keeping it

It was written honestly. A second backend was genuinely planned, the seam was
put in before it was needed rather than after, and everybody involved had been
burned by the opposite mistake — the wiring that turns out to be welded to one
concrete thing on the day you need to change it.

## Why it went anyway

The second backend was cancelled, and the seam stayed for six months after the
reason for it did. In that time it cost two confusing code reviews, one
misplaced bug fix that landed in the unused branch, and an afternoon of my life
spent tracing a call through a layer that only ever forwarded it.

The rule I would write down, if it were a rule and not a judgement, is that an
abstraction with one implementation is a bet on the future, and a bet you have
already lost is just a cost. Deleting it took forty minutes and removed more
lines than it added, which is the usual outcome and never stops being a small
surprise.
