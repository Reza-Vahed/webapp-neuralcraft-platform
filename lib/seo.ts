import { routing } from "@/i18n/routing";

/**
 * Builds `alternates` metadata (canonical + hreflang) for a path that exists
 * under every locale, e.g. buildAlternates("de", "/blog/my-post").
 */
export function buildAlternates(locale: string, pathWithoutLocale: string) {
  return {
    canonical: `/${locale}${pathWithoutLocale}`,
    languages: {
      ...Object.fromEntries(
        routing.locales.map((l) => [l, `/${l}${pathWithoutLocale}`])
      ),
      "x-default": `/${routing.defaultLocale}${pathWithoutLocale}`,
    },
  };
}
