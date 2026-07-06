import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function HomePage() {
  const t = await getTranslations("HomePage");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-32 text-center">
      <div className="fixed end-4 top-4">
        <ThemeToggle />
      </div>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
        {t("heroTitle")}
      </h1>
      <p className="text-muted-foreground max-w-xl text-lg">
        {t("heroSubtitle")}
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button size="lg">{t("ctaPrimary")}</Button>
        <Button size="lg" variant="outline">
          {t("ctaSecondary")}
        </Button>
      </div>
    </main>
  );
}
