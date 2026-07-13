import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono, Vazirmatn } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getDirection, routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SkipLink } from "@/components/layout/skip-link";
import { CookieNotice } from "@/components/legal/cookie-notice";
import { WebVitals } from "@/components/web-vitals";
import { AnalyticsScripts } from "@/components/analytics/analytics-scripts";
import { siteUrl } from "@/lib/site";
import { buildAlternates } from "@/lib/seo";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display font for headlines only (h1/h2, see `font-heading` in
// globals.css) — body text stays on Geist Sans. Fraunces has no Arabic
// glyphs, so on Farsi pages the browser's per-glyph font fallback silently
// drops through `--font-heading`'s own fallback chain to Vazirmatn, the
// same automatic script fallback already used for `--font-sans` — no
// locale branching needed in the component code.
//
// `axes` opts into Fraunces' non-standard variable axes (opsz = optical
// size, SOFT/WONK = the softer, hand-drawn-leaning alternates) — next/font
// only loads the standard weight axis by default, and the editorial
// character we picked this font for comes from those extra axes.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: Pick<LocaleLayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("title"),
      template: `%s · NeuralCraft`,
    },
    description: t("description"),
    alternates: buildAlternates(locale, ""),
    openGraph: {
      type: "website",
      locale,
      url: `/${locale}`,
      siteName: "NeuralCraft",
      title: t("title"),
      description: t("description"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      dir={getDirection(locale)}
      className={`${geistSans.variable} ${geistMono.variable} ${vazirmatn.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        {/* Safety net for components/ui/scroll-reveal.tsx: its Framer
            Motion elements SSR at opacity:0 until JS hydrates and reveals
            them on scroll — without JS that content would stay invisible
            forever, so this forces it visible whenever scripting is off. */}
        <noscript>
          <style>{`[data-scroll-reveal]{opacity:1!important;transform:none!important;}`}</style>
        </noscript>
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SkipLink />
            <Navbar />
            {children}
            <Footer />
            <CookieNotice />
            <WebVitals />
            <AnalyticsScripts />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
