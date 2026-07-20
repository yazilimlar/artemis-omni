import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const integrity = require("../../public/labs/geometric-workbench/v5-8/v6-integrity.js");
const html = readFileSync(
  new URL("../../public/labs/geometric-workbench/v5-8/index.html", import.meta.url),
  "utf8",
);
const productPage = readFileSync(
  new URL("../../app/workbench/page.tsx", import.meta.url),
  "utf8",
);
const solidMatch = html.match(
  /const UNIFORM_SOLIDS = (\{.*\});\nconst UNIFORM_SOLID_LABELS/s,
);
if (!solidMatch) throw new Error("Embedded uniform-solid library was not found");
const solids = JSON.parse(solidMatch[1]);

type Point = [number, number, number];

function topologyCells(
  solid: { vertex: Point[]; face: number[][] },
  keep: (points: Point[]) => boolean = () => true,
) {
  return solid.face
    .map((face, faceIndex) => ({ face, faceIndex }))
    .filter(({ face }) => keep(face.map((index) => solid.vertex[index])))
    .map(({ face, faceIndex }) => ({
      id: `F-${faceIndex}`,
      topologyIdentityMethod: "uniform_raw_vertex_index",
      bevels: face.map(() => ({ sawBevel: 0, dihedral: 0 })),
      edgeRefs: face.map((aIndex, localEdgeIndex) => {
        const bIndex = face[(localEdgeIndex + 1) % face.length];
        const a = solid.vertex[aIndex];
        const b = solid.vertex[bIndex];
        const vertexAId = `V-${aIndex}`;
        const vertexBId = `V-${bIndex}`;
        const point = (p: Point) => ({ x: p[0], y: p[1], z: p[2] });
        return {
          localEdgeIndex,
          vertexAId,
          vertexBId,
          canonicalKey: integrity.canonicalPair(vertexAId, vertexBId),
          outerA: point(a),
          outerB: point(b),
          innerA: point(a),
          innerB: point(b),
        };
      }),
    }));
}

type Vec = { x: number; y: number; z: number };
const vec = (x: number, y: number, z: number): Vec => ({ x, y, z });
const add = (...points: Vec[]) =>
  vec(
    points.reduce((sum, p) => sum + p.x, 0),
    points.reduce((sum, p) => sum + p.y, 0),
    points.reduce((sum, p) => sum + p.z, 0),
  );
const scale = (p: Vec, value: number) => vec(p.x * value, p.y * value, p.z * value);
const subtract = (a: Vec, b: Vec) => vec(a.x - b.x, a.y - b.y, a.z - b.z);
const dot = (a: Vec, b: Vec) => a.x * b.x + a.y * b.y + a.z * b.z;
const cross = (a: Vec, b: Vec) =>
  vec(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
const normalize = (p: Vec) => scale(p, 1 / Math.hypot(p.x, p.y, p.z));

function goldbergTopologyCells(frequency: number, cutYR: number) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const baseVertices = [
    vec(-1, phi, 0), vec(1, phi, 0), vec(-1, -phi, 0), vec(1, -phi, 0),
    vec(0, -1, phi), vec(0, 1, phi), vec(0, -1, -phi), vec(0, 1, -phi),
    vec(phi, 0, -1), vec(phi, 0, 1), vec(-phi, 0, -1), vec(-phi, 0, 1),
  ].map(normalize);
  const baseFaces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];
  const vertices: Vec[] = [];
  const vertexMap = new Map<string, number>();
  const triangles: number[][] = [];
  const addPoint = (point: Vec) => {
    const normalized = normalize(point);
    const key = [normalized.x, normalized.y, normalized.z]
      .map((value) => value.toFixed(8))
      .join(",");
    if (vertexMap.has(key)) return vertexMap.get(key)!;
    const index = vertices.length;
    vertices.push(normalized);
    vertexMap.set(key, index);
    return index;
  };
  for (const face of baseFaces) {
    const [A, B, C] = face.map((index) => baseVertices[index]);
    const grid: number[][] = [];
    for (let i = 0; i <= frequency; i += 1) {
      grid[i] = [];
      for (let j = 0; j <= frequency - i; j += 1) {
        grid[i][j] = addPoint(
          add(
            scale(A, (frequency - i - j) / frequency),
            scale(B, i / frequency),
            scale(C, j / frequency),
          ),
        );
      }
    }
    for (let i = 0; i < frequency; i += 1) {
      for (let j = 0; j < frequency - i; j += 1) {
        triangles.push([grid[i][j], grid[i + 1][j], grid[i][j + 1]]);
        if (j < frequency - i - 1) {
          triangles.push([grid[i + 1][j], grid[i + 1][j + 1], grid[i][j + 1]]);
        }
      }
    }
  }
  const centers = triangles.map((triangle) =>
    normalize(add(...triangle.map((index) => vertices[index]))),
  );
  const incident = Array.from({ length: vertices.length }, () => [] as number[]);
  triangles.forEach((triangle, faceIndex) =>
    triangle.forEach((vertexIndex) => incident[vertexIndex].push(faceIndex)),
  );
  return vertices
    .map((centerDir, vertexIndex) => ({ centerDir, vertexIndex }))
    .filter(({ centerDir, vertexIndex }) => centerDir.y >= cutYR && incident[vertexIndex].length >= 5)
    .map(({ centerDir, vertexIndex }, cellIndex) => {
      let reference = vec(0, 1, 0);
      if (Math.abs(dot(reference, centerDir)) > 0.92) reference = vec(1, 0, 0);
      const tangent1 = normalize(cross(reference, centerDir));
      const tangent2 = normalize(cross(centerDir, tangent1));
      const ordered = incident[vertexIndex]
        .map((faceIndex) => {
          const point = centers[faceIndex];
          const relative = subtract(point, scale(centerDir, dot(point, centerDir)));
          return { faceIndex, point, angle: Math.atan2(dot(relative, tangent2), dot(relative, tangent1)) };
        })
        .sort((a, b) => a.angle - b.angle)
        .reverse();
      return {
        id: `GEO-${cellIndex}`,
        topologyIdentityMethod: "goldberg_shared_triangle_index",
        bevels: ordered.map(() => ({ sawBevel: 0, dihedral: 0 })),
        edgeRefs: ordered.map((entry, localEdgeIndex) => {
          const next = ordered[(localEdgeIndex + 1) % ordered.length];
          const vertexAId = `GV-${entry.faceIndex}`;
          const vertexBId = `GV-${next.faceIndex}`;
          return {
            localEdgeIndex,
            vertexAId,
            vertexBId,
            canonicalKey: integrity.canonicalPair(vertexAId, vertexBId),
            outerA: entry.point,
            outerB: next.point,
            innerA: entry.point,
            innerB: next.point,
          };
        }),
      };
    });
}

function profile(connection: string) {
  return {
    connection,
    beamWidthMm: 120,
    beamThicknessMm: 40,
    pipeDiaMm: 114,
    pipeWallThicknessMm: 4,
    sectionFamily: connection === "piped" ? "circular_hollow" : "rectangular_solid",
    materialDensityKgM3: connection === "piped" ? 7850 : 520,
  };
}

describe("Constructor Configuration Parser", () => {
  it("parses a fully recognized constructor string", () => {
    const result = integrity.parseConstructorNotation(
      "7/12_Kruschke_3V_R2.20_beams_120x40",
    );
    expect(result.unsupportedTokens).toEqual([]);
    expect(result.partiallySupportedTokens).toEqual([]);
    expect(result.appliedConfiguration).toMatchObject({
      domeFraction: "7/12",
      subdivisionMethod: "kruschke",
      frequencyV: 3,
      radiusM: 2.2,
      beamWidthMm: 120,
      beamThicknessMm: 40,
    });
  });

  it("classifies GoodKarma as a preliminary partial mapping", () => {
    const result = integrity.parseConstructorNotation(
      "7/12_Kruschke_GoodKarma_3V_R2.20_beams_120x40",
    );
    expect(result.appliedConfiguration.connection).toBe("goodkarma");
    expect(result.partiallySupportedTokens.map((item: any) => item.token)).toContain(
      "GoodKarma",
    );
    expect(result.warnings.join(" ")).toMatch(/unvalidated/i);
  });

  it("reports aliases, partial support, warnings, and final Class III values", () => {
    const result = integrity.parseConstructorNotation(
      "Octohedron_1/2_Class_III_1,2_Inscribed_Fulleren_on_Semicone_3V_R2.20_beams_120x40",
    );
    expect(result.unsupportedTokens.map((item: any) => item.token)).toEqual(["on"]);
    expect(result.appliedConfiguration).toMatchObject({
      basePolyhedron: "solid:Octahedron",
      subdivisionClass: "III",
      hk: "1,2",
      fullerene: "inscribed",
      connection: "semicone",
      frequencyV: 3,
      radiusM: 2.2,
    });
    expect(result.partiallySupportedTokens.length).toBeGreaterThanOrEqual(4);
    expect(result.warnings.join(" ")).toMatch(/spelling alias/i);
    expect(result.warnings.join(" ")).toMatch(/independently validated/i);
  });

  it("does not silently apply unknown tokens", () => {
    const result = integrity.parseConstructorNotation(
      "7/12_UnknownConnector_3V_R2.20",
    );
    expect(result.unsupportedTokens.map((item: any) => item.token)).toEqual([
      "UnknownConnector",
    ]);
    expect(result.appliedConfiguration.connection).toBeUndefined();
  });

  it("parses Artemis-owned fabrication extensions", () => {
    const result = integrity.parseConstructorNotation(
      "rim_continuous_material_S355_pipewall_4_density_7850",
    );
    expect(result.unsupportedTokens).toEqual([]);
    expect(result.appliedConfiguration).toMatchObject({
      rimPolicy: "continuous_ring",
      material: "S355",
      pipeWallThicknessMm: 4,
      materialDensityKgM3: 7850,
    });
    expect(result.recognizedTokens.every((item: any) => item.support === "artemis_extension")).toBe(true);
  });

  it("migrates legacy fields once and fingerprints canonical data identically", async () => {
    const notation = "7/12_Kruschke_3V_R2.20";
    const legacy = integrity.migrateLegacyConstructorConfig({ acidomeHash: notation });
    const canonical = integrity.migrateLegacyConstructorConfig({
      constructorNotation: notation,
    });
    expect(legacy.config).toEqual(canonical.config);
    expect(legacy.notices).toHaveLength(1);
    expect(legacy.legacyCompatibility).toEqual({
      sourceFieldDetected: "acidomeHash",
      migrated: true,
    });
    const legacyHash = await integrity.configurationFingerprint(legacy.config);
    const canonicalHash = await integrity.configurationFingerprint(canonical.config);
    expect(legacyHash.full).toBe(canonicalHash.full);
  });
});

describe("Canonical topology and connection-aware BOM", () => {
  it.each([
    ["Icosahedron", 12, 30, 20, 60],
    ["TruncatedIcosahedron", 60, 90, 32, 180],
  ])("validates closed %s invariants", (name, V, E, F, slots) => {
    const topology = integrity.buildTopologyRegistry(topologyCells(solids[name]));
    expect(topology.metrics).toMatchObject({
      vertexCount: V,
      edgeCount: E,
      faceCount: F,
      rawFaceEdgeSlots: slots,
      boundaryEdgeCount: 0,
      nonmanifoldEdgeCount: 0,
      eulerCharacteristic: 2,
    });
    expect(topology.validation.status).toBe("PASS");
    for (const connection of ["piped", "semicone", "cone", "joint"]) {
      expect(
        integrity.memberInstances(topology, profile(connection), "member"),
      ).toHaveLength(E);
    }
    expect(
      integrity.memberInstances(topology, profile("goodkarma"), "member"),
    ).toHaveLength(E * 2);
  });

  it("validates the deterministic 7/12 3V Goldberg dome cap and each rim policy", () => {
    const capCells = goldbergTopologyCells(3, 1 - 2 * (7 / 12));
    const topology = integrity.buildTopologyRegistry(capCells);
    expect(topology.metrics).toMatchObject({
      vertexCount: 118,
      edgeCount: 169,
      faceCount: 52,
      rawFaceEdgeSlots: 304,
      interiorEdgeCount: 135,
      boundaryEdgeCount: 34,
      nonmanifoldEdgeCount: 0,
      boundaryLoopCount: 1,
      eulerCharacteristic: 1,
    });
    expect(topology.validation.status).toBe("PASS");
    expect(
      integrity.memberInstances(topology, profile("piped"), "member"),
    ).toHaveLength(135 + 34);
    expect(
      integrity.memberInstances(topology, profile("goodkarma"), "member"),
    ).toHaveLength(2 * 135 + 34);
    for (const rim of ["continuous_ring", "excluded"]) {
      expect(
        integrity.memberInstances(topology, profile("piped"), rim),
      ).toHaveLength(135);
      expect(
        integrity.memberInstances(topology, profile("goodkarma"), rim),
      ).toHaveLength(270);
    }
  });

  it("traces every member to a canonical edge, endpoints, cells, and assumptions", () => {
    const topology = integrity.buildTopologyRegistry(topologyCells(solids.Icosahedron));
    const instances = integrity.memberInstances(
      topology,
      profile("goodkarma"),
      "member",
    );
    for (const instance of instances) {
      const edge = [...topology.edges.values()].find(
        (candidate: any) => candidate.id === instance.edgeId,
      );
      expect(edge).toBeTruthy();
      expect(topology.vertices.has(edge.vertexAId)).toBe(true);
      expect(topology.vertices.has(edge.vertexBId)).toBe(true);
      expect(instance.adjacentCellIds.length).toBe(2);
      expect(instance.ownerCellId).toBeTruthy();
      expect(instance.confidence).toBe("unvalidated_proxy");
      expect(instance.clampLimitCm).toBeCloseTo(
        instance.centerlineLengthCm *
          integrity.BOM_ASSUMPTIONS.maxConnectionDeductionFraction,
      );
    }
  });

  it("calculates circular hollow section area instead of solid pipe area", () => {
    const section = integrity.sectionProperties(profile("piped"));
    const outer = 0.114;
    const inner = outer - 2 * 0.004;
    expect(section.sectionFamily).toBe("circular_hollow");
    expect(section.sectionAreaM2).toBeCloseTo(
      (Math.PI / 4) * (outer ** 2 - inner ** 2),
      12,
    );
  });

  it("fails identity collisions and nonmanifold edges", () => {
    const triangle = (id: string, cId: string, offset = 0) => ({
      id: cId,
      topologyIdentityMethod: "shared_test_index",
      bevels: [{}, {}, {}],
      edgeRefs: [
        ["V-A", "V-B"], ["V-B", id], [id, "V-A"],
      ].map(([vertexAId, vertexBId], localEdgeIndex) => ({
        localEdgeIndex,
        vertexAId,
        vertexBId,
        canonicalKey: integrity.canonicalPair(vertexAId, vertexBId),
        outerA: vertexAId === "V-A" ? { x: offset, y: 0, z: 0 } : vertexAId === "V-B" ? { x: 1, y: 0, z: 0 } : { x: 0, y: 1, z: 0 },
        outerB: vertexBId === "V-A" ? { x: offset, y: 0, z: 0 } : vertexBId === "V-B" ? { x: 1, y: 0, z: 0 } : { x: 0, y: 1, z: 0 },
        innerA: vertexAId === "V-A" ? { x: offset, y: 0, z: 0 } : vertexAId === "V-B" ? { x: 1, y: 0, z: 0 } : { x: 0, y: 1, z: 0 },
        innerB: vertexBId === "V-A" ? { x: offset, y: 0, z: 0 } : vertexBId === "V-B" ? { x: 1, y: 0, z: 0 } : { x: 0, y: 1, z: 0 },
      })),
    });
    const topology = integrity.buildTopologyRegistry([
      triangle("V-C", "F-1"),
      triangle("V-D", "F-2"),
      triangle("V-E", "F-3", 0.1),
    ]);
    expect(topology.metrics.nonmanifoldEdgeCount).toBe(1);
    expect(topology.validation.status).toBe("FAIL");
    expect(topology.failures.join(" ")).toMatch(/identity collision/i);
    expect(topology.failures.join(" ")).toMatch(/nonmanifold/i);
  });
});

describe("Auditable console evidence", () => {
  it("emits validation, parser, assumptions, and fingerprint evidence", async () => {
    const closed = integrity.buildTopologyRegistry(topologyCells(solids.Icosahedron));
    const cap = integrity.buildTopologyRegistry(
      goldbergTopologyCells(3, 1 - 2 * (7 / 12)),
    );
    const parser = integrity.parseConstructorNotation(
      "7/12_Kruschke_GoodKarma_3V_R2.20_beams_120x40",
    );
    const notation = "7/12_Kruschke_3V_R2.20";
    const legacy = integrity.migrateLegacyConstructorConfig({ acidomeHash: notation });
    const canonical = integrity.migrateLegacyConstructorConfig({ constructorNotation: notation });
    const legacyFingerprint = await integrity.configurationFingerprint(legacy.config);
    const canonicalFingerprint = await integrity.configurationFingerprint(canonical.config);
    const evidence = {
      validationDashboard: {
        closedIcosahedron: { ...closed.metrics, status: closed.validation.status },
        goldberg7_12_3V: { ...cap.metrics, status: cap.validation.status },
        physicalMembers: {
          piped: integrity.memberInstances(cap, profile("piped"), "member").length,
          goodkarma: integrity.memberInstances(cap, profile("goodkarma"), "member").length,
          semicone: integrity.memberInstances(cap, profile("semicone"), "member").length,
          cone: integrity.memberInstances(cap, profile("cone"), "member").length,
          joint: integrity.memberInstances(cap, profile("joint"), "member").length,
        },
      },
      parserDiagnostics: {
        compatible: parser.recognizedTokens.map((item: any) => item.token),
        partial: parser.partiallySupportedTokens.map((item: any) => item.token),
        unsupported: parser.unsupportedTokens.map((item: any) => item.token),
        warnings: parser.warnings,
      },
      assumptionsLedger: integrity.BOM_ASSUMPTIONS,
      fingerprintEquivalence: {
        legacy: legacyFingerprint.full,
        canonical: canonicalFingerprint.full,
        equal: legacyFingerprint.full === canonicalFingerprint.full,
      },
    };
    console.info("V6_AUDIT_EVIDENCE", JSON.stringify(evidence, null, 2));
    expect(evidence.fingerprintEquivalence.equal).toBe(true);
  });
});

describe("Static integration and no-regression guards", () => {
  it("keeps the route shell, feature tabs, exports, and external support navigation", () => {
    expect(html).toContain("ARTEMIS Geometric Workbench v6.0.0-alpha");
    expect(html).toContain("Constructor Configuration Parser");
    expect(html).toContain('<script src="./v6-integrity.js"></script>');
    for (const tab of [
      "diagrams", "manufacturing", "bom", "constructor", "struts", "erection", "glossary", "topology",
    ]) expect(html).toContain(`data-tab="${tab}"`);
    for (const exportId of [
      "downloadJSON", "downloadCSV", "downloadMFG", "downloadMFGCSV", "downloadSVG", "downloadDXF", "downloadConstructor", "downloadStruts", "downloadErectionCSV", "downloadErectionJSON", "snapshot",
    ]) expect(html).toContain(`id="${exportId}"`);
    expect(html).toContain('window.open(\n  url,\n  "_blank",\n  "noopener,noreferrer"');
    expect(html).toContain("if(!supportWindow)window.location.assign(url)");
    expect(html).not.toMatch(/Acidome-style|ACIDOME_PRESETS|applyAcidomeHash/i);
  });
});

describe("Sprint 0B regression contracts", () => {
  it("retains Full Sphere, Dome, and custom dome-cut modes", () => {
    expect(html).toMatch(
      /id="viewMode"[\s\S]*?<option value="dome" selected>Dome cap only<\/option>[\s\S]*?<option value="sphere">Full geodesic sphere<\/option>/,
    );
    expect(html).toMatch(
      /id="cut"[^>]*min="-0\.25"[^>]*max="0\.85"[^>]*step="0\.01"/,
    );
    expect(html).toMatch(
      /function params\(\)[\s\S]*?cut:\+\$\('cut'\)\.value[\s\S]*?viewMode:\$\('viewMode'\)\.value/,
    );

    const sphere = integrity.buildTopologyRegistry(
      goldbergTopologyCells(3, Number.NEGATIVE_INFINITY),
    );
    const dome = integrity.buildTopologyRegistry(goldbergTopologyCells(3, 0));
    const customCap = integrity.buildTopologyRegistry(goldbergTopologyCells(3, 0.3));

    expect(sphere.validation.status).toBe("PASS");
    expect(sphere.metrics.boundaryEdgeCount).toBe(0);
    expect(dome.validation.status).toBe("PASS");
    expect(dome.metrics.boundaryLoopCount).toBe(1);
    expect(customCap.validation.status).toBe("PASS");
    expect(customCap.metrics.faceCount).not.toBe(dome.metrics.faceCount);
  });

  it("produces deterministic BOM totals and schedules for identical inputs", () => {
    const summarize = () => {
      const topology = integrity.buildTopologyRegistry(
        goldbergTopologyCells(3, 1 - 2 * (7 / 12)),
      );
      const instances = integrity.memberInstances(
        topology,
        profile("piped"),
        "member",
      );
      const schedule = integrity.groupMemberInstances(instances);
      return {
        topology: topology.metrics,
        instanceCount: instances.length,
        schedule,
        rawLengthCm: instances.reduce(
          (sum: number, item: any) => sum + item.centerlineLengthCm,
          0,
        ),
        netLengthCm: instances.reduce(
          (sum: number, item: any) => sum + item.netCutLengthCm,
          0,
        ),
      };
    };

    const first = summarize();
    const second = summarize();
    expect(first).toEqual(second);
    expect(first.instanceCount).toBe(169);
    expect(first.schedule.reduce((sum: number, row: any) => sum + row.qty, 0)).toBe(
      first.instanceCount,
    );
  });

  it("keeps project save/load fields in a round-trip contract", () => {
    const paramsSource = html.slice(
      html.indexOf("function params()"),
      html.indexOf("function makeMat"),
    );
    const projectApiSource = html.slice(
      html.indexOf("window.ARTEMIS_WORKBENCH_V6={"),
      html.indexOf("function drawBottom"),
    );
    const projectShellSource = html.slice(
      html.indexOf("async function saveProject()"),
      html.indexOf("const commands="),
    );

    for (const field of [
      "freq", "radius", "thick", "cut", "timeline", "animationSpeed", "viewMode", "cellMode",
    ]) {
      expect(paramsSource).toContain(`${field}:`);
    }
    expect(projectApiSource).toContain("params:params()");
    expect(projectShellSource).toContain("const x=p.params||{}");
    expect(projectShellSource).toContain("Object.entries(x).forEach(([k,v])=>");
    expect(projectShellSource).toContain("document.getElementById(k)");

    for (const field of [
      "connection", "rimPolicy", "sectionFamily", "pipeWallThicknessMm",
      "materialDensityKgM3", "wasteFactorPercent",
    ]) {
      expect(projectApiSource).toContain(`${field}:constructorProfile().${field}`);
    }
    expect(projectApiSource).toContain(
      "fabrication.wasteFactorPercent??constructor.wasteFactorPercent",
    );
  });

  it("persists palette, accent, animation speed, and waste factor", () => {
    expect(html).toContain("palette:V59.palette,accentColor:V59.accent");
    expect(html).toContain("p.ui.palette||p.ui.material||'obsidian_brass'");
    expect(html).toContain("{accent:p.ui.accentColor,silent:true}");
    expect(html).toContain("animationSpeed:+$('animationSpeed').value");
    expect(html).toContain(
      "wasteFactorPercent: Math.max(0,+(readSelect('geoWaste',String(BOM_ASSUMPTIONS.defaultWasteFactorPercent))) || 0)",
    );
    expect(html).toContain(
      "setValueSafe('geoWaste',fabrication.wasteFactorPercent??constructor.wasteFactorPercent)",
    );
  });

  it("accepts provenance-sensitive legacy tokens only through explicit parser paths", () => {
    const result = integrity.parseConstructorNotation(
      "7/12_kRuScHkE_gOoDkArMa_3V_R2.20_beams_120x40",
    );
    expect(result.appliedConfiguration).toMatchObject({
      subdivisionMethod: "kruschke",
      connection: "goodkarma",
    });
    expect(result.partiallySupportedTokens).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ category: "connection", support: "partial" }),
      ]),
    );
    expect(result.warnings.join(" ")).toMatch(/unvalidated/i);
  });

  it("keeps the Squarespace support destination and popup fallback stable", () => {
    expect(html).toContain("donationUrl:'https://www.agoraxai.com/support'");
    expect(html).toContain("const supportWindow = window.open(");
    expect(html).toContain("if(!supportWindow)window.location.assign(url)");
    expect(html).toContain("Squarespace-hosted AGOraXAI support page");
  });

  it("keeps provenance-sensitive names out of filenames and product marketing copy", () => {
    const filenames = [...html.matchAll(/downloadText\('([^']+)'/g)].map(
      (match) => match[1],
    );
    expect(filenames.length).toBeGreaterThan(0);
    for (const output of [...filenames, productPage]) {
      expect(output).not.toMatch(/Kruschke|GoodKarma/i);
    }
  });

  it("fingerprints canonical configuration deterministically", async () => {
    const first = await integrity.configurationFingerprint({
      geometry: { viewMode: "dome", cut: -1 / 6, frequency: 3 },
      fabrication: { wasteFactorPercent: 10, connection: "piped" },
      ui: { palette: "blueprint_cyan", accentColor: "#39ddff" },
    });
    const reordered = await integrity.configurationFingerprint({
      ui: { accentColor: "#39ddff", palette: "blueprint_cyan" },
      fabrication: { connection: "piped", wasteFactorPercent: 10 },
      geometry: { frequency: 3, cut: -1 / 6, viewMode: "dome" },
    });
    expect(first).toEqual(reordered);
    expect(first.full).toMatch(/^[a-f0-9]{64}$/);
    expect(first.abbreviated).toBe(first.full.slice(0, 12));
  });

  it("contains no duplicate HTML ids", () => {
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    expect(duplicates).toEqual([]);
  });
});
