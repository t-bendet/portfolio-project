# specs/ — the blueprint

Everything needed to build the site. Distilled from the Phase 1 workshop
(full history in git before 2026-07-23); corrections are merged in — each
file stands alone. These are ordinary documents: when reality disagrees,
edit them.

| File | What it decides |
|---|---|
| `brand.md` | Identity, voice, allowed/banned symbolic vocabulary |
| `architecture.md` | Stack: Astro 7 static core + hand-built Node/TS API + Postgres; auth model; CI stages; budget |
| `scaffold-plan.md` | Step-by-step `app/` creation: layout, commands, containers, workflows, AWS (cloud part gated on Tal) |
| `ci-obligations.md` | The 11 things `ci.yml` must do |
| `content-model.md` | Three content collections, Zod schemas, translation pairing, analytics key contract |
| `routes/sitemap.md` | The 12 public routes + Hebrew locale subtree |
| `navigation.md` | Header, nav, eyebrow, footer, Hebrew-seam rules |
| `pages/*.md` | Per-route build briefs (11 pages) |
| `design/palette.md` | Exact color values, two themes, AA ratios |
| `design/typography.md` | Syne + DM Mono / Fraunces + IBM Plex Mono, Hebrew companions, scale |
| `design/tokens.md` | CSS custom-property registry + theme-switch mechanism |
| `design/hero-and-motion.md` | Hero typing animation, portrait rules, motion/texture budget |
| `performance-budgets.md` | Numeric budgets CI enforces |
| `security-requirements.md` | SR-1…SR-24, threat model |
| `translations-checklist.md` | Licence/credit/back-link obligations per published translation |

Hard invariants live in `CLAUDE.md`. Source material (bio, CV, notes) in
`research/`. Tal's design prototypes — the normative source of every
palette/typography value — in `design/prototypes/` (read, don't edit).
