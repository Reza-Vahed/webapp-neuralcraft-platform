import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Card } from "@/components/ui/card";
import { devRoutes } from "@/lib/dev-status";
import { Link } from "@/i18n/navigation";

export async function RouteExplorer() {
  const t = await getTranslations("DevDashboard.routes");
  const tNav = await getTranslations("Nav");

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">{t("title")}</h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {devRoutes.map((route) => (
          <li key={route.path}>
            <Link href={route.path} className="group block">
              <Card className="ring-foreground/10 group-hover:ring-primary/50 flex-row items-center justify-between px-4 py-3 transition-colors">
                <span className="font-medium">{tNav(route.navMessageKey)}</span>
                <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
                  {/* Forced LTR: a URL path must not be bidi-reordered on RTL (Farsi) pages. */}
                  <code dir="ltr" className="font-mono">
                    {route.path}
                  </code>
                  <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
                </span>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
