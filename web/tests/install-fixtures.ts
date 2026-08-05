// Copies the e2e fixtures into the content collections, and takes them back
// out again.
//
//   node web/tests/install-fixtures.ts install
//   node web/tests/install-fixtures.ts clean
//
// Why a copy rather than a flag: src/content.config.ts is normative
// (content-model.md §3) and must not grow a test branch — a schema that
// behaves differently under test is a schema that stops enforcing anything.
// The glob loaders read one directory each, so the only way in is a file, and
// the only way to keep that file out of the shipped site is to remove it.
//
// The copy target is gitignored and dockerignored, so a fixture left behind by
// an interrupted run cannot be committed and cannot leak into `web:ci`. Those
// two ignore rules match on the name, so **every fixture file must end
// `-fixture.md`** — the layout under fixtures/ otherwise mirrors src/content/
// exactly, collection directory included.
import { copyFileSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const FIXTURES = join(here, 'fixtures');
const CONTENT = join(here, '..', 'src', 'content');
// Astro's content layer cache. It survives the deletion of the file an entry
// came from, so without this a local e2e run leaves /he/writing/rtl-fixture/
// in every subsequent build — the fixture leaking into the site by way of a
// cache rather than a file. Dropped in both directions: the same staleness
// would otherwise hide a fixture edit.
//
// Two paths because the store has lived in both, and a wrong guess here fails
// silently and in the dangerous direction. `astro build --force` clears it
// too, but that only helps the person who remembers to pass it.
const DATA_STORES = [
  join(here, '..', '.astro', 'data-store.json'),
  join(here, '..', 'node_modules', '.astro', 'data-store.json'),
];

/** Every fixture, as a path relative to the fixtures root. */
function fixtures(dir = ''): string[] {
  return readdirSync(join(FIXTURES, dir)).flatMap((name) => {
    const rel = join(dir, name);
    return statSync(join(FIXTURES, rel)).isDirectory() ? fixtures(rel) : [rel];
  });
}

const command = process.argv[2];
if (command !== 'install' && command !== 'clean') {
  console.error('usage: node web/tests/install-fixtures.ts install|clean');
  process.exit(2);
}

for (const rel of fixtures()) {
  const target = join(CONTENT, rel);
  if (command === 'install') {
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(join(FIXTURES, rel), target);
  } else {
    rmSync(target, { force: true });
  }
  console.log(`${command === 'install' ? '+' : '-'} src/content/${rel}`);
}

for (const store of DATA_STORES) rmSync(store, { force: true });
