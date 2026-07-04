"use client";

export type TaxMode =
  | "separate"
  | "combined"
  | "flow"
  | "scenario"
  | "evidence";

const MODES: { id: TaxMode; label: string }[] = [
  { id: "separate", label: "Separate View" },
  { id: "combined", label: "Combined View" },
  { id: "flow", label: "Flow Map" },
  { id: "scenario", label: "Scenario Compare" },
  { id: "evidence", label: "Evidence Audit" },
];

type TaxModeSwitchProps = {
  value: TaxMode;
  onChange: (mode: TaxMode) => void;
};

export function TaxModeSwitch({ value, onChange }: TaxModeSwitchProps) {
  return (
    <div
      role="tablist"
      aria-label="Tax Atlas view mode"
      className="flex flex-wrap gap-1.5 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5"
    >
      {MODES.map((mode) => {
        const active = value === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(mode.id)}
            className={
              "rounded-xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70 " +
              (active
                ? "bg-white text-slate-950 shadow"
                : "text-white/65 hover:bg-white/10 hover:text-white")
            }
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}
