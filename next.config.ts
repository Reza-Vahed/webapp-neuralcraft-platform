import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Next.js 16 only evaluates this config file once for `next dev` (previously
// twice), and `process.argv` no longer reliably contains `dev` at that point —
// so we key off NODE_ENV instead, per Next's own migration guidance.
const isProd = process.env.NODE_ENV === "production";

async function enableVelite() {
  if (process.env.VELITE_STARTED) return;
  process.env.VELITE_STARTED = "1";
  const { build } = await import("velite");
  await build({ watch: !isProd, clean: !isProd });
}

// Extra script/connect origins for whichever analytics provider is active
// (see lib/analytics.ts + components/analytics/analytics-scripts.tsx) — kept
// here so enabling a provider via env vars doesn't also require hand-editing
// the CSP. Self-hosted Plausible needs a manual addition since its domain
// isn't knowable in advance.
function getAnalyticsCspOrigins(): { script: string[]; connect: string[] } {
  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER;

  if (provider === "plausible") {
    return {
      script: ["https://plausible.io"],
      connect: ["https://plausible.io"],
    };
  }
  if (provider === "google-analytics") {
    return {
      script: ["https://www.googletagmanager.com"],
      connect: [
        "https://www.google-analytics.com",
        "https://analytics.google.com",
      ],
    };
  }
  if (provider === "umami" && process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL) {
    const origin = new URL(process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL).origin;
    return { script: [origin], connect: [origin] };
  }
  return { script: [], connect: [] };
}

const analyticsCspOrigins = getAnalyticsCspOrigins();

const cspDirectives = [
  "default-src 'self'",
  // next-themes injects a small inline script (components/theme-provider.tsx)
  // that sets the theme class before hydration, avoiding a flash of the
  // wrong theme. Dropping 'unsafe-inline' would require nonce-based CSP,
  // which forces every route into dynamic rendering — a direct regression
  // of the static-rendering work from Phase 8. Accepted trade-off; revisit
  // if that becomes worth it.
  // 'unsafe-eval' is dev-only: React uses eval() in development to
  // reconstruct server error stacks in the browser (see Next.js's CSP
  // guide); it never does in production.
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"} ${analyticsCspOrigins.script.join(" ")}`.trim(),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' ${analyticsCspOrigins.connect.join(" ")}`.trim(),
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspDirectives },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Only takes effect over HTTPS, which is how this is expected to run in
  // production (TLS terminated by nginx/certbot in front of Node — see
  // DEPLOYMENT.md). Harmless to send over plain HTTP in local dev.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

// Next.js's config loader calls this via require() on a compiled CJS
// bundle, which can't sit on top of a top-level await — so the async work
// has to happen inside the exported function instead.
export default async function config() {
  await enableVelite();
  return withNextIntl(nextConfig);
}
