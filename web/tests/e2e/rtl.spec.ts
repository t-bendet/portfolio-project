// ci-obligations.md §4 — the RTL stage. Five assertions from
// content-model.md §5, plus the real 404 statuses §4 attaches to this stage
// "once the Caddy image is in the loop".
//
// Serving topology: `caddy:2.11.4` runs with the real deploy/Caddyfile and the
// fixture build at /srv, named `web` on a docker network the Playwright
// container joins. Nothing here is a stand-in — the file under test for the
// last two assertions *is* the production config.
//
// The route under test is the fixture translation
// (web/tests/fixtures/translations/rtl-fixture.md), installed into the
// collection for this build only. The constants below come from its
// frontmatter; if the fixture is edited, they move together.
import { expect, test } from '@playwright/test';

const FIXTURE = '/he/writing/rtl-fixture/';
const ORIGINAL_URL = 'https://example.com/articles/the-cache-layer-nobody-looks-at';
const ORIGINAL_AUTHOR = 'A. Fixture';

test.describe('translated article under dir="rtl"', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(FIXTURE);
  });

  // §5.1 — direction has one source of truth, and this is where it surfaces.
  test('renders html[lang="he"][dir="rtl"]', async ({ page }) => {
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'he');
    await expect(html).toHaveAttribute('dir', 'rtl');
  });

  // §5.2 — the assertion that is a licence condition rather than good
  // practice. All three parts, and the third is position, not presence.
  test('credit states the translation, names the author, links the original — above the body', async ({
    page,
  }) => {
    const credit = page.locator('article.article-body > .credit');
    await expect(credit).toHaveCount(1);

    // (a) it says this is a translation, in Hebrew, in plain words
    await expect(credit).toContainText('תרגום');
    // (b) author named and original linked
    await expect(credit).toContainText(ORIGINAL_AUTHOR);
    await expect(credit.locator(`a[href="${ORIGINAL_URL}"]`)).toHaveCount(1);

    // (c) before the first element of the article content. Checked twice: the
    // credit is the body's first element child, and it precedes the first
    // heading of the prose in document order. The second check survives a
    // template that one day wraps the body.
    const isFirstChild = await page
      .locator('article.article-body')
      .evaluate((body) => body.firstElementChild?.classList.contains('credit') ?? false);
    expect(isFirstChild).toBe(true);

    const creditPrecedesProse = await page.evaluate(() => {
      const creditEl = document.querySelector('article.article-body .credit');
      const firstHeading = document.querySelector('article.article-body h2');
      if (!creditEl || !firstHeading) return false;
      // Node.DOCUMENT_POSITION_FOLLOWING — the heading comes after the credit.
      return (creditEl.compareDocumentPosition(firstHeading) & 4) !== 0;
    });
    expect(creditPrecedesProse).toBe(true);
  });

  // §5.3 — code is notation, not prose (typography.md §7.1). Computed, not the
  // attribute: the rule lives in global.css and an attribute check would pass
  // on a page where the stylesheet never loaded.
  test('every pre/code resolves to direction ltr', async ({ page }) => {
    const directions = await page
      .locator('pre, code')
      .evaluateAll((els) => els.map((el) => getComputedStyle(el).direction));

    expect(directions.length).toBeGreaterThan(0);
    expect(directions).toEqual(directions.map(() => 'ltr'));
  });

  // §5.4
  test('matches the RTL screenshot baseline', async ({ page }) => {
    await expect(page).toHaveScreenshot('rtl-fixture.png', { fullPage: true });
  });

  // §5.5 — the single most common way an LTR-designed layout fails under rtl.
  for (const width of [360, 768, 1280]) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(FIXTURE);

      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return Math.max(doc.scrollWidth - doc.clientWidth, document.body.scrollWidth - doc.clientWidth);
      });
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});

// ci-obligations.md §4's last line. The Caddyfile claims a real 404 status for
// both subtrees; nothing has ever checked it. A missing path is what asks the
// question — requesting /404 itself would exercise the file server, not the
// error handler.
test.describe('404 statuses, from the real Caddyfile', () => {
  test('an unknown path returns a real 404 with the English page', async ({ request }) => {
    const response = await request.get('/nothing-resolves-here/');
    expect(response.status()).toBe(404);
    expect(await response.text()).toContain('This address does not resolve to anything.');
  });

  test('an unknown path under /he/ returns a real 404 with the Hebrew page', async ({
    request,
  }) => {
    const response = await request.get('/he/nothing-resolves-here/');
    expect(response.status()).toBe(404);

    const body = await response.text();
    expect(body).toContain('אין עמוד בכתובת הזו.');
    expect(body).toContain('dir="rtl"');
  });
});
