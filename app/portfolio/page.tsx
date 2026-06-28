import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { demoAssets } from "@/lib/artemis/demoAssets";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Portfolio",
  path: "/portfolio",
  description:
    "A preview of Artemis showcase work — production candidates and public-safe demos. Assets require review and sanitization before public release.",
});

export default function PortfolioPage() {
  // Show the strongest candidates (P1/P2) as portfolio previews.
  const featured = demoAssets.filter((a) => a.priority === "P1" || a.priority === "P2");

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Selected work, in preview"
        description="The strongest Artemis workbenches and dashboards. These are catalogued candidates — sanitized, public-safe versions will appear here after review."
      />
      <section className="py-16 lg:py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((a) => (
              <Card key={a.name} className="flex h-full flex-col">
                <div className="flex items-center justify-between gap-2">
                  <Badge>{a.classification}</Badge>
                  <span className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                    {a.priority}
                  </span>
                </div>
                <CardTitle className="mt-4 text-lg">{a.name}</CardTitle>
                <CardDescription className="flex-1">{a.demonstrates}</CardDescription>
                <p className="mt-4 text-xs text-muted-foreground">{a.note}</p>
              </Card>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Browse the full catalogue in the{" "}
            <Link href="/demo" className="text-gold hover:underline">
              Demo Center
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
