// ci-obligations.md §10 — the browser half of the `perf` stage.
//
//   node web/tests/perf/lighthouse.ts     (from web/, inside the Playwright image)
//
// Run by web/tests/run-perf.sh, which serves the fixture build through the real
// deploy/Caddyfile and puts this on the same docker network. `lighthouse` is a
// devDependency of web/ and the browser comes from the pinned Playwright image,
// so this stage adds no action to allowlist and downloads no browser.
//
// LAUNCH: Playwright starts Chromium with a CDP port and Lighthouse attaches to
// it. `chrome-launcher` — Lighthouse's own default — is a transitive dependency
// and not resolvable from web/ under pnpm's strict layout, and going through
// Playwright means the questions of which binary, which headless flag and where
// PLAYWRIGHT_BROWSERS_PATH points are all already answered by the image.
//
// CONFIG: Lighthouse's defaults, deliberately unrestated. The default *is*
// mobile form factor, Slow-4G, throttlingMethod 'simulate' and a 4x CPU
// slowdown — §2's "lab, throttled mobile" exactly. Importing
// lighthouse/core/config/constants.js to say so again would duplicate internals
// that can change on a patch bump.
//
// SIMULATE, not 'devtools': devtools throttling makes every number a function
// of how contended the runner is at that moment, while Lantern runs the page
// once and computes the metrics from the trace's dependency graph. On a shared
// runner backing a required status context, run-to-run variance is the failure
// mode that kills a gate. Measured spread across 12 local runs: 4 ms of LCP.
//
// THRESHOLDS: parsed out of performance-budgets.md §2 rather than restated, the
// way scripts/contrast.ts parses palette.md §5. A row names its Lighthouse
// audit id in backticks to be measured, and its Enforced column decides whether
// a breach fails the build — so the table says which of its own rows are gates,
// and a row can be measured and printed without being one. CLS is exactly that
// today: `/` does not meet 0.02, the number was left where it is, and §2
// carries the reason and the condition for turning it back on.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import lighthouse from 'lighthouse';
import { chromium } from '@playwright/test';

import { PAGES } from './pages.ts';

const here = dirname(fileURLToPath(import.meta.url));
const SPEC = join(here, '..', '..', '..', 'specs', 'performance-budgets.md');
const REPORTS = join(here, '..', '..', 'test-results', 'lighthouse');

const BASE_URL = process.env.E2E_BASE_URL ?? 'http://web';
const CDP_PORT = 9222;
// Median of an odd number of runs. Lantern is deterministic enough locally that
// one would do; three is the insurance until CI has published its own spread.
const RUNS = Number.parseInt(process.env.PERF_RUNS ?? '3', 10);

// LCP, CLS and TBT are measured; LCP and TBT are enforced. A parser that
// silently matched fewer of either must not pass green.
const MIN_MEASURED = 3;
const MIN_ENFORCED = 2;

interface Threshold {
  audit: string;
  label: string;
  max: number;
  unit: string;
  enforced: boolean;
}

function readThresholds(): { thresholds: Threshold[]; minScore: number } {
  const md = readFileSync(SPEC, 'utf8');
  const start = md.indexOf('## 2. Core Web Vitals');
  if (start === -1) throw new Error(`${SPEC}: no §2`);
  const section = md.slice(start, md.indexOf('## 3.', start));

  const thresholds: Threshold[] = [];
  for (const line of section.split('\n')) {
    if (!line.trim().startsWith('|')) continue;
    const cells = line.trim().slice(1, -1).split('|').map((c) => c.trim());
    if (cells.length !== 4) continue;
    // A guardrail row names no audit, and is skipped here by structure rather
    // than by an allowlist that would have to be kept in step with the table.
    const audit = cells[0].match(/`([a-z-]+)`/)?.[1];
    if (!audit) continue;
    const budget = cells[1].match(/\*\*≤\s*([\d.]+)\s*(ms|s)?\*\*/);
    if (!budget) throw new Error(`${SPEC}: §2 row "${cells[0]}" has no "**≤ N**"`);
    const enforced = cells[2].toLowerCase();
    // Only these two spellings mean anything. Anything else is a row nobody
    // decided about, and guessing which way it goes is how a gate turns off by
    // typo.
    if (enforced !== 'yes' && !enforced.startsWith('not yet')) {
      throw new Error(`${SPEC}: §2 row "${cells[0]}" has Enforced "${cells[2]}" — expected "yes" or "not yet ..."`);
    }
    const value = Number.parseFloat(budget[1]);
    thresholds.push({
      audit,
      label: cells[0].replace(/\s*\(`[a-z-]+`\)/, ''),
      max: budget[2] === 's' ? value * 1000 : value,
      unit: budget[2] === 's' ? 'ms' : (budget[2] ?? ''),
      enforced: enforced === 'yes',
    });
  }
  const enforced = thresholds.filter((t) => t.enforced).length;
  if (thresholds.length < MIN_MEASURED || enforced < MIN_ENFORCED) {
    throw new Error(
      `${SPEC}: §2 parsed ${thresholds.length} measured rows and ${enforced} enforced ` +
        `(expected ${MIN_MEASURED}+ and ${MIN_ENFORCED}+)`,
    );
  }

  const score = section.match(/performance score gate:\s*\*\*≥\s*(\d+)\*\*/);
  if (!score) throw new Error(`${SPEC}: §2 states no Lighthouse score gate`);
  return { thresholds, minScore: Number.parseInt(score[1], 10) };
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[(sorted.length - 1) >> 1];
}

function fmt(value: number, unit: string): string {
  return unit === 'ms' ? `${value.toFixed(0)} ms` : value.toFixed(4);
}

async function main(): Promise<void> {
  const { thresholds, minScore } = readThresholds();
  mkdirSync(REPORTS, { recursive: true });

  // chromiumSandbox is off by default in Playwright, which is what supplies the
  // --no-sandbox the image needs as root; /dev/shm in a container is 64 MB.
  const browser = await chromium.launch({
    args: [`--remote-debugging-port=${CDP_PORT}`, '--disable-dev-shm-usage'],
  });

  const errors: string[] = [];
  const rows: string[][] = [];

  try {
    for (const path of PAGES) {
      const url = `${BASE_URL}${path}`;
      const scores: number[] = [];
      const samples = new Map<string, number[]>(thresholds.map((t) => [t.audit, []]));

      for (let run = 0; run < RUNS; run++) {
        const result = await lighthouse(url, {
          port: CDP_PORT,
          output: 'json',
          onlyCategories: ['performance'],
          logLevel: 'error',
        });
        if (!result) throw new Error(`${url}: lighthouse returned nothing`);
        const { lhr } = result;
        writeFileSync(
          join(REPORTS, `${path.replace(/\//g, '_') || '_'}${run}.json`),
          JSON.stringify(lhr, null, 2),
        );
        if (lhr.runtimeError) {
          errors.push(`${path} — lighthouse runtime error: ${lhr.runtimeError.message}`);
          break;
        }
        scores.push((lhr.categories.performance.score ?? 0) * 100);
        for (const t of thresholds) {
          const audit = lhr.audits[t.audit];
          if (!audit || typeof audit.numericValue !== 'number') {
            errors.push(`${path} — §2 names audit "${t.audit}", which this Lighthouse does not report`);
            continue;
          }
          samples.get(t.audit)!.push(audit.numericValue);
        }
      }
      if (scores.length === 0) continue;

      const score = median(scores);
      if (score < minScore) {
        errors.push(`${path} — performance score ${score.toFixed(0)} is below §2's ${minScore}`);
      }
      const cells = [path, score.toFixed(0)];
      for (const t of thresholds) {
        const values = samples.get(t.audit)!;
        const value = median(values);
        const spread = Math.max(...values) - Math.min(...values);
        if (value > t.max) {
          const breach =
            `${path} — ${t.label} ${fmt(value, t.unit)} exceeds §2's ${fmt(t.max, t.unit)} ` +
            `(${RUNS} runs, spread ${fmt(spread, t.unit)})`;
          if (t.enforced) errors.push(breach);
          // Measured, printed, not fatal — §2's Enforced column, and the row
          // there carries the reason. Loud on stdout so it cannot be forgotten.
          else console.log(`  over budget, not enforced: ${breach}`);
        }
        cells.push(`${fmt(value, t.unit)} ±${fmt(spread, t.unit)}`);
      }
      rows.push(cells);
    }
  } finally {
    await browser.close();
  }

  const header = [
    'Route',
    'Score',
    ...thresholds.map((t) => `${t.label} (≤ ${fmt(t.max, t.unit)})${t.enforced ? '' : ' — not gated'}`),
  ];
  console.log(`| ${header.join(' | ')} |`);
  console.log(`|${header.map(() => '---').join('|')}|`);
  for (const row of rows) console.log(`| ${row.join(' | ')} |`);
  const notGated = thresholds.filter((t) => !t.enforced).map((t) => t.label);
  console.log(
    `\n${PAGES.length} routes × ${RUNS} run${RUNS === 1 ? '' : 's'}, median per metric, Lighthouse defaults ` +
      `(mobile, Slow-4G, simulated throttling). Score gate ≥ ${minScore}. ` +
      `Reports in web/test-results/lighthouse/.`,
  );
  if (notGated.length > 0) {
    console.log(`Measured but not enforced (§2's Enforced column): ${notGated.join(', ')}.`);
  }
  console.log('The ± is the spread across runs, not a tolerance: a widening one is a gate about to flake.');

  if (errors.length > 0) {
    console.error('\nlighthouse budgets failed:');
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
}

await main();
