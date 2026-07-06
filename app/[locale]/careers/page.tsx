import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { JobPostingCard } from "@/components/content/job-posting-card";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { getJobPostings } from "@/lib/content";
import { buildAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CareersPage" });

  return {
    title: t("title"),
    description: t("lead"),
    alternates: buildAlternates(locale, "/careers"),
    openGraph: { title: t("title"), description: t("lead") },
  };
}

export default async function CareersPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CareersPage" });
  const jobs = getJobPostings(locale);

  return (
    <main id="main-content" className="flex-1">
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
      <Container className="pb-24">
        {jobs.length === 0 ? (
          <p className="text-muted-foreground">{t("empty")}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobPostingCard key={job.slug} job={job} />
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
