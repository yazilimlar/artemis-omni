import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import type { SolutionPillar } from "@/lib/artemis/solutions";

/** Shared detail view for a solution pillar page. */
export function SolutionDetail({ pillar }: { pillar: SolutionPillar }) {
  return (
    <>
      <PageHero eyebrow="Solution" title={pillar.title} description={pillar.summary}>
        <div className="flex flex-wrap items-center gap-3">
          {pillar.beachhead ? <Badge>Public beachhead</Badge> : null}
          <Link
            href="/solutions"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            All solutions
          </Link>
        </div>
      </PageHero>

      <section className="py-14 lg:py-16">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Capabilities</p>
            <ul className="mt-4 space-y-3">
              {pillar.capabilities.map((c) => (
                <li key={c} className="flex items-start gap-3 text-sm text-foreground/85">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Outcomes</p>
            <ul className="mt-4 space-y-3">
              {pillar.outcomes.map((o) => (
                <li key={o} className="flex items-start gap-3 text-sm text-foreground/85">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="pb-16">
        <Container>
          <Card>
            <p className="eyebrow">Who it&apos;s for</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {pillar.forWhom.map((w) => (
                <span
                  key={w}
                  className="rounded-full border border-border/70 bg-navy-deep/50 px-3 py-1 text-xs text-foreground/80"
                >
                  {w}
                </span>
              ))}
            </div>
            <CardTitle className="mt-6 text-lg">{pillar.tagline}</CardTitle>
            <CardDescription>
              Engaged as a pilot-ready implementation framework — human-reviewed, audit-aware,
              with source-labeled assumptions.
            </CardDescription>
            <Button href="/contact" className="mt-6">
              Request a Pilot
            </Button>
          </Card>
        </Container>
      </section>
    </>
  );
}
