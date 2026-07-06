import { getTranslations } from "next-intl/server";

import { architectureItemIds } from "@/lib/dev-status";

export async function ArchitectureOverview() {
  const t = await getTranslations("DevDashboard.architecture");

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">{t("title")}</h2>
      <dl className="mt-6 grid gap-x-8 gap-y-8 sm:grid-cols-2">
        {architectureItemIds.map((id) => (
          <div key={id}>
            <dt className="font-semibold">{t(`${id}.title`)}</dt>
            <dd className="text-muted-foreground mt-2 text-sm">
              {t(`${id}.description`)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
