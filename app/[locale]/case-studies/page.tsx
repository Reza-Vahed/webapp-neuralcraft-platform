import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CaseStudyCard } from "@/components/content/case-study-card";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { getCaseStudies } from "@/lib/content";
import { buildBasicMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "CaseStudiesPage" });

  return buildBasicMetadata({
    title: t("title"),
    description: t("lead"),
    locale,
    path: "/case-studies",
  });
}

export default async function CaseStudiesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "CaseStudiesPage" });
  const caseStudies = getCaseStudies(locale);

  return (
    <main id="main-content" className="flex-1">
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
      <Container className="pb-24">
        {caseStudies.length === 0 ? (
          <p className="text-muted-foreground">{t("empty")}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((caseStudy) => (
              <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} />
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
