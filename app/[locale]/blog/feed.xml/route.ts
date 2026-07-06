import { getTranslations } from "next-intl/server";

import { getBlogPosts } from "@/lib/content";
import { buildBlogRssFeed } from "@/lib/rss";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "BlogPage" });
  const posts = getBlogPosts(locale);

  const xml = buildBlogRssFeed({
    locale,
    title: t("title"),
    description: t("lead"),
    posts,
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
