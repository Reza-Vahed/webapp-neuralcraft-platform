import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { BlogList } from "@/components/content/blog-list";
import { PageHeader } from "@/components/layout/page-header";
import { buildBasicMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "BlogPage" });

  return buildBasicMetadata({
    title: t("title"),
    description: t("lead"),
    locale,
    path: "/blog",
  });
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "BlogPage" });

  return (
    <main id="main-content" className="flex-1">
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
      <BlogList locale={locale} page={1} />
    </main>
  );
}
