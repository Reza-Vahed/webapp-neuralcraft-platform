import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContentCardLink } from "@/components/content/content-card-link";
import type { JobPosting } from "@/.velite";

export function JobPostingCard({ job }: { job: JobPosting }) {
  return (
    <ContentCardLink href={`/careers/${job.slug}`}>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{job.department}</Badge>
          <Badge variant="secondary">{job.location}</Badge>
        </div>
        <CardTitle className="mt-2 text-lg">{job.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{job.description}</p>
      </CardContent>
    </ContentCardLink>
  );
}
