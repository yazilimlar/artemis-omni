import { notFound } from "next/navigation";
import { ModuleDetail } from "@/components/artemis/ModuleDetail";
import { getProduct } from "@/lib/artemis/products";
import { createMetadata } from "@/lib/seo/metadata";

const product = getProduct("docs");

export const metadata = createMetadata({
  title: product?.name ?? "Artemis Docs",
  path: "/products/docs",
  description: product?.summary,
});

export default function Page() {
  if (!product) notFound();
  return <ModuleDetail product={product} />;
}
