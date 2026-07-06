import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import type { CaseStudy } from "@/.velite";

export function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <Link href={`/case-studies/${caseStudy.slug}`} className="group">
      <Card className="ring-foreground/10 group-hover:ring-primary/50 h-full transition-colors">
        <CardHeader>
          <p className="text-muted-foreground text-xs font-medium uppercase">
            {caseStudy.industry}
          </p>
          <CardTitle className="mt-2 text-lg">{caseStudy.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {caseStudy.results[0] && (
            <p className="text-primary text-sm font-semibold">
              {caseStudy.results[0].value} {caseStudy.results[0].label}
            </p>
          )}
          <p className="text-muted-foreground mt-3 text-sm">
            {caseStudy.summary}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
