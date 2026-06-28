import { notFound } from "next/navigation";
import { SolutionDetail } from "@/components/artemis/SolutionDetail";
import { getSolutionPillar } from "@/lib/artemis/solutions";
import { createMetadata } from "@/lib/seo/metadata";

const pillar = getSolutionPillar("ai-business-systems");

export const metadata = createMetadata({
  title: pillar?.title ?? "AI Business Systems",
  path: "/solutions/ai-business-systems",
  description: pillar?.summary,
});

export default function Page() {
  if (!pillar) notFound();
  return <SolutionDetail pillar={pillar} />;
}
