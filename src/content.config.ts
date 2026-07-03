import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  // Load Markdown and MDX files in the `src/content/posts/` directory.
  loader: glob({ base: "./src/content/posts", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      // Tags shown on the post; used to explore the archive by topic.
      tags: z.array(z.string()).default([]),
      // Categories the post belongs to.
      category: z.array(z.string()).default([]),
      // When set, the post is featured; higher numbers rank higher in homepage featured section.
      pinned: z.number().optional(),
      heroImage: z.optional(image()),
    }),
});

export const collections = { posts };
