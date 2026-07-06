import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import type { BlogPost } from "@/.velite";

export function BlogPostCard({
  post,
  formattedDate,
}: {
  post: BlogPost;
  formattedDate: string;
}) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <Card className="ring-foreground/10 group-hover:ring-primary/50 h-full transition-colors">
        <CardHeader>
          <p className="text-muted-foreground text-xs font-medium uppercase">
            {formattedDate}
          </p>
          <CardTitle className="mt-2 text-lg">{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">{post.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
