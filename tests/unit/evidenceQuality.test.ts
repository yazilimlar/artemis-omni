import { describe, expect, it } from "vitest";
import { assessEvidenceQuality } from "@/lib/civicbid/evidenceQuality";
import type { CivicBidOpportunity } from "@/types/civicbid";

function opportunity(overrides: Partial<CivicBidOpportunity> = {}): CivicBidOpportunity {
  return {
    id: "8462003B090C01",
    idProvenance: "published",
    title: "Construction of a playground",
    agency: "Parks and Recreation",
    sourceName: "NYC Open Data — Current Solicitations",
    sourceUrl: "https://data.cityofnewyork.us/City-Government/Current-Solicitations/3khw-qi8f",
    apiUrl: "https://data.cityofnewyork.us/resource/3khw-qi8f.json",
    recordUrl: "https://a856-cityrecord.nyc.gov/RequestDetail/20021211011",
    jurisdiction: "NYC",
    category: "Construction Related Services",
    publishedDate: "2026-07-01T00:00:00.000Z",
    dueDate: "2099-01-01T00:00:00.000Z",
    procurementMethod: "Competitive Sealed Bids",
    description: "Playground construction including concrete site work and drainage improvements.",
    sourceConfidence: "official_public_dataset",
    recordMode: "live_official",
    retrievedAt: "2026-07-15T00:00:00.000Z",
    ...overrides,
  };
}

describe("safety gates (non-compensating)", () => {
  it("synthetic records get no score at all — never a percentage", () => {
    const evidence = assessEvidenceQuality(
      opportunity({ recordMode: "sample", sourceConfidence: "sample_data" }),
    );
    expect(evidence.score).toBeNull();
    expect(evidence.status).toBe("synthetic");
    expect(evidence.criticalWarnings.join(" ")).toContain("Synthetic sample record");
  });

  it("record-level linkage is uncapped; a fully published record scores above the dataset cap", () => {
    const evidence = assessEvidenceQuality(opportunity());
    expect(evidence.linkage).toBe("record");
    expect(evidence.score).not.toBeNull();
    expect(evidence.score!).toBeGreaterThan(65);
    expect(evidence.gatesApplied).toHaveLength(0);
  });

  it("dataset-level-only linkage caps the score at 65", () => {
    const evidence = assessEvidenceQuality(opportunity({ recordUrl: null }));
    expect(evidence.linkage).toBe("dataset");
    expect(evidence.score!).toBeLessThanOrEqual(65);
    expect(evidence.gatesApplied.join(" ")).toContain("capped at 65");
  });

  it("no linkage caps the score at 40", () => {
    const evidence = assessEvidenceQuality(
      opportunity({ recordUrl: null, sourceUrl: null, apiUrl: null }),
    );
    expect(evidence.linkage).toBe("none");
    expect(evidence.score!).toBeLessThanOrEqual(40);
  });

  it("a missing deadline caps the score at 49 and raises a critical warning", () => {
    const evidence = assessEvidenceQuality(opportunity({ dueDate: null }));
    expect(evidence.score!).toBeLessThanOrEqual(49);
    expect(evidence.criticalWarnings.join(" ")).toContain("Deadline is missing");
  });

  it("an expired deadline warns but does not blank the score", () => {
    const evidence = assessEvidenceQuality(opportunity({ dueDate: "2003-01-23T10:30:00.000Z" }));
    expect(evidence.score).not.toBeNull();
    expect(evidence.criticalWarnings.join(" ")).toContain("due date has passed");
  });
});

describe("coverage is reported independently of the score", () => {
  it("counts published and normalized fields out of the material total", () => {
    const full = assessEvidenceQuality(opportunity());
    expect(full.fieldsTotal).toBe(10);
    expect(full.fieldsPresent).toBe(10);

    const sparse = assessEvidenceQuality(
      opportunity({
        dueDate: null,
        publishedDate: null,
        procurementMethod: null,
        description: null,
        category: null,
      }),
    );
    expect(sparse.fieldsPresent).toBe(5);
  });

  it("a generated id counts against coverage", () => {
    const evidence = assessEvidenceQuality(opportunity({ idProvenance: "generated" }));
    expect(evidence.fieldsPresent).toBe(9);
  });
});

describe("monotonicity property: adding evidence never lowers score or coverage", () => {
  const removals: Array<Partial<CivicBidOpportunity>> = [
    { description: null },
    { procurementMethod: null },
    { category: null },
    { publishedDate: null },
    { recordUrl: null },
    { idProvenance: "generated" },
  ];

  it("the full record dominates every single-field-removed variant", () => {
    const full = assessEvidenceQuality(opportunity());
    for (const removal of removals) {
      const reduced = assessEvidenceQuality(opportunity(removal));
      expect(full.score!).toBeGreaterThanOrEqual(reduced.score!);
      expect(full.fieldsPresent).toBeGreaterThanOrEqual(reduced.fieldsPresent);
    }
  });

  it("scores always stay within 0–100 when present", () => {
    for (const removal of removals) {
      const evidence = assessEvidenceQuality(opportunity(removal));
      expect(evidence.score!).toBeGreaterThanOrEqual(0);
      expect(evidence.score!).toBeLessThanOrEqual(100);
    }
  });
});

describe("independence: evidence quality ignores source-quality-independent factors", () => {
  it("changing source confidence classification (non-synthetic) does not change the evidence score", () => {
    const dataset = assessEvidenceQuality(opportunity({ sourceConfidence: "official_public_dataset" }));
    const api = assessEvidenceQuality(opportunity({ sourceConfidence: "official_api" }));
    expect(dataset.score).toBe(api.score);
  });
});
