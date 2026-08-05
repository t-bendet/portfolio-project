// The RTL stage (specs/ci-obligations.md §4, assertions in
// specs/content-model.md §5).
//
// It runs against the site as Caddy serves it — the real deploy/Caddyfile over
// a fixture build — not against `astro preview`, because two of the assertions
// are about HTTP status codes that only the error handler produces. See
// web/tests/e2e/README-less note in rtl.spec.ts for the serving topology.
//
// Everything here that looks fussy is in service of one property: a screenshot
// baseline that is byte-identical on CI and on a laptop. That is why the
// suite runs inside the pinned Playwright container, one worker, fixed
// viewport, motion reduced, animations disabled.
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',

  // Baselines are checked in next to the spec that owns them.
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',

  forbidOnly: !!process.env.CI,
  retries: 0,
  // Screenshots are the reason: parallel workers share a machine, and a
  // rendering test that sometimes shares a CPU is a rendering test that
  // sometimes fails.
  workers: 1,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],

  use: {
    // The Caddy container's name on the e2e docker network. Overridable for a
    // one-off run against something else.
    baseURL: process.env.E2E_BASE_URL ?? 'http://web',
    // prefers-reduced-motion: reduce. It lives under contextOptions rather
    // than beside viewport — the flat option was never part of the test
    // options type.
    contextOptions: { reducedMotion: 'reduce' },
    trace: 'retain-on-failure',
  },

  expect: {
    toHaveScreenshot: { animations: 'disabled', caret: 'hide' },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } },
    },
  ],
});
