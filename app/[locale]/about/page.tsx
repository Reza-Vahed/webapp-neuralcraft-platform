import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/layout/page-header";
import { MissionVision } from "@/components/about/mission-vision";
import { CompanyValues } from "@/components/about/company-values";
import { TechnologyStack } from "@/components/about/technology-stack";
import { WhyNeuralCraft } from "@/components/about/why-neuralcraft";
import { Process } from "@/components/sections/process";
import { CtaSection } from "@/components/sections/cta-section";
import { buildAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });

  return {
    title: t("title"),
    description: t("lead"),
    alternates: buildAlternates(locale, "/about"),
    openGraph: { title: t("title"), description: t("lead") },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("lead"),
    },
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });

  return (
    <main id="main-content" className="flex-1">
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
      <MissionVision />
      <CompanyValues />
      <Process />
      <TechnologyStack />
      <WhyNeuralCraft />
      <CtaSection />
    </main>
  );
}
