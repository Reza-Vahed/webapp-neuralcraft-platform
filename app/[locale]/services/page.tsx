import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ServiceCard } from "@/components/content/service-card";
import { buildAlternates } from "@/lib/seo";
import { services } from "@/lib/services";
import type { Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ServicesPage" });

  return {
    title: t("title"),
    description: t("lead"),
    alternates: buildAlternates(locale, "/services"),
    openGraph: { title: t("title"), description: t("lead") },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("lead"),
    },
  };
}

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ServicesPage" });
  const tServices = await getTranslations({ locale, namespace: "Services" });

  return (
    <main id="main-content" className="flex-1">
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
      <Container className="pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ slug, messageKey, icon }) => (
            <ServiceCard
              key={slug}
              slug={slug}
              icon={icon}
              title={tServices(`${messageKey}.title`)}
              description={tServices(`${messageKey}.description`)}
            />
          ))}
        </div>
      </Container>
    </main>
  );
}
