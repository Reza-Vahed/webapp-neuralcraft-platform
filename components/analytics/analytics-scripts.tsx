import Script from "next/script";

import { getAnalyticsConfig } from "@/lib/analytics";

// Server Component — next/script works without a client boundary here, and
// keeping this out of the client bundle when no provider is configured (the
// default) costs nothing. Renders nothing until NEXT_PUBLIC_ANALYTICS_PROVIDER
// is set (see .env.example and lib/analytics.ts).
export function AnalyticsScripts() {
  const config = getAnalyticsConfig();

  switch (config.provider) {
    case "plausible":
      return (
        <Script
          src="https://plausible.io/js/script.js"
          data-domain={config.domain}
          strategy="afterInteractive"
        />
      );

    case "google-analytics":
      return (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${config.measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${config.measurementId}');`}
          </Script>
        </>
      );

    case "umami":
      return (
        <Script
          src={config.scriptUrl}
          data-website-id={config.websiteId}
          strategy="afterInteractive"
        />
      );

    default:
      return null;
  }
}
