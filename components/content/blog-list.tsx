import { getTranslations } from "next-intl/server";

import { BlogPostCard } from "@/components/content/blog-post-card";
import { Container } from "@/components/layout/container";
import { Pagination } from "@/components/content/pagination";
import { BLOG_PAGE_SIZE, getBlogPosts, paginate } from "@/lib/content";
import { formatDate } from "@/lib/format-date";
import type { Locale } from "@/i18n/routing";

export async function BlogList({
  locale,
  page,
}: {
  locale: Locale;
  page: number;
}) {
  const t = await getTranslations("BlogPage");
  const posts = getBlogPosts(locale);
  const { items, currentPage, totalPages } = paginate(
    posts,
    page,
    BLOG_PAGE_SIZE
  );

  if (items.length === 0) {
    return (
      <Container className="pb-24">
        <p className="text-muted-foreground">{t("empty")}</p>
      </Container>
    );
  }

  return (
    <Container className="pb-24">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((post) => (
          <BlogPostCard
            key={post.slug}
            post={post}
            formattedDate={formatDate(locale, post.publishedAt)}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        buildHref={(p) => (p === 1 ? "/blog" : `/blog/page/${p}`)}
      />
    </Container>
  );
}
