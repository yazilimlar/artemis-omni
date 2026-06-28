import { notFound } from "next/navigation";
import { getMeta, getMdxComponent, getSlugs } from "@/lib/content";
import { ArticleLayout } from "@/components/content/ArticleLayout";
import { createMetadata } from "@/lib/seo/metadata";

type Params = { slug: string };

export function generateStaticParams() {
  return getSlugs("labs").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const meta = getMeta("labs", slug);
  if (!meta) return createMetadata({ title: "Not found", path: `/labs/${slug}`, noIndex: true });
  return createMetadata({
    title: meta.title,
    description: meta.seoDescription ?? meta.summary,
    path: `/labs/${meta.slug}`,
    type: "article",
    ogImage: meta.heroImage,
    keywords: meta.tags,
  });
}

export default async function LabPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const meta = getMeta("labs", slug);
  const Content = await getMdxComponent("labs", slug);
  if (!meta || !Content) notFound();

  return (
    <ArticleLayout meta={meta} backHref="/labs" backLabel="Back to Labs">
      <Content />
    </ArticleLayout>
  );
}
