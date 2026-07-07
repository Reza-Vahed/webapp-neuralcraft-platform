import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ContactInfo } from "@/components/contact/contact-info";
import { ContactForm } from "@/components/contact/contact-form";
import { buildAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ContactPage" });

  return {
    title: t("title"),
    description: t("lead"),
    alternates: buildAlternates(locale, "/contact"),
    openGraph: { title: t("title"), description: t("lead") },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("lead"),
    },
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ContactPage" });

  return (
    <main id="main-content" className="flex-1">
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
      <Container className="grid gap-6 pb-24 lg:grid-cols-[1fr_2fr] lg:items-start">
        <ContactInfo />
        <ContactForm />
      </Container>
    </main>
  );
}
