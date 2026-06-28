import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ComponentType } from "react";
import type { ContentCollection, ContentMeta } from "./types";

const CONTENT_ROOT = path.join(process.cwd(), "content");

function collectionDir(collection: ContentCollection) {
  return path.join(CONTENT_ROOT, collection);
}

/** List all .mdx slugs in a collection (filename without extension). */
export function getSlugs(collection: ContentCollection): string[] {
  const dir = collectionDir(collection);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

/** Read + parse frontmatter for a single item (no body compile). */
export function getMeta(
  collection: ContentCollection,
  slug: string,
): ContentMeta | null {
  const file = path.join(collectionDir(collection), `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data } = matter(raw);
  return { ...(data as ContentMeta), slug, collection };
}

/** All published items in a collection, newest first. */
export function getAllMeta(collection: ContentCollection): ContentMeta[] {
  return getSlugs(collection)
    .map((slug) => getMeta(collection, slug))
    .filter((m): m is ContentMeta => Boolean(m) && !m!.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * Dynamically import a compiled MDX body for rendering.
 * Returns the default React component. Frontmatter is stripped at compile time
 * (remark-frontmatter) and read separately via getMeta().
 */
export async function getMdxComponent(
  collection: ContentCollection,
  slug: string,
): Promise<ComponentType | null> {
  try {
    const mod = await import(`@/content/${collection}/${slug}.mdx`);
    return mod.default as ComponentType;
  } catch {
    return null;
  }
}
