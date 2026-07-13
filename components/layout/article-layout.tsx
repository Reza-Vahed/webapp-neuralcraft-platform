import Image from "next/image";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout/container";

type ArticleLayoutProps = {
  title: string;
  description?: string;
  /** Short meta line under the description — a formatted date, an industry
   * label, or similar, depending on the content type. */
  meta?: string;
  author?: string;
  tags?: string[];
  coverImage?: { src: string; alt: string };
  children: ReactNode;
};

// Shared template for long-form, content-driven pages (blog posts, case
// studies, job postings). Overview/static pages use PageHeader instead.
export function ArticleLayout({
  title,
  description,
  meta,
  author,
  tags,
  coverImage,
  children,
}: ArticleLayoutProps) {
  return (
    <article className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <h1 className="font-heading mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          {title}
        </h1>

        {description && (
          <p className="text-muted-foreground mt-4 text-lg">{description}</p>
        )}

        {(meta ?? author) && (
          <p className="text-muted-foreground mt-6 text-sm">
            {[meta, author].filter(Boolean).join(" · ")}
          </p>
        )}
      </Container>

      {coverImage && (
        <Container className="mt-10 max-w-4xl">
          <Image
            src={coverImage.src}
            alt={coverImage.alt}
            width={1600}
            height={900}
            className="border-border/60 rounded-2xl border"
            priority
          />
        </Container>
      )}

      <Container className="prose prose-neutral dark:prose-invert mt-10 max-w-3xl">
        {children}
      </Container>
    </article>
  );
}
