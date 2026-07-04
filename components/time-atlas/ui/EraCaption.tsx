import type { Era } from "@/data/troy/eras";

/** Caption card shown at the bottom of each era's scroll section. */
export function EraCaption({ era }: { era: Era }) {
  return (
    <div className="pointer-events-none w-full max-w-md rounded-xl border border-white/10 bg-[#0d0b16]/70 p-4 backdrop-blur-md">
      <div className="mb-1.5 flex items-center gap-2">
        <span
          className="rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest"
          style={{
            borderColor: `${era.accent}88`,
            color: era.accent,
            backgroundColor: `${era.accent}1a`,
          }}
        >
          {era.status === "active" ? "Active era" : "Ghost era"}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {era.kicker}
        </span>
      </div>
      <h2 className="font-serif text-2xl leading-tight text-parchment">
        <span style={{ color: era.accent }}>{era.year}</span> — {era.title}
      </h2>
      <p className="mt-2 text-[13px] leading-relaxed text-white/75">{era.summary}</p>
      <p className="mt-2 font-mono text-[10px] leading-relaxed tracking-wide text-white/35">
        {era.note}
      </p>
    </div>
  );
}
