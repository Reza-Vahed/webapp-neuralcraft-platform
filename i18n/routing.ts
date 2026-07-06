import { defineRouting } from "next-intl/routing";

export const locales = ["de", "en", "fa"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "de";

export const rtlLocales: readonly Locale[] = ["fa"];

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});
