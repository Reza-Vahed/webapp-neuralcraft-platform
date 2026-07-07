import { emailStyles as s } from "@/lib/email/templates/styles";

export type ContactConfirmationEmailProps = {
  lang: string;
  dir: "ltr" | "rtl";
  strings: {
    heading: string;
    body: string;
    messageRecapLabel: string;
    signature: string;
    footerNote: string;
  };
  message: string;
};

// Rendered via @react-email/render (see lib/email/send-contact-emails.tsx)
// into both HTML and plain-text — no @react-email/components here, since
// every component in that package (and its individual primitives) is
// deprecated upstream. Plain table/div markup + inline styles works with
// the same renderer and has no dependency on a discontinued package.
export function ContactConfirmationEmail({
  lang,
  dir,
  strings,
  message,
}: ContactConfirmationEmailProps) {
  return (
    <html lang={lang} dir={dir}>
      <body style={s.body}>
        <div style={s.container}>
          <div style={s.header}>
            <p style={s.brand}>NeuralCraft</p>
          </div>
          <div style={s.content}>
            <h1 style={s.heading}>{strings.heading}</h1>
            <p style={s.paragraph}>{strings.body}</p>
            <p style={s.label}>{strings.messageRecapLabel}</p>
            <p style={s.value}>{message}</p>
            <p style={s.paragraph}>{strings.signature}</p>
          </div>
          <div style={s.footer}>
            <p style={s.footerText}>{strings.footerNote}</p>
          </div>
        </div>
      </body>
    </html>
  );
}
