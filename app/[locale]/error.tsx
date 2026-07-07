"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Link } from "@/i18n/navigation";

// Error boundaries must be Client Components (see Next.js docs). This file
// sits inside app/[locale]/, so it does NOT replace app/[locale]/layout.tsx —
// the Navbar/Footer/ThemeProvider/NextIntlClientProvider above it keep
// rendering, which is why useTranslations (a client hook) still works here.
export default function ErrorBoundary({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const t = useTranslations("ErrorPage");

  useEffect(() => {
    // TODO: forward to a real error-monitoring service once one is wired up.
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" className="flex flex-1 items-center justify-center">
      <Container className="flex flex-col items-center gap-6 py-24 text-center">
        <div className="bg-destructive/10 text-destructive flex size-20 items-center justify-center rounded-full">
          <TriangleAlert className="size-10" aria-hidden />
        </div>
        <p className="text-destructive text-sm font-semibold tracking-wide uppercase">
          {t("eyebrow")}
        </p>
        <h1 className="max-w-lg text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {t("title")}
        </h1>
        <p className="text-muted-foreground max-w-md text-lg text-balance">
          {t("lead")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" onClick={() => unstable_retry()}>
            {t("retry")}
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link href="/" />}
          >
            {t("cta")}
          </Button>
        </div>
      </Container>
    </main>
  );
}
