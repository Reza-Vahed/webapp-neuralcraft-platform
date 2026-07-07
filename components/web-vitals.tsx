"use client";

import { useReportWebVitals } from "next/web-vitals";

// Confines the 'use client' boundary to this one component instead of the
// whole root layout (see Next.js docs for useReportWebVitals). Logs to the
// console for now — swap for a real analytics/observability provider once
// one is configured; the callback shape won't need to change.
export function WebVitals() {
  useReportWebVitals((metric) => {
    console.info(`[web-vitals] ${metric.name}`, metric);
  });

  return null;
}
