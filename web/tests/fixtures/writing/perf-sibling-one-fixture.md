---
# TEST FIXTURE — not content, never published. See perf-article-fixture.md for
# what the corpus is for (ci-obligations.md §10). This one is deliberately
# SHORT and carries only two h2s, one below the in-page contents threshold
# (>= 3 sections, writing/[id].astro), so that a route without a contents
# column is measured alongside one with it. It also exists to give
# perf-article-fixture.md the two siblings its end matter needs and the home
# page the three recent entries its column is built for.
title: 'The check that only fails on Fridays'
description: 'A flake with a calendar, and the one line of the report that gave it away.'
pubDate: 2026-07-29
tags: ['ci']
---

The suite went red on a Friday, green on a Monday, and red again the following
Friday. Three data points is not a pattern, but it is enough to stop guessing
and go and read the report properly.

## What the report actually said

The failing assertion compared a formatted date against one built in the test.
Both were correct. They disagreed anyway, because one of them was rendered in
the runner's locale and the other in the one the fixture assumed, and the two
formats only differ when the day of the month is a single digit.

That is not a Friday problem. It is a *first-of-the-month* problem, and the
three Fridays were coincidence — the kind that costs an hour precisely because
the false pattern is so much more memorable than the true one.

## Where the fix went

Not in the assertion. The assertion was fine. The defect was a formatter with
an implicit locale, so the locale became explicit at the one place it is
chosen, and the test now fails on every day of every month if that ever stops
being true.
