"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { submitContactForm } from "@/lib/actions/contact-form";
import {
  createContactFormSchema,
  type ContactFormValues,
} from "@/lib/validations/contact-form";

export function ContactForm() {
  const locale = useLocale() as Locale;
  const t = useTranslations("ContactPage.form");
  const [status, setStatus] = useState<"idle" | "error">("idle");
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = createContactFormSchema({
    nameRequired: t("errors.nameRequired"),
    nameTooLong: t("errors.nameTooLong"),
    emailInvalid: t("errors.emailInvalid"),
    companyTooLong: t("errors.companyTooLong"),
    messageRequired: t("errors.messageRequired"),
    messageTooLong: t("errors.messageTooLong"),
    privacyRequired: t("errors.privacyRequired"),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
      privacyConsent: false,
    },
  });

  async function onSubmit(values: ContactFormValues) {
    setServerError(null);
    const result = await submitContactForm(locale, values);

    if (result.status === "success") {
      setSubmitted(true);
      reset();
    } else {
      setStatus("error");
      setServerError(result.message);
    }
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
            <CheckCircle2 className="size-6" aria-hidden />
          </div>
          <p className="text-lg font-semibold">{t("successTitle")}</p>
          <p className="text-muted-foreground max-w-sm text-sm">
            {t("successBody")}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSubmitted(false)}
          >
            {t("sendAnother")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          {status === "error" && serverError && (
            <p role="alert" className="text-destructive text-sm">
              {serverError}
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="contact-name">{t("nameLabel")}</Label>
            <Input
              id="contact-name"
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              {...register("name")}
            />
            {errors.name && (
              <p
                id="contact-name-error"
                role="alert"
                className="text-destructive text-sm"
              >
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contact-email">{t("emailLabel")}</Label>
            <Input
              id="contact-email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={
                errors.email ? "contact-email-error" : undefined
              }
              {...register("email")}
            />
            {errors.email && (
              <p
                id="contact-email-error"
                role="alert"
                className="text-destructive text-sm"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contact-company">{t("companyLabel")}</Label>
            <Input
              id="contact-company"
              autoComplete="organization"
              aria-invalid={!!errors.company}
              aria-describedby={
                errors.company ? "contact-company-error" : undefined
              }
              {...register("company")}
            />
            {errors.company && (
              <p
                id="contact-company-error"
                role="alert"
                className="text-destructive text-sm"
              >
                {errors.company.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contact-message">{t("messageLabel")}</Label>
            <Textarea
              id="contact-message"
              rows={5}
              aria-invalid={!!errors.message}
              aria-describedby={
                errors.message ? "contact-message-error" : undefined
              }
              {...register("message")}
            />
            {errors.message && (
              <p
                id="contact-message-error"
                role="alert"
                className="text-destructive text-sm"
              >
                {errors.message.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-start gap-2.5">
              <Controller
                control={control}
                name="privacyConsent"
                render={({ field }) => (
                  <Checkbox
                    id="contact-privacy"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-invalid={!!errors.privacyConsent}
                    aria-describedby={
                      errors.privacyConsent
                        ? "contact-privacy-error"
                        : undefined
                    }
                    className="mt-0.5"
                  />
                )}
              />
              <Label
                htmlFor="contact-privacy"
                className="text-muted-foreground font-normal"
              >
                {t.rich("privacyLabel", {
                  link: (chunks) => (
                    <Link
                      href="/privacy"
                      className="text-foreground underline underline-offset-4"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </Label>
            </div>
            {errors.privacyConsent && (
              <p
                id="contact-privacy-error"
                role="alert"
                className="text-destructive mt-1.5 text-sm"
              >
                {errors.privacyConsent.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting && (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            )}
            {isSubmitting ? t("submitting") : t("submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
