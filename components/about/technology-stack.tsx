import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { technologyCategories } from "@/lib/about-content";

export async function TechnologyStack() {
  const t = await getTranslations("AboutPage");
  const tTech = await getTranslations("AboutPage.technologies");

  return (
    <Section className="border-border/60 border-t">
      <Container>
        <div className="max-w-2xl">
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">
            {t("technologyEyebrow")}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("technologyTitle")}
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            {t("technologyLead")}
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {technologyCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="text-base">
                  {tTech(`${category.id}.title`)}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-muted-foreground text-sm">
                  {tTech(`${category.id}.description`)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {category.tools.map((tool) => (
                    <Badge key={tool} variant="secondary">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
