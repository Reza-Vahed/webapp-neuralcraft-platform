import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import type { JobPosting } from "@/.velite";

export function JobPostingCard({ job }: { job: JobPosting }) {
  return (
    <Link href={`/careers/${job.slug}`} className="group">
      <Card className="ring-foreground/10 group-hover:ring-primary/50 h-full transition-colors">
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
      </Card>
    </Link>
  );
}
