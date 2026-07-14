import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Link } from "@/i18n/navigation";
import { caseStudyTeaserKeys } from "@/lib/case-study-teasers";

export async function CaseStudiesTeaser() {
  const t = await getTranslations("HomePage");
  const tItems = await getTranslations("CaseStudyTeasers.items");

  return (
    <Section className="bg-muted/30 border-border/60 border-t">
      <Container>
        <ScrollReveal className="max-w-2xl">
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">
            {t("caseStudiesEyebrow")}
          </p>
          <h2 className="font-heading mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("caseStudiesTitle")}
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            {t("caseStudiesSubtitle")}
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {caseStudyTeaserKeys.map((key) => (
            <Card
              key={key}
              className="ring-foreground/16 dark:ring-foreground/10 h-full"
            >
              <CardHeader>
                <p className="text-muted-foreground text-xs font-medium uppercase">
                  {tItems(`${key}.industry`)}
                </p>
                <CardTitle className="mt-2 text-lg">
                  {tItems(`${key}.title`)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-primary text-sm font-semibold">
                  {tItems(`${key}.result`)}
                </p>
                <p className="text-muted-foreground mt-3 text-sm">
                  {tItems(`${key}.description`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/case-studies"
            className="text-primary inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
          >
            {t("caseStudiesCta")}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
