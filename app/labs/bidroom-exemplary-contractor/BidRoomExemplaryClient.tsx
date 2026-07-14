"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Search, SlidersHorizontal } from "lucide-react";

type Scope = "All" | "Core Drilling" | "Concrete Demolition" | "Waterproofing" | "Jet Grout" | "Foundation Piles";

type Opportunity = {
  title: string;
  agency: string;
  region: string;
  due: string;
  method: string;
  scopes: Scope[];
  fit: number;
  confidence: number;
  value: string;
  reason: string;
  source: string;
};

const scopes: Scope[] = ["All", "Core Drilling", "Concrete Demolition", "Waterproofing", "Jet Grout", "Foundation Piles"];

const opportunities: Opportunity[] = [
  {
    title: "Structural Rehabilitation and Selective Concrete Removal — Municipal Facility",
    agency: "NYC capital agency",
    region: "NYC",
    due: "Verify official notice",
    method: "Competitive sealed bid",
    scopes: ["Core Drilling", "Concrete Demolition", "Waterproofing"],
    fit: 92,
    confidence: 62,
    value: "$5M–$20M program band",
    reason: "Direct specialty fit: saw cutting, coring, selective demolition, patching, and envelope restoration.",
    source: "https://a856-cityrecord.nyc.gov/",
  },
  {
    title: "Subsurface Stabilization and Excavation Support Package",
    agency: "Transportation / infrastructure owner",
    region: "NY Metro",
    due: "Verify official notice",
    method: "Prime or specialty subcontract",
    scopes: ["Jet Grout", "Foundation Piles"],
    fit: 90,
    confidence: 58,
    value: "$10M–$75M package band",
    reason: "High-value geotechnical package with likely jet grout, micropiles, drilled shafts, or soldier pile scope.",
    source: "https://www.mta.info/doing-business-with-us/procurement",
  },
  {
    title: "Floodwall, Below-Grade Waterproofing, and Concrete Penetrations",
    agency: "Resiliency / waterfront program",
    region: "NYC",
    due: "Verify official notice",
    method: "Public works bid",
    scopes: ["Core Drilling", "Waterproofing", "Foundation Piles"],
    fit: 88,
    confidence: 55,
    value: "$25M–$150M parent contract",
    reason: "Strong cross-scope opportunity: penetrations, waterstops, membrane systems, pile-supported structures, and leak remediation.",
    source: "https://passport.cityofnewyork.us/",
  },
  {
    title: "Bridge Substructure Repairs and Foundation Rehabilitation",
    agency: "State / regional transportation authority",
    region: "NY State",
    due: "Verify official notice",
    method: "Low bid / subcontract buyout",
    scopes: ["Concrete Demolition", "Core Drilling", "Foundation Piles"],
    fit: 86,
    confidence: 60,
    value: "$8M–$60M contract band",
    reason: "Likely demolition, dowel drilling, bearing-seat rehabilitation, temporary support, and pile repairs.",
    source: "https://www.nyscr.ny.gov/",
  },
  {
    title: "Tunnel and Shaft Water-Infiltration Mitigation",
    agency: "Transit / utility owner",
    region: "NY Metro",
    due: "Verify official notice",
    method: "Best value or specialty subcontract",
    scopes: ["Waterproofing", "Core Drilling", "Jet Grout"],
    fit: 84,
    confidence: 54,
    value: "$3M–$40M specialty package",
    reason: "Leak sealing, injection grouting, membrane transitions, coring, and possible ground-treatment interfaces.",
    source: "https://panynj.bonfirehub.com/",
  },
  {
    title: "Deep Foundation Installation for New Public Facility",
    agency: "Public building authority",
    region: "NY State",
    due: "Verify official notice",
    method: "General construction / trade package",
    scopes: ["Foundation Piles", "Jet Grout"],
    fit: 82,
    confidence: 56,
    value: "$4M–$30M foundation package",
    reason: "Potential driven piles, micropiles, drilled caissons, load testing, pile caps, and localized improvement work.",
    source: "https://www.dasny.org/opportunities/rfps-bids",
  },
];

const keywordPacks: Record<Exclude<Scope, "All">, string[]> = {
  "Core Drilling": ["core drilling", "concrete coring", "saw cutting", "wall opening", "slab penetration", "dowel drilling"],
  "Concrete Demolition": ["selective demolition", "concrete removal", "hydrodemolition", "structural demolition", "scarification", "deck removal"],
  Waterproofing: ["waterproofing", "membrane", "waterstop", "injection grout", "leak remediation", "below-grade envelope"],
  "Jet Grout": ["jet grout", "soil mixing", "ground improvement", "compensation grouting", "permeation grouting", "cutoff wall"],
  "Foundation Piles": ["micropile", "drilled shaft", "caisson", "driven pile", "soldier pile", "secant pile", "pile load test"],
};

export default function BidRoomExemplaryClient() {
  const [scope, setScope] = useState<Scope>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return opportunities.filter((item) => {
      const scopeMatch = scope === "All" || item.scopes.includes(scope);
      const text = `${item.title} ${item.agency} ${item.region} ${item.method} ${item.reason} ${item.scopes.join(" ")}`.toLowerCase();
      return scopeMatch && (!term || text.includes(term));
    });
  }, [scope, query]);

  return (
    <>
      <section className="border-b border-[#aeb5bd] bg-[#15202e] text-white">
        <div className="mx-auto max-w-[1380px] px-5 py-10">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#9fc2ff]">Exemplary Contractor pursuit system</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">Find the work that matches the crews, equipment, and specialty risk you already control.</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#cbd3dc]">Purpose-built for core drilling, concrete demolition, waterproofing, jet grouting, and deep-foundation pile installation. Screen prime contracts, trade packages, subcontract buyouts, and early procurement signals from a specialty-contractor perspective.</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {["5 target scopes", "6 source channels", "Prime + subcontract", "Public-safe workflow", "Official-source verification"].map((item) => (
              <div key={item} className="border border-white/20 bg-white/5 px-3 py-3 font-mono text-xs uppercase tracking-wide text-[#e5e9ee]">{item}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1380px] px-5 py-7">
        <div className="grid gap-5 xl:grid-cols-[280px_1fr]">
          <aside className="space-y-5">
            <div className="border-2 border-[#15202e] bg-white p-4">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wide"><SlidersHorizontal className="h-4 w-4" /> Target scope</div>
              <div className="mt-3 space-y-2">
                {scopes.map((item) => (
                  <button key={item} onClick={() => setScope(item)} className={`w-full border px-3 py-2 text-left text-sm font-semibold transition-colors ${scope === item ? "border-[#1d5fbf] bg-[#1d5fbf] text-white" : "border-[#aeb5bd] bg-[#f7f7f4] hover:border-[#15202e]"}`}>{item}</button>
                ))}
              </div>
            </div>

            <div className="border-2 border-[#15202e] bg-white p-4">
              <p className="font-mono text-xs font-bold uppercase tracking-wide">Search vocabulary</p>
              <p className="mt-2 text-xs leading-relaxed text-[#596472]">Use owner-language, engineering-language, and subcontract buyout terms. Scope is often buried inside a larger contract title.</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(scope === "All" ? Object.values(keywordPacks).flat() : keywordPacks[scope]).slice(0, 18).map((word) => (
                  <button key={word} onClick={() => setQuery(word)} className="border border-[#aeb5bd] bg-[#f1f2ee] px-2 py-1 font-mono text-[0.65rem] hover:border-[#1d5fbf] hover:text-[#1d5fbf]">{word}</button>
                ))}
              </div>
            </div>

            <div className="border-2 border-[#15202e] bg-[#fff8dc] p-4 text-xs leading-relaxed">
              <p className="font-mono font-bold uppercase tracking-wide">Estimator rule</p>
              <p className="mt-2">Do not reject a solicitation because the title does not name the specialty. Review bid-item schedules, geotechnical reports, structural drawings, demolition notes, waterproofing details, and subcontracting goals.</p>
            </div>
          </aside>

          <div>
            <div className="flex flex-col gap-3 border-2 border-[#15202e] bg-white p-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#596472]" aria-hidden />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search scope, method, agency, region, or work type" className="w-full border border-[#7d8792] bg-[#fafaf8] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#1d5fbf] focus:ring-2 focus:ring-[#1d5fbf]/20" />
              </div>
              <div className="font-mono text-xs font-bold uppercase tracking-wide text-[#596472]">{filtered.length} pursuit signals</div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {filtered.map((item) => (
                <article key={item.title} className="flex flex-col border-2 border-[#15202e] bg-white p-5 shadow-[4px_4px_0_#15202e]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[0.65rem] font-bold uppercase tracking-wide text-[#596472]">{item.agency} · {item.region}</p>
                      <h2 className="mt-2 text-lg font-black leading-snug">{item.title}</h2>
                    </div>
                    <div className="shrink-0 border-2 border-[#1f7a4d] bg-[#e8f5ed] px-2 py-1 text-center"><div className="text-xl font-black text-[#1f7a4d]">{item.fit}</div><div className="font-mono text-[0.55rem] font-bold uppercase">Fit</div></div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">{item.scopes.map((tag) => <span key={tag} className="border border-[#1d5fbf] bg-[#edf4ff] px-2 py-1 font-mono text-[0.62rem] font-semibold uppercase text-[#1d5fbf]">{tag}</span>)}</div>
                  <p className="mt-4 text-sm leading-relaxed text-[#3f4a56]">{item.reason}</p>
                  <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="border border-[#c7ccd1] bg-[#f6f6f3] p-2"><dt className="font-mono uppercase text-[#68727e]">Due</dt><dd className="mt-1 font-semibold">{item.due}</dd></div>
                    <div className="border border-[#c7ccd1] bg-[#f6f6f3] p-2"><dt className="font-mono uppercase text-[#68727e]">Method</dt><dd className="mt-1 font-semibold">{item.method}</dd></div>
                    <div className="border border-[#c7ccd1] bg-[#f6f6f3] p-2"><dt className="font-mono uppercase text-[#68727e]">Opportunity scale</dt><dd className="mt-1 font-semibold">{item.value}</dd></div>
                    <div className="border border-[#c7ccd1] bg-[#f6f6f3] p-2"><dt className="font-mono uppercase text-[#68727e]">Signal confidence</dt><dd className="mt-1 font-semibold">{item.confidence}/100</dd></div>
                  </dl>
                  <a href={item.source} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center justify-center gap-2 border-2 border-[#15202e] bg-[#15202e] px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-[#1d5fbf]">Open official source channel <ExternalLink className="h-4 w-4" /></a>
                </article>
              ))}
            </div>

            <section className="mt-7 border-2 border-[#15202e] bg-white p-5">
              <h2 className="text-xl font-black">Qualification gate before estimating</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {["Scope is self-performable with current crews and equipment", "Bonding, insurance, safety, and prequalification thresholds are achievable", "Bid documents expose measurable quantities or a defensible allowance", "Schedule, access, noise, vibration, slurry, water, and disposal constraints are understood", "Union, prevailing wage, M/WBE, DBE, and subcontracting requirements are mapped", "Owner payment terms and retainage fit working-capital capacity", "Geotechnical and structural risks are priced with exclusions and assumptions", "Prime-versus-subcontract pursuit strategy is assigned before bid-room spend begins"].map((item, index) => (
                  <div key={item} className="border border-[#aeb5bd] bg-[#f6f6f3] p-3 text-sm leading-relaxed"><span className="mr-2 font-mono text-xs font-black text-[#1d5fbf]">{String(index + 1).padStart(2, "0")}</span>{item}</div>
                ))}
              </div>
            </section>

            <section className="mt-7 border-2 border-[#15202e] bg-[#15202e] p-5 text-white">
              <h2 className="text-xl font-black">Official source channels</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ["NYC City Record", "https://a856-cityrecord.nyc.gov/", "NYC notices and procurement advertisements"],
                  ["PASSPort", "https://passport.cityofnewyork.us/", "NYC solicitations, vendor actions, and submissions"],
                  ["NYS Contract Reporter", "https://www.nyscr.ny.gov/", "New York State and authority opportunities"],
                  ["MTA Procurement", "https://www.mta.info/doing-business-with-us/procurement", "Transit construction and capital packages"],
                  ["PANYNJ Bonfire", "https://panynj.bonfirehub.com/", "Port, airport, tunnel, bridge, and facility procurements"],
                  ["DASNY Opportunities", "https://www.dasny.org/opportunities/rfps-bids", "Public buildings, higher education, and healthcare projects"],
                ].map(([name, href, description]) => (
                  <a key={name} href={href} target="_blank" rel="noreferrer" className="border border-white/25 bg-white/5 p-4 transition-colors hover:border-[#9fc2ff] hover:bg-white/10"><div className="flex items-center justify-between gap-2 font-bold">{name}<ExternalLink className="h-4 w-4" /></div><p className="mt-2 text-xs leading-relaxed text-[#cbd3dc]">{description}</p></a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
