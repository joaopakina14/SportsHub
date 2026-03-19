import { getAllPosts } from '@/lib/posts';

export async function GET() {
  const posts = getAllPosts();
  
  const siteUrl = 'https://sports-news-theta.vercel.app';
  
  const rssItems = posts.slice(0, 15).map((post) => {
    return `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${siteUrl}/news/${post.slug}</link>
        <guid isPermaLink="true">${siteUrl}/news/${post.slug}</guid>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        <description><![CDATA[${post.excerpt}]]></description>
        ${post.image ? `<media:content url="${post.image.replace(/&/g, '&amp;')}" medium="image" />\n        <enclosure url="${post.image.replace(/&/g, '&amp;')}" length="0" type="image/jpeg" />` : ''}
      </item>
    `;
  }).join('');

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
      <channel>
        <title>SportsHub News</title>
        <link>${siteUrl}</link>
        <description>As últimas notícias reais do desporto mundial</description>
        <language>pt-PT</language>
        <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
        ${rssItems}
      </channel>
    </rss>`;

  return new Response(feed, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 's-maxage=1800, stale-while-revalidate',
    },
  });
}
