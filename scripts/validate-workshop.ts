// Validates the workshop machinery itself: skills and agents follow their
// structural contracts. Called by the protect-workshop hook after any allowed
// .claude/ write, and runnable standalone:
//   node scripts/validate-workshop.ts
// Exit 0 = valid, exit 1 = problems (listed on stderr).
//
// ADR 0032 dropped the judgment/worker species contract and the mission
// template-section checks; what remains is the structure that still has
// consumers: a skill that exists, is named for its folder, describes itself
// well enough to trigger, and — for mission skills — cannot be model-invoked.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parseFrontmatter } from './lib/frontmatter.ts';

const SKILLS_DIR = '.claude/skills';
const AGENTS_DIR = '.claude/agents';

function checkSkill(dir: string): string[] {
  const problems: string[] = [];
  const path = join(SKILLS_DIR, dir, 'SKILL.md');
  if (!existsSync(path)) return [`${dir}: missing SKILL.md`];

  const raw = readFileSync(path, 'utf8');
  const { frontmatter, errors } = parseFrontmatter(raw);
  problems.push(...errors.map((e) => `${dir}: frontmatter ${e}`));

  if (!frontmatter['name']) problems.push(`${dir}: missing "name" in frontmatter`);
  if (frontmatter['name'] && frontmatter['name'] !== dir) {
    problems.push(`${dir}: frontmatter name "${frontmatter['name']}" != folder name`);
  }
  if (!frontmatter['description'] || frontmatter['description'].length < 20) {
    problems.push(`${dir}: "description" missing or too thin to trigger correctly`);
  }

  const isMission = /^m\d-/.test(dir);
  if (isMission && frontmatter['disable-model-invocation'] !== 'true') {
    problems.push(
      `${dir}: mission skill must set disable-model-invocation: true (missions run only when Tal invokes them)`,
    );
  }
  return problems;
}

function checkAgent(file: string): string[] {
  const problems: string[] = [];
  const raw = readFileSync(join(AGENTS_DIR, file), 'utf8');
  const { frontmatter, errors } = parseFrontmatter(raw);
  problems.push(...errors.map((e) => `${file}: frontmatter ${e}`));

  if (!frontmatter['name']) problems.push(`${file}: missing "name"`);
  if (!frontmatter['description']) problems.push(`${file}: missing "description"`);
  if (!frontmatter['tools']) {
    problems.push(
      `${file}: missing "tools" allowlist — unrestricted agents inherit everything, which defeats a constrained specialist`,
    );
  }
  return problems;
}

function main(): void {
  const problems: string[] = [];
  for (const dir of readdirSync(SKILLS_DIR).sort()) {
    problems.push(...checkSkill(dir));
  }
  for (const file of readdirSync(AGENTS_DIR).sort()) {
    if (file.endsWith('.md')) problems.push(...checkAgent(file));
  }

  if (problems.length > 0) {
    console.error('WORKSHOP VALIDATION FAILED:');
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  console.log('workshop machinery valid (all skills + agents pass structural checks)');
}

main();
