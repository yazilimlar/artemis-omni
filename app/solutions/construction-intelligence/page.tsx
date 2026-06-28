import { notFound } from "next/navigation";
import { SolutionDetail } from "@/components/artemis/SolutionDetail";
import { getSolutionPillar } from "@/lib/artemis/solutions";
import { createMetadata } from "@/lib/seo/metadata";

const pillar = getSolutionPillar("construction-intelligence");

export const metadata = createMetadata({
  title: pillar?.title ?? "Construction Intelligence",
  path: "/solutions/construction-intelligence",
  description: pillar?.summary,
});

export default function Page() {
  if (!pillar) notFound();
  return <SolutionDetail pillar={pillar} />;
}
