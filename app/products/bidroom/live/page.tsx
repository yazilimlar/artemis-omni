import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ExternalLink,
  FileSearch,
  Radar,
  Route,
  ShieldCheck,
} from "lucide-react";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "BidRoom Live",
  path: "/products/bidroom/live",
  description:
    "Public BidRoom entry point for opportunity discovery, official source portals, deadlines, and pursuit triage.",
  noIndex: true,
});

const officialSources = [
  {
    name: "NYC City Record",
    href: "https://a856-cityrecord.nyc.gov/",
    jurisdiction: "New York City",
    description: "Official notices, solicitations, addenda, public hearings, and awards.",
  },
  {
    name: "PASSPort",
    href: "https://passport.cityofnewyork.us/",
    jurisdiction: "New York City",
    description: "Sourcing events, vendor actions, procurement documents, and submissions.",
  },
  {
    name: "SAM.gov",
    href: "https://sam.gov/content/opportunities",
    jurisdiction: "United States",
    description: "Federal contract opportunities, notices, amendments, and award records.",
  },
] as const;

const workflow = [
  {
    step: "01",
    title: "Discover",
    description: "Start with a controlling public portal or use a BidRoom discovery view to narrow the field.",
    icon: Radar,
  },
  {
    step: "02",
    title: "Verify",
    description: "Confirm the notice, dates, addenda, qualifications, and submission instructions at the source.",
    icon: ShieldCheck,
  },
  {
    step: "03",
    title: "Pursue",
    description: "Move a qualified opportunity into contractor triage, geographic review, or evidence analysis.",
    icon: Route,
  },
] as const;

const workspaces = [
  {
    href: "/products/bidroom/contractor",
    label: "Specialty pursuit",
    title: "Contractor Cockpit",
    description: "Prioritize opportunities against trade fit, timing, qualifications, and pursuit readiness.",
    icon: Building2,
  },
  {
    href: "/products/bidroom/atlasiq",
    label: "Jurisdiction intelligence",
    title: "AtlasIQ",
    description: "Explore opportunity coverage across agencies, geographies, portals, and requirements.",
    icon: Radar,
  },
  {
    href: "/products/bidroom/evidence-engine",
    label: "Document intelligence",
    title: "Evidence Engine",
    description: "Trace findings back to notices, drawings, specifications, clauses, and addenda.",
    icon: FileSearch,
  },
] as const;

export default async function BidRoomLivePage({
  searchParams,
}: {
  searchParams: Promise<{ embedded?: string }>;
}) {
  const { embedded } = await searchParams;
  const isEmbedded = embedded === "switchboard";
  return (
    <main className="min-h-screen bg-[#071426] text-white">
      {!isEmbedded && (
      <header className="border-b border-[#2b5275] bg-[#06182b]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3 lg:px-8">
          <Link
            href="/products/bidroom"
            className="inline-flex items-center gap-2 font-mono text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#9edff0] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd86b]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            BidRoom Nexus
          </Link>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em]">
            <span className="inline-flex items-center gap-2 text-[#8fe4b9]">
              <span className="h-2 w-2 rounded-full bg-[#51cf8a]" aria-hidden />
              Official-source launchpad
            </span>
            <Link href="/labs/civicbid-signal-forge" className="text-[#9edff0] hover:text-white">
              CivicBid review
            </Link>
            <Link href="/products/bidroom/switchboard" className="text-[#9edff0] hover:text-white">
              Switchboard
            </Link>
          </div>
        </div>
      </header>
      )}

      <section className="relative overflow-hidden border-b-4 border-[#ddb04e] bg-[#06182b]">
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(rgba(126,231,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(126,231,255,.12) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-20">
          <div>
            <p className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#7ee7ff]">
              <Radar className="h-6 w-6" aria-hidden />
              Opportunity discovery
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black tracking-[-0.04em] sm:text-7xl">
              Find the signal.
              <span className="block text-[#ddb04e]">Verify the source.</span>
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#dce9f3]">
              BidRoom Live organizes the path from public opportunity discovery to a defensible
              pursuit decision. It is a launchpad—not a substitute for the controlling agency record.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#official-sources"
                className="inline-flex items-center gap-2 bg-[#ddb04e] px-5 py-3 font-bold text-[#071426] transition hover:bg-[#f2d06b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#06182b]"
              >
                Open source directory <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <Link
                href="/products/bidroom/contractor"
                className="inline-flex items-center gap-2 border-2 border-[#59dcff] px-5 py-3 font-bold text-white transition hover:bg-[#17456d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd86b]"
              >
                Enter Contractor Cockpit <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>

          <aside className="self-end border border-[#3e6b91] bg-[#0c2944]/95 p-5 shadow-2xl">
            <p className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#7ee7ff]">
              Operating boundary
            </p>
            <div className="mt-5 space-y-4">
              {[
                "Official notices and bid documents control",
                "Source links open in their original systems",
                "No submission or eligibility claim is made here",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm leading-relaxed text-[#e8f1f7]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#70e0a8]" aria-hidden />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-[#3e6b91] pt-4 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[#a8bfd0]">
              Review → verify → pursue
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8" aria-labelledby="workflow-title">
        <h2 id="workflow-title" className="sr-only">
          BidRoom opportunity workflow
        </h2>
        <div className="grid gap-px overflow-hidden border border-[#315a7e] bg-[#315a7e] md:grid-cols-3">
          {workflow.map(({ step, title, description, icon: Icon }) => (
            <article key={step} className="relative bg-[#0b2239] p-6">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-xs font-bold tracking-[0.18em] text-[#ddb04e]">{step}</span>
                <Icon className="h-5 w-5 text-[#7ee7ff]" aria-hidden />
              </div>
              <h3 className="mt-6 text-xl font-black">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#b9cbd9]">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="official-sources" className="border-y border-[#2b5275] bg-[#091b2e] scroll-mt-4">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#7ee7ff]">
                Controlling systems
              </p>
              <h2 className="mt-3 text-3xl font-black">Official source directory</h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-[#b9cbd9]">
              Always confirm deadlines, amendments, forms, qualifications, and submission instructions
              in the issuing system.
            </p>
          </div>

          <div className="mt-7 divide-y divide-[#315a7e] border-y border-[#315a7e]">
            {officialSources.map(({ name, href, jurisdiction, description }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group grid gap-3 py-5 transition hover:bg-[#103352] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ffd86b] sm:grid-cols-[190px_1fr_auto] sm:items-center sm:px-4"
              >
                <div>
                  <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#7ee7ff]">
                    {jurisdiction}
                  </p>
                  <h3 className="mt-1 text-lg font-black">{name}</h3>
                </div>
                <p className="text-sm leading-relaxed text-[#c9d8e3]">{description}</p>
                <span className="inline-flex items-center gap-2 font-mono text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#ddb04e]">
                  Open source <ExternalLink className="h-4 w-4" aria-hidden />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8" aria-labelledby="workspaces-title">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#7ee7ff]">
              Continue the work
            </p>
            <h2 id="workspaces-title" className="mt-3 text-3xl font-black">
              Choose the next workspace
            </h2>
          </div>
          <Link href="/products/bidroom" className="hidden font-mono text-xs font-bold uppercase tracking-wider text-[#7ee7ff] hover:text-white sm:block">
            All BidRoom routes →
          </Link>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {workspaces.map(({ href, label, title, description, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group border border-[#315a7e] bg-[#0b2239] p-5 transition hover:-translate-y-0.5 hover:border-[#59dcff] hover:bg-[#103352] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd86b]"
            >
              <div className="flex items-start justify-between gap-4">
                <Icon className="h-6 w-6 text-[#ddb04e]" aria-hidden />
                <ArrowRight className="h-4 w-4 text-[#7ee7ff] transition-transform group-hover:translate-x-1" aria-hidden />
              </div>
              <p className="mt-6 font-mono text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#7ee7ff]">{label}</p>
              <h3 className="mt-2 text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#b9cbd9]">{description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
