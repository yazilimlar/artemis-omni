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
    recordUrlProvenance: "derived",
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
    const sourceLink = evidence.fields.find((entry) => entry.key === "sourceLink");
    expect(sourceLink?.state).toBe("normalized");
    expect(sourceLink?.note).toContain("does not fetch or content-verify");
  });

  it("credits a genuinely source-published record URL as published", () => {
    const evidence = assessEvidenceQuality(opportunity({ recordUrlProvenance: "published" }));
    expect(evidence.fields.find((entry) => entry.key === "sourceLink")?.state).toBe("published");
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

describe("monotonicity property across every material-field presence combination", () => {
  const dimensions: Array<{ remove: Partial<CivicBidOpportunity> }> = [
    { remove: { idProvenance: "generated" } },
    { remove: { title: "Untitled public opportunity" } },
    { remove: { agency: "Agency not published" } },
    { remove: { dueDate: null } },
    { remove: { publishedDate: null } },
    { remove: { procurementMethod: null } },
    { remove: { description: null } },
    { remove: { category: null } },
    { remove: { recordUrl: null, recordUrlProvenance: null } },
    { remove: { jurisdiction: "" } },
  ];

  function variant(mask: number): CivicBidOpportunity {
    const removals: Partial<CivicBidOpportunity> = {};
    for (const [index, dimension] of dimensions.entries()) {
      if ((mask & (1 << index)) === 0) Object.assign(removals, dimension.remove);
    }
    return opportunity(removals);
  }

  it("adding any one missing material field never lowers score or coverage", () => {
    const combinations = 1 << dimensions.length;
    for (let mask = 0; mask < combinations; mask += 1) {
      const base = assessEvidenceQuality(variant(mask));
      expect(base.score!).toBeGreaterThanOrEqual(0);
      expect(base.score!).toBeLessThanOrEqual(100);

      for (let index = 0; index < dimensions.length; index += 1) {
        if ((mask & (1 << index)) !== 0) continue;
        const added = assessEvidenceQuality(variant(mask | (1 << index)));
        expect(added.score!).toBeGreaterThanOrEqual(base.score!);
        expect(added.fieldsPresent).toBeGreaterThanOrEqual(base.fieldsPresent);
      }
    }
  });
});

describe("independence: evidence quality ignores source-quality-independent factors", () => {
  it("every non-synthetic source classification produces the same evidence score", () => {
    const classifications = [
      "official_api",
      "official_public_dataset",
      "official_public_portal",
      "official_login_portal",
      "commercial_platform",
      "user_forwarded_email",
      "user_uploaded_document",
      "manual_entry",
    ] as const;
    const expected = assessEvidenceQuality(opportunity()).score;
    for (const sourceConfidence of classifications) {
      expect(assessEvidenceQuality(opportunity({ sourceConfidence })).score).toBe(expected);
    }
  });
});
