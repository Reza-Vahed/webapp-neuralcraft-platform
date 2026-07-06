import { relative, sep } from "node:path";
import rehypePrettyCode from "rehype-pretty-code";
import { context, defineCollection, defineConfig, s } from "velite";

// Locale is not stored in frontmatter — it's derived from the file's
// position under content/<locale>/<collection>/*.md, so authors can't get
// it out of sync with the actual folder the file lives in.
const locale = () =>
  s
    .custom<string>((value) => typeof value === "string" || value === undefined)
    .optional()
    .transform(() => {
      const { file, config } = context();
      return relative(config.root, file.path).split(sep)[0];
    });

const slug = () =>
  s.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case");

const blogPosts = defineCollection({
  name: "BlogPost",
  pattern: "*/blog/*.md",
  schema: s
    .object({
      slug: slug(),
      title: s.string().max(120),
      description: s.string().max(300),
      publishedAt: s.isodate(),
      author: s.string(),
      tags: s.array(s.string()).default([]),
      coverImage: s.image().optional(),
      content: s.markdown(),
      metadata: s.metadata(),
      locale: locale(),
    })
    .transform((data) => ({
      ...data,
      permalink: `/${data.locale}/blog/${data.slug}`,
    })),
});

const caseStudies = defineCollection({
  name: "CaseStudy",
  pattern: "*/case-studies/*.md",
  schema: s
    .object({
      slug: slug(),
      title: s.string().max(120),
      industry: s.string(),
      summary: s.string().max(300),
      challenge: s.string(),
      solution: s.string(),
      results: s
        .array(s.object({ label: s.string(), value: s.string() }))
        .min(1),
      tags: s.array(s.string()).default([]),
      coverImage: s.image().optional(),
      content: s.markdown(),
      locale: locale(),
    })
    .transform((data) => ({
      ...data,
      permalink: `/${data.locale}/case-studies/${data.slug}`,
    })),
});

const jobPostings = defineCollection({
  name: "JobPosting",
  pattern: "*/careers/*.md",
  schema: s
    .object({
      slug: slug(),
      title: s.string().max(120),
      department: s.string(),
      location: s.string(),
      employmentType: s.enum(["full-time", "part-time", "freelance"]),
      description: s.string().max(300),
      requirements: s.array(s.string()).min(1),
      content: s.markdown(),
      locale: locale(),
    })
    .transform((data) => ({
      ...data,
      permalink: `/${data.locale}/careers/${data.slug}`,
    })),
});

export default defineConfig({
  root: "content",
  collections: { blogPosts, caseStudies, jobPostings },
  markdown: {
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: { light: "github-light", dark: "github-dark" },
          keepBackground: false,
        },
      ],
    ],
  },
});
