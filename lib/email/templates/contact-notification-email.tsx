import { emailStyles as s } from "@/lib/email/templates/styles";

export type ContactNotificationEmailProps = {
  lang: string;
  dir: "ltr" | "rtl";
  strings: {
    heading: string;
    nameLabel: string;
    emailLabel: string;
    companyLabel: string;
    messageLabel: string;
    footerNote: string;
  };
  data: {
    name: string;
    email: string;
    company?: string;
    message: string;
  };
};

// Internal lead-notification email, sent to NeuralCraft's own inbox with
// reply-to set to the submitter (see lib/email/send-contact-emails.tsx) so
// replying from a normal mail client goes straight back to them.
export function ContactNotificationEmail({
  lang,
  dir,
  strings,
  data,
}: ContactNotificationEmailProps) {
  return (
    <html lang={lang} dir={dir}>
      <body style={s.body}>
        <div style={s.container}>
          <div style={s.header}>
            <p style={s.brand}>NeuralCraft</p>
          </div>
          <div style={s.content}>
            <h1 style={s.heading}>{strings.heading}</h1>

            <p style={s.label}>{strings.nameLabel}</p>
            <p style={s.value}>{data.name}</p>

            <p style={s.label}>{strings.emailLabel}</p>
            <p style={{ ...s.value, direction: "ltr" }}>{data.email}</p>

            {data.company && (
              <>
                <p style={s.label}>{strings.companyLabel}</p>
                <p style={s.value}>{data.company}</p>
              </>
            )}

            <p style={s.label}>{strings.messageLabel}</p>
            <p style={s.value}>{data.message}</p>
          </div>
          <div style={s.footer}>
            <p style={s.footerText}>{strings.footerNote}</p>
          </div>
        </div>
      </body>
    </html>
  );
}
