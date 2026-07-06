import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { companyValueIds } from "@/lib/about-content";

export async function CompanyValues() {
  const t = await getTranslations("AboutPage");
  const tValues = await getTranslations("AboutPage.values");

  return (
    <Section className="bg-muted/30 border-border/60 border-t">
      <Container>
        <div className="max-w-2xl">
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">
            {t("valuesEyebrow")}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("valuesTitle")}
          </h2>
        </div>

        <dl className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {companyValueIds.map((id) => (
            <div key={id}>
              <dt className="font-semibold">{tValues(`${id}.title`)}</dt>
              <dd className="text-muted-foreground mt-2 text-sm">
                {tValues(`${id}.description`)}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
