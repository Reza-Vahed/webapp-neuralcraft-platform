import "server-only";

import {
  blogPosts,
  caseStudies,
  jobPostings,
  type BlogPost,
  type CaseStudy,
  type JobPosting,
} from "@/.velite";
import type { Locale } from "@/i18n/routing";

export const BLOG_PAGE_SIZE = 6;

export function getBlogPosts(locale: Locale): BlogPost[] {
  return blogPosts
    .filter((post) => post.locale === locale)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getBlogPost(
  locale: Locale,
  slug: string
): BlogPost | undefined {
  return blogPosts.find((post) => post.locale === locale && post.slug === slug);
}

export function getCaseStudies(locale: Locale): CaseStudy[] {
  return caseStudies.filter((item) => item.locale === locale);
}

export function getCaseStudy(
  locale: Locale,
  slug: string
): CaseStudy | undefined {
  return caseStudies.find(
    (item) => item.locale === locale && item.slug === slug
  );
}

export function getJobPostings(locale: Locale): JobPosting[] {
  return jobPostings.filter((item) => item.locale === locale);
}

export function getJobPosting(
  locale: Locale,
  slug: string
): JobPosting | undefined {
  return jobPostings.find(
    (item) => item.locale === locale && item.slug === slug
  );
}

export type PaginatedResult<T> = {
  items: T[];
  currentPage: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number
): PaginatedResult<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    currentPage,
    totalPages,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
  };
}
