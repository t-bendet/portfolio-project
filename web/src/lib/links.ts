/*
 * The three direct links, in one place because two surfaces carry them: the
 * global footer (specs/navigation.md §4) and /contact/ (§2, section 4). Two
 * copies of an address is one address going stale.
 *
 * specs/pages/contact.md §6 records exactly two social accounts, and records
 * that the email address was not in specs/research/about-tal.md — Tal chose
 * it on 2026-08-05, with §2.3's cost accepted: a plain mailto: will be
 * scraped, and this is a primary inbox rather than a site-only address.
 */

export const emailAddress = 'talbendet21@gmail.com';
export const email = `mailto:${emailAddress}`;

export const github = 'https://github.com/t-bendet';
export const linkedin = 'https://www.linkedin.com/in/tal-bendet';

/** The public repository this site is built from (specs/pages/colophon.md §2.3). */
export const repo = 'https://github.com/t-bendet/portfolio-project';
