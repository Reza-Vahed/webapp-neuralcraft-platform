import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";

// Shared shell for the clickable preview cards on the Services/Blog/
// Case-Studies/Careers overview grids — same hover/ring treatment
// everywhere, so it lives in one place instead of four.
export function ContentCardLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="group">
      <Card className="ring-foreground/10 group-hover:ring-primary/50 h-full transition-colors">
        {children}
      </Card>
    </Link>
  );
}
