import type { MetadataRoute } from "next";

import { getBlogPosts, getCaseStudies, getJobPostings } from "@/lib/content";
import { routing } from "@/i18n/routing";
import { buildSitemapLanguageAlternates } from "@/lib/seo";
import { services } from "@/lib/services";
import { siteUrl } from "@/lib/site";

const staticPaths = [
  "",
  "/services",
  "/case-studies",
  "/about",
  "/blog",
  "/careers",
  "/contact",
  "/privacy",
  "/imprint",
];

function entriesForPath(
  path: string,
  lastModified?: Date
): MetadataRoute.Sitemap {
  const alternates = buildSitemapLanguageAlternates(path);
  return routing.locales.map((locale) => ({
    url: `${siteUrl}/${locale}${path}`,
    ...(lastModified && { lastModified }),
    alternates,
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = staticPaths.flatMap((path) =>
    entriesForPath(path, now)
  );

  const serviceEntries = services.flatMap(({ slug }) =>
    entriesForPath(`/services/${slug}`, now)
  );

  const contentEntries = routing.locales.flatMap((locale) => [
    ...getBlogPosts(locale).map((post) => ({
      url: `${siteUrl}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      alternates: buildSitemapLanguageAlternates(`/blog/${post.slug}`),
    })),
    ...getCaseStudies(locale).map((item) => ({
      url: `${siteUrl}/${locale}/case-studies/${item.slug}`,
      alternates: buildSitemapLanguageAlternates(`/case-studies/${item.slug}`),
    })),
    ...getJobPostings(locale).map((job) => ({
      url: `${siteUrl}/${locale}/careers/${job.slug}`,
      alternates: buildSitemapLanguageAlternates(`/careers/${job.slug}`),
    })),
  ]);

  return [...staticEntries, ...serviceEntries, ...contentEntries];
}
