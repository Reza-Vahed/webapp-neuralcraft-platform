"use server";

import { getTranslations } from "next-intl/server";

import {
  createContactFormSchema,
  type ContactFormValues,
} from "@/lib/validations/contact-form";
import type { Locale } from "@/i18n/routing";

export type ContactFormResult =
  { status: "success" } | { status: "error"; message: string };

export async function submitContactForm(
  locale: Locale,
  values: ContactFormValues
): Promise<ContactFormResult> {
  const t = await getTranslations({ locale, namespace: "ContactPage.form" });

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

  // TODO(future phase): dispatch via an email provider (e.g. Resend) once
  // one is configured. Logging server-side for now so inquiries are at
  // least visible instead of being silently discarded.
  console.info("[contact] new inquiry received", {
    name: parsed.data.name,
    email: parsed.data.email,
    company: parsed.data.company || undefined,
  });

  return { status: "success" };
}
