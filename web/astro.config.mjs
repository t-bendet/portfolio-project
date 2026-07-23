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
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'he'],
    routing: { prefixDefaultLocale: false },
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
