"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ReducedMotionFallback } from "@/components/cinematic/ReducedMotionFallback";
import { usePrefersStatic } from "@/lib/utils/use-reduced-motion";

// Lazy-load the cinematic layer. ssr:false keeps it out of the server bundle and
// off the critical path — the static fallback renders first, then this hydrates
// in only for motion-OK, non-mobile clients.
const ArtemisSceneCanvas = dynamic(
  () => import("@/components/cinematic/ArtemisSceneCanvas").then((m) => m.ArtemisSceneCanvas),
  {
    ssr: false,
    loading: () => <ReducedMotionFallback />,
  },
);

/**
 * The cinematic homepage hero — the 5D Construction Intelligence Bridge.
 *
 * Structure: all copy and CTAs live in real DOM (SEO + a11y), independent of the
 * canvas. The visual is progressive: static fallback by default, upgraded to the
 * animated scene only when the client allows motion and the viewport is large.
 */
export function CinematicHero() {
  const prefersStatic = usePrefersStatic();

  return (
    <section className="relative overflow-hidden">
      {/* Ambient backdrop */}
      <div className="absolute inset-0 -z-10 bg-lunar-radial" aria-hidden />
      <div
        className="absolute inset-0 -z-10 bg-blueprint-grid bg-grid opacity-[0.18]"
        aria-hidden
      />

      <Container className="grid gap-12 py-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-28">
        {/* Copy — always server-rendered, SEO-accessible */}
        <div className="animate-fade-up">
          <p className="eyebrow">5D Construction Intelligence Bridge</p>
          <h1 className="display-serif mt-5 text-balance text-4xl leading-[1.05] text-parchment sm:text-5xl lg:text-6xl">
            Connect the field to the forecast
            <br />
            <span className="bg-gold-sheen bg-clip-text text-transparent">
              to the cash.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Artemis Omni links design, geometry, quantities, schedule, field
            production, and actual cost into one live cashflow forecast — comparing
            Bid Estimate vs Actuals vs PM Forecast vs system-generated projections.
            Built for heavy civil contractors, infrastructure owners, and project
            controls teams.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button href="/contact" size="lg">
              Request a Pilot
            </Button>
            <Button href="/solutions" variant="outline" size="lg">
              Explore Solutions
            </Button>
          </div>

          {/* Proof stats */}
          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border/50 pt-6">
            {[
              { v: "5D", l: "Cashflow forecast" },
              { v: "Bid → Actual", l: "vs PM Forecast" },
              { v: "ERP / CMiC", l: "Connected workflows" },
            ].map((s) => (
              <div key={s.l}>
                <dt className="display-serif text-2xl text-gold">{s.v}</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {s.l}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Visual — progressive enhancement */}
        <div className="relative">
          {prefersStatic ? <ReducedMotionFallback /> : <ArtemisSceneCanvas />}
        </div>
      </Container>

      <div className="meander-divider" aria-hidden />
    </section>
  );
}
