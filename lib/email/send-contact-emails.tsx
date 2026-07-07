import "server-only";

import { render } from "@react-email/render";
import { getTranslations } from "next-intl/server";

import { ContactConfirmationEmail } from "@/lib/email/templates/contact-confirmation-email";
import { ContactNotificationEmail } from "@/lib/email/templates/contact-notification-email";
import { getResendClient } from "@/lib/email/resend-client";
import { logger } from "@/lib/logger";
import { getDirection, type Locale } from "@/i18n/routing";
import type { ContactFormValues } from "@/lib/validations/contact-form";

const FROM_ADDRESS =
  process.env.CONTACT_EMAIL_FROM ?? "NeuralCraft <onboarding@resend.dev>";
const NOTIFICATION_RECIPIENT =
  process.env.CONTACT_EMAIL_TO ?? "hello@neuralcraft.ai";

/**
 * Sends the customer confirmation + internal lead-notification email for a
 * validated contact form submission. Both are rendered once as React
 * elements and turned into HTML + plain text via the same `render()` call
 * (see @react-email/render), so there is exactly one source of truth per
 * email, not a separately maintained plain-text copy.
 *
 * Throws only when the *internal* notification fails to send — that's the
 * one email this business can't afford to lose silently, since there is no
 * database backing this form (see IA.md). A failed customer confirmation is
 * logged but does not fail the submission.
 */
export async function sendContactEmails(
  locale: Locale,
  submission: ContactFormValues
): Promise<void> {
  const resend = getResendClient();
  if (!resend) {
    logger.warn("Skipping contact email delivery — Resend not configured", {
      email: submission.email,
    });
    return;
  }

  const t = await getTranslations({ locale, namespace: "ContactPage.emails" });
  const dir = getDirection(locale);

  const confirmationElement = (
    <ContactConfirmationEmail
      lang={locale}
      dir={dir}
      strings={{
        heading: t("confirmation.heading", { name: submission.name }),
        body: t("confirmation.body"),
        messageRecapLabel: t("confirmation.messageRecapLabel"),
        signature: t("confirmation.signature"),
        footerNote: t("confirmation.footerNote"),
      }}
      message={submission.message}
    />
  );

  const notificationElement = (
    <ContactNotificationEmail
      lang={locale}
      dir={dir}
      strings={{
        heading: t("notification.heading"),
        nameLabel: t("notification.nameLabel"),
        emailLabel: t("notification.emailLabel"),
        companyLabel: t("notification.companyLabel"),
        messageLabel: t("notification.messageLabel"),
        footerNote: t("notification.footerNote", { name: submission.name }),
      }}
      data={submission}
    />
  );

  const [
    confirmationHtml,
    confirmationText,
    notificationHtml,
    notificationText,
  ] = await Promise.all([
    render(confirmationElement),
    render(confirmationElement, { plainText: true }),
    render(notificationElement),
    render(notificationElement, { plainText: true }),
  ]);

  const [confirmationResult, notificationResult] = await Promise.allSettled([
    resend.emails.send({
      from: FROM_ADDRESS,
      to: submission.email,
      subject: t("confirmation.subject"),
      html: confirmationHtml,
      text: confirmationText,
    }),
    resend.emails.send({
      from: FROM_ADDRESS,
      to: NOTIFICATION_RECIPIENT,
      replyTo: submission.email,
      subject: t("notification.subject", { name: submission.name }),
      html: notificationHtml,
      text: notificationText,
    }),
  ]);

  if (notificationResult.status === "rejected") {
    logger.error("Failed to deliver internal contact notification email", {
      reason: String(notificationResult.reason),
    });
    throw new Error("Failed to deliver internal contact notification email");
  }

  if (confirmationResult.status === "rejected") {
    logger.warn("Failed to deliver contact confirmation email to customer", {
      email: submission.email,
      reason: String(confirmationResult.reason),
    });
  }
}
