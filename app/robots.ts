import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The internal dev dashboard is already `noindex`; disallowing the
      // crawl itself too (defense in depth) across all three locales.
      disallow: ["/*/dev"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
