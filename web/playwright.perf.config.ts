// ci-obligations.md §10's idle-cost check. Its own config, not tests/e2e/'s.
//
// §4's config carries the screenshot baseline machinery — snapshotPathTemplate,
// the toHaveScreenshot defaults — that this has no use for, and putting these
// assertions under it would make a §10 failure report as an RTL failure. The
// obligation numbers are identifiers, cited from workflow step names; a stage
// that reports under someone else's number is the silent gap the list exists to
// prevent.
//
// Deliberately no reducedMotion override. tests/e2e/ reduces motion so the
// baseline is still; the question here is what a default visitor's page does
// when left alone, and a page that only sits quiet under reduced motion is not
// sitting quiet.
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // testMatch defaults to *.spec.ts, so lighthouse.ts and pages.ts in the same
  // directory are not collected as tests.
  testDir: './tests/perf',
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://web',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
