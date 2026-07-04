import { CONFIDENCE_LABEL, type Confidence } from "@/data/troy/pois";

const STYLES: Record<Confidence, string> = {
  attested: "bg-emerald-400/15 text-emerald-300 border-emerald-400/40",
  probable: "bg-amber-400/15 text-amber-300 border-amber-400/40",
  conjectural: "bg-slate-400/15 text-slate-300 border-slate-400/40",
};

const DOTS: Record<Confidence, string> = {
  attested: "bg-emerald-400",
  probable: "bg-amber-400",
  conjectural: "bg-slate-400",
};

export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${STYLES[confidence]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOTS[confidence]}`} />
      {CONFIDENCE_LABEL[confidence]}
    </span>
  );
}
