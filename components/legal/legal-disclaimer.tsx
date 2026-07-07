import { Info } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function LegalDisclaimer({ children }: { children: React.ReactNode }) {
  return (
    <Card className="ring-foreground/10">
      <CardContent className="flex items-start gap-3">
        <Info
          className="text-muted-foreground mt-0.5 size-5 shrink-0"
          aria-hidden
        />
        <p className="text-muted-foreground text-sm">{children}</p>
      </CardContent>
    </Card>
  );
}
