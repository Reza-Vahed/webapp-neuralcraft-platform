"use client";

import { useLocale } from "next-intl";

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

  return (
    <div className="flex items-center gap-1" aria-label="Sprache / Language">
      {routing.locales.map((locale) => {
        const isActive = locale === activeLocale;
        return (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "rounded-md px-2 py-1 text-sm font-medium transition-colors",
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
