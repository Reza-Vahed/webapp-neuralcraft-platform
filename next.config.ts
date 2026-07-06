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

const nextConfig: NextConfig = {/* config options here */};

// Next.js's config loader calls this via require() on a compiled CJS
// bundle, which can't sit on top of a top-level await — so the async work
// has to happen inside the exported function instead.
export default async function config() {
  await enableVelite();
  return withNextIntl(nextConfig);
}
