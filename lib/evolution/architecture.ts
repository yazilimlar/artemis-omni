/**
 * Hand-defined architecture of the Artemis platform for the Evolution Archive
 * map. Nodes name real files and routes; an edge `from -> to` means data or
 * control flows from `from` to `to` (the target reads from, or is produced by,
 * the source). Maintained manually for now; ADR-018 may later derive it.
 *
 * `pos` is [x, y, z] in scene units. The 2D layout uses x and y only.
 */

export type ArchitectureKind = "source" | "registry" | "script" | "service" | "route" | "api";

export type ArchitectureNode = {
  id: string;
  label: string;
  detail: string;
  kind: ArchitectureKind;
  pos: [number, number, number];
};

export type ArchitectureEdge = { from: string; to: string; label: string };

export const KIND_COLORS: Record<ArchitectureKind, string> = {
  source: "#a78bfa",
  registry: "#d9b46a",
  script: "#6fcf97",
  service: "#f2a65a",
  route: "#4fb3ff",
  api: "#56d6c2",
};

export const KIND_LABELS: Record<ArchitectureKind, string> = {
  source: "Source of truth",
  registry: "Registry / data file",
  script: "Script / automation",
  service: "External service",
  route: "Route",
  api: "API route",
};

export const architectureNodes: ArchitectureNode[] = [
  { id: "git-history", label: "Git history", detail: "Commits and PRs on main", kind: "source", pos: [-3, 3, 0] },
  { id: "product-registry", label: "Product registry", detail: "ENGINEERING/PRODUCT_REGISTRY.yaml", kind: "registry", pos: [-1, 3, -0.8] },
  { id: "division-registry", label: "Division registry", detail: "ENGINEERING/DIVISION_REGISTRY.yaml", kind: "registry", pos: [1, 3, -0.8] },
  { id: "scene-registry", label: "Scene registry", detail: "data/scene-registry.json", kind: "registry", pos: [3, 3, -0.8] },
  { id: "extract-script", label: "extract-evolution", detail: "scripts/extract-evolution.mjs", kind: "script", pos: [-2, 1.5, 0] },
  { id: "pr-bot", label: "GitHub PR bot", detail: ".github/workflows/evolution-update.yml and /control/propose", kind: "service", pos: [0, 1.5, 0] },
  { id: "evolution-json", label: "evolution.json", detail: "data/evolution.json (generated)", kind: "registry", pos: [-2, 0, -0.8] },
  { id: "supabase-auth", label: "Supabase Auth", detail: "Magic link, allowlist and roles", kind: "service", pos: [3, 0, 0] },
  { id: "evolution", label: "/evolution", detail: "Evolution Archive page", kind: "route", pos: [-3.2, -1.5, 0.4] },
  { id: "evolution-api", label: "evolution API", detail: "/api/evolution-data", kind: "api", pos: [-1.6, -1.5, 1] },
  { id: "scene-page", label: "scene page", detail: "/labs/scenes/[id]", kind: "route", pos: [0, -1.5, 0.4] },
  { id: "labs", label: "/labs", detail: "Registry-driven labs index", kind: "route", pos: [1.6, -1.5, 0.4] },
  { id: "control", label: "/control", detail: "Registry truth table and proposals", kind: "route", pos: [3.2, -1.5, 0.4] },
  { id: "dashboard", label: "/dashboard", detail: "Role-based dashboard", kind: "route", pos: [-3, -3, 0.4] },
  { id: "sandbox-api", label: "sandbox API", detail: "/api/sandbox", kind: "api", pos: [-1.5, -3, 1] },
  { id: "integrate", label: "/integrate", detail: "Pilot request page", kind: "route", pos: [0, -3, 0.4] },
  { id: "pilot-api", label: "pilot API", detail: "/api/pilot-requests", kind: "api", pos: [1.5, -3, 1] },
];

export const architectureEdges: ArchitectureEdge[] = [
  { from: "git-history", to: "extract-script", label: "history" },
  { from: "product-registry", to: "extract-script", label: "products" },
  { from: "scene-registry", to: "extract-script", label: "scenes" },
  { from: "extract-script", to: "pr-bot", label: "regenerated file" },
  { from: "pr-bot", to: "evolution-json", label: "merged PR" },
  { from: "extract-script", to: "evolution-json", label: "writes" },
  { from: "evolution-json", to: "evolution", label: "reads" },
  { from: "evolution-json", to: "evolution-api", label: "serves" },
  { from: "scene-registry", to: "scene-page", label: "reads" },
  { from: "product-registry", to: "labs", label: "reads" },
  { from: "product-registry", to: "control", label: "reads" },
  { from: "division-registry", to: "control", label: "reads" },
  { from: "product-registry", to: "dashboard", label: "reads" },
  { from: "control", to: "pr-bot", label: "opens PR" },
  { from: "supabase-auth", to: "evolution", label: "gates" },
  { from: "supabase-auth", to: "evolution-api", label: "gates" },
  { from: "supabase-auth", to: "control", label: "gates" },
  { from: "supabase-auth", to: "dashboard", label: "gates" },
  { from: "labs", to: "sandbox-api", label: "runs artifacts" },
  { from: "integrate", to: "pilot-api", label: "submits" },
];
