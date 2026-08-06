// The theme mechanism — the trigger in Base.astro's inline script.
//
// Why this file may write the incantations out in full: every ban in the specs
// is scoped to *shipped output* or to site content. brand.md §2's test is "no
// UI element, copy, tooltip, or doc page references the switch"; tokens.md §1
// governs shipped selectors, properties, attribute values, storage keys,
// comments and asset names; banned-vocab.ts hardcodes `web/dist` and its own
// header forbids pointing it anywhere else. web/tests/ is built into nothing
// and served to nobody. brand.md §2 itself carries both phrases in plaintext.
// Repo-visible is not acknowledgment — that is the same line brand.md §3 draws
// for the mythology names. Do not "fix" this file by hiding the phrases.
//
// Deliberately takes no screenshots. rtl.spec.ts owns the one checked-in
// baseline and this file must have zero surface against it.
import { expect, test } from '@playwright/test';

declare global {
  interface Window {
    /** Set by the observer in the 600ms test; nothing shipped reads it. */
    __swapSeen?: boolean;
  }
}

const ON = 'i solemnly swear that i am up to no good';
const OFF = 'mischief managed';

const LOG_ON = 'Messrs Moony, Wormtail, Padfoot & Prongs are proud to present';
const LOG_OFF = 'Mischief managed.';

/** The attribute is absent in the default temperature — there is no 'dark'. */
const theme = (page: import('@playwright/test').Page) =>
  page.evaluate(() => document.documentElement.getAttribute('data-theme'));

const stored = (page: import('@playwright/test').Page) =>
  page.evaluate(() => localStorage.getItem('theme'));

/**
 * Reads the declared swap duration with the class applied by hand rather than
 * by the toggle. The toggle removes the class one --motion-theme later, so
 * reading it during a real swap would be a race; the rule under test is the
 * CSS contract, which does not care who added the class.
 */
const declaredDuration = (page: import('@playwright/test').Page) =>
  page.evaluate(() => {
    const root = document.documentElement;
    root.classList.add('theme-transition');
    const duration = getComputedStyle(root).transitionDuration;
    root.classList.remove('theme-transition');
    return duration;
  });

// Playwright gives each test a fresh context and no storageState is
// configured, so storage cannot reach rtl.spec.ts. This is the second belt.
test.afterEach(async ({ page }) => {
  await page.evaluate(() => localStorage.clear());
});

test.describe('the theme trigger', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('the phrase switches the temperature, persists it, and swaps the fonts', async ({
    page,
  }) => {
    expect(await theme(page)).toBeNull();

    await page.keyboard.type(ON);

    expect(await theme(page)).toBe('warm');
    expect(await stored(page)).toBe('warm');

    // The whole chain in one assertion: attribute -> tokens.css block ->
    // global.css font bridge -> Astro's hashed family name.
    const family = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(family).toMatch(/Fraunces/);
  });

  test('the second phrase reverts, and leaves the origin as it was found', async ({ page }) => {
    await page.keyboard.type(ON);
    expect(await theme(page)).toBe('warm');

    await page.keyboard.type(OFF);

    // Absence, not a 'dark' value, in both places (tokens.md §2).
    expect(await theme(page)).toBeNull();
    expect(await stored(page)).toBeNull();
  });

  test('a tail window: noise before the phrase does not spoil it', async ({ page }) => {
    await page.keyboard.type('zzz not the phrase at all ');
    await page.keyboard.type(ON);

    expect(await theme(page)).toBe('warm');
  });

  test('a wrong keystroke inside the phrase does not switch', async ({ page }) => {
    await page.keyboard.type('i solemnly swear that i am up to no goob');

    expect(await theme(page)).toBeNull();
    expect(await stored(page)).toBeNull();
  });

  test('the temperature survives a navigation', async ({ page }) => {
    await page.keyboard.type(ON);
    await page.goto('/about/');

    // Set before first paint by the head script, from storage.
    expect(await theme(page)).toBe('warm');
  });

  test('it works on a Hebrew route', async ({ page }) => {
    await page.goto('/he/writing/');
    await page.keyboard.type(ON);

    expect(await theme(page)).toBe('warm');
    const family = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(family).toMatch(/Fraunces/);
  });

  // SR-23. The public IA has no form fields today; the requirement is that the
  // listener stay harmless by construction if one ever appears.
  test('typing the phrase into an input field does nothing', async ({ page }) => {
    await page.evaluate(() => {
      const field = document.createElement('input');
      field.id = 'sr23-probe';
      document.body.appendChild(field);
      field.focus();
    });

    await page.keyboard.type(ON);

    expect(await theme(page)).toBeNull();
    expect(await stored(page)).toBeNull();

    await page.evaluate(() => document.getElementById('sr23-probe')?.remove());
  });

  // brand.md §2: "Console log on toggle. Nothing else." Typing the forward
  // phrase while already warm is not a toggle, so it must not log either.
  test('logs exactly once per toggle, and not for a non-event', async ({ page }) => {
    const lines: string[] = [];
    page.on('console', (message) => lines.push(message.text()));

    await page.keyboard.type(ON);
    await page.keyboard.type(ON);
    expect(lines).toEqual([LOG_ON]);

    await page.keyboard.type(OFF);
    expect(lines).toEqual([LOG_ON, LOG_OFF]);
  });

  // hero-and-motion.md §5 M3 — the theme *change* is the payoff, not the
  // crossfade. This is the config's default context, so reduced motion is on.
  test('the swap is instant under reduced motion', async ({ page }) => {
    expect(await declaredDuration(page)).toBe('0s');
  });

  test('otherwise the swap is 600ms, and the class is cleaned up after it', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });

    // The declared value, never observed pixel timing — that is how this test
    // would become flaky on a shared CI runner.
    expect(await declaredDuration(page)).toContain('0.6s');

    // The class lives for 600ms, which is shorter than typing 40 characters
    // over the wire and then polling for it — asking after the fact is a race
    // that loses on a loaded runner. An observer installed first cannot miss
    // it however long the round trip takes.
    await page.evaluate(() => {
      window.__swapSeen = false;
      const root = document.documentElement;
      new MutationObserver(() => {
        if (root.classList.contains('theme-transition')) window.__swapSeen = true;
      }).observe(root, { attributes: true, attributeFilter: ['class'] });
    });

    await page.keyboard.type(ON);

    expect(await page.evaluate(() => window.__swapSeen)).toBe(true);
    // Removal is an "eventually", so polling is the right tool here.
    await expect(page.locator('html')).not.toHaveClass(/theme-transition/, { timeout: 2000 });
  });
});
