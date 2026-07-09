"use client";

import { useState } from "react";
import SignalRadar from "./SignalRadar";
import SourceTrustMatrix from "./SourceTrustMatrix";
import BidReadinessQueue from "./BidReadinessQueue";
import ComplianceFrictionMap from "./ComplianceFrictionMap";

type Panel = "radar" | "trust" | "queue" | "friction" | "lifecycle";

const PANELS: { id: Panel; label: string; icon: string; blurb: string }[] = [
  { id: "radar", label: "Signal Radar", icon: "📡", blurb: "Public bid opportunities and source health" },
  { id: "trust", label: "Trust Matrix", icon: "🔐", blurb: "Confidence, jurisdiction, API availability" },
  { id: "queue", label: "Readiness Queue", icon: "⚡", blurb: "Urgency × readiness × confidence scoring" },
  { id: "friction", label: "Friction Map", icon: "🗺️", blurb: "Access barriers: API, deep link, login" },
  { id: "lifecycle", label: "Lifecycle Watch", icon: "⏳", blurb: "From pursuit to execution — CivicBid to Artemis" },
];

export default function CivicBidSignalForge() {
  const [activePanel, setActivePanel] = useState<Panel>("radar");
  const active = PANELS.find((panel) => panel.id === activePanel)!;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-900/25 bg-amber-950/15 px-4 py-3">
        <p className="text-xs leading-relaxed text-amber-300/80">
          <strong className="text-amber-300">Source-of-truth disclaimer:</strong> Official portals
          remain the authoritative record. Signal Forge is decision support only — not legal advice,
          compliance certification, or a substitute for PASSPort, agency portals, bid documents,
          estimator judgment, or counsel review. No logins are scraped. No credentials are used.
          Sample/demo data is not a certified bid feed.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {PANELS.map((panel) => (
          <button
            key={panel.id}
            onClick={() => setActivePanel(panel.id)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
              activePanel === panel.id
                ? "border-slate-500 bg-slate-800 text-white shadow-lg shadow-slate-950/50"
                : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-600 hover:text-slate-200"
            }`}
          >
            <span aria-hidden>{panel.icon}</span>
            <span>{panel.label}</span>
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        <h3 className="mb-4 flex flex-wrap items-baseline gap-2 text-lg font-semibold text-white">
          <span aria-hidden>{active.icon}</span> {active.label}
          <span className="text-xs font-normal text-slate-500">{active.blurb}</span>
        </h3>

        {activePanel === "radar" ? <SignalRadar /> : null}
        {activePanel === "trust" ? <SourceTrustMatrix /> : null}
        {activePanel === "queue" ? <BidReadinessQueue /> : null}
        {activePanel === "friction" ? <ComplianceFrictionMap /> : null}
        {activePanel === "lifecycle" ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <p className="mb-4 text-sm leading-relaxed text-slate-300">
                CivicBid Signal Forge is the upstream pursuit-intelligence layer. It surfaces,
                scores, and tracks public procurement signals. The next layer — <strong className="text-white">Artemis execution,
                cost, forecast, and cashflow controls</strong> — takes over after bid submission and
                award.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-cyan-900/40 bg-cyan-950/10 p-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
                    CivicBid (this layer)
                  </p>
                  <ul className="space-y-1 text-[11px] text-slate-400">
                    <li>• Signal discovery &amp; scoring</li>
                    <li>• Source trust &amp; friction mapping</li>
                    <li>• Bid-readiness ranking</li>
                    <li>• Compliance flagging</li>
                    <li>• Watchlist &amp; alert triggers</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-violet-900/40 bg-violet-950/10 p-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-violet-300">
                    Artemis (next layer)
                  </p>
                  <ul className="space-y-1 text-[11px] text-slate-400">
                    <li>• Estimate &amp; takeoff</li>
                    <li>• 5D cost / schedule integration</li>
                    <li>• Forecast &amp; cashflow controls</li>
                    <li>• Execution dashboards</li>
                    <li>• Project intelligence</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-900/25 bg-amber-950/15 p-6">
              <h4 className="mb-3 text-sm font-semibold text-amber-300">
                Pilot CTA
              </h4>
              <p className="text-sm leading-relaxed text-amber-200/80">
                Start with <strong className="text-amber-200">3 agencies</strong>,{" "}
                <strong className="text-amber-200">5 connectors</strong>,{" "}
                <strong className="text-amber-200">25 watchlist opportunities</strong>, and a{" "}
                <strong className="text-amber-200">weekly pursuit briefing</strong>.
              </p>
              <p className="mt-2 text-xs text-amber-300/60">
                Contact the Artemis team to scope a pilot for your pursuit team.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
