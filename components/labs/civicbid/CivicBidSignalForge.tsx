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
  { id: "lifecycle", label: "Lifecycle Watch", icon: "⏳", blurb: "Awards, amendments, addenda — planned" },
];

export default function CivicBidSignalForge() {
  const [activePanel, setActivePanel] = useState<Panel>("radar");
  const active = PANELS.find((panel) => panel.id === activePanel)!;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-900/25 bg-amber-950/15 px-4 py-3">
        <p className="text-xs leading-relaxed text-amber-300/80">
          <strong className="text-amber-300">Source-of-truth disclaimer:</strong> official portals
          remain the authoritative record. Signal Forge is a decision-support layer — not a
          compliance guarantee, legal advice, or certified procurement record. All data shown is
          public-safe; no logins are scraped and no credentials are used.
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
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950 p-12 text-center">
            <p className="mb-3 text-4xl" aria-hidden>
              🔜
            </p>
            <p className="text-sm font-medium text-slate-300">Lifecycle Watch — coming soon</p>
            <p className="mx-auto mt-2 max-w-md text-xs text-slate-500">
              Planned add-on panel for tracking contract awards, amendments, addenda releases, and
              vendor activity patterns via Checkbook NYC and PASSPort Public feeds.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
