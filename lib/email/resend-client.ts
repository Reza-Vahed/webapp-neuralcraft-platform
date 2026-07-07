import "server-only";

import { Resend } from "resend";

import { logger } from "@/lib/logger";

let client: Resend | null = null;
let warnedMissingKey = false;

/**
 * Lazily creates the Resend client. Returns null when RESEND_API_KEY isn't
 * set (e.g. local dev, or before a real key is provisioned) so callers can
 * degrade gracefully instead of crashing — see lib/email/send-contact-emails.tsx.
 */
export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (!warnedMissingKey) {
      // Logged once per process, not per request, to avoid log spam.
      warnedMissingKey = true;
      logger.warn(
        "RESEND_API_KEY is not set — contact form emails will not be sent"
      );
    }
    return null;
  }

  client ??= new Resend(apiKey);
  return client;
}
