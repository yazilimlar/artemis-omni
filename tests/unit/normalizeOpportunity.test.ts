import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  normalizeNycDate,
  normalizeOpenDataOpportunity,
} from "@/lib/civicbid/normalizeOpportunity";
import { scoreOpportunity } from "@/lib/civicbid/signalForgeScoring";

const CONTEXT = {
  sourceName: "NYC Open Data — Current Solicitations",
  apiUrl: "https://data.cityofnewyork.us/resource/3khw-qi8f.json",
  sourceUrl: "https://data.cityofnewyork.us/City-Government/Current-Solicitations/3khw-qi8f",
  jurisdiction: "NYC",
  retrievedAt: "2026-07-15T00:00:00.000Z",
  recordUrlTemplate: "https://a856-cityrecord.nyc.gov/RequestDetail/{requestId}",
};

const fixtureRows = JSON.parse(
  readFileSync(path.resolve(__dirname, "../fixtures/nyc-current-solicitations-snapshot.json"), "utf8"),
) as Record<string, unknown>[];

describe("normalizeOpenDataOpportunity — golden fixture (real captured City Record rows)", () => {
  it("maps the first snapshot row field-for-field", () => {
    const row = fixtureRows[0];
    const opportunity = normalizeOpenDataOpportunity(row, CONTEXT, 0);

    // Hand-checked against the raw snapshot in tests/fixtures.
    expect(opportunity.id).toBe("8462003B090C01");
    expect(opportunity.idProvenance).toBe("published");
    expect(opportunity.title).toContain("CONSTRUCTION OF A PLAYGROUND");
    expect(opportunity.procurementMethod).toBe("Competitive Sealed Bids");
    expect(opportunity.category).toBe("Construction Related Services");
    expect(opportunity.recordUrl).toBe("https://a856-cityrecord.nyc.gov/RequestDetail/20021211011");
    expect(opportunity.recordUrlProvenance).toBe("derived");
    expect(opportunity.sourceConfidence).toBe("official_public_dataset");
    expect(opportunity.dueDate).toBe("2003-01-23T15:30:00.000Z");
  });

  it("normalizes every snapshot row without throwing and keeps ids published", () => {
    for (const [index, row] of fixtureRows.entries()) {
      const opportunity = normalizeOpenDataOpportunity(row, CONTEXT, index);
      expect(opportunity.idProvenance).toBe("published");
      expect(opportunity.recordUrl).toMatch(/^https:\/\/a856-cityrecord\.nyc\.gov\/RequestDetail\/\d+$/);
      expect(opportunity.procurementMethod).toBeTruthy();
      expect(opportunity.category).toBeTruthy();
    }
  });

  it("pins the golden fixture's scoring output", () => {
    const opportunity = normalizeOpenDataOpportunity(fixtureRows[0], CONTEXT, 0);
    const score = scoreOpportunity(opportunity, new Date("2026-07-15T12:00:00.000Z"));

    expect(score.components.map(({ key, score: componentScore }) => [key, componentScore])).toEqual([
      ["urgency", 5],
      ["documentation", 100],
      ["sourceConfidence", 92],
      ["constructionFit", 43],
      ["complianceClarity", 30],
    ]);
    expect(score.compositeScore).toBe(54);
    expect(score.tier).toBe("C");
  });
});

describe("normalizeNycDate — floating Eastern timestamps", () => {
  it("converts summer daylight time independently of the server timezone", () => {
    expect(normalizeNycDate("2026-08-27T14:00:00.000")).toBe("2026-08-27T18:00:00.000Z");
  });

  it("converts winter standard time independently of the server timezone", () => {
    expect(normalizeNycDate("2003-01-23T10:30:00.000")).toBe("2003-01-23T15:30:00.000Z");
  });

  it("preserves explicitly zoned instants", () => {
    expect(normalizeNycDate("2026-08-27T14:00:00.000Z")).toBe("2026-08-27T14:00:00.000Z");
  });
});

describe("normalizeOpenDataOpportunity — field mapping rules", () => {
  it("reads additional_description_1 when description is absent and strips HTML", () => {
    const opportunity = normalizeOpenDataOpportunity(
      {
        pin: "TEST-1",
        additional_description_1:
          "<p>Bridge <strong>rehabilitation</strong> &amp; concrete repair.&nbsp;See PASSPort.</p>",
      },
      CONTEXT,
    );
    expect(opportunity.description).toBe("Bridge rehabilitation & concrete repair. See PASSPort.");
  });

  it("prefers description over additional_description_1", () => {
    const opportunity = normalizeOpenDataOpportunity(
      { pin: "TEST-2", description: "Primary text", additional_description_1: "Secondary text" },
      CONTEXT,
    );
    expect(opportunity.description).toBe("Primary text");
  });

  it("falls back to a generated, order-dependent id and marks its provenance", () => {
    const opportunity = normalizeOpenDataOpportunity({ short_title: "No id here" }, CONTEXT, 4);
    expect(opportunity.id).toBe("nyc-open-data-current-solicitations-5");
    expect(opportunity.idProvenance).toBe("generated");
  });

  it("omits recordUrl when the row has no request_id or no template is configured", () => {
    const noRequestId = normalizeOpenDataOpportunity({ pin: "TEST-3" }, CONTEXT);
    expect(noRequestId.recordUrl).toBeNull();
    expect(noRequestId.recordUrlProvenance).toBeNull();

    const { recordUrlTemplate: _omitted, ...contextWithoutTemplate } = CONTEXT;
    const noTemplate = normalizeOpenDataOpportunity(
      { pin: "TEST-4", request_id: "123" },
      contextWithoutTemplate,
    );
    expect(noTemplate.recordUrl).toBeNull();
  });
});
