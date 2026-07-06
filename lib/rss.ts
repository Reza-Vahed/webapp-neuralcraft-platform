import type { BlogPost } from "@/.velite";
import { siteUrl } from "@/lib/site";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildBlogRssFeed({
  locale,
  title,
  description,
  posts,
}: {
  locale: string;
  title: string;
  description: string;
  posts: BlogPost[];
}): string {
  const feedUrl = `${siteUrl}/${locale}/blog/feed.xml`;
  const siteHome = `${siteUrl}/${locale}/blog`;

  const items = posts
    .map((post) => {
      const url = `${siteUrl}${post.permalink}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${siteHome}</link>
    <description>${escapeXml(description)}</description>
    <language>${locale}</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}
