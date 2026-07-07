import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentCardLink } from "@/components/content/content-card-link";
import type { CaseStudy } from "@/.velite";

export function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <ContentCardLink href={`/case-studies/${caseStudy.slug}`}>
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
    </ContentCardLink>
  );
}
