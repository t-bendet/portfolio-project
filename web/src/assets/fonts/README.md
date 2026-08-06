# Vendored font files

Thirteen woff2 files, committed. `astro.config.mjs` reads them through
`fontProviders.local()`.

They are committed rather than fetched at build time so that `docker build`
needs no network and the shipped bytes cannot drift between a laptop build,
a CI build and a deploy build. The Fontsource packages they came from are
pinned devDependencies whose only job is to make the extraction repeatable —
nothing imports them, and removing them would not change a single byte of
the build.

## Which file, and why that one

Families and weights are `specs/design/typography.md` §1's "weights in use".
Subsets are `latin` + `hebrew` only, per §9.

| Family | File | Role |
|---|---|---|
| Syne | `syne-latin-wght-normal` | dark display + body |
| DM Mono | `dm-mono-latin-{400,500}-normal` | dark chrome + code |
| Heebo | `heebo-hebrew-wght-normal` | dark Hebrew companion |
| Fraunces | `fraunces-latin-standard-{normal,italic}` | warm display + body |
| IBM Plex Mono | `ibm-plex-mono-latin-{400,500,600}-normal` | warm chrome + code |
| Frank Ruhl Libre | `frank-ruhl-libre-hebrew-wght-normal` | warm Hebrew body |
| IBM Plex Sans Hebrew | `ibm-plex-sans-hebrew-hebrew-{400,500,600}-normal` | warm Hebrew mono slots |

**Fraunces is the `standard` build, not `full`.** Fontsource publishes
Fraunces in per-axis builds. `standard` carries `wght` + `opsz`; `full` adds
`SOFT` and `WONK`, which the warm prototype never requests — its import is
`Fraunces:ital,opsz,wght@0,9..144,300;...`. Taking `full` would ship two
unused axes and breach `specs/performance-budgets.md` §4.1 twice: italic at
146 KB against a 100 KB cap, and a warm total of 343 KB against 280 KB.
With `standard` the same numbers are 79.6 KB and 224.0 KB.

The smaller `wght`-only build (35.8 KB) is **not** correct here:
`font-optical-sizing: auto` is the CSS initial value, so dropping `opsz`
would silently change every glyph the warm theme renders.

## Re-extracting

The devDependencies are pinned at `5.3.0`. To refresh or add a face:

```bash
pnpm --filter web install
cp web/node_modules/@fontsource-variable/syne/files/syne-latin-wght-normal.woff2 \
   web/src/assets/fonts/
```

Then re-measure before committing — the per-file caps in
`performance-budgets.md` §4.1 are contracts, and a Fontsource release can
change a file's size without changing its name:

```bash
cd web && for f in src/assets/fonts/*.woff2; do
  printf '%7.1f KB  %s\n' "$(echo "scale=2;$(wc -c <"$f")/1024" | bc)" "$(basename "$f")"
done
```

## What is deliberately absent

**Metric-adjusted fallback faces.** Astro generates them from the `fallbacks`
array; every family here sets `fallbacks: []`, because Astro's generated
fallback is a real local face with no `unicode-range`. Placed ahead of a
Hebrew companion in the stack it would claim Hebrew codepoints — Arial has
Hebrew glyphs — and the companion would never be reached, silently breaking
`typography.md` §3. The generic tail lives once, explicitly, in
`global.css`'s font bridge instead.

**`size-adjust` / `ascent-override` for the Hebrew companions.** Owed by
`typography.md` §3 and §7.4, and deliberately not guessed here: that spec's
rule is verified-or-absent, and the numbers are gated on visual QA of
mixed-script pages under both `dir` values. Astro's automatic fallback
optimization would not have discharged it either — it tunes the *generic*
fallback, not the Latin/Hebrew pairing.
