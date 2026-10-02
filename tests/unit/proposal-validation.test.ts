import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import {
  VISIBILITY_VALUES,
  getAllowedFieldValues,
  validateProposal,
} from "@/lib/github/validate-proposal";
import { getProduct, loadRegistrySchema } from "@/lib/registry/load";

const schema = loadRegistrySchema();
const civicbid = getProduct("civicbid")!; // visibility public, lifecycle rescue
const validate = (overrides: Partial<Parameters<typeof validateProposal>[0]>) =>
  validateProposal(
    {
      productId: "civicbid",
      field: "visibility",
      newValue: "noindex_review",
      reason: "Pending deployed-route review.",
      ...overrides,
    },
    civicbid,
    schema.lifecycles,
    schema.maturities,
  );

describe("validateProposal", () => {
  it("rejects an empty or whitespace reason", () => {
    expect(validate({ reason: "" }).ok).toBe(false);
    expect(validate({ reason: "    " }).ok).toBe(false);
  });

  it("rejects a reason shorter than 10 characters", () => {
    expect(validate({ reason: "too short" })).toMatchObject({ ok: false });
  });

  it("rejects a no-op change", () => {
    expect(validate({ newValue: "public" }).error).toMatch(/already/);
  });

  it("rejects an unknown field", () => {
    expect(validate({ field: "division", newValue: "core-platform" }).error).toMatch(/cannot be proposed/);
  });

  it("rejects an unknown value for the field", () => {
    expect(validate({ newValue: "everyone" }).ok).toBe(false);
    expect(validate({ field: "lifecycle", newValue: "shipped" }).ok).toBe(false);
    expect(validate({ field: "canonical_route", newValue: "labs/no-slash" }).ok).toBe(false);
    expect(validate({ field: "canonical_route", newValue: "/a path: with yaml" }).ok).toBe(false);
  });

  it("rejects an unknown product", () => {
    expect(
      validateProposal(
        { productId: "nope", field: "visibility", newValue: "public", reason: "Long enough reason." },
        undefined,
        schema.lifecycles,
        schema.maturities,
      ).ok,
    ).toBe(false);
  });

  it("accepts a valid visibility change", () => {
    expect(validate({})).toEqual({ ok: true });
  });

  it("accepts a valid lifecycle change", () => {
    expect(validate({ field: "lifecycle", newValue: "active_lab" })).toEqual({ ok: true });
  });

  it("accepts canonical_route paths, null and UNREVIEWED", () => {
    expect(validate({ field: "canonical_route", newValue: "/labs/civicbid-v2" }).ok).toBe(true);
    expect(validate({ field: "canonical_route", newValue: "null" }).ok).toBe(true);
    expect(validate({ field: "canonical_route", newValue: "UNREVIEWED" }).ok).toBe(true);
  });
});

describe("drift guards against the real PRODUCT_REGISTRY.yaml", () => {
  const definitions = parse(
    fs.readFileSync(path.join(process.cwd(), "ENGINEERING", "PRODUCT_REGISTRY.yaml"), "utf8"),
  ).status_definitions as Record<string, string[]>;

  it("hard-coded visibility values equal status_definitions.visibility plus UNREVIEWED", () => {
    expect([...VISIBILITY_VALUES].sort()).toEqual([...definitions.visibility, "UNREVIEWED"].sort());
  });

  it("loader lifecycle and maturity lists equal status_definitions", () => {
    expect(schema.lifecycles).toEqual(definitions.lifecycle);
    expect(schema.maturities).toEqual(definitions.maturity);
    expect(schema.visibilityClasses).toEqual(definitions.visibility);
  });

  it("offers UNREVIEWED for every enumerated field", () => {
    for (const field of ["visibility", "lifecycle", "maturity"]) {
      expect(getAllowedFieldValues(field, schema)).toContain("UNREVIEWED");
    }
  });
});
