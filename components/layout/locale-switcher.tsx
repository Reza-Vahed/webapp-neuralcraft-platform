"use client";

import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

// Language names are always shown in their own language, regardless of the
// active locale — this is the standard convention for locale switchers.
const localeNames: Record<(typeof routing.locales)[number], string> = {
  de: "Deutsch",
  en: "English",
  fa: "فارسی",
};

export function LocaleSwitcher() {
  const activeLocale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Common");

  return (
    <div
      className="flex items-center gap-1"
      aria-label={t("languageSwitcherLabel")}
    >
      {routing.locales.map((locale) => {
        const isActive = locale === activeLocale;
        return (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              // Mobile-audit: py-3 (not py-1) — these labels are already
              // wide enough horizontally, the 28px-tall original fell short
              // only on the vertical axis; 12px top/bottom + the 20px
              // text-sm line height lands on the 44px guideline.
              "rounded-md px-2 py-3 text-sm font-medium transition-colors",
              isActive
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {localeNames[locale]}
          </Link>
        );
      })}
    </div>
  );
}
