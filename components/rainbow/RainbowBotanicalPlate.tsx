"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Archive,
  Atom,
  BookOpenText,
  CheckCircle2,
  ChevronRight,
  Compass,
  Database,
  Flower2,
  Layers3,
  MapPinned,
  Palette,
  Ruler,
  ShieldCheck,
  Sparkles,
  Sprout,
  Sun,
  TreePine,
  Waves,
  type LucideIcon,
} from "lucide-react";
import type { RainbowSpecimen, RainbowTheme } from "@/data/rainbow";
import { cn } from "@/lib/utils/cn";

type RainbowBotanicalPlateProps = {
  specimen: RainbowSpecimen;
  theme?: RainbowTheme;
  blockers: string[];
  referenceImage: string;
};

type ModeId = "plate" | "taxonomy" | "atlas" | "blueprint" | "culture" | "production";

type ModeConfig = {
  id: ModeId;
  label: string;
  title: string;
  summary: string;
  icon: LucideIcon;
};

const modeConfig: ModeConfig[] = [
  {
    id: "plate",
    label: "Plate",
    title: "Living library plate",
    summary:
      "A source-safe first version of the Rainbow Botanical Library plate, rebuilt from structured specimen data instead of a single flat poster.",
    icon: Archive,
  },
  {
    id: "taxonomy",
    label: "Taxonomy",
    title: "Taxonomic architecture",
    summary:
      "Classification, family relationships, names, and source status are separated so botany can be upgraded without rewriting the visual system.",
    icon: Atom,
  },
  {
    id: "atlas",
    label: "Atlas",
    title: "Spatial telemetry",
    summary:
      "Atlas panels stay public-safe in this draft: exact coordinates are withheld while habitat, range, and deployment status remain reviewable.",
    icon: MapPinned,
  },
  {
    id: "blueprint",
    label: "Blueprint",
    title: "Engineering blueprint",
    summary:
      "Geometry, root architecture, water behavior, and stabilization claims are treated as interpretive engineering layers until fully sourced.",
    icon: Ruler,
  },
  {
    id: "culture",
    label: "Culture",
    title: "Cultural and linguistic archive",
    summary:
      "Common, regional, historical, and symbolic material is visible but clearly marked for citation review before public launch.",
    icon: BookOpenText,
  },
  {
    id: "production",
    label: "QA",
    title: "Production gates",
    summary:
      "The draft remains non-indexed and review-first. Blockers are surfaced as part of the artifact rather than hidden in process notes.",
    icon: ShieldCheck,
  },
];

const hotspots = [
  {
    id: "throat",
    label: "Golden throat",
    x: 51,
    y: 54,
    text: "Solar yellow throat anchors the spectrum profile and gives the plate its high-contrast orange designation.",
  },
  {
    id: "eyezone",
    label: "Red eyezone",
    x: 50,
    y: 48,
    text: "The darker eyezone creates the radial target pattern used in the blueprint and color classification panels.",
  },
  {
    id: "tepals",
    label: "Six-part tepals",
    x: 31,
    y: 47,
    text: "Six-part floral presentation supports the 60-degree rotational geometry used in the engineering interpretation.",
  },
  {
    id: "stamens",
    label: "Stamen cluster",
    x: 56,
    y: 43,
    text: "Visible reproductive structures are flagged for future scientific annotation, measurement, and macro photography.",
  },
];

const bloomPhases = [
  {
    label: "06:00",
    phase: "Dawn",
    status: "Bud stack",
    detail: "Sequential blooms prepare the daily cycle while prior flowers decline.",
  },
  {
    label: "12:00",
    phase: "Peak bloom",
    status: "Full bloom",
    detail: "Reference photo state: open tepals, visible throat, strong spectrum contrast.",
  },
  {
    label: "18:00",
    phase: "Decline",
    status: "One-day flower",
    detail: "Individual bloom life is short, while the clump continues producing replacements.",
  },
  {
    label: "Winter",
    phase: "Dormancy",
    status: "Root reserve",
    detail: "Above-ground structure withdraws while underground storage supports next season.",
  },
];

const mapPanels = [
  {
    title: "Point of origin",
    label: "Native range draft",
    accent: "#0E6B4E",
  },
  {
    title: "Vector migration",
    label: "Historic dispersal model",
    accent: "#E66A17",
  },
  {
    title: "Deployment density",
    label: "Public-safe regional view",
    accent: "#C43A20",
  },
];

function titleCaseStatus(status?: string) {
  if (!status) return "Not recorded";
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function rangeText(
  range: { min?: number; max?: number; unit?: string } | undefined,
) {
  if (!range?.min && !range?.max) return "Not measured";
  if (range.min && range.max) return `${range.min}-${range.max} ${range.unit ?? ""}`.trim();
  return `${range.min ?? range.max} ${range.unit ?? ""}`.trim();
}

function SectionLabel({
  eyebrow,
  title,
  className,
}: {
  eyebrow: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="font-mono text-[0.64rem] uppercase tracking-[0.22em] text-[#926a22]">
        {eyebrow}
      </p>
      <h2 className="mt-1 font-serif text-xl font-semibold leading-tight text-[#0f3928]">
        {title}
      </h2>
    </div>
  );
}

function PlatePanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border border-[#b99d54]/70 bg-[#fff8dd]/88 p-4 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[6.75rem_1fr] gap-3 border-b border-[#d6c27c]/60 py-1.5 last:border-b-0">
      <dt className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[#91621b]">
        {label}
      </dt>
      <dd className="text-sm leading-snug text-[#123c2a]">{value}</dd>
    </div>
  );
}

function SpectrumStrip({
  palette,
}: {
  palette: NonNullable<RainbowTheme["extracted_colors"]>;
}) {
  return (
    <div className="grid grid-cols-5 overflow-hidden border border-[#b99d54]/70">
      {palette.map((color) => (
        <div key={`${color.role}-${color.hex}`} className="min-w-0">
          <div className="h-10" style={{ backgroundColor: color.hex }} />
          <div className="bg-[#fff3c4] px-2 py-1.5">
            <p className="truncate font-mono text-[0.58rem] uppercase text-[#123c2a]">
              {color.name}
            </p>
            <p className="font-mono text-[0.58rem] text-[#6c5220]">{color.hex}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function FlowerHotspotImage({
  referenceImage,
  activeHotspot,
  activeMode,
  onHotspotChange,
}: {
  referenceImage: string;
  activeHotspot: string;
  activeMode: ModeId;
  onHotspotChange: (hotspotId: string) => void;
}) {
  const active = hotspots.find((hotspot) => hotspot.id === activeHotspot) ?? hotspots[0];

  return (
    <div className="relative min-h-[24rem] overflow-hidden border border-[#b99d54]/80 bg-[#142d1f]">
      <Image
        src={referenceImage}
        alt="Source-safe cropped field reference of Hemerocallis fulva bloom"
        fill
        priority
        sizes="(min-width: 1024px) 34vw, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,221,0.08),transparent_38%,rgba(13,48,32,0.16))]" />
      {activeMode === "blueprint" ? (
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden>
          <circle cx="50" cy="49" r="32" fill="none" stroke="#fff1bd" strokeOpacity="0.72" />
          <circle cx="50" cy="49" r="20" fill="none" stroke="#fff1bd" strokeOpacity="0.38" />
          {[0, 60, 120, 180, 240, 300].map((rotation) => (
            <line
              key={rotation}
              x1="50"
              y1="49"
              x2="50"
              y2="15"
              stroke="#fff1bd"
              strokeOpacity="0.54"
              transform={`rotate(${rotation} 50 49)`}
            />
          ))}
        </svg>
      ) : null}
      {hotspots.map((hotspot) => (
        <button
          key={hotspot.id}
          type="button"
          aria-label={hotspot.label}
          aria-pressed={activeHotspot === hotspot.id}
          onClick={() => onHotspotChange(hotspot.id)}
          className={cn(
            "absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-[#fff2bd] bg-[#0f3928]/78 text-[#fff2bd] shadow-lg transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f3928] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fff8dd]",
            activeHotspot === hotspot.id && "bg-[#e65b17] text-white",
          )}
          style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
        >
          <span className="h-2 w-2 rounded-full bg-current" />
        </button>
      ))}
      <div className="absolute inset-x-3 bottom-3 border border-[#d9bf70]/80 bg-[#fff8dd]/94 p-3 backdrop-blur">
        <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-[#91621b]">
          Active annotation
        </p>
        <p className="mt-1 font-serif text-lg text-[#10351f]">{active.label}</p>
        <p className="mt-1 text-sm leading-relaxed text-[#31513f]">{active.text}</p>
      </div>
    </div>
  );
}

function TaxonomyDiagram({ specimen }: { specimen: RainbowSpecimen }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
      <dl>
        <DetailRow label="Kingdom" value={specimen.taxonomy.kingdom} />
        <DetailRow label="Order" value={specimen.taxonomy.order} />
        <DetailRow label="Family" value={specimen.taxonomy.family} />
        <DetailRow label="Genus" value={<em>{specimen.taxonomy.genus}</em>} />
        <DetailRow label="Species" value={<em>{specimen.taxonomy.species}</em>} />
      </dl>
      <div className="relative min-h-52 border border-[#c7ad65] bg-[#f8edc9] p-3">
        <svg viewBox="0 0 360 190" className="h-full w-full" aria-hidden>
          <path d="M180 18v34M180 52H88v34M180 52h92v34M88 86v34M272 86v34" stroke="#91621b" />
          <path d="M88 120H48v38M88 120h40v38M272 120h-40v38M272 120h40v38" stroke="#91621b" />
          {[
            [180, 18, "ASPARAGALES"],
            [88, 86, "ASPHODELACEAE"],
            [272, 86, "LILIACEAE"],
            [48, 158, "HEMEROCALLIS"],
            [128, 158, "ALOE"],
            [232, 158, "HAWORTHIA"],
            [312, 158, "LILIUM"],
          ].map(([x, y, label]) => (
            <g key={label as string}>
              <circle cx={x as number} cy={y as number} r="4" fill="#e65b17" />
              <text
                x={x as number}
                y={(y as number) + 17}
                textAnchor="middle"
                className="fill-[#123c2a] font-mono text-[9px]"
              >
                {label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function AtlasMiniMap({
  title,
  label,
  accent,
}: {
  title: string;
  label: string;
  accent: string;
}) {
  return (
    <div className="border border-[#c7ad65] bg-[#10351f] p-2 text-[#fff8dd]">
      <p className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[#f2ce73]">
        {title}
      </p>
      <svg viewBox="0 0 220 96" className="mt-2 h-24 w-full bg-[#f8edc9]" aria-hidden>
        <path
          d="M18 58c24-24 45-33 72-25 19 6 29 18 52 8 23-9 34-23 61-14"
          fill="none"
          stroke="#245b45"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d="M22 66c36-8 48 11 79-7 34-20 53-12 92 8"
          fill="none"
          stroke={accent}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="52" cy="55" r="4" fill={accent} />
        <circle cx="112" cy="48" r="3" fill={accent} opacity="0.78" />
        <circle cx="176" cy="61" r="5" fill={accent} opacity="0.9" />
        <g stroke="#b99d54" strokeOpacity="0.45">
          <path d="M0 24h220M0 48h220M0 72h220M44 0v96M88 0v96M132 0v96M176 0v96" />
        </g>
      </svg>
      <p className="mt-2 text-center text-xs leading-snug text-[#fff8dd]/82">{label}</p>
    </div>
  );
}

function LifecycleWheel({
  activePhase,
  onPhaseChange,
}: {
  activePhase: number;
  onPhaseChange: (index: number) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-[13rem_1fr]">
      <div className="relative mx-auto h-52 w-52">
        <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
          <circle cx="100" cy="100" r="86" fill="#10351f" />
          <circle cx="100" cy="100" r="66" fill="#f8edc9" stroke="#b99d54" />
          {bloomPhases.map((phase, index) => {
            const rotation = index * 90 - 35;
            const x = 100 + Math.cos((rotation * Math.PI) / 180) * 76;
            const y = 100 + Math.sin((rotation * Math.PI) / 180) * 76;
            return (
              <g key={phase.phase}>
                <circle
                  cx={x}
                  cy={y}
                  r={activePhase === index ? 12 : 8}
                  fill={activePhase === index ? "#e65b17" : "#d6b75d"}
                />
                <text
                  x={x}
                  y={y + 25}
                  textAnchor="middle"
                  className="fill-[#10351f] font-mono text-[8px]"
                >
                  {phase.phase}
                </text>
              </g>
            );
          })}
          <path
            d="M100 36c34 0 63 28 63 64s-29 64-63 64-63-28-63-64 29-64 63-64Z"
            fill="none"
            stroke="#e65b17"
            strokeDasharray="7 8"
          />
          <text x="100" y="96" textAnchor="middle" className="fill-[#10351f] font-serif text-[17px]">
            24-hour
          </text>
          <text x="100" y="114" textAnchor="middle" className="fill-[#91621b] font-mono text-[8px]">
            BLOOM CYCLE
          </text>
        </svg>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {bloomPhases.map((phase, index) => (
          <button
            key={phase.phase}
            type="button"
            aria-pressed={activePhase === index}
            onClick={() => onPhaseChange(index)}
            className={cn(
              "border border-[#d0b76b] bg-[#fff8dd] p-3 text-left transition hover:border-[#e65b17]",
              activePhase === index && "border-[#e65b17] bg-[#fff3c4]",
            )}
          >
            <span className="block font-mono text-xs uppercase tracking-[0.14em] text-[#91621b]">
              {phase.label}
            </span>
            <span className="mt-1 block font-serif text-base leading-tight text-[#10351f]">
              {phase.phase}
            </span>
            <span className="mt-1 block text-xs leading-snug text-[#31513f]">
              {phase.status}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function RootNetworkDiagram() {
  return (
    <div className="relative min-h-64 overflow-hidden border border-[#c7ad65] bg-[#f7e3b5]">
      <svg viewBox="0 0 420 250" className="h-full w-full" aria-hidden>
        <rect width="420" height="250" fill="#f7e3b5" />
        <path d="M0 86h420" stroke="#9f7835" />
        <path d="M72 87c24-42 64-50 110-18 50-34 106-28 147 18" fill="none" stroke="#2f6b3d" strokeWidth="7" />
        {[96, 128, 164, 205, 246, 284, 318].map((x, index) => (
          <g key={x}>
            <path d={`M${x} 88c-8 34-3 66 ${index % 2 ? -23 : 20} 102`} fill="none" stroke="#7a4d22" strokeWidth="3" />
            <path d={`M${x} 128c${index % 2 ? 24 : -24} 18 ${index % 2 ? 32 : -32} 38 ${index % 2 ? 44 : -44} 68`} fill="none" stroke="#7a4d22" strokeWidth="1.5" />
            <ellipse cx={x} cy={116 + index * 9} rx="12" ry="27" fill="#b97332" opacity="0.72" />
          </g>
        ))}
        <text x="22" y="32" className="fill-[#10351f] font-mono text-[12px]">
          CORE SYSTEM: TUBEROUS RHIZOME NETWORK
        </text>
        <text x="24" y="230" className="fill-[#6d5220] font-mono text-[10px]">
          Public-safe schematic. Measurement verification pending.
        </text>
      </svg>
    </div>
  );
}

function BlueprintDiagram() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {["Top view", "Side elevation", "Root isometric"].map((label, panelIndex) => (
        <div key={label} className="border border-[#5a8ca5] bg-[#083047] p-2">
          <svg viewBox="0 0 180 150" className="h-40 w-full" aria-hidden>
            <rect width="180" height="150" fill="#083047" />
            <g stroke="#7db2c6" strokeOpacity="0.22">
              {Array.from({ length: 9 }).map((_, index) => (
                <path key={`h-${index}`} d={`M0 ${index * 18}h180M${index * 22} 0v150`} />
              ))}
            </g>
            {panelIndex === 0 ? (
              <g fill="none" stroke="#dbeef2">
                {[0, 60, 120, 180, 240, 300].map((rotation) => (
                  <ellipse
                    key={rotation}
                    cx="90"
                    cy="74"
                    rx="15"
                    ry="58"
                    transform={`rotate(${rotation} 90 74)`}
                  />
                ))}
                <circle cx="90" cy="74" r="20" stroke="#ffb34c" />
              </g>
            ) : panelIndex === 1 ? (
              <g fill="none" stroke="#dbeef2">
                <path d="M90 22c-28 22-34 48-20 80M90 22c28 22 34 48 20 80M90 30v92" />
                <path d="M62 122h56M70 130h40" />
              </g>
            ) : (
              <g fill="none" stroke="#dbeef2">
                <path d="M90 30v82" />
                {[50, 65, 80, 100, 115, 130].map((x) => (
                  <path key={x} d={`M90 112c${x - 90} 20 ${x - 90} 28 ${x - 90} 34`} />
                ))}
                <ellipse cx="90" cy="94" rx="44" ry="18" />
              </g>
            )}
          </svg>
          <p className="mt-1 text-center font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[#dbeef2]">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

function HeritageSketch() {
  return (
    <div className="min-h-64 border border-[#b99d54] bg-[#f7e7c2] p-4">
      <svg viewBox="0 0 520 210" className="h-full w-full" aria-hidden>
        <rect width="520" height="210" fill="#f7e7c2" />
        <g stroke="#755129" fill="none" strokeWidth="1.4">
          {[0, 60, 120, 180, 240, 300].map((rotation) => (
            <ellipse
              key={rotation}
              cx="150"
              cy="98"
              rx="18"
              ry="68"
              transform={`rotate(${rotation} 150 98)`}
            />
          ))}
          <circle cx="150" cy="98" r="23" />
          <path d="M150 120c-20 32-37 48-70 70M150 120c18 32 44 45 76 69" />
          <path d="M310 36v132M284 168h78M300 58h42M294 92h54" />
          <path d="M394 50c28 18 39 44 28 77M394 50c-16 32-14 55 3 84M396 134h38" />
          <path d="M52 32v142M43 174h22M43 32h22" />
        </g>
        <g fill="#755129" className="font-mono text-[12px]">
          <text x="36" y="196">0.6 m</text>
          <text x="280" y="190">Column comparison</text>
          <text x="378" y="156">Stamen study</text>
        </g>
      </svg>
    </div>
  );
}

function ModeDetail({
  activeMode,
  specimen,
  blockers,
}: {
  activeMode: ModeId;
  specimen: RainbowSpecimen;
  blockers: string[];
}) {
  const activeConfig =
    modeConfig.find((mode) => mode.id === activeMode) ?? modeConfig[0];
  const Icon = activeConfig.icon;

  if (activeMode === "taxonomy") {
    return (
      <div>
        <SectionLabel eyebrow="VI. System relationships" title={activeConfig.title} />
        <p className="mt-3 text-sm leading-relaxed text-[#31513f]">{activeConfig.summary}</p>
        <div className="mt-5">
          <TaxonomyDiagram specimen={specimen} />
        </div>
      </div>
    );
  }

  if (activeMode === "atlas") {
    return (
      <div>
        <SectionLabel eyebrow="VII. Atlas integration" title={activeConfig.title} />
        <p className="mt-3 text-sm leading-relaxed text-[#31513f]">{activeConfig.summary}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {mapPanels.map((panel) => (
            <AtlasMiniMap key={panel.title} {...panel} />
          ))}
        </div>
        <dl className="mt-4 grid gap-2 md:grid-cols-3">
          <DetailRow label="Location" value={specimen.location.public_location_label} />
          <DetailRow label="Atlas" value={titleCaseStatus(specimen.location.atlas_status)} />
          <DetailRow label="Privacy" value={titleCaseStatus(specimen.location.privacy_level)} />
        </dl>
      </div>
    );
  }

  if (activeMode === "blueprint") {
    return (
      <div>
        <SectionLabel eyebrow="IX. Visual asset protocol" title={activeConfig.title} />
        <p className="mt-3 text-sm leading-relaxed text-[#31513f]">{activeConfig.summary}</p>
        <div className="mt-5">
          <BlueprintDiagram />
        </div>
        <ul className="mt-5 grid gap-2 text-sm leading-relaxed text-[#31513f] md:grid-cols-2">
          {[
            specimen.engineering.geometry,
            specimen.engineering.root_architecture,
            specimen.engineering.soil_stabilization,
            specimen.engineering.water_management,
          ]
            .filter(Boolean)
            .map((item) => (
              <li key={item} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#e65b17]" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
        </ul>
      </div>
    );
  }

  if (activeMode === "culture") {
    return (
      <div>
        <SectionLabel eyebrow="X. Cultural archive" title={activeConfig.title} />
        <p className="mt-3 text-sm leading-relaxed text-[#31513f]">{activeConfig.summary}</p>
        <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <DetailRow label="Common" value={specimen.names.common.join(", ")} />
            <DetailRow label="Historical" value={specimen.names.historical?.join(", ") || "Pending"} />
            <DetailRow label="Regional" value={specimen.names.regional?.join(", ") || "Pending"} />
            <DetailRow label="Pronounce" value={specimen.names.pronunciation} />
            <DetailRow label="Source" value={titleCaseStatus(specimen.names.source_status)} />
          </div>
          <HeritageSketch />
        </div>
      </div>
    );
  }

  if (activeMode === "production") {
    return (
      <div>
        <SectionLabel eyebrow="XI. Production gates" title={activeConfig.title} />
        <p className="mt-3 text-sm leading-relaxed text-[#31513f]">{activeConfig.summary}</p>
        <div className="mt-5 grid gap-3 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="grid gap-2">
            {[
              ["Privacy checked", specimen.qa.privacy_checked],
              ["Claims checked", specimen.qa.claims_checked],
              ["Accessibility checked", specimen.qa.accessibility_checked],
              ["Visual assets checked", specimen.qa.visual_assets_checked],
              ["Human approved", specimen.qa.human_approved],
            ].map(([label, value]) => (
              <div key={label as string} className="flex items-center justify-between border border-[#d2b86c] bg-[#fff8dd] px-3 py-2">
                <span className="text-sm text-[#123c2a]">{label}</span>
                <span
                  className={cn(
                    "font-mono text-[0.65rem] uppercase tracking-[0.14em]",
                    value ? "text-[#0e6b4e]" : "text-[#b33b1d]",
                  )}
                >
                  {value ? "Pass" : "Open"}
                </span>
              </div>
            ))}
          </div>
          <div className="border border-[#d69b4b] bg-[#fff2c8] p-4">
            <div className="flex items-center gap-2 text-[#8a391e]">
              <AlertTriangle className="h-5 w-5" aria-hidden />
              <h3 className="font-serif text-lg">Publication blockers</h3>
            </div>
            <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-[#5b3c1e]">
              {blockers.map((blocker) => (
                <li key={blocker} className="flex gap-2">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <span>{blocker}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center border border-[#b99d54] bg-[#10351f] text-[#f5d272]">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <SectionLabel eyebrow="I. Interactive archive" title={activeConfig.title} />
          <p className="mt-3 text-sm leading-relaxed text-[#31513f]">{activeConfig.summary}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {specimen.knowledge_layers.slice(0, 8).map((layer) => (
          <div key={layer.layer} className="border border-[#d2b86c] bg-[#fff8dd] p-3">
            <p className="font-serif text-base text-[#10351f]">{layer.layer}</p>
            <p className="mt-2 text-xs leading-relaxed text-[#31513f]">{layer.summary}</p>
            <p className="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[#91621b]">
              {titleCaseStatus(layer.source_status)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RainbowBotanicalPlate({
  specimen,
  theme,
  blockers,
  referenceImage,
}: RainbowBotanicalPlateProps) {
  const [activeMode, setActiveMode] = useState<ModeId>("plate");
  const [activeHotspot, setActiveHotspot] = useState(hotspots[0].id);
  const [activePhase, setActivePhase] = useState(1);
  const [activeLayer, setActiveLayer] = useState(specimen.knowledge_layers[0]?.layer ?? "");

  const palette = theme?.extracted_colors ?? [];
  const selectedLayer = useMemo(
    () =>
      specimen.knowledge_layers.find((layer) => layer.layer === activeLayer) ??
      specimen.knowledge_layers[0],
    [activeLayer, specimen.knowledge_layers],
  );
  const currentPhase = bloomPhases[activePhase];
  const activeModeConfig =
    modeConfig.find((mode) => mode.id === activeMode) ?? modeConfig[0];
  const qaRows: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: Database, label: "Record", value: titleCaseStatus(specimen.record_status) },
    { icon: Palette, label: "Color", value: theme?.habitat.theme_name ?? "Theme pending" },
    { icon: Compass, label: "Atlas", value: titleCaseStatus(specimen.location.atlas_status) },
    {
      icon: Sparkles,
      label: "AI",
      value: specimen.ai_metadata.color_analysis_status ?? "Pending",
    },
  ];
  const ecologyRoles: { icon: LucideIcon; label: string }[] = [
    { icon: Sprout, label: "Nectar source" },
    { icon: Flower2, label: "Pollinators" },
    { icon: Waves, label: "Water edge" },
    { icon: TreePine, label: "Soil mass" },
  ];

  return (
    <main className="min-h-screen bg-[#0b251b] text-[#123c2a]">
      <div className="sticky top-16 z-30 border-b border-[#b99d54]/70 bg-[#fff8dd]/95 shadow-[0_8px_24px_rgba(28,41,23,0.12)] backdrop-blur">
        <div className="mx-auto flex max-w-[1680px] flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#96712d]">
              <Flower2 className="h-5 w-5 text-[#10351f]" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="truncate font-serif text-xl font-semibold uppercase tracking-[0.18em] text-[#10351f]">
                Rainbow Botanical Library
              </p>
              <p className="truncate font-mono text-[0.63rem] uppercase tracking-[0.18em] text-[#91621b]">
                Living archive of plant intelligence / culture / ecology / engineering
              </p>
            </div>
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1 lg:pb-0">
            {modeConfig.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  type="button"
                  aria-pressed={activeMode === mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  className={cn(
                    "inline-flex h-9 shrink-0 items-center gap-2 border border-[#c7ad65] bg-[#fff8dd] px-3 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-[#10351f] transition hover:border-[#e65b17]",
                    activeMode === mode.id && "border-[#10351f] bg-[#10351f] text-[#fff8dd]",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                  {mode.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-[#f4e7b8] bg-[linear-gradient(90deg,rgba(16,53,31,0.055)_1px,transparent_1px),linear-gradient(0deg,rgba(16,53,31,0.045)_1px,transparent_1px)] bg-[size:34px_34px] px-3 py-4 sm:px-5 sm:py-6">
        <div className="mx-auto max-w-[1680px] border border-[#9c792f] bg-[#fbf1c9] shadow-[0_20px_80px_rgba(14,35,24,0.32)]">
          <header className="grid gap-3 border-b border-[#9c792f] px-4 py-4 lg:grid-cols-[1fr_auto] lg:px-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 hidden h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#9c792f] sm:flex">
                <svg viewBox="0 0 80 80" className="h-14 w-14" aria-hidden>
                  <g fill="none" stroke="#9c792f">
                    {[0, 30, 60, 90, 120, 150].map((rotation) => (
                      <ellipse
                        key={rotation}
                        cx="40"
                        cy="40"
                        rx="13"
                        ry="32"
                        transform={`rotate(${rotation} 40 40)`}
                      />
                    ))}
                    <circle cx="40" cy="40" r="6" />
                  </g>
                </svg>
              </div>
              <div>
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-[#91621b]">
                  Botanical archive / living color / natural intelligence
                </p>
                <h1 className="mt-2 font-serif text-3xl font-semibold uppercase tracking-[0.08em] text-[#10351f] sm:text-5xl">
                  {specimen.identity.scientific_name}
                </h1>
                <p className="mt-2 text-base text-[#10351f]">
                  {specimen.identity.primary_common_name} / {specimen.names.common.join(" / ")}
                </p>
              </div>
            </div>
            <aside className="border-l-0 border-[#9c792f] pt-0 lg:border-l lg:pl-8">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-[#91621b]">
                Asset ID
              </p>
              <p className="font-serif text-2xl text-[#10351f]">{specimen.specimen_id}</p>
              <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[#c53c18]">
                {specimen.identity.spectrum_designation}
              </p>
            </aside>
          </header>

          <section className="grid items-start border-b border-[#9c792f] lg:grid-cols-[0.36fr_0.64fr]">
            <PlatePanel className="border-x-0 border-y-0 border-r-[#9c792f] bg-[#fff4cf]">
              <SectionLabel eyebrow="Specimen identity" title="Botanical profile" />
              <dl className="mt-4">
                <DetailRow label="Common" value={specimen.identity.primary_common_name} />
                <DetailRow label="Family" value={specimen.taxonomy.family} />
                <DetailRow label="Origin" value={specimen.location.native_range} />
                <DetailRow label="Type" value={specimen.morphology.growth_habit} />
                <DetailRow label="Record" value={titleCaseStatus(specimen.record_status)} />
              </dl>
              <div className="mt-5">
                <FlowerHotspotImage
                  referenceImage={referenceImage}
                  activeHotspot={activeHotspot}
                  activeMode={activeMode}
                  onHotspotChange={setActiveHotspot}
                />
              </div>
              <div className="mt-4">
                <SectionLabel eyebrow="Spectrum profile" title="Living color extraction" />
                <div className="mt-3">
                  <SpectrumStrip palette={palette} />
                </div>
              </div>
              <div className="mt-4 border border-[#d2b86c] bg-[#fff8dd] p-3">
                <p className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-[#91621b]">
                  Diagnostic features
                </p>
                <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-[#123c2a]">
                  {specimen.morphology.diagnostic_features?.slice(0, 6).map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#91621b]" aria-hidden />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="border border-[#d2b86c] bg-[#fff8dd] p-3">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[#91621b]">
                    Capture set
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#123c2a]">
                    {specimen.observation.capture_set.map(titleCaseStatus).join(", ")}
                  </p>
                </div>
                <div className="border border-[#d2b86c] bg-[#fff8dd] p-3">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[#91621b]">
                    Source state
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#123c2a]">
                    Raw media protected. Cropped derivative only.
                  </p>
                </div>
              </div>
              <div className="mt-3 border border-[#d69b4b] bg-[#fff2c8] p-3">
                <p className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-[#8a391e]">
                  Review gate
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#5b3c1e]">
                  {blockers[0] ?? "Human approval required before publication."}
                </p>
              </div>
            </PlatePanel>

            <div className="grid lg:grid-rows-[auto_auto_1fr]">
              <div className="grid border-b border-[#9c792f] xl:grid-cols-[0.52fr_0.48fr]">
                <PlatePanel className="border-x-0 border-y-0 border-r-[#9c792f]">
                  <ModeDetail activeMode={activeMode} specimen={specimen} blockers={blockers} />
                </PlatePanel>
                <PlatePanel className="border-x-0 border-y-0">
                  <SectionLabel eyebrow="VII. Spatial telemetry" title="Atlas integration" />
                  <div className="mt-4 grid gap-3">
                    {mapPanels.map((panel) => (
                      <AtlasMiniMap key={panel.title} {...panel} />
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[#31513f]">
                    Exact GPS, raw EXIF, and locality overlays are withheld in this preview.
                    The Atlas layer remains a public-safe placeholder until approval.
                  </p>
                </PlatePanel>
              </div>

              <div className="grid border-b border-[#9c792f] xl:grid-cols-[0.58fr_0.42fr]">
                <PlatePanel className="border-x-0 border-y-0 border-r-[#9c792f]">
                  <SectionLabel eyebrow="VIII. Temporal phenology" title="Seasonal states" />
                  <div className="mt-4 grid gap-3 sm:grid-cols-4">
                    {["Emergence", "Execution", "Drawdown", "Dormancy"].map((phase, index) => (
                      <button
                        key={phase}
                        type="button"
                        onClick={() => setActivePhase(index)}
                        className={cn(
                          "min-h-32 border border-[#d0b76b] bg-[#fff8dd] p-3 text-left transition hover:border-[#e65b17]",
                          activePhase === index && "border-[#e65b17] bg-[#fff3c4]",
                        )}
                      >
                        <p className="font-mono text-[0.58rem] uppercase tracking-[0.13em] text-[#91621b]">
                          Phase {index + 1}
                        </p>
                        <p className="mt-1 font-serif text-base text-[#10351f]">{phase}</p>
                        <div className="mt-3 h-16 border border-[#d2b86c] bg-[#113d2c]">
                          <svg viewBox="0 0 120 60" className="h-full w-full" aria-hidden>
                            <rect width="120" height="60" fill={index === 3 ? "#e8d8ae" : "#113d2c"} />
                            {index < 2 ? (
                              <g stroke="#9bcf61" strokeWidth="3">
                                <path d="M24 56c2-28 8-42 18-52M52 56c2-32 11-44 28-52M84 56c-1-22 5-34 19-46" />
                              </g>
                            ) : (
                              <g stroke={index === 2 ? "#9a6b33" : "#7a5830"} strokeWidth="2">
                                <path d="M25 55c12-20 8-37-5-52M56 55c8-22 7-39 2-52M88 55c15-18 13-38 2-52" />
                              </g>
                            )}
                            {index === 1 ? (
                              <circle cx="74" cy="22" r="13" fill="#e65b17" stroke="#ffd15a" />
                            ) : null}
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </PlatePanel>
                <PlatePanel className="border-x-0 border-y-0">
                  <SectionLabel eyebrow="Life cycle timeline" title={currentPhase.phase} />
                  <p className="mt-2 font-mono text-[0.66rem] uppercase tracking-[0.15em] text-[#91621b]">
                    {currentPhase.label} / {currentPhase.status}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[#31513f]">{currentPhase.detail}</p>
                  <div className="mt-4">
                    <LifecycleWheel activePhase={activePhase} onPhaseChange={setActivePhase} />
                  </div>
                </PlatePanel>
              </div>

              <div className="grid xl:grid-cols-[0.34fr_0.36fr_0.3fr]">
                <PlatePanel className="border-x-0 border-y-0 border-r-[#9c792f]">
                  <SectionLabel eyebrow="Engineering role" title="Root and water system" />
                  <p className="mt-3 text-sm leading-relaxed text-[#31513f]">
                    {specimen.engineering.biomimicry_notes}
                  </p>
                  <div className="mt-4">
                    <RootNetworkDiagram />
                  </div>
                </PlatePanel>
                <PlatePanel className="border-x-0 border-y-0 border-r-[#9c792f]">
                  <SectionLabel eyebrow="Knowledge layers" title={selectedLayer?.layer ?? "Layer"} />
                  <div className="mt-4 grid max-h-[22rem] gap-2 overflow-y-auto pr-1">
                    {specimen.knowledge_layers.map((layer) => (
                      <button
                        key={layer.layer}
                        type="button"
                        aria-pressed={activeLayer === layer.layer}
                        onClick={() => setActiveLayer(layer.layer)}
                        className={cn(
                          "border border-[#d2b86c] bg-[#fff8dd] p-3 text-left transition hover:border-[#e65b17]",
                          activeLayer === layer.layer && "border-[#10351f] bg-[#fff3c4]",
                        )}
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="font-serif text-base text-[#10351f]">{layer.layer}</span>
                          <span className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#91621b]">
                            {titleCaseStatus(layer.source_status)}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#31513f]">
                    {selectedLayer?.summary}
                  </p>
                </PlatePanel>
                <PlatePanel className="border-x-0 border-y-0">
                  <SectionLabel eyebrow="AI and QA layer" title="Publication status" />
                  <div className="mt-4 grid gap-2">
                    {qaRows.map(({ icon: RowIcon, label, value }) => {
                      return (
                        <div key={label} className="grid grid-cols-[2rem_5rem_1fr] items-center gap-2 border border-[#d2b86c] bg-[#fff8dd] p-2">
                          <RowIcon className="h-4 w-4 text-[#91621b]" aria-hidden />
                          <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[#91621b]">
                            {label}
                          </span>
                          <span className="text-sm text-[#123c2a]">{value}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 border border-[#d69b4b] bg-[#fff2c8] p-3">
                    <p className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-[#8a391e]">
                      Draft protection
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[#5b3c1e]">
                      Noindex, exact location withheld, and claims remain review-gated.
                    </p>
                  </div>
                </PlatePanel>
              </div>
            </div>
          </section>

          <section className="grid border-b border-[#9c792f] lg:grid-cols-[0.28fr_0.24fr_0.24fr_0.24fr]">
            <PlatePanel className="border-x-0 border-y-0 border-r-[#9c792f]">
              <SectionLabel eyebrow="Field measurements" title="Growth characteristics" />
              <dl className="mt-4">
                <DetailRow label="Height" value={rangeText(specimen.morphology.height_cm)} />
                <DetailRow label="Spread" value={rangeText(specimen.morphology.spread_cm)} />
                <DetailRow label="Flower" value={rangeText(specimen.morphology.flower_diameter_cm)} />
                <DetailRow label="Bloom" value={specimen.phenology.current_bloom_stage} />
                <DetailRow label="Zones" value={specimen.location.usda_zones} />
              </dl>
            </PlatePanel>
            <PlatePanel className="border-x-0 border-y-0 border-r-[#9c792f]">
              <SectionLabel eyebrow="Ecological role" title="Function indicators" />
              <div className="mt-4 grid grid-cols-2 gap-2">
                {ecologyRoles.map(({ icon: RoleIcon, label }) => {
                  return (
                    <div key={label} className="border border-[#d2b86c] bg-[#fff8dd] p-3 text-center">
                      <RoleIcon className="mx-auto h-5 w-5 text-[#91621b]" aria-hidden />
                      <p className="mt-2 text-xs leading-tight text-[#123c2a]">{label}</p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#31513f]">
                {specimen.ecology.ecological_notes}
              </p>
            </PlatePanel>
            <PlatePanel className="border-x-0 border-y-0 border-r-[#9c792f]">
              <SectionLabel eyebrow="Cultural names" title="Linguistic register" />
              <ul className="mt-4 grid gap-2 text-sm text-[#123c2a]">
                {[
                  ...specimen.names.common,
                  ...(specimen.names.historical ?? []),
                ].map((name) => (
                  <li key={name} className="flex items-center gap-2">
                    <ChevronRight className="h-3.5 w-3.5 text-[#91621b]" aria-hidden />
                    {name}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-[#31513f]">{specimen.names.etymology}</p>
            </PlatePanel>
            <PlatePanel className="border-x-0 border-y-0">
              <SectionLabel eyebrow="Asset foundry" title="Package state" />
              <div className="mt-4 grid gap-2">
                {Object.entries(specimen.assets).map(([key, asset]) => (
                  <div key={key} className="flex items-center justify-between gap-3 border border-[#d2b86c] bg-[#fff8dd] px-3 py-2">
                    <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-[#91621b]">
                      {titleCaseStatus(key)}
                    </span>
                    <span className="text-xs text-[#123c2a]">{titleCaseStatus(asset?.status)}</span>
                  </div>
                ))}
              </div>
            </PlatePanel>
          </section>

          <footer className="grid gap-4 px-4 py-4 text-[#10351f] lg:grid-cols-[1fr_auto_1fr] lg:px-6">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#91621b]">
              The language of nature is color.
            </p>
            <p className="text-center font-serif text-2xl uppercase tracking-[0.25em]">
              AGORAXAI
            </p>
            <p className="text-left font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#91621b] lg:text-right">
              Rendered as draft / non-indexed / review-gated
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
