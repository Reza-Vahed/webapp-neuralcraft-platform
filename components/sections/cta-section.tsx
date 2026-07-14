import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Link } from "@/i18n/navigation";

export async function CtaSection() {
  const t = await getTranslations("HomePage");

  return (
    <Section className="border-border/60 border-t">
      <ScrollReveal>
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-heading max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {t("ctaTitle")}
          </h2>
          <p className="text-muted-foreground max-w-lg text-lg text-balance">
            {t("ctaSubtitle")}
          </p>
          <MagneticButton>
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/contact" />}
            >
              {t("ctaButton")}
            </Button>
          </MagneticButton>
        </Container>
      </ScrollReveal>
    </Section>
  );
}
