import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ArticleLayout } from "@/components/layout/article-layout";
import { Container } from "@/components/layout/container";
import { Markdown } from "@/components/content/markdown";
import { JsonLd } from "@/components/content/json-ld";
import { caseStudies } from "@/.velite";
import { getCaseStudy } from "@/lib/content";
import { buildAlternates } from "@/lib/seo";
import { buildArticleJsonLd } from "@/lib/structured-data";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: Locale; slug: string }>;
};

export function generateStaticParams() {
  return caseStudies.map((item) => ({ locale: item.locale, slug: item.slug }));
}

// Every valid slug is enumerated above (content is build-time, not
// user-generated), so an unlisted slug is definitively invalid — 404
// immediately instead of attempting an on-demand render.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const caseStudy = getCaseStudy(locale, slug);
  if (!caseStudy) return {};

  return {
    title: caseStudy.title,
    description: caseStudy.summary,
    alternates: buildAlternates(locale, `/case-studies/${slug}`),
    openGraph: {
      type: "article",
      title: caseStudy.title,
      description: caseStudy.summary,
      tags: caseStudy.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: caseStudy.title,
      description: caseStudy.summary,
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const caseStudy = getCaseStudy(locale, slug);

  if (!caseStudy) notFound();

  const t = await getTranslations({ locale, namespace: "CaseStudiesPage" });

  return (
    <main id="main-content" className="flex-1">
      <JsonLd
        data={buildArticleJsonLd({
          headline: caseStudy.title,
          description: caseStudy.summary,
          url: caseStudy.permalink,
          tags: caseStudy.tags,
          image: caseStudy.coverImage?.src,
        })}
      />

      <Container className="max-w-3xl pt-8">
        <Link
          href="/case-studies"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
          {t("backToOverview")}
        </Link>
      </Container>

      <ArticleLayout
        title={caseStudy.title}
        description={caseStudy.summary}
        meta={caseStudy.industry}
        tags={caseStudy.tags}
        coverImage={
          caseStudy.coverImage
            ? { src: caseStudy.coverImage.src, alt: caseStudy.title }
            : undefined
        }
      >
        <h2>{t("resultsTitle")}</h2>
        <dl className="not-prose grid gap-4 sm:grid-cols-3">
          {caseStudy.results.map((result) => (
            <div
              key={result.label}
              className="border-border/60 rounded-lg border p-4"
            >
              <dt className="text-muted-foreground text-xs uppercase">
                {result.label}
              </dt>
              <dd className="text-primary mt-1 text-lg font-semibold">
                {result.value}
              </dd>
            </div>
          ))}
        </dl>

        <p>{caseStudy.challenge}</p>
        <p>{caseStudy.solution}</p>

        <Markdown html={caseStudy.content} />
      </ArticleLayout>
    </main>
  );
}
