/**
 * Shared content model for AI-generated, modular content packages.
 * Every Academy / tutorial / case study item supports these fields so future
 * agents can add packages without touching rendering code.
 */
export type ContentFrontmatter = {
  title: string;
  summary: string;
  date: string; // ISO yyyy-mm-dd
  category: string;
  tags?: string[];
  heroImage?: string;
  seoDescription?: string;
  relatedTools?: string[]; // tool slugs
  relatedInfographics?: string[]; // infographic ids
  draft?: boolean;
  author?: string;
  readingTime?: string;
};

export type ContentMeta = ContentFrontmatter & {
  slug: string;
  collection: ContentCollection;
};

export type ContentCollection = "academy" | "labs" | "case-studies";
