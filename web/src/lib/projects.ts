// Destination disclosure (specs/pages/projects-index.md §2.2): a card must
// say where it goes before it is clicked, so an outbound card carries its
// host as metadata.
//
// One implementation, imported by / and /projects/, because this function is
// the rule. §2.2's test — "no two cards with visually identical affordances
// produce different navigation outcomes" — is written across the whole site,
// and two copies of this could satisfy it on one page while failing it on the
// other. (Markup is duplicated across sibling pages in this repo; a rule that
// cites a spec section gets one home.)
import type { CollectionEntry } from 'astro:content';

/** The host a URL leaves for — what an outbound card and link disclose. */
export function host(url: string): string {
  return new URL(url).host;
}

/**
 * Where a project card links, and the host to disclose when it leaves the
 * site. `caseStudy: true` generates /projects/[id]/ and the card links inward
 * with nothing extra to say; otherwise it links straight out
 * (specs/content-model.md §3.3). The schema's .refine() guarantees the
 * non-case-study branch has a URL, so the assertion cannot fire at runtime —
 * a card that links nowhere is a build failure, not a rendered state
 * (projects-index.md §3).
 */
export function destination(project: CollectionEntry<'projects'>): {
  href: string;
  host: string | null;
} {
  if (project.data.caseStudy) return { href: `/projects/${project.id}/`, host: null };
  const url = project.data.liveUrl ?? project.data.repoUrl!;
  return { href: url, host: host(url) };
}
