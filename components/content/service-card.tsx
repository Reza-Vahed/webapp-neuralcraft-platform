import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";

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
    <Link href={`/services/${slug}`} className="group">
      <Card className="ring-foreground/10 group-hover:ring-primary/50 h-full transition-colors">
        <CardHeader>
          <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
            <Icon className="size-5" aria-hidden />
          </div>
          <CardTitle className="mt-4 text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
