import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentCardLink } from "@/components/content/content-card-link";
import type { BlogPost } from "@/.velite";

export function BlogPostCard({
  post,
  formattedDate,
}: {
  post: BlogPost;
  formattedDate: string;
}) {
  return (
    <ContentCardLink href={`/blog/${post.slug}`}>
      <CardHeader>
        <p className="text-muted-foreground text-xs font-medium uppercase">
          {formattedDate}
        </p>
        <CardTitle className="mt-2 text-lg">{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{post.description}</p>
      </CardContent>
    </ContentCardLink>
  );
}
