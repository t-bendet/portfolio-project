// Schemas are normative in specs/content-model.md §3 — field sets,
// requiredness, and defaults are binding.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const writing = defineCollection({
  loader: glob({ base: './src/content/writing', pattern: '**/[^_]*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    // list subtitle AND meta description — one string, no duplication
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const translations = defineCollection({
  loader: glob({ base: './src/content/translations', pattern: '**/[^_]*.{md,mdx}' }),
  schema: z.object({
    title: z.string(), // Hebrew — what the reader sees
    description: z.string(), // Hebrew
    pubDate: z.coerce.date(), // when the TRANSLATION was published here
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),

    // Attribution — required in full; a translation missing credit is a
    // build failure, not a review comment.
    original: z.object({
      title: z.string(), // the English title, verbatim
      author: z.string(),
      url: z.string().url(),
      publishedAt: z.coerce.date().optional(),
    }),

    // On what basis this translation may be published
    // (specs/translations-checklist.md).
    rights: z
      .object({
        basis: z.enum(['standing-grant', 'licence', 'direct-permission']),
        url: z.string().url().optional(),
        consultedAt: z.coerce.date(),
      })
      .refine((r) => r.basis === 'direct-permission' || r.url !== undefined, {
        message: 'rights.url is required for standing-grant and licence bases',
      }),
  }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/[^_]*.{md,mdx}' }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      stack: z.array(z.string()).default([]), // rendered as chip badges
      repoUrl: z.string().url().optional(),
      liveUrl: z.string().url().optional(),
      order: z.number().default(0), // manual ordering; projects are not chronological
      caseStudy: z.boolean().default(false),
      draft: z.boolean().default(false),
    })
    .refine((p) => p.caseStudy || p.repoUrl !== undefined || p.liveUrl !== undefined, {
      message: 'a project without a case study needs repoUrl or liveUrl, or its card links nowhere',
    }),
});

export const collections = { writing, translations, projects };
