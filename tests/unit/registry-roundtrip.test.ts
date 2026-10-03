import fs from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { CST, Parser } from "yaml";

// "server-only" throws outside the react-server condition; propose.ts is tested as plain code.
vi.mock("server-only", () => ({}));
const { applyRegistryEdit } = await import("@/lib/github/propose");

const source = fs.readFileSync(
  path.join(process.cwd(), "ENGINEERING", "PRODUCT_REGISTRY.yaml"),
  "utf8",
);

function changedLines(before: string, after: string) {
  const a = before.split("\n");
  const b = after.split("\n");
  expect(b).toHaveLength(a.length);
  return a.flatMap((line, i) => (line === b[i] ? [] : [{ before: line, after: b[i] }]));
}

describe("PRODUCT_REGISTRY.yaml CST round trip (ADR-013 hard gate)", () => {
  it("Parser + CST.stringify reproduces the file byte for byte", () => {
    const tokens = [...new Parser().parse(source)];
    expect(tokens.map((token) => CST.stringify(token)).join("")).toBe(source);
  });

  const cases = [
    { id: "civicbid", field: "lifecycle", from: "rescue", to: "active_lab" },
    { id: "bidroom-suite", field: "visibility", from: "noindex_review", to: "public_safe_demo" },
    { id: "atlas-handcrafted-guru-selection", field: "canonical_route", from: "null", to: "/atlas" },
  ] as const;

  for (const { id, field, from, to } of cases) {
    it(`edits ${id}.${field} on exactly one line and keeps its inline comment`, () => {
      const edit = applyRegistryEdit(source, id, field, to);
      expect(edit.oldValue).toBe(from);
      expect(edit.changedLines).toBe(1);

      const diff = changedLines(source, edit.output);
      expect(diff).toHaveLength(1);
      const [{ before, after }] = diff;
      const comment = before.includes("  #") ? before.slice(before.indexOf("  #")) : "";
      expect(after).toBe(`    ${field}: ${to}${comment}`);
    });
  }

  it("round-trips a value back to null as a YAML null", () => {
    const edit = applyRegistryEdit(source, "civicbid", "canonical_route", "null");
    expect(changedLines(source, edit.output)).toHaveLength(1);
  });

  it("refuses a no-op, an unknown product, and a missing field", () => {
    expect(() => applyRegistryEdit(source, "civicbid", "lifecycle", "rescue")).toThrow(/already/);
    expect(() => applyRegistryEdit(source, "no-such-product", "lifecycle", "concept")).toThrow(
      /not in the registry/,
    );
  });
});
