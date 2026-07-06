import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Link } from "@/i18n/navigation";
import { services } from "@/lib/services";

export async function ServicesOverview() {
  const t = await getTranslations("HomePage");
  const tServices = await getTranslations("Services");

  return (
    <Section className="border-border/60 border-t">
      <Container>
        <div className="max-w-2xl">
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">
            {t("servicesEyebrow")}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("servicesTitle")}
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            {t("servicesSubtitle")}
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ slug, messageKey, icon: Icon }) => (
            <Link key={slug} href={`/services/${slug}`} className="group">
              <Card className="ring-foreground/10 group-hover:ring-primary/50 h-full transition-colors">
                <CardHeader>
                  <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <CardTitle className="mt-4 text-lg">
                    {tServices(`${messageKey}.title`)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {tServices(`${messageKey}.description`)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/services"
            className="text-primary inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
          >
            {t("servicesCta")}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
