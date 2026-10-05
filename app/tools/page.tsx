import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { tools } from "@/lib/tools";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Tools",
  path: "/tools",
  description:
    "Interactive calculators, dashboards, and decision-support tools for project controls — starting with fuel price adjustment.",
});

const statusLabel: Record<string, string> = {
  live: "Live",
  beta: "Beta",
  planned: "Planned",
};

export default function ToolsPage() {
  return (
    <>
      <PageHero
        eyebrow="Tools"
        title="Decision support you can use today"
        description="Calculators and dashboards that put project-controls intelligence directly in your hands. More tools land here as Artemis grows."
      />
      <section className="py-16 lg:py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools
              .filter((tool) => tool.status === "live")
              .map((tool) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group">
                  <Card className="h-full">
                    <div className="flex items-center justify-between gap-2">
                      <Badge>{tool.category}</Badge>
                      <span className="font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground">
                        {statusLabel[tool.status]}
                      </span>
                    </div>
                    <CardTitle className="mt-4">{tool.title}</CardTitle>
                    <CardDescription>{tool.summary}</CardDescription>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm text-gold">
                      Open tool
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Card>
                </Link>
              ))}
          </div>
        </Container>
      </section>
    </>
  );
}
