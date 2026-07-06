import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export async function MissionVision() {
  const t = await getTranslations("AboutPage");

  return (
    <Section spacing="compact">
      <Container className="grid gap-10 sm:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {t("mission.title")}
          </h2>
          <p className="text-muted-foreground mt-3 text-base">
            {t("mission.body")}
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {t("vision.title")}
          </h2>
          <p className="text-muted-foreground mt-3 text-base">
            {t("vision.body")}
          </p>
        </div>
      </Container>
    </Section>
  );
}
