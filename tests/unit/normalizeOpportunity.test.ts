import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { normalizeOpenDataOpportunity } from "@/lib/civicbid/normalizeOpportunity";

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
    expect(opportunity.sourceConfidence).toBe("official_public_dataset");
    expect(opportunity.dueDate).toBe(new Date("2003-01-23T10:30:00.000").toISOString());
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

    const { recordUrlTemplate: _omitted, ...contextWithoutTemplate } = CONTEXT;
    const noTemplate = normalizeOpenDataOpportunity(
      { pin: "TEST-4", request_id: "123" },
      contextWithoutTemplate,
    );
    expect(noTemplate.recordUrl).toBeNull();
  });
});
