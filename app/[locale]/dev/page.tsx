import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectStatusCard } from "@/components/dev/project-status-card";
import { PhaseTimeline } from "@/components/dev/phase-timeline";
import { RouteExplorer } from "@/components/dev/route-explorer";
import { QualityStatus } from "@/components/dev/quality-status";
import { ArchitectureOverview } from "@/components/dev/architecture-overview";
import type { Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "DevDashboard" });

  return {
    title: t("title"),
    description: t("lead"),
    robots: { index: false, follow: false },
  };
}

export default async function DevDashboardPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "DevDashboard" });

  return (
    <main id="main-content" className="flex-1">
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

      <Container className="flex flex-col gap-16 pb-24">
        <ProjectStatusCard />
        <PhaseTimeline />
        <RouteExplorer />
        <QualityStatus />
        <ArchitectureOverview />
      </Container>
    </main>
  );
}
