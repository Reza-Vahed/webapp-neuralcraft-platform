import type { LucideIcon } from "lucide-react";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentCardLink } from "@/components/content/content-card-link";
import { ScrollParallax } from "@/components/ui/scroll-parallax";

type ServiceCardProps = {
  slug: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

export function ServiceCard({
  slug,
  icon: Icon,
  title,
  description,
}: ServiceCardProps) {
  return (
    <ContentCardLink href={`/services/${slug}`}>
      <CardHeader>
        {/* One of the "selected elements" with scroll parallax (motion-polish) —
            picked because it's small, purely decorative, and repeats across
            two grids (Home teaser + /services), so one change reads sitewide
            without touching many files. */}
        <ScrollParallax
          range={6}
          className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg"
        >
          <Icon className="size-5" aria-hidden />
        </ScrollParallax>
        <CardTitle className="mt-4 text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </ContentCardLink>
  );
}
