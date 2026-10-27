import { Badge } from "@/components/ui/badge";
import type {
  ConsoleView,
  EvidenceState,
  NetworkEdge,
  NetworkNode,
} from "@/lib/tax-intelligence/ecosystem-console-manifest";

/**
 * Relationship map for the ecosystem console.
 *
 * Server-compatible (no client hooks). Renders an SVG layered layout —
 * platform top-centre, participants/providers in the middle, activities at
 * the bottom — and ALWAYS follows it with the full accessible alternative:
 * tables listing every node and every edge from the manifest view.
 *
 * Only edges present in the view are drawn. Ownership edges never occur in
 * R01 (the projection removes them; none is evidenced), and the legend says
 * so explicitly: absence is the recorded state, not missing data.
 */

const WIDTH = 1080;
const HEIGHT = 540;
const NODE_W = 320;
const NODE_H = 84;
const GAP = 40;
/** Top edge (y) of each layer: 0 platform, 1 participants/providers, 2 activities. */
const LAYER_TOP = [48, 228, 408];

function layerOf(node: NetworkNode): number {
  const role = node.role.toLowerCase();
  if (role.includes("platform")) return 0;
  if (role.includes("activity")) return 2;
  return 1;
}

interface PlacedNode {
  node: NetworkNode;
  x: number;
  y: number;
  cx: number;
  cy: number;
}

function placeNodes(nodes: NetworkNode[]): PlacedNode[] {
  const layers: NetworkNode[][] = [[], [], []];
  for (const node of nodes) layers[layerOf(node)].push(node);
  const placed: PlacedNode[] = [];
  layers.forEach((layerNodes, layer) => {
    const used = layerNodes.length * NODE_W + Math.max(0, layerNodes.length - 1) * GAP;
    const startX = (WIDTH - used) / 2;
    layerNodes.forEach((node, i) => {
      const x = startX + i * (NODE_W + GAP);
      const y = LAYER_TOP[layer];
      placed.push({ node, x, y, cx: x + NODE_W / 2, cy: y + NODE_H / 2 });
    });
  });
  return placed;
}

const CATEGORY_STYLE: Record<NetworkEdge["category"], { stroke: string; dash?: string }> = {
  participation: { stroke: "#fbbf24" },
  services: { stroke: "#7dd3fc", dash: "7 5" },
  "financial-contracts": { stroke: "#c4b5fd", dash: "2 4" },
  ownership: { stroke: "#fda4af", dash: "10 4 2 4" },
};

function evidenceBadgeClass(state: EvidenceState): string {
  switch (state) {
    case "verified":
      return "border-emerald-400/40 bg-emerald-400/10 text-emerald-200";
    case "observed":
      return "border-sky-400/40 bg-sky-400/10 text-sky-200";
    case "declared":
      return "border-amber-400/40 bg-amber-400/10 text-amber-200";
    case "inferred":
      return "border-violet-400/40 bg-violet-400/10 text-violet-200";
    case "blocked":
      return "border-rose-400/40 bg-rose-400/10 text-rose-200";
    case "stale":
      return "border-orange-400/40 bg-orange-400/10 text-orange-200";
    case "unknown":
    default:
      return "border-slate-500/50 bg-slate-500/10 text-slate-300";
  }
}

const TH_CLASS =
  "border-b border-slate-600/50 px-3 py-2 text-xs font-medium uppercase tracking-wider text-slate-400";
const TD_CLASS = "border-b border-slate-700/40 px-3 py-3 align-top text-slate-300";

export function NetworkMap({ view }: { view: ConsoleView }) {
  const placed = placeNodes(view.nodes);
  const byId = new Map(placed.map((p) => [p.node.id, p]));
  const labelOf = (id: string) => byId.get(id)?.node.label ?? id;

  return (
    <div className="rounded-xl border border-slate-600/50 bg-slate-900/50 p-6">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Relationship map: ${view.nodes.length} participants and ${view.edges.length} recorded relationships. No ownership relationships are recorded.`}
      >
        <title>Ecosystem relationship map</title>
        <defs>
          <marker
            id="ec-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
          </marker>
        </defs>

        {view.edges.map((edge) => {
          const source = byId.get(edge.sourceId);
          const target = byId.get(edge.targetId);
          if (!source || !target) return null;
          const upward = target.cy < source.cy;
          const y1 = source.cy + (upward ? -NODE_H / 2 : NODE_H / 2);
          const y2 = target.cy + (upward ? NODE_H / 2 : -NODE_H / 2);
          const style = CATEGORY_STYLE[edge.category];
          return (
            <g key={edge.id}>
              <line
                x1={source.cx}
                y1={y1}
                x2={target.cx}
                y2={y2}
                stroke={style.stroke}
                strokeWidth={2}
                strokeDasharray={style.dash}
                markerEnd="url(#ec-arrow)"
              />
              <text
                x={(source.cx + target.cx) / 2 + 10}
                y={(y1 + y2) / 2}
                fill="#cbd5e1"
                fontSize={12}
                style={{ paintOrder: "stroke", stroke: "#020617", strokeWidth: 4 }}
              >
                {edge.label}
              </text>
            </g>
          );
        })}

        {placed.map(({ node, x, y, cx, cy }) => (
          <g key={node.id}>
            <rect
              x={x}
              y={y}
              width={NODE_W}
              height={NODE_H}
              rx={12}
              fill="#0f172a"
              stroke="#475569"
              strokeWidth={1}
            />
            <text x={cx} y={cy - 14} textAnchor="middle" fill="#f1f5f9" fontSize={15} fontWeight={600}>
              {node.label}
            </text>
            <text x={cx} y={cy + 8} textAnchor="middle" fill="#94a3b8" fontSize={10.5}>
              {node.role}
            </text>
            <text
              x={cx}
              y={cy + 27}
              textAnchor="middle"
              fill="#fcd34d"
              fontSize={9.5}
              fontFamily="monospace"
            >
              {`evidence: ${node.evidenceState}`}
            </text>
          </g>
        ))}
      </svg>

      <div className="mt-4 border-t border-slate-700/50 pt-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Legend</h3>
        <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
          <li className="flex items-center gap-3">
            <span aria-hidden="true" className="inline-block w-10 border-t-2 border-amber-300" />
            Participation in the platform — solid line.
          </li>
          <li className="flex items-center gap-3">
            <span aria-hidden="true" className="inline-block w-10 border-t-2 border-dashed border-sky-300" />
            Services provided — dashed line.
          </li>
          <li>
            Participation is <strong className="text-slate-100">not ownership</strong>: a participation
            edge records membership in the agora only — never equity, control, agency, or subsidiary
            status.
          </li>
          <li>
            No ownership edges are recorded. Their absence is the recorded state, not missing data.
          </li>
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Nodes</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                <th scope="col" className={TH_CLASS}>Label</th>
                <th scope="col" className={TH_CLASS}>Role</th>
                <th scope="col" className={TH_CLASS}>Status</th>
                <th scope="col" className={TH_CLASS}>Evidence state</th>
              </tr>
            </thead>
            <tbody>
              {view.nodes.map((node) => (
                <tr key={node.id}>
                  <td className={`${TD_CLASS} font-medium text-slate-100`}>{node.label}</td>
                  <td className={TD_CLASS}>{node.role}</td>
                  <td className={TD_CLASS}>{node.statusLabel}</td>
                  <td className={TD_CLASS}>
                    <Badge className={evidenceBadgeClass(node.evidenceState)}>{node.evidenceState}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Relationships</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                <th scope="col" className={TH_CLASS}>From</th>
                <th scope="col" className={TH_CLASS}>Relation</th>
                <th scope="col" className={TH_CLASS}>To</th>
                <th scope="col" className={TH_CLASS}>Evidence state</th>
              </tr>
            </thead>
            <tbody>
              {view.edges.length === 0 ? (
                <tr>
                  <td className={TD_CLASS} colSpan={4}>
                    No relationships recorded.
                  </td>
                </tr>
              ) : (
                view.edges.map((edge) => (
                  <tr key={edge.id}>
                    <td className={`${TD_CLASS} font-medium text-slate-100`}>{labelOf(edge.sourceId)}</td>
                    <td className={TD_CLASS}>
                      {edge.label}
                      <span className="block font-mono text-xs text-slate-400">{edge.type}</span>
                    </td>
                    <td className={`${TD_CLASS} font-medium text-slate-100`}>{labelOf(edge.targetId)}</td>
                    <td className={TD_CLASS}>
                      <Badge className={evidenceBadgeClass(edge.evidenceState)}>{edge.evidenceState}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
