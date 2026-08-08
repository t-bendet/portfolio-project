---
# TEST FIXTURE — not content, not a draft, never published.
# It exists so ci-obligations.md §10 has a /writing/[id]/ route to measure
# against performance-budgets.md §3/§5, the way rtl-fixture.md gives §4 a
# translated article to assert against. web/tests/install-fixtures.ts copies it
# into src/content/writing/ for the perf and e2e builds and deletes it
# afterwards; the copy is gitignored and dockerignored.
#
# The prose is synthetic and written to be representative in SHAPE and LENGTH —
# five h2s so the in-page contents column renders, two code panels because the
# Shiki `css-variables` path is the heaviest markup the article template emits,
# a list, a blockquote, and enough body text that the page weight is a page
# weight rather than a chrome measurement. It is not awaiting Tal's review and
# must not be mistaken for one.
title: 'Why the migration ran twice'
description: 'A deploy that was safe to retry, right up until the retry was the thing that broke it.'
pubDate: 2026-08-04
updatedDate: 2026-08-07
tags: ['postgres', 'deploys']
---

The deploy failed on a Tuesday afternoon with a timeout, and the runbook said
what runbooks say: retry it. So it was retried, and the second attempt went
green in ninety seconds. The site came back. Nobody looked any closer for
eleven days, which is how long it took for the reporting job to notice that a
few hundred rows had two of something they should have had one of.

What follows is the whole shape of it, because the interesting part is not the
bug. The bug is small and slightly embarrassing. The interesting part is that
every individual decision in the chain was defensible, and the failure lived in
the gap between two of them — in an assumption that each side believed the
other was holding.

## The failure looked like a network blip

The pipeline runs migrations before it swaps the running container. That
ordering is deliberate: the new schema has to exist before any process that
expects it starts serving, and rolling the container first would put requests
against columns that were not there yet. So the sequence is migrate, health
check, swap, health check again.

The timeout came from the first step. The migration client opened a connection,
started work, and the step exceeded its wall clock while the statement was
still running. The step was killed. From the pipeline's point of view this is
indistinguishable from the database being unreachable, and the log said as
much — a client-side deadline, no server-side error, nothing in the Postgres
log except a connection that went away.

Here is the part that matters and that the log could not say: **the statement
did not stop.** Killing a client does not kill the query it started. The
backend kept going, finished the work, and committed. By the time the retry ran
a minute later, the first attempt had already succeeded — silently, from the
outside, after the process that started it was gone.

> A cancelled client and a cancelled transaction are different events. Almost
> every timeout story I have chased eventually turns out to be a place where
> someone treated them as the same one.

The retry then ran the same migration against a schema that had already been
changed. And that is the moment where "idempotent" was supposed to save us.

## What "idempotent" was doing in that sentence

Every migration in the tree carried a comment saying it was safe to re-run, and
most of them were telling the truth. The schema changes used the guarded forms,
and those really are re-runnable:

```sql
-- Safe on a second pass: the guard is the point.
alter table article
  add column if not exists reading_minutes integer;

create index concurrently if not exists article_published_idx
  on article (published_at desc)
  where draft = false;
```

The trouble is that the file did not stop at schema. It also carried a
backfill — the statement that gives the new column its values for rows that
already existed. That is normal practice and there is nothing wrong with it in
principle. It was written like this:

```sql
insert into article_metric (article_id, kind, value)
select id, 'reading_minutes', ceil(word_count / 220.0)
from article
where word_count is not null;
```

No guard. No conflict target. Nothing about this statement notices that it has
run before, because nothing about it was ever asked to. And when it ran the
second time it did exactly what it says: it inserted a second row for every
article that already had one.

So the file was idempotent in the half of itself that people look at, and not
in the half that actually writes data. The comment at the top was not a lie
when it was written. It became one when the backfill was appended six weeks
later by someone who read the comment as a description of the file rather than
as a claim they had just inherited responsibility for.

This is the general form, and it is worth stating plainly because it is not
specific to migrations:

- A property asserted in a comment is checked by nobody.
- A property asserted by a constraint is checked by everybody, forever, for
  free.
- The distance between those two is the entire cost of the incident.

A unique constraint on `(article_id, kind)` would have turned this from eleven
quiet days into one loud, immediate, correct failure at 14:02 on the Tuesday.
The retry would have gone red. Somebody would have read the error. The whole
thing would have been a twenty-minute detour.

## The lock that was already there

What makes this properly annoying is that the protection existed and was doing
its job — just one layer away from where it was needed.

The migration tool takes an advisory lock before it runs anything, precisely so
two deploys cannot migrate at once. It is a good mechanism and it was working
correctly the entire time:

```ts
// Serialise migrators, so two concurrent deploys cannot interleave.
const LOCK = 0x6d_69_67_72;

export async function withMigrationLock<T>(
  db: Client,
  run: () => Promise<T>,
): Promise<T> {
  await db.query('select pg_advisory_lock($1)', [LOCK]);
  try {
    return await run();
  } finally {
    await db.query('select pg_advisory_unlock($1)', [LOCK]);
  }
}
```

Read what that guarantees, and then read what it does not. It guarantees that
two migrators do not run *simultaneously*. It says nothing whatsoever about a
migrator running twice in *sequence*, which is the entire scenario here — the
first attempt had finished and released the lock before the retry asked for it.
The retry took the lock cleanly, on the first try, with no contention at all.
The mechanism reported success because it succeeded.

There is a second, quieter detail. The advisory lock is held on a session, and
the first attempt's session was gone the moment its client was killed, so
Postgres released the lock automatically. That is the correct behaviour and you
would not want any other. But it means the lock's lifetime was tied to a
process the pipeline had already given up on, while the *work* that process
started was tied to nothing at all and ran happily to completion.

Two things people say about this that are both wrong:

1. "The lock should have been held longer." It could not have been. The session
   ended. And a lock that outlives its session is a lock that strands the next
   deploy behind a process nobody can find.
2. "The pipeline should not retry." It should. Retrying a deploy step is
   correct and it will keep happening. The retry is not the defect; the defect
   is a statement that could not tolerate one.

## Reading the plan instead of the code

The last thing worth pulling out is why the timeout happened at all, because it
was not load and it was not a slow disk.

The backfill's `select` scanned the whole table. That is fine at ten thousand
rows and it is fine at a hundred thousand. It stopped being fine somewhere
around two million, and nobody noticed the crossing because the statement's
text never changed — only the number of rows underneath it did. The query was
identical on the day it was fast and on the day it timed out.

The tool for this is not code review, it is `explain`, and specifically
`explain` run against something the size of production rather than the size of
a development database. A sequential scan over a table with two million rows is
not a bug; it is a fact, and a fact you can read in about four seconds:

```sql
explain (analyze, buffers)
select id, ceil(word_count / 220.0)
from article
where word_count is not null;
```

If that had been run once, at any point, the estimate would have been sitting
right there in the output, in the same units as the pipeline's timeout, and the
conversation would have happened before the deploy rather than eleven days
after it. The cost of looking was four seconds. The cost of not looking was two
people for most of an afternoon plus a data repair.

I do not think the lesson is "always run explain", which is the kind of rule
that gets written on a wiki page and then ignored, because it costs attention
every time and pays off rarely. The lesson is narrower and easier to actually
follow: **a statement that touches every row of a growing table is a statement
whose cost changes without its text changing.** Those are worth a look. Almost
nothing else is.

## What changed, and what did not

Three changes, in descending order of how much they mattered.

The unique constraint went on first, before anything else, because it is the
one that converts a silent wrong answer into a loud stop. It also had to be
added *after* the duplicate rows were repaired, which meant the repair was
written and reviewed under exactly the pressure that produces second incidents
— worth saying out loud, because "add the constraint later, once the data is
clean" is how a table stays without one for two years.

Second, the backfill moved out of the migration entirely. Schema changes and
data changes have genuinely different properties: schema changes are small,
fast, guarded, and safe to re-run, and data changes are none of those four. The
backfill is now a separate job that records what it has processed, can be
stopped and resumed, and works in batches rather than one transaction the size
of the table. It is more code. It is worth it.

Third, and smallest: the migration step's timeout was raised. This is the
change that feels like the fix and is the least important of the three. A
larger number would have made this particular Tuesday uneventful and would have
done nothing at all about the shape of the problem, which was a statement that
could not survive being run twice. If the other two changes had landed and this
one had not, the incident does not happen. The reverse is not true.

What did not change: the pipeline still retries, the advisory lock still works
the way it always did, and the runbook still says retry it. Those were never
the problem, and rewriting them would have been the kind of activity that
feels like a response.
