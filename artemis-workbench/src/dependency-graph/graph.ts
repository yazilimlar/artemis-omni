export type DependencyNode =
  | "configuration.geometry"
  | "configuration.fabrication"
  | "configuration.display"
  | "geometry.vertices"
  | "topology"
  | "geometry.faces"
  | "fabrication.parts"
  | "engineering.metrics"
  | "bom"
  | "drawings"
  | "exports"
  | "renderer";

const downstream: Readonly<Record<DependencyNode, readonly DependencyNode[]>> = {
  "configuration.geometry": ["geometry.vertices"],
  "configuration.fabrication": ["fabrication.parts"],
  "configuration.display": ["renderer"],
  "geometry.vertices": ["topology", "engineering.metrics", "renderer"],
  topology: ["geometry.faces", "fabrication.parts", "engineering.metrics", "renderer"],
  "geometry.faces": ["engineering.metrics", "fabrication.parts", "renderer"],
  "fabrication.parts": ["bom", "drawings", "exports", "renderer"],
  "engineering.metrics": ["bom", "drawings", "exports", "renderer"],
  bom: ["exports"],
  drawings: ["exports"],
  exports: [],
  renderer: [],
};

export function affectedNodes(seeds: readonly DependencyNode[]): ReadonlySet<DependencyNode> {
  const affected = new Set<DependencyNode>();
  const queue = [...seeds];

  while (queue.length > 0) {
    const node = queue.shift();
    if (!node || affected.has(node)) continue;
    affected.add(node);
    for (const child of downstream[node]) queue.push(child);
  }

  return affected;
}

export function configurationPathsToSeeds(paths: readonly string[]): readonly DependencyNode[] {
  const seeds = new Set<DependencyNode>();
  for (const path of paths) {
    if (path.startsWith("geometry.")) seeds.add("configuration.geometry");
    else if (path.startsWith("fabrication.")) seeds.add("configuration.fabrication");
    else if (path.startsWith("display.")) seeds.add("configuration.display");
  }
  return [...seeds];
}
