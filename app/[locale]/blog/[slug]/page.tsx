import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ArticleLayout } from "@/components/layout/article-layout";
import { Container } from "@/components/layout/container";
import { Markdown } from "@/components/content/markdown";
import { JsonLd } from "@/components/content/json-ld";
import { blogPosts } from "@/.velite";
import { getBlogPost } from "@/lib/content";
import { formatDate } from "@/lib/format-date";
import { buildAlternates } from "@/lib/seo";
import { buildArticleJsonLd } from "@/lib/structured-data";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: Locale; slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ locale: post.locale, slug: post.slug }));
}

// Every valid slug is enumerated above (content is build-time, not
// user-generated), so an unlisted slug is definitively invalid — 404
// immediately instead of attempting an on-demand render.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = getBlogPost(locale, slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: buildAlternates(locale, `/blog/${slug}`),
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = getBlogPost(locale, slug);

  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: "BlogPage" });

  return (
    <main id="main-content" className="flex-1">
      <JsonLd
        data={buildArticleJsonLd({
          headline: post.title,
          description: post.description,
          url: post.permalink,
          datePublished: post.publishedAt,
          author: post.author,
          tags: post.tags,
          image: post.coverImage?.src,
        })}
      />

      <Container className="max-w-3xl pt-8">
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
          {t("backToOverview")}
        </Link>
      </Container>

      <ArticleLayout
        title={post.title}
        description={post.description}
        meta={formatDate(locale, post.publishedAt)}
        author={post.author}
        tags={post.tags}
        coverImage={
          post.coverImage
            ? { src: post.coverImage.src, alt: post.title }
            : undefined
        }
      >
        <Markdown html={post.content} />
      </ArticleLayout>
    </main>
  );
}
