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
    "Public procurement signals from NYC agencies — sample cockpit with source trust matrix, bid readiness scoring, and compliance friction mapping. Not a certified live bid feed.",
});

export default function CivicBidSignalForgePage() {
  return (
    <>
      <PageHero
        eyebrow="Labs · Experimental"
        title="CivicBid Signal Forge"
        description="NYC public procurement signals, translated into bid-room action."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Public-safe demo</Badge>
          <Badge>Sample data</Badge>
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
