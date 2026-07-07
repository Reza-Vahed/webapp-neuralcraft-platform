import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { ArticleLayout } from "@/components/layout/article-layout";
import { Container } from "@/components/layout/container";
import { Markdown } from "@/components/content/markdown";
import { jobPostings } from "@/.velite";
import { getJobPosting } from "@/lib/content";
import { buildBasicMetadata } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: Locale; slug: string }>;
};

export function generateStaticParams() {
  return jobPostings.map((job) => ({ locale: job.locale, slug: job.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const job = getJobPosting(locale, slug);
  if (!job) return {};

  return buildBasicMetadata({
    title: job.title,
    description: job.description,
    locale,
    path: `/careers/${slug}`,
  });
}

export default async function JobPostingPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const job = getJobPosting(locale, slug);

  if (!job) notFound();

  const t = await getTranslations({ locale, namespace: "CareersPage" });

  return (
    <main id="main-content" className="flex-1">
      <Container className="max-w-3xl pt-8">
        <Link
          href="/careers"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
          {t("backToOverview")}
        </Link>
      </Container>

      <ArticleLayout
        title={job.title}
        description={job.description}
        meta={`${job.department} · ${job.location} · ${t(`employmentType.${job.employmentType}`)}`}
      >
        <h2>{t("requirementsTitle")}</h2>
        <ul>
          {job.requirements.map((requirement) => (
            <li key={requirement}>{requirement}</li>
          ))}
        </ul>

        <Markdown html={job.content} />
      </ArticleLayout>
    </main>
  );
}
