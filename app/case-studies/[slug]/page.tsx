import { notFound } from "next/navigation";
import { getMeta, getMdxComponent, getSlugs } from "@/lib/content";
import { ArticleLayout } from "@/components/content/ArticleLayout";
import { createMetadata } from "@/lib/seo/metadata";

type Params = { slug: string };

export function generateStaticParams() {
  return getSlugs("case-studies").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const meta = getMeta("case-studies", slug);
  if (!meta)
    return createMetadata({ title: "Not found", path: `/case-studies/${slug}`, noIndex: true });
  return createMetadata({
    title: meta.title,
    description: meta.seoDescription ?? meta.summary,
    path: `/case-studies/${meta.slug}`,
    type: "article",
    ogImage: meta.heroImage,
    keywords: meta.tags,
  });
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const meta = getMeta("case-studies", slug);
  const Content = await getMdxComponent("case-studies", slug);
  if (!meta || !Content) notFound();

  return (
    <ArticleLayout meta={meta} backHref="/case-studies" backLabel="Back to Case Studies">
      <Content />
    </ArticleLayout>
  );
}
