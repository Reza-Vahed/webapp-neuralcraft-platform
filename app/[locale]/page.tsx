import { setRequestLocale } from "next-intl/server";

import { CaseStudiesTeaser } from "@/components/sections/case-studies-teaser";
import { CtaSection } from "@/components/sections/cta-section";
import { Hero } from "@/components/sections/hero";
import { Process } from "@/components/sections/process";
import { ServicesOverview } from "@/components/sections/services-overview";
import { ValueProps } from "@/components/sections/value-props";
import { JsonLd } from "@/components/content/json-ld";
import { buildOrganizationJsonLd } from "@/lib/structured-data";
import type { Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="main-content" className="flex-1">
      <JsonLd data={buildOrganizationJsonLd()} />
      <Hero />
      <ServicesOverview />
      <ValueProps />
      <Process />
      <CaseStudiesTeaser />
      <CtaSection />
    </main>
  );
}
