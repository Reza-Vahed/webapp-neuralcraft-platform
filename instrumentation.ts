import type { Instrumentation } from "next";

import { logger } from "@/lib/logger";

// Integration point for a real observability provider (e.g. Sentry,
// Datadog, OpenTelemetry) once one is selected. Intentionally a no-op for
// now — see DESIGN.md's monitoring section.
export function register() {}

// Server-side errors (Server Components, Route Handlers, Server Actions)
// land here. Logged to the server console for now; swap the body for a
// real provider call once one is configured — the signature won't change.
export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context
) => {
  const message = error instanceof Error ? error.message : String(error);
  const digest =
    typeof error === "object" && error !== null && "digest" in error
      ? String(error.digest)
      : undefined;

  logger.error("Unhandled request error", {
    message,
    digest,
    path: request.path,
    method: request.method,
    routeType: context.routeType,
  });
};
