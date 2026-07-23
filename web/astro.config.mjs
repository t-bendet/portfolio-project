// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // TODO(Tal): replace with the real domain when chosen (specs/scaffold-plan.md §6).
  site: 'https://tbendet.example',
  // One canonical URL form; the non-canonical spelling redirects (specs/routes/sitemap.md §1).
  trailingSlash: 'always',
  // /he/ is a redirect, never a page (specs/routes/sitemap.md §1 row 14).
  // Nothing in the chrome links it — R-5 forbids a chrome link that resolves
  // to a redirect — so this exists for people who trim the URL by hand.
  redirects: {
    '/he/': '/he/writing/',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'he'],
    routing: { prefixDefaultLocale: false },
  },
  markdown: {
    // Shiki's built-in themes emit hardcoded colors inline, which would pin
    // every code panel to one temperature and override the palette. The
    // css-variables theme emits `--astro-code-*` instead; those are aliased
    // to the palette's code tokens in tokens.css, so panels follow the
    // active temperature like everything else (specs/design/palette.md).
    shikiConfig: { theme: 'css-variables' },
  },
  // sitemap: deliberately NO i18n option — no hreflang alternates
  // (the English counterparts of /he/ articles are not on this site).
  // The integration drops /404 on its own; /he/404 is a page like any other
  // to it, and an error page does not belong in the sitemap.
  integrations: [mdx(), sitemap({ filter: (page) => !page.endsWith('/he/404/') })],
  vite: {
    plugins: [tailwindcss()],
  },
});
