import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { HeroBackground } from "@/components/sections/hero-background";
import { HeroInteractive } from "@/components/sections/hero-interactive";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Link } from "@/i18n/navigation";

// Hero stays a Server Component — translations are still fetched here, on
// the server, exactly as before. HeroInteractive is the one Client
// Component boundary this section needs: it owns pointer tracking for the
// glow parallax (see hero-interactive.tsx for why the listener has to sit
// on the outermost wrapper, not on a layer inside HeroBackground) and hands
// the offset down via context to HeroGlow, several server-rendered layers
// below — see DESIGN.md's Hero section.
export async function Hero() {
  const t = await getTranslations("HomePage");

  return (
    <HeroInteractive>
      <HeroBackground />

      <Container className="relative z-10 flex flex-col items-center gap-8 py-20 text-center sm:py-28 lg:py-32">
        <span className="border-border/60 bg-muted/50 text-muted-foreground rounded-full border px-4 py-1.5 text-sm font-medium">
          {t("eyebrow")}
        </span>

        <h1 className="font-heading max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {t("heroTitle")}
        </h1>

        <p className="text-muted-foreground max-w-xl text-lg text-balance">
          {t("heroSubtitle")}
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <MagneticButton>
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/contact" />}
            >
              {t("ctaPrimary")}
            </Button>
          </MagneticButton>
          <MagneticButton>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href="/services" />}
            >
              {t("ctaSecondary")}
            </Button>
          </MagneticButton>
        </div>
      </Container>
    </HeroInteractive>
  );
}
