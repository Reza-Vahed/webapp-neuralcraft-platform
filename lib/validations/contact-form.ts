import { z } from "zod";

// Shared (not server-only) because the honeypot input needs to render on
// the client with this exact name, while lib/spam-protection.ts checks it
// server-side — this file is already imported by both sides.
export const HONEYPOT_FIELD_NAME = "website";

// Localized error messages are supplied by the caller (client component via
// useTranslations, Server Action via getTranslations) so this schema stays
// framework-agnostic and works identically on both sides of the request.
export type ContactFormMessages = {
  nameRequired: string;
  nameTooLong: string;
  emailInvalid: string;
  companyTooLong: string;
  messageRequired: string;
  messageTooLong: string;
  privacyRequired: string;
};

export function createContactFormSchema(m: ContactFormMessages) {
  return z.object({
    name: z.string().trim().min(1, m.nameRequired).max(120, m.nameTooLong),
    email: z.email(m.emailInvalid),
    company: z
      .string()
      .trim()
      .max(160, m.companyTooLong)
      .optional()
      .or(z.literal("")),
    message: z
      .string()
      .trim()
      .min(10, m.messageRequired)
      .max(4000, m.messageTooLong),
    privacyConsent: z.boolean().refine((value) => value === true, {
      message: m.privacyRequired,
    }),
  });
}

export type ContactFormValues = z.infer<
  ReturnType<typeof createContactFormSchema>
>;
