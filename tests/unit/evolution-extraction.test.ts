import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const ROOT = process.cwd();
const SCRIPT = join(ROOT, "scripts", "extract-evolution.mjs");

type EvolutionEvent = {
  id: string;
  type: string;
  date: string;
  title: string;
  summary: string;
  references: string[];
  division: string | null;
  product: string | null;
  outcome: string;
};
type Evolution = {
  _meta: { generated_by: string; generated_at: string; do_not_edit: boolean };
  version: number;
  generated_at: string;
  events: EvolutionEvent[];
  stats: Record<string, unknown>;
};

const EVENT_TYPES = [
  "adr_added",
  "adr_superseded",
  "product_registered",
  "product_status_changed",
  "route_added",
  "route_removed",
  "milestone_shipped",
  "pr_merged",
  "registry_changed",
  "security_fix",
  "scene_registered",
];

let dir: string;
let firstRun: string;
let secondRun: string;

function run(name: string): string {
  const out = join(dir, name);
  execFileSync("node", [SCRIPT, "--root", ROOT, "--out", out], { stdio: "pipe" });
  return readFileSync(out, "utf8");
}

// Two real runs against the repo into a temp directory; the extractor reads git history.
beforeAll(() => {
  dir = mkdtempSync(join(tmpdir(), "evolution-"));
  firstRun = run("a.json");
  secondRun = run("b.json");
}, 120_000);
afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe("extract-evolution.mjs", () => {
  it("produces valid JSON with the ADR-018 fields", () => {
    const data = JSON.parse(firstRun) as Evolution;
    expect(data.version).toBe(1);
    expect(data._meta).toMatchObject({
      generated_by: "scripts/extract-evolution.mjs",
      do_not_edit: true,
    });
    expect(Number.isNaN(Date.parse(data.generated_at))).toBe(false);
    expect(Array.isArray(data.events)).toBe(true);
    for (const e of data.events) {
      expect(EVENT_TYPES).toContain(e.type);
      expect(e.id).toMatch(/^EVT-[A-Za-z0-9-]+$/);
      expect(Number.isNaN(Date.parse(e.date))).toBe(false);
      expect(typeof e.title).toBe("string");
      expect(typeof e.summary).toBe("string");
      expect(Array.isArray(e.references)).toBe(true);
      expect(typeof e.outcome).toBe("string");
    }
    for (const key of [
      "adrs_total",
      "adrs_superseded",
      "products_total",
      "products_by_status",
      "scenes_total",
      "milestones_shipped",
      "prs_merged",
    ]) {
      expect(data.stats).toHaveProperty(key);
    }
  });

  it("is idempotent: two runs give byte-identical output", () => {
    expect(secondRun).toBe(firstRun);
  });

  it("derives stable, unique event ids from source references", () => {
    const first = (JSON.parse(firstRun) as Evolution).events.map((e) => e.id);
    const second = (JSON.parse(secondRun) as Evolution).events.map((e) => e.id);
    expect(first).toEqual(second);
    expect(new Set(first).size).toBe(first.length);
    expect(first).toContain("EVT-adr-017");
    expect(first).toContain("EVT-adr-002-superseded");
    expect(first).toContain("EVT-scene-hello-orb");
  });

  it("matches the committed data/evolution.json shape", () => {
    const committed = JSON.parse(
      readFileSync(join(ROOT, "data", "evolution.json"), "utf8"),
    ) as Evolution;
    expect(committed._meta.do_not_edit).toBe(true);
    expect(committed.events.length).toBeGreaterThan(0);
  });
});
