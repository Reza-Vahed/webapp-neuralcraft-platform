import type { Metadata } from "next";
import { ArrowLeft, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { CtaSection } from "@/components/sections/cta-section";
import { JsonLd } from "@/components/content/json-ld";
import { buildAlternates } from "@/lib/seo";
import { services } from "@/lib/services";
import { buildServiceJsonLd } from "@/lib/structured-data";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: Locale; slug: string }>;
};

const highlightKeys = ["point1", "point2", "point3"] as const;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    services.map(({ slug }) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) return {};

  const tServices = await getTranslations({ locale, namespace: "Services" });
  const title = tServices(`${service.messageKey}.title`);
  const description = tServices(`${service.messageKey}.description`);

  return {
    title,
    description,
    alternates: buildAlternates(locale, `/services/${slug}`),
    openGraph: { type: "website", title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) notFound();

  const t = await getTranslations({ locale, namespace: "ServiceDetailPage" });
  const tServicesPage = await getTranslations({
    locale,
    namespace: "ServicesPage",
  });
  const tServices = await getTranslations({ locale, namespace: "Services" });
  const Icon = service.icon;

  return (
    <main id="main-content" className="flex-1">
      <JsonLd
        data={buildServiceJsonLd({
          name: tServices(`${service.messageKey}.title`),
          description: tServices(`${service.messageKey}.description`),
          url: `/${locale}/services/${slug}`,
        })}
      />

      <Container className="max-w-3xl pt-8">
        <Link
          href="/services"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
          {t("backToOverview")}
        </Link>
      </Container>

      <PageHeader
        eyebrow={tServicesPage("eyebrow")}
        title={tServices(`${service.messageKey}.title`)}
        lead={tServices(`${service.messageKey}.lead`)}
      />

      <Section spacing="compact">
        <Container className="max-w-3xl">
          <div className="bg-primary/10 text-primary mb-6 flex size-12 items-center justify-center rounded-lg">
            <Icon className="size-6" aria-hidden />
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">
            {t("highlightsTitle")}
          </h2>
          <ul className="mt-6 space-y-4">
            {highlightKeys.map((key) => (
              <li key={key} className="flex items-start gap-3">
                <Check
                  className="text-primary mt-1 size-5 shrink-0"
                  aria-hidden
                />
                <span>
                  {tServices(`${service.messageKey}.highlights.${key}`)}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaSection />
    </main>
  );
}
