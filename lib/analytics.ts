// Analytics architecture with no analytics running yet. Set
// NEXT_PUBLIC_ANALYTICS_PROVIDER (+ the provider's own vars, see
// .env.example) to activate one — until then getAnalyticsConfig() returns
// `{ provider: null }` and components/analytics/analytics-scripts.tsx
// renders nothing. next.config.ts reads the same env vars to widen the CSP
// for whichever provider is chosen.
export type AnalyticsConfig =
  | { provider: "plausible"; domain: string }
  | { provider: "google-analytics"; measurementId: string }
  | { provider: "umami"; websiteId: string; scriptUrl: string }
  | { provider: null };

export function getAnalyticsConfig(): AnalyticsConfig {
  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER;

  if (provider === "plausible") {
    const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
    return domain ? { provider: "plausible", domain } : { provider: null };
  }

  if (provider === "google-analytics") {
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    return measurementId
      ? { provider: "google-analytics", measurementId }
      : { provider: null };
  }

  if (provider === "umami") {
    const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
    const scriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
    return websiteId && scriptUrl
      ? { provider: "umami", websiteId, scriptUrl }
      : { provider: null };
  }

  return { provider: null };
}
