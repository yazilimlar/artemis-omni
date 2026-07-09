"use client";

import { useMemo, useState } from "react";
import {
  civicBidSources,
  sourceFriction,
  type CivicBidSource,
  type CivicBidSourceCategory,
} from "@/lib/civicbid/sourceRegistry";

type SortKey = "name" | "category" | "jurisdiction" | "trust";

const CATEGORY_LABELS: Record<CivicBidSourceCategory, string> = {
  public_api: "Public API",
  public_portal: "Public Portal",
  official_portal: "Official Portal",
  platform_portal: "Platform",
};

const CATEGORY_STYLES: Record<CivicBidSourceCategory, string> = {
  public_api: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  public_portal: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
  official_portal: "bg-slate-500/10 text-slate-300 border-slate-600/40",
  platform_portal: "bg-violet-500/10 text-violet-300 border-violet-500/30",
};

function trustScore(source: CivicBidSource): number {
  const byCategory: Record<CivicBidSourceCategory, number> = {
    public_api: 92,
    public_portal: 80,
    official_portal: 84,
    platform_portal: 62,
  };
  let score = byCategory[source.category];
  if (source.api_url) score += 4;
  if (sourceFriction(source) === "high") score -= 8;
  return Math.min(score, 99);
}

export default function SourceTrustMatrix() {
  const [sortKey, setSortKey] = useState<SortKey>("trust");
  const [ascending, setAscending] = useState(false);

  const rows = useMemo(() => {
    const sorted = [...civicBidSources].sort((a, b) => {
      let result = 0;
      if (sortKey === "trust") result = trustScore(a) - trustScore(b);
      else result = String(a[sortKey]).localeCompare(String(b[sortKey]));
      return ascending ? result : -result;
    });
    return sorted;
  }, [sortKey, ascending]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setAscending((prev) => !prev);
    else {
      setSortKey(key);
      setAscending(key !== "trust");
    }
  };

  const headers: { key: SortKey; label: string }[] = [
    { key: "name", label: "Source" },
    { key: "category", label: "Category" },
    { key: "jurisdiction", label: "Jurisdiction" },
    { key: "trust", label: "Trust" },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500">
            {headers.map((header) => (
              <th key={header.key} className="px-4 py-3">
                <button
                  onClick={() => toggleSort(header.key)}
                  className="inline-flex items-center gap-1 hover:text-slate-300"
                >
                  {header.label}
                  {sortKey === header.key ? <span>{ascending ? "↑" : "↓"}</span> : null}
                </button>
              </th>
            ))}
            <th className="px-4 py-3">Access</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((source) => {
            const trust = trustScore(source);
            return (
              <tr
                key={source.id}
                className="border-b border-slate-900 transition-colors last:border-0 hover:bg-slate-900/40"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-200">{source.name}</p>
                  <p className="mt-0.5 max-w-xs text-[11px] leading-snug text-slate-500">
                    {source.notes}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-semibold ${CATEGORY_STYLES[source.category]}`}
                  >
                    {CATEGORY_LABELS[source.category]}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">
                  {source.jurisdiction}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full rounded-full ${
                          trust >= 85 ? "bg-emerald-400" : trust >= 70 ? "bg-cyan-400" : "bg-amber-400"
                        }`}
                        style={{ width: `${trust}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-300">{trust}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-cyan-400 hover:text-cyan-300"
                  >
                    {source.api_url ? "API + Portal →" : "Official link →"}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
