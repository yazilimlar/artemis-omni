import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { showcaseAssets } from "@/lib/artemis/demoAssets";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Demos & Portfolio",
  path: "/portfolio",
  description:
    "Live Artemis demos and showcases — workbenches, intelligence bridges, and tools you can open and use right now.",
});

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Demos & Portfolio"
        title="Live demos. Real showcases."
        description="Every entry below opens a working demo, workbench, or tool — nothing mocked up, nothing coming soon."
      />
      <section className="py-16 lg:py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {showcaseAssets.map((a) => (
              <Link key={a.href} href={a.href} className="group">
                <Card className="flex h-full flex-col transition group-hover:border-gold/40">
                  <Badge>{a.tag}</Badge>
                  <CardTitle className="mt-4 text-lg">{a.name}</CardTitle>
                  <CardDescription className="flex-1">{a.description}</CardDescription>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm text-gold">
                    Open <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Building something with us?{" "}
            <Link href="/contact" className="text-gold hover:underline">
              Request a pilot
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
