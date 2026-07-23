// Hebrew feed (/he/rss.xml) — specs/content-model.md §7.
//
// Item descriptions carry the attribution. A feed reader shows the item
// outside the page, so the credit has to survive the trip — this is the one
// place where credit exists outside the article's credit block (§4.3), and
// it is required for the same reason the block is. Attribution is enforced
// at three layers: schema, CI, and here.
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const entries = (await getCollection('translations', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  return rss({
    title: 'T://bendet · תרגומים',
    // TODO(Tal): the channel description, in Hebrew
    description: '',
    site: context.site!,
    items: entries.map((entry) => {
      const { original } = entry.data;
      // TODO(Tal): the Hebrew wording. Binding: the item says it is a
      // translation, names the author, and carries the original's URL.
      const credit = `תרגום של "${original.title}" מאת ${original.author} — ${original.url}`;

      return {
        title: entry.data.title,
        description: `${entry.data.description}\n\n${credit}`,
        pubDate: entry.data.pubDate,
        link: `/he/writing/${entry.id}/`,
      };
    }),
    customData: '<language>he</language>',
  });
}
