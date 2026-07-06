import { Check, X } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { qualityChecks } from "@/lib/dev-status";

export async function QualityStatus() {
  const t = await getTranslations("DevDashboard.quality");

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">{t("title")}</h2>
      <p className="text-muted-foreground mt-2 text-sm">{t("note")}</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {qualityChecks.map((check) => (
          <li
            key={check.id}
            className="border-border/60 flex items-center justify-between gap-3 rounded-lg border p-4"
          >
            <span className="font-medium">{t(check.id)}</span>
            <Badge
              variant={check.status === "pass" ? "default" : "destructive"}
            >
              {check.status === "pass" ? (
                <Check className="size-3" aria-hidden />
              ) : (
                <X className="size-3" aria-hidden />
              )}
              {check.status === "pass" ? t("statusPass") : t("statusFail")}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}
