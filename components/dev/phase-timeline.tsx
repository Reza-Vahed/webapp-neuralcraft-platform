import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { phases, type PhaseStatus } from "@/lib/dev-status";
import { cn } from "@/lib/utils";

const statusMessageKey: Record<
  PhaseStatus,
  "statusCompleted" | "statusActive" | "statusPlanned"
> = {
  completed: "statusCompleted",
  active: "statusActive",
  planned: "statusPlanned",
};

export async function PhaseTimeline() {
  const t = await getTranslations("DevDashboard.timeline");

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">{t("title")}</h2>
      <ol className="mt-6 space-y-3">
        {phases.map((phase) => (
          <li
            key={phase.id}
            className="border-border/60 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "size-2.5 shrink-0 rounded-full",
                  phase.status === "planned"
                    ? "bg-muted-foreground/40"
                    : "bg-primary"
                )}
                aria-hidden
              />
              <span className="font-medium">{t(phase.id)}</span>
            </div>
            <Badge variant={phase.status === "planned" ? "outline" : "default"}>
              {t(statusMessageKey[phase.status])}
            </Badge>
          </li>
        ))}
      </ol>
    </div>
  );
}
