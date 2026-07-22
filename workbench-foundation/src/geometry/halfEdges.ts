/**
 * ARTEMIS Workbench v6 — geometry/halfEdges
 * ID-based, immutable, JSON-serializable half-edge topology.
 *
 * Preconditions:
 * - every panel loop contains >= 3 distinct vertex IDs;
 * - loops are already normalized CCW relative to their outward normal;
 * - vertex IDs identify shared geometric vertices consistently across panels.
 */

export interface PanelLoopInput {
  id: string;
  vertexIds: readonly string[];
}

export interface HalfEdgeRecord {
  id: string;
  physicalEdgeId: string;
  originVertexId: string;
  destinationVertexId: string;
  panelId: string;
  twinId: string | null;
  nextId: string;
  previousId: string;
}

export interface PhysicalEdgeRecord {
  id: string;
  vertexIds: readonly [string, string];
  halfEdgeIds: readonly [string, string | null];
  boundary: boolean;
}

export interface HalfEdgeTopology {
  halfEdges: readonly HalfEdgeRecord[];
  physicalEdges: readonly PhysicalEdgeRecord[];
  panelFirstHalfEdgeId: Readonly<Record<string, string>>;
}

export interface TopologyIssue {
  code:
    | "INVALID_PANEL_LOOP"
    | "DUPLICATE_DIRECTED_EDGE"
    | "NONMANIFOLD_EDGE"
    | "BROKEN_NEXT_PREVIOUS"
    | "BROKEN_TWIN"
    | "OPEN_PANEL_LOOP";
  message: string;
  entityIds: readonly string[];
}

export interface HalfEdgeAudit {
  valid: boolean;
  issues: readonly TopologyIssue[];
  panelCount: number;
  halfEdgeCount: number;
  physicalEdgeCount: number;
  internalEdgeCount: number;
  boundaryEdgeCount: number;
}

function edgeKey(a: string, b: string): string {
  return a < b ? `${a}\u0000${b}` : `${b}\u0000${a}`;
}

function edgeId(a: string, b: string): string {
  const [lo, hi] = a < b ? [a, b] : [b, a];
  return `edge:${encodeURIComponent(lo)}--${encodeURIComponent(hi)}`;
}

function halfEdgeId(panelId: string, index: number): string {
  return `half-edge:${encodeURIComponent(panelId)}:${index}`;
}

function validatePanel(panel: PanelLoopInput): void {
  const ids = panel.vertexIds;
  if (ids.length < 3 || new Set(ids).size !== ids.length || ids.some((id) => !id)) {
    throw new RangeError(`panel ${panel.id} must contain at least three distinct non-empty vertex IDs`);
  }
}

export function buildHalfEdgeTopology(panels: readonly PanelLoopInput[]): HalfEdgeTopology {
  const halfEdges: HalfEdgeRecord[] = [];
  const byPhysical = new Map<string, number[]>();
  const panelFirstHalfEdgeId: Record<string, string> = {};
  const directed = new Set<string>();

  for (const panel of panels) {
    validatePanel(panel);
    if (panelFirstHalfEdgeId[panel.id]) throw new RangeError(`duplicate panel ID ${panel.id}`);
    const n = panel.vertexIds.length;
    const ids = Array.from({ length: n }, (_, i) => halfEdgeId(panel.id, i));
    panelFirstHalfEdgeId[panel.id] = ids[0];

    for (let i = 0; i < n; i++) {
      const origin = panel.vertexIds[i];
      const destination = panel.vertexIds[(i + 1) % n];
      const directedKey = `${origin}\u0000${destination}`;
      if (directed.has(directedKey)) {
        throw new RangeError(`duplicate directed edge ${origin} -> ${destination}`);
      }
      directed.add(directedKey);
      const record: HalfEdgeRecord = {
        id: ids[i],
        physicalEdgeId: edgeId(origin, destination),
        originVertexId: origin,
        destinationVertexId: destination,
        panelId: panel.id,
        twinId: null,
        nextId: ids[(i + 1) % n],
        previousId: ids[(i - 1 + n) % n],
      };
      const index = halfEdges.push(record) - 1;
      const key = edgeKey(origin, destination);
      const bucket = byPhysical.get(key) ?? [];
      bucket.push(index);
      byPhysical.set(key, bucket);
    }
  }

  const physicalEdges: PhysicalEdgeRecord[] = [];
  for (const indices of byPhysical.values()) {
    if (indices.length > 2) {
      const first = halfEdges[indices[0]];
      throw new RangeError(`nonmanifold physical edge ${first.physicalEdgeId} has ${indices.length} incident panels`);
    }
    const a = halfEdges[indices[0]];
    const b = indices.length === 2 ? halfEdges[indices[1]] : null;
    if (b) {
      if (a.originVertexId !== b.destinationVertexId || a.destinationVertexId !== b.originVertexId) {
        throw new RangeError(`shared edge ${a.physicalEdgeId} does not have opposite directed half-edges; normalize winding first`);
      }
      halfEdges[indices[0]] = { ...a, twinId: b.id };
      halfEdges[indices[1]] = { ...b, twinId: a.id };
    }
    physicalEdges.push({
      id: a.physicalEdgeId,
      vertexIds: a.originVertexId < a.destinationVertexId
        ? [a.originVertexId, a.destinationVertexId]
        : [a.destinationVertexId, a.originVertexId],
      halfEdgeIds: [a.id, b?.id ?? null],
      boundary: b === null,
    });
  }

  halfEdges.sort((a, b) => a.id.localeCompare(b.id));
  physicalEdges.sort((a, b) => a.id.localeCompare(b.id));

  const frozenHalfEdges: readonly HalfEdgeRecord[] = Object.freeze(
    halfEdges.map((halfEdge): HalfEdgeRecord => Object.freeze({ ...halfEdge })),
  );
  const frozenPhysicalEdges: readonly PhysicalEdgeRecord[] = Object.freeze(
    physicalEdges.map((physicalEdge): PhysicalEdgeRecord => Object.freeze({
      ...physicalEdge,
      vertexIds: Object.freeze([...physicalEdge.vertexIds]) as readonly [string, string],
      halfEdgeIds: Object.freeze([...physicalEdge.halfEdgeIds]) as readonly [string, string | null],
    })),
  );

  return Object.freeze({
    halfEdges: frozenHalfEdges,
    physicalEdges: frozenPhysicalEdges,
    panelFirstHalfEdgeId: Object.freeze({ ...panelFirstHalfEdgeId }),
  });
}

export function auditHalfEdgeTopology(topology: HalfEdgeTopology): HalfEdgeAudit {
  const issues: TopologyIssue[] = [];
  const byId = new Map(topology.halfEdges.map((halfEdge) => [halfEdge.id, halfEdge]));
  const panelIds = new Set(topology.halfEdges.map((halfEdge) => halfEdge.panelId));

  for (const halfEdge of topology.halfEdges) {
    const next = byId.get(halfEdge.nextId);
    const previous = byId.get(halfEdge.previousId);
    if (!next || !previous || next.previousId !== halfEdge.id || previous.nextId !== halfEdge.id) {
      issues.push({
        code: "BROKEN_NEXT_PREVIOUS",
        message: `half-edge ${halfEdge.id} has inconsistent next/previous links`,
        entityIds: [halfEdge.id, halfEdge.nextId, halfEdge.previousId],
      });
    }
    if (halfEdge.twinId) {
      const twin = byId.get(halfEdge.twinId);
      if (!twin || twin.twinId !== halfEdge.id ||
          twin.originVertexId !== halfEdge.destinationVertexId ||
          twin.destinationVertexId !== halfEdge.originVertexId ||
          twin.physicalEdgeId !== halfEdge.physicalEdgeId) {
        issues.push({
          code: "BROKEN_TWIN",
          message: `half-edge ${halfEdge.id} has an inconsistent twin`,
          entityIds: [halfEdge.id, halfEdge.twinId],
        });
      }
    }
  }

  for (const panelId of panelIds) {
    const startId = topology.panelFirstHalfEdgeId[panelId];
    const visited = new Set<string>();
    let currentId: string | undefined = startId;
    while (currentId && !visited.has(currentId)) {
      visited.add(currentId);
      const current = byId.get(currentId);
      if (!current || current.panelId !== panelId) break;
      currentId = current.nextId;
    }
    const expected = topology.halfEdges.filter((halfEdge) => halfEdge.panelId === panelId).length;
    if (currentId !== startId || visited.size !== expected) {
      issues.push({
        code: "OPEN_PANEL_LOOP",
        message: `panel ${panelId} does not form one closed half-edge loop`,
        entityIds: [panelId, ...visited],
      });
    }
  }

  const boundaryEdgeCount = topology.physicalEdges.filter((edge) => edge.boundary).length;
  return {
    valid: issues.length === 0,
    issues,
    panelCount: panelIds.size,
    halfEdgeCount: topology.halfEdges.length,
    physicalEdgeCount: topology.physicalEdges.length,
    internalEdgeCount: topology.physicalEdges.length - boundaryEdgeCount,
    boundaryEdgeCount,
  };
}
