import { notFound } from "next/navigation";
import { ModuleDetail } from "@/components/artemis/ModuleDetail";
import { getProduct } from "@/lib/artemis/products";
import { createMetadata } from "@/lib/seo/metadata";

const product = getProduct("flow");

export const metadata = createMetadata({
  title: product?.name ?? "Artemis Flow",
  path: "/products/flow",
  description: product?.summary,
});

export default function Page() {
  if (!product) notFound();
  return <ModuleDetail product={product} />;
}
