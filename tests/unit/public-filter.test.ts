import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  PUBLIC_ADR_NUMBERS,
  PUBLIC_ADR_SUMMARIES,
  PUBLIC_MILESTONES,
  SENSITIVE_PATTERNS,
  filterForPublic,
} from "@/lib/evolution/public-filter";
import type { EvolutionEvent } from "@/lib/evolution/load";

function event(over: Partial<EvolutionEvent> & Pick<EvolutionEvent, "id" | "type">): EvolutionEvent {
  return {
    date: "2026-10-01T00:00:00.000Z",
    title: "A change",
    summary: "A summary.",
    references: [],
    division: null,
    product: null,
    outcome: "",
    ...over,
  };
}

const adr = (num: string, title = `ADR-${num}: ADR-${num} — Some decision`) =>
  event({ id: `EVT-adr-${num}`, type: "adr_added", title, summary: "raw index text", references: [`ADR-${num}`] });
const pr = (n: number, title: string, extra: Partial<EvolutionEvent> = {}) =>
  event({ id: `EVT-pr-${n}`, type: "pr_merged", title, references: [`PR#${n}`, "abc1234"], ...extra });

describe("filterForPublic", () => {
  it("excludes the internal governance types", () => {
    const out = filterForPublic([
      event({ id: "EVT-security-pr-94", type: "security_fix", title: "Sandbox labs", references: ["PR#94"] }),
      event({ id: "EVT-registry-abc", type: "registry_changed" }),
      event({ id: "EVT-product-x-status-abc", type: "product_status_changed" }),
    ]);
    expect(out).toEqual([]);
  });

  it("excludes events with sensitive keywords", () => {
    const words = ["auth", "allowlist", "secret", "token", "ENV", "cookie", "Supabase", "email", "private", "internal_operations", "noindex_review", "resend", "IP salt"];
    for (const word of words) {
      const out = filterForPublic([pr(70, `feat(labs): handle ${word} values`)]);
      expect(out, word).toEqual([]);
    }
    expect(filterForPublic([pr(70, "feat(labs): render the labs index")])).toHaveLength(1);
  });

  it("does not treat ordinary words as sensitive", () => {
    expect(filterForPublic([pr(70, "feat(labs): development environment and authors")])).toHaveLength(1);
  });

  it("includes public ADRs and excludes internal ones", () => {
    for (const num of ["006", "017"]) expect(filterForPublic([adr(num)]).map((e) => e.id)).toEqual([`EVT-adr-${num}`]);
    for (const num of ["011", "013", "014", "012", "007", "008", "009", "010", "016"]) {
      expect(filterForPublic([adr(num)]), num).toEqual([]);
    }
  });

  it("republishes public ADRs with curated wording and a clean title", () => {
    const [out] = filterForPublic([adr("006", "ADR-006: ADR-006 — Artemis Multi-Division Product Architecture")]);
    expect(out.title).toBe("ADR-006: Artemis Multi-Division Product Architecture");
    expect(out.summary).toBe(PUBLIC_ADR_SUMMARIES["006"]);
    expect(out.summary).not.toContain("raw index text");
  });

  it("keeps an allowlisted ADR whose raw summary mentions an internal term", () => {
    const e = adr("018", "ADR-018: ADR-018 — Evolution Archive");
    e.summary = "internal_operations and noindex";
    expect(filterForPublic([e])).toHaveLength(1);
  });

  it("only includes milestones from the public list", () => {
    const m = (id: string, title: string) => event({ id: `EVT-milestone-${id}`, type: "milestone_shipped", title });
    expect(filterForPublic([m("M7", "M7: /labs/scenes/[id] immersive layer")]).map((e) => e.title)).toEqual([
      PUBLIC_MILESTONES["EVT-milestone-M7"].title,
    ]);
    expect(filterForPublic([m("M3", "M3: magic-link auth with allowlist"), m("M2", "M2: /control and /system-map")])).toEqual([]);
  });

  it("only includes merged PRs on the public list and drops PRs that name internal ADRs", () => {
    expect(filterForPublic([pr(70, "feat(labs): index")])).toHaveLength(1);
    expect(filterForPublic([pr(107, "docs: add PR triage report")])).toEqual([]); // internal housekeeping
    expect(filterForPublic([pr(12, "feat(labs): index")])).toEqual([]); // not on the list
    expect(filterForPublic([pr(79, "governance: add ADR-013 (registry sync)")])).toEqual([]);
    expect(filterForPublic([pr(84, "governance: add ADR-015 (immersive 3D layer, supersedes ADR-002)")])).toHaveLength(1);
    expect(filterForPublic([pr(80, "feat(control): registry changes")])).toEqual([]);
  });

  it("never returns an event with a bot branch, proposal branch or environment variable in references", () => {
    const bad = ["bot/evolution-update-123", "proposal/dayos-visibility", "registry-proposal/x", "ARTEMIS_IP_SALT", "NEXT_PUBLIC_SUPABASE_URL"];
    for (const ref of bad) {
      expect(filterForPublic([pr(70, "feat(labs): index", { references: ["PR#70", ref] })]), ref).toEqual([]);
    }
  });

  it("strips references to PR numbers and ADR ids", () => {
    const [out] = filterForPublic([pr(70, "feat(labs): index", { references: ["PR#70", "abc1234", "docs/HANDOVER.md"], division: "core-platform" })]);
    expect(out.references).toEqual(["PR#70"]);
    expect(out.division).toBeNull();
    expect(out.outcome).toBe("");
  });

  it("keeps public scenes and drops internal ones", () => {
    const scene = (id: string, outcome: string) =>
      event({ id: `EVT-scene-${id}`, type: "scene_registered", title: `Scene registered: ${id}`, summary: `Scene ${id} registered.`, outcome });
    const out = filterForPublic([
      scene("hello-orb", "visibility=public_safe_demo; data_mode=synthetic"),
      scene("evolution-architecture-map", "visibility=internal_operations; data_mode=mixed_explicit"),
      scene("unknown", "visibility=authenticated"),
    ]);
    expect(out.map((e) => e.id)).toEqual(["EVT-scene-hello-orb"]);
  });

  it("drops unlisted types and malformed events instead of throwing", () => {
    const malformed = { id: "EVT-x", type: "pr_merged" } as unknown as EvolutionEvent;
    expect(filterForPublic([event({ id: "EVT-route-1", type: "route_added" }), malformed])).toEqual([]);
  });

  it("has curated public text that is itself free of sensitive terms", () => {
    const texts = [
      ...PUBLIC_ADR_NUMBERS.map((n) => PUBLIC_ADR_SUMMARIES[n] ?? ""),
      ...Object.values(PUBLIC_MILESTONES).flatMap((m) => [m.title, m.summary]),
    ];
    for (const text of texts) {
      expect(text).not.toBe("");
      for (const re of SENSITIVE_PATTERNS) expect(re.test(text), `${text} ~ ${re}`).toBe(false);
    }
    for (const n of PUBLIC_ADR_NUMBERS) expect(PUBLIC_ADR_SUMMARIES[n], n).toBeTruthy();
  });

  it("on the real archive returns a non-empty, bounded, clean subset", () => {
    const data = JSON.parse(fs.readFileSync("data/evolution.json", "utf8")) as { events: EvolutionEvent[] };
    const out = filterForPublic(data.events);
    expect(out.length).toBeGreaterThan(5);
    expect(out.length).toBeLessThan(data.events.length);
    for (const e of out) {
      const text = `${e.title}\n${e.summary}`;
      for (const re of SENSITIVE_PATTERNS) expect(re.test(text), `${e.id}: ${re}`).toBe(false);
      expect(e.references.every((r) => /^(PR#\d+|ADR-\d{3})$/.test(r))).toBe(true);
    }
    const types = new Set(out.map((e) => e.type));
    for (const banned of ["security_fix", "registry_changed", "product_status_changed", "route_added"]) {
      expect(types.has(banned as EvolutionEvent["type"])).toBe(false);
    }
    expect(out.some((e) => e.id === "EVT-scene-evolution-architecture-map")).toBe(false);
  });
});
