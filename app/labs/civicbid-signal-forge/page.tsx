import { ArrowLeft, Database, Radio, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { CivicBidLiveCockpit } from "@/components/labs/civicbid/CivicBidLiveCockpit";
import { ConfidenceNote } from "@/components/showcase/ConfidenceNote";
import { ExecutiveSectionHeader } from "@/components/showcase/ExecutiveSectionHeader";
import { WhatItIsNotBox } from "@/components/showcase/WhatItIsNotBox";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "CivicBid Signal Forge",
  path: "/labs/civicbid-signal-forge",
  description:
    "A reviewable Artemis CivicBid cockpit that reads the official NYC Current Solicitations dataset, filters for contractor relevance, and applies a transparent deterministic pursuit score.",
  noIndex: true,
});

const operatingTruth = [
  {
    icon: Radio,
    label: "Live source state",
    detail:
      "The route declares whether records came from the official public API, a synthetic fallback, or an unavailable source response.",
  },
  {
    icon: Database,
    label: "Feed truth vs relevance",
    detail:
      "The official dataset can contain many procurement categories. Contractor view filters by declared construction signals without changing the source record.",
  },
  {
    icon: ShieldCheck,
    label: "Human review gate",
    detail:
      "Scores support triage only. Official notices, addenda, plans, specifications, eligibility, and compliance documents remain controlling.",
  },
] as const;

export default function CivicBidSignalForgePage() {
  return (
    <>
      <PageHero
        eyebrow="CivicBid · Review Route"
        title="Signal Forge: live public opportunity triage"
        description="A contractor-facing CivicBid cockpit built on an official NYC public source, explicit source modes, deterministic scoring, and a visible human-review boundary."
      >
        <div className="flex flex-wrap gap-3">
          <Button href="#live-signal-forge">
            Open live cockpit
          </Button>
          <Button href="/labs/civicbid-intelligence-bridge" variant="outline">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            CivicBid product bridge
          </Button>
          <Button href="/api/civicbid/signal-forge?view=queue&scope=construction" variant="ghost">
            View public API
          </Button>
        </div>
      </PageHero>

      <section className="border-b border-border/60 py-14 lg:py-16">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Operating Truth"
            title="Useful because the source state and limitations stay visible"
            description="CivicBid does not hide whether a record is live or synthetic, does not equate a complete citywide procurement feed with contractor relevance, and does not convert a score into a certified bid decision."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {operatingTruth.map(({ icon: Icon, label, detail }) => (
              <article
                key={label}
                className="rounded-xl border border-border/70 bg-navy-deep/45 p-5 shadow-panel"
              >
                <Icon className="h-5 w-5 text-gold-soft" aria-hidden />
                <h2 className="display-serif mt-4 text-xl text-parchment">{label}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{detail}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <CivicBidLiveCockpit />
        </Container>
      </section>

      <section className="border-y border-border/60 py-14 lg:py-16">
        <Container className="grid gap-5 lg:grid-cols-2">
          <ConfidenceNote title="Current review status">
            This route is a no-index public-safe review surface during the selective rescue. It uses
            a real official public source when available and switches only to unmistakably synthetic
            fallback records when the source cannot be reached.
          </ConfidenceNote>
          <WhatItIsNotBox
            items={[
              "Not a certified bid calendar, legal interpretation, compliance determination, or agency system of record.",
              "Not an automated go/no-go decision or a substitute for plans, specifications, addenda, and official notices.",
              "Not a wholesale publication of every raw upstream field or a merge of the contaminated historical donor branches.",
            ]}
          />
        </Container>
      </section>
    </>
  );
}
