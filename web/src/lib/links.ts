/*
 * The three direct links, in one place because two surfaces carry them: the
 * global footer (specs/navigation.md §4) and /contact/ (§2, section 4). Two
 * copies of an address is one address going stale.
 *
 * specs/pages/contact.md §6 records exactly two social accounts, and records
 * that the email address is not in specs/research/about-tal.md — it is Tal's
 * to confirm, which is why the placeholder below is a `.invalid` domain that
 * cannot silently work.
 */

/** TODO(Tal): the address to publish. Must not ship as-is. */
export const emailAddress = 'tal@t-bendet.invalid';
export const email = `mailto:${emailAddress}`;

export const github = 'https://github.com/t-bendet';
export const linkedin = 'https://www.linkedin.com/in/tal-bendet';

/** The public repository this site is built from (specs/pages/colophon.md §2.3). */
export const repo = 'https://github.com/t-bendet/portfolio-project';
