// SessionStart hook: inject what Claude Code does NOT auto-load —
// the decision index and current mission statuses. (CLAUDE.md is auto-loaded;
// re-injecting it would double context spend for nothing.)

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseFrontmatter } from '../lib/frontmatter.ts';

const parts: string[] = ['<project-state>'];

const indexPath = 'docs/decisions/INDEX.md';
if (existsSync(indexPath)) {
  parts.push('## Decision index (generated)');
  parts.push(readFileSync(indexPath, 'utf8'));
}

parts.push('## Mission statuses');
for (const d of readdirSync('missions').sort()) {
  const statusPath = join('missions', d, 'STATUS.md');
  if (!existsSync(statusPath)) continue;
  const { frontmatter } = parseFrontmatter(readFileSync(statusPath, 'utf8'));
  parts.push(
    `- ${frontmatter['mission'] ?? d}: ${frontmatter['status'] ?? '?'} (depends-on: ${frontmatter['depends-on'] ?? '-'})`,
  );
}
parts.push('</project-state>');

console.log(parts.join('\n'));
process.exit(0);
