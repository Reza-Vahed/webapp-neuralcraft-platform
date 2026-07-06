import { Clock, Mail, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const rows = [
  // The email address is a technical, always-LTR string (see DESIGN.md's
  // note on forcing LTR for such values); the other two are ordinary
  // translated sentences and must follow the page's own direction.
  { icon: Mail, labelKey: "emailLabel", valueKey: "emailValue", ltr: true },
  {
    icon: Clock,
    labelKey: "responseTimeLabel",
    valueKey: "responseTimeValue",
    ltr: false,
  },
  {
    icon: MapPin,
    labelKey: "locationLabel",
    valueKey: "locationValue",
    ltr: false,
  },
] as const;

export async function ContactInfo() {
  const t = await getTranslations("ContactPage.info");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-5">
          {rows.map(({ icon: Icon, labelKey, valueKey, ltr }) => (
            <li key={labelKey} className="flex items-start gap-3">
              <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Icon className="size-4" aria-hidden />
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase">
                  {t(labelKey)}
                </p>
                <p
                  className="text-sm font-medium"
                  dir={ltr ? "ltr" : undefined}
                >
                  {t(valueKey)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
