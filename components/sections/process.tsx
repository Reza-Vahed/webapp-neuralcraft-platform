import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

const processStepKeys = ["discover", "strategize", "build", "scale"] as const;

export async function Process() {
  const t = await getTranslations("HomePage");
  const tSteps = await getTranslations("ProcessSteps");

  return (
    <Section className="border-border/60 border-t">
      <Container>
        <div className="max-w-2xl">
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">
            {t("processEyebrow")}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("processTitle")}
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            {t("processSubtitle")}
          </p>
        </div>

        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {processStepKeys.map((key, index) => (
            <li key={key} className="border-border/60 border-t pt-6">
              <span className="text-muted-foreground text-sm font-semibold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-semibold">{tSteps(`${key}.title`)}</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                {tSteps(`${key}.description`)}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
