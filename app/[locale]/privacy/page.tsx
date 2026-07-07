import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { LegalDisclaimer } from "@/components/legal/legal-disclaimer";
import { privacyRightsItemIds, privacySectionIds } from "@/lib/legal-content";
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
  const t = await getTranslations({ locale, namespace: "PrivacyPage" });

  return buildBasicMetadata({
    title: t("title"),
    description: t("lead"),
    locale,
    path: "/privacy",
  });
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "PrivacyPage" });
  const tSections = await getTranslations({
    locale,
    namespace: "PrivacyPage.sections",
  });
  const tRights = await getTranslations({
    locale,
    namespace: "PrivacyPage.sections.rights.items",
  });

  return (
    <main id="main-content" className="flex-1">
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
      <Container className="max-w-3xl pb-24">
        <LegalDisclaimer>{t("disclaimer")}</LegalDisclaimer>

        <div className="prose prose-neutral dark:prose-invert mt-10 max-w-none">
          {privacySectionIds.map((id) =>
            id === "rights" ? (
              <section key={id}>
                <h2>{tSections("rights.title")}</h2>
                <ul>
                  {privacyRightsItemIds.map((itemId) => (
                    <li key={itemId}>{tRights(itemId)}</li>
                  ))}
                </ul>
              </section>
            ) : (
              <section key={id}>
                <h2>{tSections(`${id}.title`)}</h2>
                <p>{tSections(`${id}.body`)}</p>
              </section>
            )
          )}
        </div>
      </Container>
    </main>
  );
}
