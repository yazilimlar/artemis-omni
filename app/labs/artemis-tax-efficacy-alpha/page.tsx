import { createMetadata } from "@/lib/seo/metadata";
import { defaultTaxScenario } from "@/data/tax-demo-scenarios";
import { TaxAtlasApp } from "@/components/tax/TaxAtlasApp";

export const metadata = createMetadata({
  title: "Artemis Tax Atlas (Alpha) — 5D Owner/Operator Tax & Cashflow Simulator",
  path: "/labs/artemis-tax-efficacy-alpha",
  description:
    "See personal tax, company tax, and combined after-tax cash in one view. A fictional-data planning and visualization prototype — not tax advice. Alpha.",
});

export default function ArtemisTaxEfficacyAlphaPage() {
  return <TaxAtlasApp scenario={defaultTaxScenario} />;
}
