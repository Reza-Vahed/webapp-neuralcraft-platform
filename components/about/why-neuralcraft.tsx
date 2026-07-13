import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { whyNeuralCraftIds } from "@/lib/about-content";

export async function WhyNeuralCraft() {
  const t = await getTranslations("AboutPage");
  const tWhy = await getTranslations("AboutPage.why");

  return (
    <Section className="bg-muted/30 border-border/60 border-t">
      <Container>
        <ScrollReveal className="max-w-2xl">
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">
            {t("whyEyebrow")}
          </p>
          <h2 className="font-heading mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("whyTitle")}
          </h2>
        </ScrollReveal>

        <dl className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2">
          {whyNeuralCraftIds.map((id) => (
            <div key={id}>
              <dt className="font-semibold">{tWhy(`${id}.title`)}</dt>
              <dd className="text-muted-foreground mt-2 text-sm">
                {tWhy(`${id}.description`)}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
