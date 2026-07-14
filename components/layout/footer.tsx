import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Link } from "@/i18n/navigation";

const navItems = [
  { href: "/services", key: "services" },
  { href: "/case-studies", key: "caseStudies" },
  { href: "/about", key: "about" },
  { href: "/blog", key: "blog" },
  { href: "/careers", key: "careers" },
  { href: "/contact", key: "contact" },
] as const;

export function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  const year = new Date().getFullYear();

  return (
    <footer className="border-border/60 border-t">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-2">
          <span className="font-heading text-base font-semibold tracking-tight">
            NeuralCraft
          </span>
          <p className="text-muted-foreground mt-3 max-w-sm text-sm">
            {t("tagline")}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">{t("navigation")}</h3>
          <ul className="mt-4 space-y-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {tNav(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">{t("legal")}</h3>
          <ul className="mt-4 space-y-3">
            <li>
              <Link
                href="/imprint"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {t("impressum")}
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {t("privacy")}
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <Container className="border-border/60 border-t py-6">
        <p className="text-muted-foreground text-sm">{t("rights", { year })}</p>
      </Container>
    </footer>
  );
}
