/*
 * The two assets /about/ renders only if they exist (specs/pages/about.md §3).
 * Both are absent from the build today, and both are removals rather than
 * placeholders when absent — hence `null` rather than an empty string, and
 * hence this module: it is the one place either gets turned on.
 */

/** The wedding-invitation drawing (ADR 0018) — the only image on the site. */
export interface Portrait {
  /** Path under web/public/. */
  src: string;
  alt: string;
}

/** The CV PDF, disclosed at its link as a file (§2, section 6). */
export interface Cv {
  href: string;
  /** Human-readable size, e.g. "180 KB" — shown so the download is disclosed. */
  size: string;
}

/*
 * Not digitized yet. While this is null the bio runs the full column: the
 * composition allocates the slot, the render reserves no space (§2.2). Set it
 * when the asset lands; nothing else on the route changes.
 */
export const portrait: Portrait | null = null;

/*
 * Not published. While this is null section 6 is omitted entirely — never
 * "CV available on request", which is a sentence that exists to fill a hole
 * (§3).
 */
export const cv: Cv | null = null;
