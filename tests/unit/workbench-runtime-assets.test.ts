import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("workbench runtime assets (regression: ARTEMIS_V6 is not defined)", () => {
  const dir = "public/labs/geometric-workbench/v5-8";
  const html = fs.readFileSync(path.join(dir, "index.html"), "utf8");

  it("every relative script of the runtime page exists next to it", () => {
    const srcs = [...html.matchAll(/<script[^>]+src="(\.\/[^"]+)"/g)].map((m) => m[1].slice(2));
    expect(srcs).toContain("v6-integrity.js");
    for (const src of srcs) expect(fs.existsSync(path.join(dir, src)), src).toBe(true);
  });

  it("serves those siblings from /workbench/runtime/<file>, where the page without a trailing slash resolves them", async () => {
    const config = (await import("../../next.config.mjs")).default as {
      rewrites: () => Promise<{ beforeFiles: { source: string; destination: string }[] }>;
    };
    const { beforeFiles } = await config.rewrites();
    const rule = beforeFiles.find((r) => r.source.startsWith("/workbench/runtime/:file"));
    expect(rule?.destination).toBe("/labs/geometric-workbench/v5-8/:file");
    expect(rule?.source).toContain("js");
    // The page itself is still served at /workbench/runtime/latest.
    expect(beforeFiles.some((r) => r.source === "/workbench/runtime/latest")).toBe(true);
  }, 60_000); // importing next.config.mjs loads the MDX toolchain
});
