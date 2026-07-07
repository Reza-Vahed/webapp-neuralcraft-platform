import { siteUrl } from "@/lib/site";

export function buildArticleJsonLd({
  headline,
  description,
  url,
  datePublished,
  author,
  tags,
  image,
}: {
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  author?: string;
  tags?: string[];
  image?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: `${siteUrl}${url}`,
    mainEntityOfPage: `${siteUrl}${url}`,
    ...(datePublished && { datePublished }),
    ...(author && { author: { "@type": "Person", name: author } }),
    ...(tags && tags.length > 0 && { keywords: tags.join(", ") }),
    ...(image && { image: `${siteUrl}${image}` }),
    publisher: {
      "@type": "Organization",
      name: "NeuralCraft",
    },
  };
}

export function buildServiceJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${siteUrl}${url}`,
    provider: {
      "@type": "Organization",
      name: "NeuralCraft",
      url: siteUrl,
    },
  };
}
