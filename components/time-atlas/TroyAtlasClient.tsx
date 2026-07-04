"use client";

import dynamic from "next/dynamic";

const TroyExperience = dynamic(
  () => import("./TroyExperience").then((m) => m.TroyExperience),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-3 bg-[#241a2e]">
        <p className="animate-pulse font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
          Artemis Time Atlas
        </p>
        <p className="font-serif text-2xl text-parchment">Troy · Ilion</p>
        <p className="font-mono text-[11px] tracking-widest text-gold/80">
          Entering the Troad — 600 BC
        </p>
      </div>
    ),
  },
);

/** Client boundary: the WebGL experience is loaded lazily, never SSR'd. */
export function TroyAtlasClient() {
  return <TroyExperience />;
}
