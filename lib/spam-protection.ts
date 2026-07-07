import "server-only";

import { logger } from "@/lib/logger";

// See lib/validations/contact-form.ts for HONEYPOT_FIELD_NAME — it lives
// there (not here) because the client form needs the same constant and
// this file is server-only.
export function isHoneypotTriggered(value: string | undefined): boolean {
  return Boolean(value && value.trim().length > 0);
}

type TurnstileVerifyResult = { success: boolean };

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_TIMEOUT_MS = 5000;

/**
 * Cloudflare Turnstile verification — inactive until TURNSTILE_SECRET_KEY is
 * set (see .env.example). Until then this always succeeds, so the form
 * behaves exactly as it does today. To enable Turnstile: configure
 * TURNSTILE_SECRET_KEY + NEXT_PUBLIC_TURNSTILE_SITE_KEY, then render the
 * widget in ContactForm and pass its token through as `token`.
 */
export async function verifyTurnstileToken(
  token: string | undefined
): Promise<TurnstileVerifyResult> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) return { success: true };

  if (!token) return { success: false };

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: secretKey, response: token }),
      signal: AbortSignal.timeout(TURNSTILE_TIMEOUT_MS),
    });
    const data = (await response.json()) as { success: boolean };
    return { success: data.success };
  } catch (error) {
    // Fail closed: if Turnstile is configured but unreachable, treat the
    // submission as unverified rather than silently letting it through.
    logger.warn("Turnstile verification request failed", {
      reason: error instanceof Error ? error.message : String(error),
    });
    return { success: false };
  }
}
