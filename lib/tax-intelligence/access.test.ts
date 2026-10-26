import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { accessibleClients, parseMemberships } from "./access";

describe("Tax Intelligence client membership gate", () => {
  it("denies access when configuration is missing or malformed", () => {
    expect(accessibleClients("user-a", undefined)).toEqual([]);
    expect(accessibleClients("user-a", "{invalid")).toEqual([]);
    expect(accessibleClients("user-a", "[]")).toEqual([]);
  });
  it("denies an empty identity", () => {
    expect(accessibleClients("", '{"personal":["user-a"]}')).toEqual([]);
  });
  it("shows only memberships for the current user", () => {
    const raw = JSON.stringify({
      personal: ["user-a"],
      "great-order": ["user-b"],
      artemis: ["user-a"],
      agoraxai: [],
      apolloa: ["user-b"],
    });
    expect(accessibleClients("user-a", raw)).toEqual(["personal", "artemis"]);
    expect(accessibleClients("user-b", raw)).toEqual(["great-order", "apolloa"]);
    expect(accessibleClients("user-c", raw)).toEqual([]);
  });
  it("ignores malformed member entries and unrecognized client keys", () => {
    const raw = JSON.stringify({ personal: ["user-a", null, 5], attacker: ["user-a"] });
    expect(accessibleClients("user-a", raw)).toEqual(["personal"]);
    expect(parseMemberships(raw).personal).toEqual(["user-a"]);
  });
});
