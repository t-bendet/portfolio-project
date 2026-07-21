// Flat frontmatter parser. Deliberately minimal: the ADR schema is constrained
// to flat `key: value` pairs (no nesting, no arrays) precisely so this stays
// dependency-free and runs via native Node type-stripping (Node >= 24).
// Erasable syntax only: no enum, no namespace.

export type Frontmatter = Record<string, string>;

export type AdrStatus =
  | 'proposed'
  | 'active'
  | 'reopened'
  | 'superseded'
  | 'rejected';

export const ADR_STATUSES: readonly string[] = [
  'proposed',
  'active',
  'reopened',
  'superseded',
  'rejected',
];

export interface ParsedDoc {
  frontmatter: Frontmatter;
  body: string;
  errors: string[];
}

export function parseFrontmatter(raw: string): ParsedDoc {
  const errors: string[] = [];
  const fm: Frontmatter = {};

  if (!raw.startsWith('---\n')) {
    return { frontmatter: fm, body: raw, errors: ['missing frontmatter block'] };
  }
  const end = raw.indexOf('\n---', 4);
  if (end === -1) {
    return { frontmatter: fm, body: raw, errors: ['unterminated frontmatter block'] };
  }

  const block = raw.slice(4, end);
  const body = raw.slice(end + 4).replace(/^\n/, '');

  for (const [i, line] of block.split('\n').entries()) {
    if (line.trim() === '') continue;
    const sep = line.indexOf(':');
    if (sep === -1) {
      errors.push(`line ${i + 2}: no "key: value" separator ("${line.trim()}")`);
      continue;
    }
    const key = line.slice(0, sep).trim();
    const value = line.slice(sep + 1).trim();
    if (/^\s/.test(line)) {
      errors.push(`line ${i + 2}: indentation suggests nesting — flat keys only`);
      continue;
    }
    if (value.startsWith('[') || value.startsWith('- ')) {
      errors.push(`line ${i + 2}: arrays are not allowed — flat scalar values only`);
      continue;
    }
    if (key in fm) {
      errors.push(`line ${i + 2}: duplicate key "${key}"`);
      continue;
    }
    fm[key] = value;
  }

  return { frontmatter: fm, body, errors };
}
