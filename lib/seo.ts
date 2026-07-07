import type { Metadata } from "next";

import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";

/**
 * Builds `alternates` metadata (canonical + hreflang) for a path that exists
 * under every locale, e.g. buildAlternates("de", "/blog/my-post").
 */
export function buildAlternates(locale: string, pathWithoutLocale: string) {
  return {
    canonical: `/${locale}${pathWithoutLocale}`,
    languages: {
      ...Object.fromEntries(
        routing.locales.map((l) => [l, `/${l}${pathWithoutLocale}`])
      ),
      "x-default": `/${routing.defaultLocale}${pathWithoutLocale}`,
    },
  };
}

/**
 * Full metadata (title, description, canonical/hreflang, OpenGraph, Twitter)
 * for a page whose SEO needs are the "plain" case — no article-specific
 * fields (publishedTime, authors, tags, …). Several list pages independently
 * ended up missing the Twitter card block; this is the single place that
 * shape now gets built, so the same gap can't reappear per-page.
 */
export function buildBasicMetadata({
  title,
  description,
  locale,
  path,
}: {
  title: string;
  description: string;
  locale: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: { title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

/**
 * Absolute-URL hreflang alternates for `sitemap.ts` (unlike `buildAlternates`,
 * sitemap entries have no `metadataBase` to resolve relative URLs against).
 */
export function buildSitemapLanguageAlternates(pathWithoutLocale: string) {
  return {
    languages: {
      ...Object.fromEntries(
        routing.locales.map((l) => [l, `${siteUrl}/${l}${pathWithoutLocale}`])
      ),
      "x-default": `${siteUrl}/${routing.defaultLocale}${pathWithoutLocale}`,
    },
  };
}
