import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import {
  SANDBOX_IFRAME_FLAGS,
  SANDBOX_ROOT,
  artifactHeaders,
  buildCsp,
  findArtifact,
  listArtifacts,
  resolveEntryPath,
  validateRegistry,
  type Artifact,
} from "@/lib/sandbox/artifacts";

vi.mock("server-only", () => ({}));

const synthetic: Artifact = {
  id: "demo-orbit",
  title: "Demo Orbit",
  source_path: "sandbox/demo-orbit/",
  entry: "index.html",
  visibility: "public_safe_demo",
  data_mode: "synthetic",
  allow_outbound: false,
  resource_limits: { max_session_seconds: 120, cpu: "low", memory: "64MB" },
  owner: "core-platform",
  created_at: "2026-10-01",
  updated_at: "2026-10-01",
  notes: "Synthetic test entry.",
};

describe("path traversal guard", () => {
  it("rejects traversal through the id or the entry", () => {
    expect(findArtifact("../package.json")).toBeNull();
    expect(findArtifact("../../etc/passwd")).toBeNull();
    expect(resolveEntryPath({ id: "..", entry: "package.json" })).toBeNull();
    expect(resolveEntryPath({ id: "../..", entry: "etc/passwd" })).toBeNull();
    expect(resolveEntryPath({ id: "demo-orbit", entry: "../../package.json" })).toBeNull();
    expect(resolveEntryPath({ id: "demo-orbit", entry: "/etc/passwd" })).toBeNull();
  });

  it("does not treat a sibling directory with a shared prefix as inside sandbox/", () => {
    const root = path.resolve("/tmp/sandbox");
    expect(resolveEntryPath({ id: "../sandbox-evil", entry: "index.html" }, root)).toBeNull();
  });

  it("resolves a valid entry inside sandbox/<id>/", () => {
    expect(resolveEntryPath(synthetic)).toBe(path.join(SANDBOX_ROOT, "demo-orbit", "index.html"));
  });

  it("rejects registry entries whose entry or source_path could escape", () => {
    expect(() => validateRegistry([{ ...synthetic, entry: "../x.html" }])).toThrow(/entry/);
    expect(() => validateRegistry([{ ...synthetic, source_path: "public/demo-orbit/" }])).toThrow(/source_path/);
  });
});

describe("registry lookup", () => {
  it("finds a synthetic entry and returns null for unknown ids", () => {
    const registry = validateRegistry([synthetic]);
    expect(findArtifact("demo-orbit", registry)?.title).toBe("Demo Orbit");
    expect(findArtifact("unknown-artifact", registry)).toBeNull();
  });

  it("ships an empty registry (mechanism only, no lab migrated)", () => {
    expect(listArtifacts()).toEqual([]);
  });

  it("enforces ADR-014 registry rules", () => {
    expect(() =>
      validateRegistry([{ ...synthetic, allow_outbound: ["https://api.example.com"] }]),
    ).toThrow(/owner-only/);
    expect(() => validateRegistry([{ ...synthetic, owner: "someone@example.com" }])).toThrow(/email/);
    expect(() => validateRegistry([synthetic, synthetic])).toThrow(/Duplicate/);
  });
});

describe("GET /api/sandbox/[id]", () => {
  it("returns a 404 JSON shape for unknown and traversal ids", async () => {
    const { GET } = await import("@/app/api/sandbox/[id]/route");
    for (const id of ["unknown-artifact", "../package.json", "../../etc/passwd"]) {
      const response = await GET(new Request("http://localhost/api/sandbox/x") as never, {
        params: Promise.resolve({ id }),
      });
      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ error: "not_found" });
    }
  }, 30_000); // cold import of the route (Supabase SSR + Next server modules) flaked past 5 s in full runs
});

describe("response headers", () => {
  it("CSP sandboxes the document and denies everything by default", () => {
    const csp = buildCsp(synthetic);
    expect(csp).toContain("sandbox allow-scripts");
    expect(csp).toContain("default-src 'none'");
    expect(csp).toContain("connect-src 'none'");
    expect(csp).toContain("frame-ancestors 'self'");
    expect(csp).not.toContain("allow-same-origin");
  });

  it("replaces connect-src with the declared allowlist when outbound is enabled", () => {
    const csp = buildCsp({ allow_outbound: ["https://api.example.com", "https://tiles.example.org"] });
    expect(csp).toContain("connect-src https://api.example.com https://tiles.example.org");
    expect(csp).not.toContain("connect-src 'none'");
  });

  it("sets the required headers, no X-Frame-Options, and never caches gated artifacts publicly", () => {
    const publicHeaders = artifactHeaders(synthetic, 10);
    expect(publicHeaders).toMatchObject({
      "Content-Type": "text/html; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "Cache-Control": "public, max-age=300",
    });
    expect(Object.keys(publicHeaders)).not.toContain("X-Frame-Options");
    expect(artifactHeaders({ ...synthetic, visibility: "authenticated" }, 10)["Cache-Control"]).toBe(
      "private, no-store",
    );
  });
});

describe("iframe", () => {
  it("is rendered with sandbox=\"allow-scripts\" only", async () => {
    expect(SANDBOX_IFRAME_FLAGS).toBe("allow-scripts");
    const { SandboxFrame } = await import("@/app/labs/run/[id]/SandboxFrame");
    const html = renderToStaticMarkup(
      createElement(SandboxFrame, { id: "demo-orbit", title: "Demo Orbit", maxSessionSeconds: 120 }),
    );
    expect(html).toMatch(/<iframe[^>]* sandbox="allow-scripts"[^>]*>/);
    expect(html).not.toContain("allow-same-origin");
    expect(html).toContain('src="/api/sandbox/demo-orbit"');
    expect(html).toMatch(/referrerpolicy="no-referrer"/i);
    expect(html).toMatch(/<iframe[^>]* loading="lazy"/);
  });
});
