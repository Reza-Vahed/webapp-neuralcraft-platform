"use server";

import { getTranslations } from "next-intl/server";

import { sendContactEmails } from "@/lib/email/send-contact-emails";
import { logger } from "@/lib/logger";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  isHoneypotTriggered,
  verifyTurnstileToken,
} from "@/lib/spam-protection";
import {
  createContactFormSchema,
  HONEYPOT_FIELD_NAME,
  type ContactFormValues,
} from "@/lib/validations/contact-form";
import type { Locale } from "@/i18n/routing";

export type ContactFormResult =
  { status: "success" } | { status: "error"; message: string };

// Security-related fields are kept separate from ContactFormValues so the
// Zod schema stays focused on the actual message content — these are about
// trusting the *request*, not validating the message.
export type ContactFormSecurity = {
  /** Honeypot value (see lib/spam-protection.ts) — must be empty. */
  [HONEYPOT_FIELD_NAME]: string;
  /** Cloudflare Turnstile token — undefined until the widget is enabled. */
  turnstileToken?: string;
};

// 5 submissions per 10 minutes per IP — generous enough for a genuine
// visitor retrying a typo, tight enough to blunt a scripted flood.
const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };
const EMAIL_TIMEOUT_MS = 8000;

// Promise.race can't cancel the underlying Resend request, only stop
// waiting for it — good enough here since the goal is bounding how long a
// slow provider can hang this request, not aborting the network call.
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms);
    }),
  ]);
}

export async function submitContactForm(
  locale: Locale,
  values: ContactFormValues,
  security: ContactFormSecurity
): Promise<ContactFormResult> {
  const t = await getTranslations({ locale, namespace: "ContactPage.form" });

  // Rate limit gates everything below, including honeypot-triggered
  // requests — otherwise a bot that always fills the honeypot would never
  // be throttled, since it'd keep hitting the (cheap) early-return below.
  const ip = await getClientIp();
  const rateLimit = checkRateLimit(`contact-form:${ip}`, RATE_LIMIT);
  if (!rateLimit.success) {
    logger.warn("Contact form rate limit exceeded", { ip });
    return { status: "error", message: t("errors.rateLimited") };
  }

  // Bots that fill every input (including ones humans never see) trip this.
  // Fake success so they never learn the submission was discarded.
  if (isHoneypotTriggered(security[HONEYPOT_FIELD_NAME])) {
    logger.warn("Contact form honeypot triggered — discarding silently");
    return { status: "success" };
  }

  // No-op until TURNSTILE_SECRET_KEY is configured (see lib/spam-protection.ts).
  const turnstile = await verifyTurnstileToken(security.turnstileToken);
  if (!turnstile.success) {
    logger.warn("Contact form spam check failed", { ip });
    return { status: "error", message: t("genericError") };
  }

  const schema = createContactFormSchema({
    nameRequired: t("errors.nameRequired"),
    nameTooLong: t("errors.nameTooLong"),
    emailInvalid: t("errors.emailInvalid"),
    companyTooLong: t("errors.companyTooLong"),
    messageRequired: t("errors.messageRequired"),
    messageTooLong: t("errors.messageTooLong"),
    privacyRequired: t("errors.privacyRequired"),
  });

  const parsed = schema.safeParse(values);

  if (!parsed.success) {
    // The client already validates against the same schema — reaching this
    // branch means the request bypassed the UI (or was tampered with), so a
    // generic message is sufficient here.
    return { status: "error", message: t("genericError") };
  }

  try {
    await withTimeout(sendContactEmails(locale, parsed.data), EMAIL_TIMEOUT_MS);
  } catch (error) {
    const isTimeout =
      error instanceof Error && error.message.startsWith("Timed out");
    logger.error("Contact form email delivery failed", {
      reason: error instanceof Error ? error.message : String(error),
    });
    // Never surface the underlying error (provider details, stack, etc.) to
    // the client — only a translated, generic message.
    return {
      status: "error",
      message: isTimeout ? t("errors.timeout") : t("genericError"),
    };
  }

  logger.info("Contact form submission processed", {
    email: parsed.data.email,
  });

  return { status: "success" };
}
