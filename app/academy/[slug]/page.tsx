import { notFound } from "next/navigation";
import { getMeta, getMdxComponent, getSlugs } from "@/lib/content";
import { ArticleLayout } from "@/components/content/ArticleLayout";
import { createMetadata } from "@/lib/seo/metadata";

type Params = { slug: string };

export function generateStaticParams() {
  return getSlugs("academy").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const meta = getMeta("academy", slug);
  if (!meta) return createMetadata({ title: "Not found", path: `/academy/${slug}`, noIndex: true });
  return createMetadata({
    title: meta.title,
    description: meta.seoDescription ?? meta.summary,
    path: `/academy/${meta.slug}`,
    type: "article",
    ogImage: meta.heroImage,
    keywords: meta.tags,
  });
}

export default async function AcademyArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const meta = getMeta("academy", slug);
  const Content = await getMdxComponent("academy", slug);
  if (!meta || !Content) notFound();

  return (
    <ArticleLayout meta={meta} backHref="/academy" backLabel="Back to Academy">
      <Content />
    </ArticleLayout>
  );
}
