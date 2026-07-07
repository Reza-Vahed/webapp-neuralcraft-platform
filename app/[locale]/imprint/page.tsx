import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { LegalDisclaimer } from "@/components/legal/legal-disclaimer";
import { imprintSectionIds } from "@/lib/legal-content";
import { buildBasicMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ImprintPage" });

  return buildBasicMetadata({
    title: t("title"),
    description: t("lead"),
    locale,
    path: "/imprint",
  });
}

export default async function ImprintPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ImprintPage" });
  const tSections = await getTranslations({
    locale,
    namespace: "ImprintPage.sections",
  });

  return (
    <main id="main-content" className="flex-1">
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
      <Container className="max-w-3xl pb-24">
        <LegalDisclaimer>{t("disclaimer")}</LegalDisclaimer>

        <div className="prose prose-neutral dark:prose-invert mt-10 max-w-none">
          {imprintSectionIds.map((id) => (
            <section key={id}>
              <h2>{tSections(`${id}.title`)}</h2>
              <p>{tSections(`${id}.body`)}</p>
            </section>
          ))}
        </div>
      </Container>
    </main>
  );
}
