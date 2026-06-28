import { notFound } from "next/navigation";
import { SolutionDetail } from "@/components/artemis/SolutionDetail";
import { getSolutionPillar } from "@/lib/artemis/solutions";
import { createMetadata } from "@/lib/seo/metadata";

const pillar = getSolutionPillar("engineering-visualization");

export const metadata = createMetadata({
  title: pillar?.title ?? "Engineering Visualization",
  path: "/solutions/engineering-visualization",
  description: pillar?.summary,
});

export default function Page() {
  if (!pillar) notFound();
  return <SolutionDetail pillar={pillar} />;
}
