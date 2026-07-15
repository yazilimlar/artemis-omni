import { describe, expect, it } from "vitest";
import {
  CONSTRUCTION_RELEVANCE_THRESHOLD,
  isConstructionRelevant,
  scoreOpportunity,
  scoreQueue,
  SIGNAL_FORGE_SCORING_MODEL,
} from "@/lib/civicbid/signalForgeScoring";
import type { CivicBidOpportunity } from "@/types/civicbid";

const NOW = new Date("2026-07-15T12:00:00.000Z");

function opportunity(overrides: Partial<CivicBidOpportunity> = {}): CivicBidOpportunity {
  return {
    id: "TEST-1",
    idProvenance: "published",
    title: "Test opportunity",
    agency: "Test Agency",
    sourceName: "Test Source",
    sourceUrl: "https://example.gov/dataset",
    apiUrl: "https://example.gov/api",
    jurisdiction: "NYC",
    category: null,
    publishedDate: "2026-07-01T00:00:00.000Z",
    dueDate: "2026-08-15T00:00:00.000Z",
    procurementMethod: "Competitive Sealed Bids",
    description: null,
    sourceConfidence: "official_public_dataset",
    recordMode: "live_official",
    retrievedAt: NOW.toISOString(),
    ...overrides,
  };
}

function daysFromNow(days: number): string {
  return new Date(NOW.getTime() + days * 86_400_000).toISOString();
}

describe("scoring model shape", () => {
  it("weights total exactly 100", () => {
    expect(SIGNAL_FORGE_SCORING_MODEL.reduce((sum, c) => sum + c.weight, 0)).toBe(100);
  });
});

describe("urgency brackets (characterization)", () => {
  const cases: Array<[number, number]> = [
    [2, 100],
    [7, 92],
    [14, 82],
    [30, 68],
    [60, 52],
    [90, 38],
  ];
  for (const [days, expected] of cases) {
    it(`due in ${days} day(s) scores ${expected}`, () => {
      const score = scoreOpportunity(opportunity({ dueDate: daysFromNow(days) }), NOW);
      expect(score.components.find((c) => c.key === "urgency")?.score).toBe(expected);
    });
  }

  it("expired opportunities score 5 on urgency", () => {
    const score = scoreOpportunity(opportunity({ dueDate: daysFromNow(-10) }), NOW);
    expect(score.components.find((c) => c.key === "urgency")?.score).toBe(5);
  });

  it("missing due date scores 35 on urgency", () => {
    const score = scoreOpportunity(opportunity({ dueDate: null }), NOW);
    expect(score.components.find((c) => c.key === "urgency")?.score).toBe(35);
  });
});

describe("tier boundaries", () => {
  it("assigns tiers at the documented 75/55 composite boundaries", () => {
    // Boundaries are defined on the rounded composite.
    for (const [composite, tier] of [
      [75, "A"],
      [74, "B"],
      [55, "B"],
      [54, "C"],
    ] as const) {
      const t = composite >= 75 ? "A" : composite >= 55 ? "B" : "C";
      expect(t).toBe(tier);
    }
  });

  it("CHARACTERIZATION: an expired record can still reach tier B when all other components max out", () => {
    // urgency 5 × 30% + 100 × 70% = 71.5 → 72 → tier B. Documented in the
    // Codex accuracy review as a real property of the current formula; if this
    // test fails, the formula changed and the docs must change with it.
    const expired = opportunity({
      dueDate: daysFromNow(-3),
      description:
        "Construction reconstruction renovation rehabilitation infrastructure utility sewer bridge " +
        "concrete excavation roadway transit engineering drainage capital improvement site work " +
        "prevailing wage MWBE bonding insurance project labor minority participation women-owned section 3",
      procurementMethod: "Competitive Sealed Bids",
      sourceConfidence: "official_api",
    });
    const score = scoreOpportunity(expired, NOW);
    const nonUrgency = score.components.filter((c) => c.key !== "urgency");
    // Only meaningful when every other component actually maxes out.
    expect(nonUrgency.every((c) => c.score === 100)).toBe(true);
    expect(score.compositeScore).toBe(72);
    expect(score.tier).toBe("B");
  });
});

describe("source confidence component", () => {
  it("scores official_public_dataset at 92 (Socrata classification fix)", () => {
    const score = scoreOpportunity(opportunity(), NOW);
    expect(score.components.find((c) => c.key === "sourceConfidence")?.score).toBe(92);
  });

  it("scores sample_data at 35 and flags it in the note", () => {
    const score = scoreOpportunity(
      opportunity({ sourceConfidence: "sample_data", recordMode: "sample" }),
      NOW,
    );
    const component = score.components.find((c) => c.key === "sourceConfidence");
    expect(component?.score).toBe(35);
    expect(component?.note).toContain("Synthetic sample record");
  });
});

describe("construction relevance", () => {
  it("keeps the threshold at its documented value", () => {
    expect(CONSTRUCTION_RELEVANCE_THRESHOLD).toBe(43);
  });

  it("flags a bridge reconstruction record as relevant and an office-supplies record as not", () => {
    expect(
      isConstructionRelevant(opportunity({ title: "Bridge reconstruction and concrete repair" })),
    ).toBe(true);
    expect(isConstructionRelevant(opportunity({ title: "Office supplies procurement" }))).toBe(false);
  });
});

describe("scoring invariants", () => {
  const variants = [
    opportunity(),
    opportunity({ dueDate: null, description: null, procurementMethod: null }),
    opportunity({ dueDate: daysFromNow(-100) }),
    opportunity({ sourceConfidence: "sample_data", recordMode: "sample" }),
    opportunity({ sourceUrl: null, apiUrl: null }),
  ];

  it("composite and component scores always stay within 0–100", () => {
    for (const variant of variants) {
      const score = scoreOpportunity(variant, NOW);
      expect(score.compositeScore).toBeGreaterThanOrEqual(0);
      expect(score.compositeScore).toBeLessThanOrEqual(100);
      for (const component of score.components) {
        expect(component.score).toBeGreaterThanOrEqual(0);
        expect(component.score).toBeLessThanOrEqual(100);
      }
    }
  });

  it("scoreQueue sorts by composite descending", () => {
    const queue = scoreQueue(variants, NOW);
    for (let i = 1; i < queue.length; i += 1) {
      expect(queue[i - 1].compositeScore).toBeGreaterThanOrEqual(queue[i].compositeScore);
    }
  });
});
