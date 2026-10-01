import { describe, expect, it } from "vitest";
import { isEmailAllowed, parseAllowedEmails } from "@/lib/auth/allowlist";

describe("parseAllowedEmails", () => {
  it("returns an empty list for undefined or empty input", () => {
    expect(parseAllowedEmails(undefined)).toEqual([]);
    expect(parseAllowedEmails("")).toEqual([]);
    expect(parseAllowedEmails("   ")).toEqual([]);
  });

  it("parses a single email", () => {
    expect(parseAllowedEmails("a@example.com")).toEqual(["a@example.com"]);
  });

  it("parses multiple emails and trims whitespace", () => {
    expect(parseAllowedEmails(" a@example.com , b@example.com,c@example.com ")).toEqual([
      "a@example.com",
      "b@example.com",
      "c@example.com",
    ]);
  });

  it("lowercases entries", () => {
    expect(parseAllowedEmails("Owner@Example.COM")).toEqual(["owner@example.com"]);
  });

  it("drops empty entries from trailing or repeated commas", () => {
    expect(parseAllowedEmails("a@example.com,,b@example.com,")).toEqual([
      "a@example.com",
      "b@example.com",
    ]);
  });
});

describe("isEmailAllowed", () => {
  const allowed = parseAllowedEmails("owner@example.com,reviewer@example.com");

  it("accepts a listed email", () => {
    expect(isEmailAllowed("owner@example.com", allowed)).toBe(true);
  });

  it("matches case-insensitively", () => {
    expect(isEmailAllowed("Reviewer@EXAMPLE.com", allowed)).toBe(true);
  });

  it("rejects an email that is not listed", () => {
    expect(isEmailAllowed("stranger@example.com", allowed)).toBe(false);
  });

  it("fails closed for an empty allowlist or empty email", () => {
    expect(isEmailAllowed("owner@example.com", [])).toBe(false);
    expect(isEmailAllowed("", allowed)).toBe(false);
  });
});
