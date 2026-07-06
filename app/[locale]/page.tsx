import { CaseStudiesTeaser } from "@/components/sections/case-studies-teaser";
import { CtaSection } from "@/components/sections/cta-section";
import { Hero } from "@/components/sections/hero";
import { Process } from "@/components/sections/process";
import { ServicesOverview } from "@/components/sections/services-overview";
import { ValueProps } from "@/components/sections/value-props";

export default function HomePage() {
  return (
    <main id="main-content" className="flex-1">
      <Hero />
      <ServicesOverview />
      <ValueProps />
      <Process />
      <CaseStudiesTeaser />
      <CtaSection />
    </main>
  );
}
