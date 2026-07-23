// English feed (/rss.xml) — specs/content-model.md §7.
//
// Linked from the footer on English pages. It ships even when the corpus is
// empty and carries a channel title, description and language regardless:
// a reader who subscribes to an empty feed receives article #1 the day it
// lands, which is the best outcome available to the site's most interested
// visitor (specs/pages/writing-index.md §4).
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const entries = (await getCollection('writing', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  return rss({
    // The mark is never translated or altered, in a feed reader either.
    title: 'T://bendet · writing',
    // TODO(Tal): the channel description
    description: '',
    site: context.site!,
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.pubDate,
      link: `/writing/${entry.id}/`,
    })),
    customData: '<language>en</language>',
  });
}
