// The routes ci-obligations.md §10 measures, resolved to concrete paths.
//
// performance-budgets.md §8 item 4 names them as route *types* — `/`,
// `/writing/[id]/`, `/he/writing/[id]/`, `/writing/` — and two of those render
// nowhere without the fixture corpus. These are the ids that corpus produces,
// so this list and web/tests/fixtures/ move together: rename a fixture and the
// stage fails on a 404 rather than quietly measuring three pages.
//
// scripts/perf-budgets.ts keeps the route *patterns* instead, because it is
// asking a different question — whether a budgeted route emitted anything at
// all — and a pattern is what §5's Routes column gives it.
export const PAGES = [
  '/',
  '/writing/',
  '/writing/perf-article-fixture/',
  '/he/writing/rtl-fixture/',
];

// §8 item 3: the idle assertions run on `/` and one article. Not all four —
// idle cost is a property of the scripts a page carries, and every page carries
// the same one; two pages is enough to catch a route-specific regression and
// cheap enough to keep the stage short.
export const IDLE_PAGES = ['/', '/writing/perf-article-fixture/'];
