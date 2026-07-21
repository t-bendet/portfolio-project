// WCAG 2.x contrast checker — deterministic, zero dependencies, erasable TS.
// Contrast is arithmetic; never spend model tokens computing it.
//
// Usage:
//   node scripts/contrast.ts '#e8e8ec' '#0d0d0f'          # one pair
//   node scripts/contrast.ts --pairs pairs.txt             # batch mode
//
// pairs.txt format (one pair per line, optional label after '|'):
//   #e8e8ec #0d0d0f | text on bg (hyde)
//   #6b6b78 #0d0d0f | muted on bg (hyde)
//
// Output per pair: ratio + AA / AA-large / AAA verdicts.
// Exit 1 if any pair fails AA for normal text (so it can gate CI later).

import { readFileSync } from 'node:fs';

interface Result {
  fg: string;
  bg: string;
  label: string;
  ratio: number;
  aa: boolean; // >= 4.5 (normal text)
  aaLarge: boolean; // >= 3.0 (large text / UI components)
  aaa: boolean; // >= 7.0
}

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace(/^#/, '');
  const full =
    h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error(`invalid hex color: "${hex}"`);
  }
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

// WCAG relative luminance
function luminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(fg: string, bg: string): number {
  const l1 = luminance(parseHex(fg));
  const l2 = luminance(parseHex(bg));
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

function check(fg: string, bg: string, label: string): Result {
  const ratio = contrast(fg, bg);
  return {
    fg,
    bg,
    label,
    ratio,
    aa: ratio >= 4.5,
    aaLarge: ratio >= 3.0,
    aaa: ratio >= 7.0,
  };
}

function main(): void {
  const args = process.argv.slice(2);
  const pairs: Array<[string, string, string]> = [];

  if (args[0] === '--pairs') {
    const file = args[1];
    if (!file) {
      console.error('usage: node scripts/contrast.ts --pairs <file>');
      process.exit(1);
    }
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      const trimmed = line.trim();
      if (trimmed === '' || trimmed.startsWith('//')) continue;
      const [colors, label = ''] = trimmed.split('|').map((s) => s.trim());
      const parts = colors.split(/\s+/);
      if (parts.length !== 2) {
        console.error(`skipping malformed line: "${trimmed}"`);
        continue;
      }
      pairs.push([parts[0], parts[1], label]);
    }
  } else if (args.length >= 2) {
    pairs.push([args[0], args[1], args[2] ?? '']);
  } else {
    console.error(
      "usage: node scripts/contrast.ts '#fg' '#bg' [label]\n" +
        '       node scripts/contrast.ts --pairs pairs.txt',
    );
    process.exit(1);
  }

  let anyAaFailure = false;
  console.log('| FG | BG | Ratio | AA (4.5) | AA-large (3.0) | AAA (7.0) | Label |');
  console.log('|----|----|-------|----------|----------------|-----------|-------|');
  for (const [fg, bg, label] of pairs) {
    const r = check(fg, bg, label);
    if (!r.aa) anyAaFailure = true;
    const mark = (ok: boolean): string => (ok ? 'PASS' : 'FAIL');
    console.log(
      `| ${r.fg} | ${r.bg} | ${r.ratio.toFixed(2)} | ${mark(r.aa)} | ${mark(r.aaLarge)} | ${mark(r.aaa)} | ${r.label} |`,
    );
  }

  if (anyAaFailure) {
    console.error('\nAt least one pair fails AA for normal text.');
    process.exit(1);
  }
}

main();
