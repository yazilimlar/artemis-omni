import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import registry from "@/data/standalone-labs.json";
import { exemptLabs, labSandbox } from "@/lib/standalone-labs";

const root = process.cwd();
const read = (p: string) => fs.readFileSync(path.join(root, p), "utf8");
function walk(dir: string, ext: string[]): string[] {
  return fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((e) => {
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) return walk(rel, ext);
    return ext.some((x) => e.name.endsWith(x)) ? [rel] : [];
  });
}
const labHtml = [...walk("public/standalone", [".html"]), ...walk("public/labs", [".html"])];

describe("Batch 5: sandbox tokens", () => {
  it("never grant allow-same-origin and resolve for every registered lab", () => {
    for (const lab of registry.labs) {
      if (lab.sandbox === null) {
        expect(lab.reason, lab.id).toMatch(/^EXEMPT/);
        expect(() => labSandbox(lab.id)).toThrow(/exempt/);
        continue;
      }
      expect(lab.sandbox).not.toMatch(/allow-same-origin/);
      expect(lab.sandbox.split(" ")).toContain("allow-scripts");
      expect(labSandbox(lab.id)).toBe(lab.sandbox);
    }
    expect(() => labSandbox("no-such-lab")).toThrow(/Unknown standalone lab/);
    // Exemptions are explicit and currently limited to the one recorded lab.
    expect(exemptLabs.map((lab) => lab.id)).toEqual(["levara-l28-financial-twin"]);
  });

  it("every app/ iframe that frames a raw lab uses a registry sandbox, no-referrer and lazy", () => {
    const sources = walk("app", [".tsx"]).filter((f) => read(f).includes("<iframe"));
    const framing = sources.filter((f) => /src=(?:"\/standalone\/|\{selected\.src\})/.test(read(f)));
    expect(framing.length).toBe(10);
    const exemptSrc = exemptLabs.flatMap((lab) => lab.paths).map((p) => p.replace(/:path\*$/, ""));
    for (const f of framing) {
      const tag = read(f).match(/<iframe[\s\S]*?\/>/)![0];
      if (exemptSrc.some((prefix) => tag.includes(`src="${prefix}`))) {
        expect(tag, f).not.toMatch(/sandbox=/);
        continue;
      }
      expect(tag, f).toMatch(/sandbox=\{labSandbox\("[a-z0-9-]+"\)\}/);
      expect(tag, f).toMatch(/referrerPolicy="no-referrer"/);
      expect(tag, f).toMatch(/loading="lazy"/);
      expect(tag, f).not.toMatch(/allow-same-origin/);
    }
  });

  it("next.config emits a CSP sandbox header for every registered path, never allow-same-origin", async () => {
    const config = (await import(path.join(root, "next.config.mjs"))).default;
    const rules: { source: string; headers: { key: string; value: string }[] }[] = await config.headers();
    const csp = new Map(
      rules.flatMap((r) =>
        r.headers.filter((h) => h.key === "Content-Security-Policy").map((h) => [r.source, h.value] as const),
      ),
    );
    const catchAll = [...csp.keys()].find((k) => k.startsWith("/standalone/:path"))!;
    expect(csp.get(catchAll)).toBe("sandbox allow-scripts");
    for (const lab of registry.labs) {
      if (lab.sandbox === null) {
        for (const p of lab.paths) expect(csp.has(p), p).toBe(false);
        expect(catchAll).toContain(`(?!${lab.paths[0].replace(/^\/standalone\//, "").replace(/:path\*$/, "")}`);
        continue;
      }
      for (const p of lab.paths) expect(csp.get(p), p).toBe(`sandbox ${lab.sandbox}`);
    }
    for (const value of csp.values()) expect(value).not.toMatch(/allow-same-origin/);
    const vendor = rules.find((r) => r.source === "/vendor/:path*")!;
    expect(vendor.headers).toContainEqual({ key: "Cache-Control", value: "public, max-age=31536000, immutable" });
  }, 30_000); // cold import of next.config.mjs (MDX + remark plugins) can exceed the 5 s default
});

describe("Batch 5: CDN integrity", () => {
  it("import maps load three.js only from self-hosted /vendor files that exist", () => {
    for (const f of labHtml) {
      const map = read(f).match(/<script type="importmap">([\s\S]*?)<\/script>/);
      if (!map) continue;
      expect(map[1], f).not.toMatch(/https?:\/\//);
      for (const target of Object.values(JSON.parse(map[1]).imports as Record<string, string>)) {
        expect(target, f).toMatch(/^\/vendor\/three@\d+\.\d+\.\d+\//);
        const local = path.join("public", target);
        expect(fs.existsSync(path.join(root, local)), local).toBe(true);
      }
    }
  });

  it("vendored files match the SHA-256 recorded in public/vendor/manifest.json", () => {
    const manifest = JSON.parse(read("public/vendor/manifest.json"));
    for (const pkg of manifest.packages) {
      for (const file of pkg.files) {
        const bytes = fs.readFileSync(path.join(root, "public", file.path));
        expect(createHash("sha256").update(bytes).digest("hex"), file.path).toBe(file.sha256);
      }
    }
  });

  it("every remaining external <script>/<link> carries SRI (Google Fonts excepted by owner decision)", () => {
    for (const f of labHtml) {
      for (const tag of read(f).match(/<(?:script|link)\b[^>]*(?:src|href)="https?:\/\/[^"]+"[^>]*>/g) ?? []) {
        if (/fonts\.(?:googleapis|gstatic)\.com/.test(tag)) continue;
        expect(tag, f).toMatch(/integrity="sha(?:256|384|512)-/);
        expect(tag, f).toMatch(/crossorigin="anonymous"/);
      }
    }
  });
});

describe("Batch 5: retired files", () => {
  it("the owner cockpit and the empty auremeander page are gone, and no copy of the coordinate remains", () => {
    expect(fs.existsSync(path.join(root, "public/labs/rainbow-house-owner-cockpit-m8.html"))).toBe(false);
    expect(fs.existsSync(path.join(root, "public/labs/auremeander/index.html"))).toBe(false);
    for (const f of walk("public", [".html", ".js", ".json"])) expect(read(f), f).not.toMatch(/41\.61708/);
  });
});
