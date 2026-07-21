# T://bendet Portfolio — Decision Log

A running record of every decision made building this portfolio, from concept through implementation.

---

## Concept & Identity

**The premise:** A personal portfolio that reflects the developer, not just lists their work. The guiding question was: *what makes this site feel like Tal, not like a template?*

**Identity mark:** `T://bendet` — a personal protocol/namespace. The `T` is the scheme, `bendet` is what's inside. Appears as the logo, hero centrepiece, and eyebrow label throughout. The `://` carries a subtle purple glow effect.

**The Jekyll & Hyde duality:** Two sides of the same person — order-oriented and experimentative, structured and curious. Rather than splitting the visual design across sections, the duality became a hidden easter egg (see Marauder's Map below).

---

## The Marauder's Map Easter Egg

The single most important design decision.

**What it is:** The site has one clean dark design for all visitors. Hidden, with no label or hint, is a trigger. If a visitor types `i solemnly swear that i am up to no good` anywhere on the page, the entire site transforms into a warm editorial light theme. Typing `mischief managed` reverts it.

**Why it works:**
- Nobody who isn't looking will find it
- Everyone who finds it will immediately understand everything about the developer
- It maps onto the mad scientist / order-oriented duality without naming it
- It connects to the HP/LOTR fandom without being on-the-nose
- It rewards exactly the kind of curious, detail-oriented visitor you want to attract

**Implementation:** A `keydown` listener buffers typed characters globally. On match, `data-theme="jekyll"` is set on `<html>` and persisted to `localStorage`. A 600ms CSS transition on `background-color`, `border-color`, and `color` makes the transformation feel like ink spreading across paper.

**Console easter egg:** On activation logs `✦ Mischief managed.` in serif. On revert logs `✦ The map has been wiped clean.`

---

## The Two Themes

### Hyde (default dark)
```
--bg:      #0d0d0f
--surface: #141417
--border:  #222228
--text:    #e8e8ec
--muted:   #6b6b78
--accent1: #ff6b35
--accent2: #7c6af7  ← primary, used for :// glow
--accent3: #2fc98e  ← live indicator
--accent4: #f5c542
--accent5: #e06fe8
--accent6: #3fc9d4
```

Font: **DM Mono** throughout.

Accent colors appear ONLY on badges, labels, and one glow element. Never as background colors. Inspired by the build-tools reference doc Tal had already designed.

### Jekyll (revealed via Marauder's Map)
```
--bg:      #f7f3ec
--surface: #ede6d8
--border:  #e0d8c8
--text:    #1a1610
--muted:   #9c8e78
--accent1: #9c6b3a
--accent2: #6a5a48
--accent3: #5a7a5a
```

Fonts: **Fraunces** (display headings, serif, weight 300) + **IBM Plex Mono** (body, labels, chrome).

Feels like warm parchment. Editorial. Literary.

### The through-line
Both themes share identical grid, spacing, border radius, interaction patterns, and the `T://bendet` eyebrow pattern. What changes is only temperature — warm vs cool, serif vs mono. A visitor who doesn't find the easter egg just experiences a well-designed portfolio with personality.

---

## Typography

| Role | Hyde | Jekyll |
|------|------|--------|
| Display headings | DM Mono | Fraunces (serif, light) |
| Body / prose | DM Mono | IBM Plex Mono |
| Labels / eyebrows | DM Mono | IBM Plex Mono |
| Code | DM Mono | DM Mono |

**The eyebrow pattern:** Small uppercase mono labels above headings — `T://bendet · about`, `T://bendet · projects` etc. This was already present in Tal's existing design files and became a consistent signature across the site.

---

## The Illustration

Tal's wife drew a caricature of both of them for their wedding invitation. Only Tal's head (bearded, glasses) is used on the portfolio.

**Placement:**
- About page — next to the bio, exactly like the wizard on totaltypescript.com
- Favicon — cropped tight, strong silhouette reads well at 32px

**Why it works:** A hand-drawn face in a sea of monospace and precision is the most distinctive thing on the page. Nobody else has it. Gives the site a human feeling against the technical precision.

---

## Hero Section

A terminal window UI containing the `T://bendet` typing animation.

**Sequence:**
```
T          → pause
T:
T:/
T://       → pause, let :// land
T://b
T://be
T://ben
T://bend
T://bende
T://bendet → :// glow fades in, cursor disappears, tagline fades up
```

The `://` glow only appears once the full string is complete. The cursor blinks during typing, then disappears. The hero tagline and CTA buttons fade in after the animation ends. Runs once on page load, never loops.

---

## Site Structure

| Route | Theme | Notes |
|-------|-------|-------|
| `/` | Both | Hero, dark → typing animation |
| `/about` | Jekyll (warm) | Illustration, bio, three personality items |
| `/projects` | Hyde (dark) | Cards, tech badges, glow dot for live |
| `/writing` | Jekyll (warm) | Two tabs: original + translated |
| `/contact` | Hyde (dark) | Email, GitHub, LinkedIn. Minimal. |

---

## Writing Section

Two content types, one section:

**Original** — Tal's own English posts, starting fresh.

**Translated** — English technical articles Tal has translated into Hebrew for the Israeli dev community. Shows original article credit and author. Post pages render `dir="rtl"`.

Both live under `/writing` with a tab switcher. Post count shown as a small badge on each tab.

---

## Tech Stack

**Framework:** Astro 6 (chosen over Next.js for zero-JS default, Content Collections API, SEO/performance out of the box)

**Styling:** Tailwind CSS 4 (CSS-only config via `@theme`, no `tailwind.config.js`)

**Content:** MDX via `@astrojs/mdx` — posts as `.mdx` files in `src/content/`

**Routing:** Astro file-based routing

**Deployment target:** Vercel or Netlify

### Verified package versions
```json
{
  "astro": "^6.0.5",
  "@astrojs/mdx": "^5.0.1",
  "@astrojs/sitemap": "^3.7.1",
  "tailwindcss": "^4.0.0",
  "@tailwindcss/vite": "^4.0.0",
  "@tailwindcss/typography": "^0.5.0"
}
```

Node: `>=22.12.0` (Astro 6 requirement)

### Key config notes
- Tailwind 4 goes in `vite.plugins`, NOT `integrations` — `@astrojs/tailwind` is deprecated
- Content collections use Astro 6's `glob` loader from `astro/loaders`
- Posts use `post.id` not `post.slug`
- `render()` is imported from `astro:content`, not called as a method on the post

---

## Decisions Rejected

| Option | Rejected because |
|--------|-----------------|
| Next.js | Overkill for a portfolio; React runtime overhead; Astro better for static content |
| TanStack Start | Still RC at time of decision; thin MDX/blog story |
| Plain React | No SSG = bad SEO; no image optimisation out of the box |
| React + shadcn | Every shadcn component becomes a React island; not worth the overhead for a mostly-static site |
| Dual design visible to all | Looked like two different sites, not one site with personality |
| Jekyll/Hyde as split sections | Confusing without explanation; the Marauder's Map is cleaner |
| Option A palette (Warm Noir) | Too warm; amber accent felt forced |
| Option C palette (Blood & Parchment) | Too dramatic; violet risk of "too much" |
| Framer Motion | Friction with Astro islands; GSAP is framework-agnostic and fits better |
| `@astrojs/tailwind` | Deprecated for Tailwind 4 |

---

## Design Principles

1. **Restraint is the skill.** Accent colors only on badges and one glow element. Everything else stays clean.
2. **The ones who notice will notice.** No easter egg labels, no hints. Reward curiosity silently.
3. **One design system, two temperatures.** Same grid, spacing, and patterns. What changes is mood — not structure.
4. **A person lives here.** The illustration, the writing tone, the hidden references. Anti-template.
5. **Never say "let's connect."**

---

## Inspiration

- **totaltypescript.com** — illustration as brand, not decoration; glow effects used sparingly; technical depth with personality
- Tal's own `build-tools-overview.html` — the Hyde dark theme is a direct evolution of this file
- Tal's own `tooling-deepdive.html` — the Jekyll warm theme is a direct evolution of this file
