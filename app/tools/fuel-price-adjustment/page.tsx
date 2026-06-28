import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { FuelPriceAdjustmentCalculator } from "@/components/tools/FuelPriceAdjustmentCalculator";
import { getTool } from "@/lib/tools";
import { createMetadata } from "@/lib/seo/metadata";

const tool = getTool("fuel-price-adjustment");

export const metadata = createMetadata({
  title: tool?.title ?? "Fuel Price Adjustment",
  path: "/tools/fuel-price-adjustment",
  description:
    "Interactive fuel price adjustment calculator — model contract adjustments from a fuel baseline, deadband, and fuel-sensitive share. Runs entirely in your browser.",
  keywords: ["fuel price adjustment", "FPA", "project controls", "construction cost", "escalation"],
});

export default function FuelPriceAdjustmentPage() {
  return (
    <>
      <PageHero
        eyebrow="Tool · Project Controls"
        title="Fuel Price Adjustment Calculator"
        description="Estimate the contract value adjustment driven by fuel price movement, with a configurable deadband and fuel-sensitive share. Nothing you enter leaves your browser."
      >
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          All tools
        </Link>
      </PageHero>

      <section className="py-14 lg:py-16">
        <Container>
          <FuelPriceAdjustmentCalculator />
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="mx-auto max-w-2xl rounded-xl border border-border/60 bg-navy-deep/40 p-6">
            <p className="eyebrow">How it works</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The adjustment applies your fuel-sensitive share to the portion of
              the fuel price change that exceeds the deadband, relative to the
              baseline. It is an illustrative, symmetric model — production clauses
              often use published indices, caps and floors, or one-way adjustment.
              Artemis configures the exact formula to your contract.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
