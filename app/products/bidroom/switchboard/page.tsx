import Link from "next/link";
import { ArrowLeft, Layers3 } from "lucide-react";
import { BidRoomViewSwitcher } from "@/app/products/bidroom/_components/BidRoomViewSwitcher";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "BidRoom Review Switchboard",
  path: "/products/bidroom/switchboard",
  description:
    "A unified review surface for comparing the preserved Bid Room reference interface against the BidRoom Live official-source workflow.",
  noIndex: true,
});

const reviewCheckpoints = [
  {
    step: "01",
    title: "Interface fidelity",
    description:
      "Confirm the preserved reference renders identically inside the governed wrapper and when opened standalone.",
  },
  {
    step: "02",
    title: "Workflow coverage",
    description:
      "Note which pursuit steps the Live workflow covers that the preserved reference interface does not.",
  },
  {
    step: "03",
    title: "Evidence labeling",
    description:
      "Check how each view labels official-source, preserved, and sample content before trusting any figure.",
  },
  {
    step: "04",
    title: "Navigation integrity",
    description:
      "Verify hub links, back-links, and deep links resolve directly, with no fallbacks or redirect chains.",
  },
];

export default function BidRoomSwitchboardPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-navy-deep/70">
        <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/products/bidroom"
            className="inline-flex items-center gap-2 font-mono text-[0.64rem] font-bold uppercase tracking-[0.14em] text-muted-foreground hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> BidRoom Nexus
          </Link>
          <div className="mt-6 flex max-w-4xl items-start gap-4">
            <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center border border-gold/50 bg-gold/10 text-gold">
              <Layers3 className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-gold">Unified review surface</p>
              <h1 className="mt-3 text-4xl font-black tracking-[-0.035em] sm:text-5xl">
                BidRoom Review Switchboard
              </h1>
              <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
                Toggle between the preserved Bid Room reference interface and the current BidRoom Live source workflow.
                Each view keeps its own stable URL and can be opened independently; the active view is reflected
                in the page URL so a review state can be shared.
              </p>
            </div>
          </div>
        </div>
      </header>
      <section aria-label="How to review" className="border-b border-border bg-navy-deep/40">
        <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
          <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-gold">Review guide</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {reviewCheckpoints.map(({ step, title, description }) => (
              <div key={step} className="border border-border bg-background/50 p-4">
                <p className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.14em] text-signal-soft">{step}</p>
                <p className="mt-2 font-bold text-foreground">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="pt-5">
        <BidRoomViewSwitcher />
      </div>
    </main>
  );
}
