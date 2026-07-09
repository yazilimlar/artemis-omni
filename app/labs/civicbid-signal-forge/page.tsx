import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import CivicBidSignalForge from "@/components/labs/civicbid/CivicBidSignalForge";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "CivicBid Signal Forge",
  path: "/labs/civicbid-signal-forge",
  description:
    "Experimental signal-intelligence cockpit for public procurement — live NYC Open Data feed with sample fallback, source trust matrix, bid readiness scoring, and compliance friction mapping. Variant of the CivicBid Intelligence Bridge.",
});

export default function CivicBidSignalForgePage() {
  return (
    <>
      <PageHero
        eyebrow="Labs · Experimental Variant"
        title="CivicBid Signal Forge"
        description="A signal-intelligence cockpit for public procurement in the NYC region. Polls official public datasets where an API exists, deep-links everywhere else, and scores every opportunity by urgency, readiness, and source confidence. Falls back to clearly-labeled sample data when live feeds are unreachable."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Preview variant</Badge>
          <Badge>Public-safe data</Badge>
          <Link
            href="/labs"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Labs
          </Link>
        </div>
      </PageHero>

      <section className="py-12 lg:py-16">
        <Container>
          <CivicBidSignalForge />
        </Container>
      </section>

      <section className="border-t border-border/60 py-8">
        <Container>
          <p className="text-center text-xs text-muted-foreground">
            CivicBid Signal Forge — experimental variant built on Artemis. The production CivicBid
            Intelligence Bridge remains unchanged at{" "}
            <a
              href="https://artemis.agoraxai.com/labs/civicbid-intelligence-bridge"
              className="underline hover:text-gold"
            >
              /labs/civicbid-intelligence-bridge
            </a>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
