import type { Metadata } from "next";
import { Compass } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Link } from "@/i18n/navigation";

// `not-found.tsx` receives no props (see Next.js docs), so the locale isn't
// available as a param here — but next-intl's request config (i18n/request.ts)
// already resolved it for this request, and `getTranslations()`/
// `NextIntlClientProvider` (used without explicit props in the layout) pick
// that up automatically. Next.js also auto-injects `noindex` for any
// response that resolves to a 404 status, so no manual robots meta needed.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NotFound");
  return { title: t("title") };
}

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <main id="main-content" className="flex flex-1 items-center justify-center">
      <Container className="flex flex-col items-center gap-6 py-24 text-center">
        <div className="bg-primary/10 text-primary flex size-20 items-center justify-center rounded-full">
          <Compass className="size-10" aria-hidden />
        </div>
        <p className="text-primary text-sm font-semibold tracking-wide uppercase">
          {t("eyebrow")}
        </p>
        <h1 className="font-heading max-w-lg text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {t("title")}
        </h1>
        <p className="text-muted-foreground max-w-md text-lg text-balance">
          {t("lead")}
        </p>
        <Button size="lg" nativeButton={false} render={<Link href="/" />}>
          {t("cta")}
        </Button>
      </Container>
    </main>
  );
}
