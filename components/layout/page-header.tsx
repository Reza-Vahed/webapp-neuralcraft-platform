import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  className?: string;
};

// Shared header for overview/static pages (Services, About, Careers, Contact,
// legal pages). Article-style pages (blog posts, case studies) use
// ArticleLayout instead — see IA.md.
export function PageHeader({
  eyebrow,
  title,
  lead,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("py-16 sm:py-24", className)}>
      <Container className="max-w-3xl">
        {eyebrow && (
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          {title}
        </h1>
        {lead && <p className="text-muted-foreground mt-4 text-lg">{lead}</p>}
      </Container>
    </div>
  );
}
