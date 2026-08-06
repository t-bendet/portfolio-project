// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// The two unicode-ranges every face below is scoped by, lifted verbatim from
// Fontsource's own generated CSS rather than hand-written — they are what the
// Google Fonts CSS API serves, and an approximated range silently changes
// which file a codepoint pulls. Per-script scoping is the mechanism behind
// two separate requirements: typography.md §3 (Latin never falls back to the
// Hebrew companion; the browser routes codepoints to the right file) and
// performance-budgets.md §4.3 (a Hebrew page adds only the hebrew-subset
// companion, never a second full set).
// Arrays, not comma-joined strings: Astro calls `.join(',')` on this, so a
// string passes the truthiness check and then throws at build.
/** @type {[string, ...string[]]} */
const LATIN = [
  'U+0000-00FF', 'U+0131', 'U+0152-0153', 'U+02BB-02BC', 'U+02C6', 'U+02DA',
  'U+02DC', 'U+0304', 'U+0308', 'U+0329', 'U+2000-206F', 'U+20AC', 'U+2122',
  'U+2191', 'U+2193', 'U+2212', 'U+2215', 'U+FEFF', 'U+FFFD',
];
/** @type {[string, ...string[]]} */
const HEBREW = [
  'U+0307-0308', 'U+0590-05FF', 'U+200C-2010', 'U+20AA', 'U+25CC', 'U+FB1D-FB4F',
];

// `fallbacks: []` on every family, and the reason is a correctness one rather
// than a byte one. Astro's default appends a generic plus a metric-adjusted
// local face, so `--font-syne` would expand to
// `Syne-hash, "Syne-hash fallback: Arial", sans-serif`. Compose that ahead of
// the Hebrew companion and a Hebrew codepoint hits the adjusted Arial — which
// has Hebrew glyphs and no unicode-range — and never reaches Heebo. That is
// exactly the silent failure typography.md §3's companion mechanism exists to
// prevent, so the generics are written once, explicitly, at the tail of each
// stack in global.css instead.
//
// The cost is Astro's automatic metric-matched fallback. Taking it would not
// have discharged typography.md §3's owed `size-adjust`/`ascent-override`
// work anyway: that is about the Latin/Hebrew companion pairing, which no
// generic fallback touches, and the spec requires a QA-verified number rather
// than a computed one ("verified-or-absent").
/**
 * One face of one family. Spelled out rather than derived from Astro's config
 * type: the `fonts` union resolves through the provider, so indexing into it
 * for the local shape collapses to `never`.
 *
 * The non-empty tuples are Astro's, not decoration — `src` and `variants` are
 * both `[T, ...T[]]`, so a plain `T[]` does not satisfy them.
 *
 * @typedef {object} LocalVariant
 * @property {number | string} weight  a single weight, or a variable span like '400 800'
 * @property {'normal' | 'italic'} style
 * @property {[string, ...string[]]} unicodeRange
 * @property {[string, ...string[]]} src
 */

/**
 * The helper exists so `fallbacks: []` cannot be forgotten on a family — it is
 * a correctness invariant here (see above), not a default worth overriding.
 *
 * @param {string} name
 * @param {`--${string}`} cssVariable
 * @param {[LocalVariant, ...LocalVariant[]]} variants
 */
const font = (name, cssVariable, variants) => ({
  provider: fontProviders.local(),
  name,
  cssVariable,
  fallbacks: [],
  options: { variants },
});

// https://astro.build/config
export default defineConfig({
  // TODO(Tal): replace with the real domain when chosen (specs/scaffold-plan.md §6).
  site: 'https://tbendet.example',
  // One canonical URL form; the non-canonical spelling redirects (specs/routes/sitemap.md §1).
  trailingSlash: 'always',
  // /he/ is a redirect, never a page (specs/routes/sitemap.md §1 row 14).
  // Nothing in the chrome links it — R-5 forbids a chrome link that resolves
  // to a redirect — so this exists for people who trim the URL by hand.
  redirects: {
    '/he/': '/he/writing/',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'he'],
    routing: { prefixDefaultLocale: false },
  },
  markdown: {
    // Shiki's built-in themes emit hardcoded colors inline, which would pin
    // every code panel to one temperature and override the palette. The
    // css-variables theme emits `--astro-code-*` instead; those are aliased
    // to the palette's code tokens in tokens.css, so panels follow the
    // active temperature like everything else (specs/design/palette.md).
    shikiConfig: { theme: 'css-variables' },
  },
  // Seven families, self-hosted from committed woff2 (typography.md §9: all
  // OFL, so self-hosting is licence-clean). The files are vendored rather
  // than fetched at build time so `docker build` needs no network and the
  // bytes can never drift; the Fontsource packages they were extracted from
  // are devDependencies, pinned, and exist only to make the extraction
  // repeatable — see web/src/assets/fonts/README.md.
  //
  // Weights are typography.md §1's "weights in use", not the families' full
  // ranges. Variable faces still declare their real `weight` span because
  // that is what the file contains; naming a narrower one would make the
  // browser synthesise weights the file can already render.
  //
  // Fraunces is the `standard` build (wght + opsz), not `full`. The warm
  // prototype imports `Fraunces:ital,opsz,wght@0,9..144,...` and never asks
  // for SOFT or WONK, so `full` would ship two axes the design does not use
  // — and would breach §4.1 twice over (italic 146 KB against a 100 KB cap,
  // warm total 343 KB against 280 KB). Dropping opsz too would be smaller
  // still, but `font-optical-sizing: auto` is the CSS initial value and the
  // prototype relies on it, so opsz stays. This is the remedy §4.2
  // pre-registered: restrict the axes before asking to move a budget.
  fonts: [
    // --- dark temperature (default) — the critical path -------------------
    font('Syne', '--font-syne', [
      { weight: '400 800', style: 'normal', unicodeRange: LATIN, src: ['./src/assets/fonts/syne-latin-wght-normal.woff2'] },
    ]),
    font('DM Mono', '--font-dm-mono', [
      { weight: 400, style: 'normal', unicodeRange: LATIN, src: ['./src/assets/fonts/dm-mono-latin-400-normal.woff2'] },
      { weight: 500, style: 'normal', unicodeRange: LATIN, src: ['./src/assets/fonts/dm-mono-latin-500-normal.woff2'] },
    ]),

    // --- warm temperature (hidden) ---------------------------------------
    // Never preloaded, and never fetched until the theme is actually on: a
    // family no rendered glyph matches is not downloaded, so these four cost
    // zero bytes on every visit that stays dark. That is what discharges
    // §4.2's "warm fonts are excluded from every initial-load budget"
    // without any fetch-on-toggle machinery.
    font('Fraunces', '--font-fraunces', [
      { weight: '100 900', style: 'normal', unicodeRange: LATIN, src: ['./src/assets/fonts/fraunces-latin-standard-normal.woff2'] },
      { weight: '100 900', style: 'italic', unicodeRange: LATIN, src: ['./src/assets/fonts/fraunces-latin-standard-italic.woff2'] },
    ]),
    font('IBM Plex Mono', '--font-plex-mono', [
      { weight: 400, style: 'normal', unicodeRange: LATIN, src: ['./src/assets/fonts/ibm-plex-mono-latin-400-normal.woff2'] },
      { weight: 500, style: 'normal', unicodeRange: LATIN, src: ['./src/assets/fonts/ibm-plex-mono-latin-500-normal.woff2'] },
      { weight: 600, style: 'normal', unicodeRange: LATIN, src: ['./src/assets/fonts/ibm-plex-mono-latin-600-normal.woff2'] },
    ]),
    font('IBM Plex Sans Hebrew', '--font-plex-hebrew', [
      { weight: 400, style: 'normal', unicodeRange: HEBREW, src: ['./src/assets/fonts/ibm-plex-sans-hebrew-hebrew-400-normal.woff2'] },
      { weight: 500, style: 'normal', unicodeRange: HEBREW, src: ['./src/assets/fonts/ibm-plex-sans-hebrew-hebrew-500-normal.woff2'] },
      { weight: 600, style: 'normal', unicodeRange: HEBREW, src: ['./src/assets/fonts/ibm-plex-sans-hebrew-hebrew-600-normal.woff2'] },
    ]),
  ],
  // sitemap: deliberately NO i18n option — no hreflang alternates
  // (the English counterparts of /he/ articles are not on this site).
  // The integration drops /404 on its own; /he/404 is a page like any other
  // to it, and an error page does not belong in the sitemap.
  integrations: [mdx(), sitemap({ filter: (page) => !page.endsWith('/he/404/') })],
  vite: {
    plugins: [tailwindcss()],
  },
});
