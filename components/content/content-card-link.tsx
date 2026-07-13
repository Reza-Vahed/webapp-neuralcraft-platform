import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";

// Shared shell for the clickable preview cards on the Services/Blog/
// Case-Studies/Careers overview grids — same hover/ring treatment
// everywhere, so it lives in one place instead of four. The lift is a
// small, interaction-triggered transform (2px), not an auto-playing
// animation, so it stays outside the `.hero-animate`/prefers-reduced-motion
// gate (see globals.css) — the same convention used elsewhere for hover
// states.
export function ContentCardLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="group">
      <Card className="ring-foreground/10 group-hover:ring-primary/50 h-full shadow-sm transition-all duration-300 ease-(--ease-premium) group-hover:-translate-y-0.5 group-hover:shadow-lg">
        {children}
      </Card>
    </Link>
  );
}
