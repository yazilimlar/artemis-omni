import { notFound } from "next/navigation";
import UtilitySewer3DBridgePage, {
  metadata as utilitySewer3DBridgeMetadata,
} from "../../utility-intelligence-bridge/3d-model/page";

type Params = {
  slug: string;
  path: string[];
};

export function generateStaticParams() {
  return [
    {
      slug: "utility-intelligence-bridge",
      path: ["3d-model"],
    },
  ];
}

export const metadata = utilitySewer3DBridgeMetadata;

export default async function NestedLabRecoveryPage({ params }: { params: Promise<Params> }) {
  const { slug, path } = await params;

  if (slug === "utility-intelligence-bridge" && path.join("/") === "3d-model") {
    return <UtilitySewer3DBridgePage />;
  }

  notFound();
}
