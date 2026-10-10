import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ConfidenceNote } from "@/components/showcase/ConfidenceNote";
import { ExecutiveSectionHeader } from "@/components/showcase/ExecutiveSectionHeader";
import { ValueChainDiagram } from "@/components/home/ValueChainDiagram";
import { ValueChainToggle } from "@/components/home/ValueChainToggle";
import { TempleBackdrop } from "@/components/home/TempleBackdrop";
import { DianaDrift } from "@/components/home/DianaDrift";
import { StickyNav } from "@/components/home/StickyNav";
import { CinematicCloser } from "@/components/home/CinematicCloser";
import { IntroVideo } from "@/components/home/IntroVideo";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  path: "/",
  description:
    "Artemis turns project fundamentals into AI-enabled execution with an executive-grade bridge across design, geometry, quantities, schedule, field production, cost, revenue, forecast, cashflow, risk, and action.",
});

// Proof slots carry no numbers until a figure is verified and supplied.
const proofSlots = [
  {
    title: "Forecast variance vs. actuals",
    measure: "PM forecast against booked actuals, per period.",
    badge: "Planned",
  },
  {
    title: "Quantity reconciliation coverage",
    measure: "% of quantities tied to a labeled source.",
    badge: "Planned",
  },
  {
    title: "Decision traceability",
    measure: "Every executive decision traces to its source.",
    badge: "Planned",
  },
];

const audiences = [
  {
    name: "Owners & executives",
    line: "One reviewable truth, from field signals to cash.",
  },
  {
    name: "Project managers & engineers",
    line: "Quantities, schedule, and production tied to one source.",
  },
  {
    name: "Finance & reviewers",
    line: "Every number traces back to its evidence.",
  },
  {
    name: "Teams & learners",
    line: "The operating logic, taught — not just sold.",
  },
];

const sprintSteps = [
  {
    title: "Decide what improves",
    text: "Pick the decision loop that matters most.",
  },
  {
    title: "Connect the evidence",
    text: "Tie sources to that loop, labeled and reviewable.",
  },
  {
    title: "Prove it safely",
    text: "Controlled proof, private by default.",
  },
  {
    title: "Pilot with governance",
    text: "Expand only what the evidence earns.",
  },
];

const whatItIsNot = [
  "Not raw private demos, client workbenches, or project HTML dressed up as proof.",
  "Not an AI chatbot layered on top of broken workflows.",
  "Not a replacement for PMs, engineers, finance leaders, field teams, or reviewers.",
];

// Greek-key (meander) fret strip, echoing the Artemis mark's border.
// Gold stroke on transparent; tiled horizontally as a decorative rail.
const MEANDER_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='20' viewBox='0 0 28 20'%3E%3Cpath d='M4 16V4h20v10H10V8h8' fill='none' stroke='%23c9a227' stroke-opacity='0.55' stroke-width='1.8'/%3E%3C/svg%3E\")";

// Inquiry email for the pilot CTA. Used in the mailto link target only —
// the address is never rendered as visible page text.
const PILOT_EMAIL = "gokmen1313@gmail.com";

const CONTENT_WIDTH = "max-w-[1120px]";

export default function HomePage() {
  return (
    <>
      {/* 1 — Hero (immersive temple backdrop + Diana drift) */}
      <section id="top" className="relative flex min-h-[100svh] overflow-hidden border-b border-border/60">
        <TempleBackdrop />
        {/* Greek-key rails top and bottom, echoing the Artemis mark. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-5 opacity-70"
          style={{
            backgroundImage: MEANDER_BG,
            backgroundSize: "28px 20px",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "center top",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-5 opacity-70"
          style={{
            backgroundImage: MEANDER_BG,
            backgroundSize: "28px 20px",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "center bottom",
          }}
        />
        <DianaDrift className="pointer-events-none absolute right-10 top-1/2 hidden h-[420px] w-[280px] -translate-y-1/2 opacity-40 xl:block" />
        <Container className={`${CONTENT_WIDTH} relative m-auto w-full py-16`}>
          <p className="eyebrow">Artemis · AI Implementation</p>
          <h1 className="display-serif mt-4 max-w-3xl text-balance text-4xl leading-[1.1] text-parchment">
            Turn project fundamentals into AI-enabled execution.
          </h1>
          <p className="mt-4 max-w-2xl text-xl leading-relaxed text-gold-soft">
            AI is not the strategy. Implementation is the strategy.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Artemis connects design, field reality, and cashflow into one reviewable
            operating system — source-labeled, human-reviewed, cash-aware. Every
            forecast traces back to its source.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="#pilot" size="lg">
              Bring one workflow →
            </Button>
            <Button href="#how-it-works" variant="outline" size="lg">
              See how it works →
            </Button>
          </div>
          <p className="mt-8 font-mono text-[0.66rem] uppercase tracking-wider text-muted-foreground">
            System ID ARTEMIS-OMNI-2026 · Public-safe proof
          </p>
          <div className="mt-6">
            <ValueChainDiagram
              idPrefix="hero-value-chain"
              animated
              className="bg-navy-deep/70 backdrop-blur-sm"
            />
          </div>
        </Container>
      </section>

      <StickyNav ctaHref={`mailto:${PILOT_EMAIL}`} />

      {/* 1b — Intro video (click-to-play; nothing loads until watched) */}
      <section className="border-b border-border/60">
        <Container className={`${CONTENT_WIDTH} py-12`}>
          <div className="mx-auto max-w-3xl">
            <IntroVideo />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Artemis Intro · 2:24
            </p>
          </div>
        </Container>
      </section>

      {/* 2 — Value chain */}
      <section id="how-it-works" className="scroll-mt-32 border-b border-border/60">
        <Container className={`${CONTENT_WIDTH} py-12`}>
          <ExecutiveSectionHeader
            title="From project fundamentals to executive action."
            description="Field reports, schedules, cost codes, and forecasts live in separate systems that never quite agree. Artemis draws those scattered signals into one reviewable control plane."
          />
          <div className="mt-8">
            <ValueChainToggle />
          </div>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Each handoff is explicit — because handoffs are where forecasts, cashflow,
            and trust break.
          </p>
        </Container>
      </section>

      {/* 3 — Proof */}
      <section id="proof" className="scroll-mt-32 border-b border-border/60">
        <Container className={`${CONTENT_WIDTH} py-12`}>
          <ExecutiveSectionHeader
            title="Proof, as it lands."
            description="We publish numbers only when they're verified. Artemis is mid-flight on its first full project — this section fills in as results land, each labeled with its evidence state."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {proofSlots.map((slot) => (
              <div
                key={slot.title}
                className="rounded-2xl border border-border/60 bg-navy-deep/40 p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[22px] font-medium leading-snug text-foreground">
                    {slot.title}
                  </h3>
                  <span className="shrink-0 rounded-full border border-gold/40 px-3 py-1 font-mono text-[0.66rem] uppercase tracking-wider text-gold-soft">
                    {slot.badge}
                  </span>
                </div>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {slot.measure}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Labs is our public-safe proof library: narrative pages, status badges,
            system diagrams, boundary language. Raw private demos stay private —
            always.
          </p>
          <div className="mt-6">
            <Button href="/labs" variant="outline" size="lg">
              Browse the proof library →
            </Button>
          </div>
        </Container>
      </section>

      {/* 4 — What it is not */}
      <section className="border-b border-border/60">
        <Container className={`${CONTENT_WIDTH} py-12`}>
          <ExecutiveSectionHeader title="What it is not." />
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-rose-300/25 bg-rose-400/5 p-6">
              <ul className="space-y-3">
                {whatItIsNot.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-base leading-relaxed text-muted-foreground"
                  >
                    <span
                      className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-200"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <ConfidenceNote title="Public boundary">
              Public pages use executive narrative, generic proof structure, diagrams,
              and clear limitations. Private workbench material remains private until
              it is rebuilt with synthetic or approved data.
            </ConfidenceNote>
          </div>
        </Container>
      </section>

      {/* 5 — Who it's for */}
      <section id="who" className="scroll-mt-32 border-b border-border/60">
        <Container className={`${CONTENT_WIDTH} py-12`}>
          <ExecutiveSectionHeader
            title="Built for the people who have to implement."
            description="The same operating logic, reframed for each seat at the table."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {audiences.map((audience) => (
              <div
                key={audience.name}
                className="rounded-2xl border border-border/60 bg-navy-deep/40 p-6"
              >
                <h3 className="text-[22px] font-medium leading-snug text-foreground">
                  {audience.name}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {audience.line}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 6 — First sprint */}
      <section id="sprint" className="scroll-mt-32 border-b border-border/60">
        <Container className={`${CONTENT_WIDTH} py-12`}>
          <ExecutiveSectionHeader
            title="The first sprint makes the argument visible."
            description="Artemis is a disciplined implementation system. Four moves, in order:"
          />
          <ol className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {sprintSteps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-2xl border border-border/60 bg-navy-deep/40 p-6"
              >
                <p className="font-mono text-[0.66rem] uppercase tracking-wider text-gold-soft">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-[22px] font-medium leading-snug text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* 7 — Pilot CTA */}
      <section id="pilot" className="scroll-mt-32">
        <Container className={`${CONTENT_WIDTH} py-12`}>
          <div className="relative overflow-hidden rounded-2xl border border-gold/25 bg-navy-deep/60 p-8 text-center lg:p-12">
            <div
              className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,_hsl(41_64%_56%/0.14),transparent_60%)]"
              aria-hidden="true"
            />
            <h2 className="display-serif mx-auto max-w-2xl text-balance text-3xl text-parchment">
              Bring one high-value workflow to Artemis
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Start with one decision loop, one evidence chain, and one controlled
              proof. Artemis turns that into a pilot-ready implementation path.
            </p>
            <div className="mt-8 flex justify-center">
              <Button href={`mailto:${PILOT_EMAIL}`} size="lg">
                Start the conversation →
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 8 — Cinematic closer (trimmed blueprint build; gibberish middle cut) */}
      <CinematicCloser />
    </>
  );
}
