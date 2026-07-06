import { getTranslations } from "next-intl/server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLastCommit } from "@/lib/git-info";
import { projectName } from "@/lib/dev-status";

export async function ProjectStatusCard() {
  const t = await getTranslations("DevDashboard.statusCard");
  const commit = getLastCommit();

  const rows: Array<{ label: string; value: string; dir?: "ltr" }> = [
    { label: t("projectName"), value: projectName },
    { label: t("status"), value: t("statusValue") },
    { label: t("phase"), value: t("phaseValue") },
    {
      label: t("lastCommit"),
      value: commit
        ? `${commit.hash} · ${commit.message} (${commit.date})`
        : t("noCommit"),
      // Git metadata (hash, message, ISO date) is inherently LTR technical
      // content and must not be bidi-reordered on RTL (Farsi) pages.
      dir: commit ? "ltr" : undefined,
    },
    { label: t("nextStep"), value: t("nextStepValue") },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="divide-border/60 divide-y">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-3 sm:gap-4"
            >
              <dt className="text-muted-foreground text-sm">{row.label}</dt>
              <dd dir={row.dir} className="text-sm font-medium sm:col-span-2">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
