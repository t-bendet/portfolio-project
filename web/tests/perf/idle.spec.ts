// ci-obligations.md §10 item 3 — performance-budgets.md §3's idle assertions.
//
//   "zero timers, zero polling, zero long tasks at idle on every route; the
//    keydown buffer and theme transition must be unmeasurable when not in use."
//
// Read that carefully, because it is not "the code contains no timers". The
// theme transition legitimately starts exactly one setTimeout when it runs. So
// the instrumentation tracks what is *pending*, not what was ever scheduled —
// a wrapped callback removes its own id when it fires — and the last test in
// this file toggles the theme and asserts the instrumentation can see that
// timer. Without it the assertions above are a tautology the day addInitScript
// ordering breaks, and they would pass loudest exactly when they had stopped
// measuring anything.
import { expect, test } from '@playwright/test';

import { IDLE_PAGES } from './pages.ts';

// Long enough to catch a one-second poll two turns in.
const SETTLE = 3000;

interface Idle {
  timeouts: number[];
  intervals: number[];
  rafs: number[];
  // Monotonic: every timer ever scheduled, including the ones that have already
  // fired and left `timeouts`. The pending set answers "is the page quiet"; this
  // answers "would we notice if it were not", and unlike the pending set it
  // cannot be raced by a 600 ms timer that elapses while an assertion round-trips.
  scheduled: number;
  longTasks: { name: string; start: number; duration: number }[];
  loadEnd: number;
}

async function instrument(page: import('@playwright/test').Page): Promise<void> {
  await page.addInitScript(() => {
    const w = window as unknown as { __idle: Record<string, unknown> };
    const timeouts = new Set<number>();
    const intervals = new Set<number>();
    const rafs = new Set<number>();
    const longTasks: unknown[] = [];
    const counter = { scheduled: 0 };
    w.__idle = { timeouts, intervals, rafs, longTasks, counter };

    const nativeSetTimeout = window.setTimeout;
    const nativeClearTimeout = window.clearTimeout;
    const nativeSetInterval = window.setInterval;
    const nativeClearInterval = window.clearInterval;
    const nativeRaf = window.requestAnimationFrame;
    const nativeCancelRaf = window.cancelAnimationFrame;

    window.setTimeout = ((fn: TimerHandler, ms?: number, ...args: unknown[]) => {
      const id = nativeSetTimeout(function (this: unknown) {
        timeouts.delete(id);
        if (typeof fn === 'function') fn.apply(this, args);
      }, ms);
      timeouts.add(id);
      counter.scheduled++;
      return id;
    }) as typeof window.setTimeout;
    window.clearTimeout = ((id?: number) => {
      if (id !== undefined) timeouts.delete(id);
      nativeClearTimeout(id);
    }) as typeof window.clearTimeout;

    // An interval is never removed by firing — that is the whole point of one.
    window.setInterval = ((fn: TimerHandler, ms?: number, ...args: unknown[]) => {
      const id = nativeSetInterval(fn, ms, ...args);
      intervals.add(id);
      counter.scheduled++;
      return id;
    }) as typeof window.setInterval;
    window.clearInterval = ((id?: number) => {
      if (id !== undefined) intervals.delete(id);
      nativeClearInterval(id);
    }) as typeof window.clearInterval;

    window.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      const id = nativeRaf((t) => {
        rafs.delete(id);
        cb(t);
      });
      rafs.add(id);
      return id;
    }) as typeof window.requestAnimationFrame;
    window.cancelAnimationFrame = ((id: number) => {
      rafs.delete(id);
      nativeCancelRaf(id);
    }) as typeof window.cancelAnimationFrame;

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        longTasks.push({ name: entry.name, start: entry.startTime, duration: entry.duration });
      }
    }).observe({ type: 'longtask', buffered: true });
  });
}

async function read(page: import('@playwright/test').Page): Promise<Idle> {
  return page.evaluate(() => {
    const w = window as unknown as { __idle: Record<string, unknown> };
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      timeouts: [...(w.__idle.timeouts as Set<number>)],
      intervals: [...(w.__idle.intervals as Set<number>)],
      rafs: [...(w.__idle.rafs as Set<number>)],
      scheduled: (w.__idle.counter as { scheduled: number }).scheduled,
      longTasks: w.__idle.longTasks as Idle['longTasks'],
      loadEnd: nav.loadEventEnd,
    };
  });
}

for (const path of IDLE_PAGES) {
  test(`${path} costs nothing at idle`, async ({ page }) => {
    await instrument(page);
    await page.goto(path, { waitUntil: 'load' });
    await page.waitForTimeout(SETTLE);
    const idle = await read(page);

    expect(idle.intervals, 'zero polling (§3)').toEqual([]);
    expect(idle.timeouts, 'zero timers pending at idle (§3)').toEqual([]);
    expect(idle.rafs, 'no animation frame pending at idle (§3)').toEqual([]);

    // "At idle", not "ever": parsing and evaluating the page before load are
    // work the visitor asked for. Only what happens after load is idle cost.
    const afterLoad = idle.longTasks.filter((task) => task.start >= idle.loadEnd);
    expect(afterLoad, 'zero long tasks at idle (§3)').toEqual([]);
  });
}

test('the instrumentation can see the one timer the theme transition starts', async ({ page }) => {
  await instrument(page);
  await page.goto('/', { waitUntil: 'load' });
  await page.waitForTimeout(SETTLE);

  const before = await read(page);
  expect(before.timeouts, 'nothing pending before the trigger').toEqual([]);

  await page.keyboard.type('i solemnly swear that i am up to no good');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'warm');

  // Counted, not caught in the act. The transition's timer is --motion-theme
  // long — 600 ms — and asserting on the pending set here is a race against it
  // that the assertion round-trip can lose. What matters is that the wrappers
  // are in place and observing: if this comes back 0, the four assertions above
  // are measuring nothing and passing anyway, which is the failure this test
  // exists to catch.
  const after = await read(page);
  expect(after.scheduled - before.scheduled, 'the transition schedules exactly one timer').toBe(1);

  // And the page goes quiet again on its own.
  await expect.poll(async () => (await read(page)).timeouts, { timeout: 5000 }).toEqual([]);
});
