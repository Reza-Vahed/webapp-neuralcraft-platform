import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { BlogList } from "@/components/content/blog-list";
import { PageHeader } from "@/components/layout/page-header";
import { BLOG_PAGE_SIZE, getBlogPosts } from "@/lib/content";
import { buildBasicMetadata } from "@/lib/seo";
import { routing, type Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: Locale; page: string }>;
};

function parsePage(raw: string): number | null {
  const page = Number(raw);
  return Number.isInteger(page) && page > 0 ? page : null;
}

// Page 1 has no static entry here — it lives at the canonical /blog route.
export function generateStaticParams() {
  return routing.locales.flatMap((locale) => {
    const totalPages = Math.max(
      1,
      Math.ceil(getBlogPosts(locale).length / BLOG_PAGE_SIZE)
    );
    return Array.from({ length: totalPages - 1 }, (_, index) => ({
      locale,
      page: String(index + 2),
    }));
  });
}

// Total pages is derived from build-time content (Velite), so any page
// number outside the range above is definitively invalid until the next
// build — 404 immediately instead of attempting an on-demand render.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, page } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "BlogPage" });

  return buildBasicMetadata({
    title: `${t("title")} (${page})`,
    description: t("lead"),
    locale,
    path: `/blog/page/${page}`,
  });
}

export default async function BlogPagePaginated({ params }: PageProps) {
  const { locale, page: pageParam } = await params;
  setRequestLocale(locale);
  const page = parsePage(pageParam);
  const t = await getTranslations({ locale, namespace: "BlogPage" });

  if (page === null) notFound();

  // Page 1 lives at /blog — redirect traffic that lands here to the
  // canonical URL instead of rendering a duplicate.
  const totalPages = Math.max(
    1,
    Math.ceil(getBlogPosts(locale).length / BLOG_PAGE_SIZE)
  );
  if (page === 1 || page > totalPages) notFound();

  return (
    <main id="main-content" className="flex-1">
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
      <BlogList locale={locale} page={page} />
    </main>
  );
}
