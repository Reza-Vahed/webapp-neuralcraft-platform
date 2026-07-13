import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const valuePropKeys = [
  "measurable",
  "partnership",
  "practical",
  "accessible",
] as const;

export async function ValueProps() {
  const t = await getTranslations("HomePage");
  const tValueProps = await getTranslations("ValueProps");

  return (
    <Section spacing="compact" className="bg-muted/30">
      <Container>
        <ScrollReveal className="max-w-2xl">
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">
            {t("valuePropsEyebrow")}
          </p>
          <h2 className="font-heading mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("valuePropsTitle")}
          </h2>
        </ScrollReveal>

        <dl className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {valuePropKeys.map((key) => (
            <div key={key}>
              <dt className="font-semibold">{tValueProps(`${key}.title`)}</dt>
              <dd className="text-muted-foreground mt-2 text-sm">
                {tValueProps(`${key}.description`)}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
