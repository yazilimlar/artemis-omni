/**
 * ARTEMIS Workbench v6 — build.mjs
 * Modular-source -> single offline HTML pipeline (Release 6.1A).
 *
 *   TypeScript modules
 *     -> esbuild ESM bundle (consumed by node:test suites)
 *     -> esbuild IIFE bundle (global ARTEMIS_V6_FOUNDATION)
 *     -> inject into HTML shell placeholder
 *     -> emit dist/index.html + manifest.json with SHA-256
 *
 * Deterministic: no timestamps inside bundles; manifest carries generatedAt.
 */
import { build } from "esbuild";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const ENGINE_VERSION = "6.1.0-foundation.1";
const SCHEMA_VERSION = "1.0.0";

mkdirSync("dist", { recursive: true });

const shared = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  target: "es2020",
  logLevel: "silent",
  define: {
    __ENGINE_VERSION__: JSON.stringify(ENGINE_VERSION),
    __SCHEMA_VERSION__: JSON.stringify(SCHEMA_VERSION),
  },
};

await build({ ...shared, format: "esm", outfile: "dist/foundation.esm.js" });

await build({
  ...shared,
  format: "iife",
  globalName: "ARTEMIS_V6_FOUNDATION",
  outfile: "dist/foundation.iife.js",
  footer: {
    js: "window.ARTEMIS_V6 = Object.assign(window.ARTEMIS_V6 || {}, { foundation: ARTEMIS_V6_FOUNDATION });",
  },
});

const bundle = readFileSync("dist/foundation.iife.js", "utf8");
const shell = readFileSync("shell/index.template.html", "utf8");
const marker = "<!--ARTEMIS_FOUNDATION_BUNDLE-->";
if (!shell.includes(marker)) throw new Error("shell template missing bundle marker");
const html = shell.replace(marker, `<script>\n${bundle}\n</script>`);
writeFileSync("dist/index.html", html);

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");
const manifest = {
  releaseId: ENGINE_VERSION,
  semanticVersion: ENGINE_VERSION,
  schemaVersion: SCHEMA_VERSION,
  engineVersion: ENGINE_VERSION,
  artifactSha256: sha256(html),
  bundleSha256: sha256(bundle),
  generatedAt: new Date().toISOString(),
  status: "experimental",
};
writeFileSync("dist/manifest.json", JSON.stringify(manifest, null, 2));
console.log("build ok:", manifest.releaseId, "artifact sha256", manifest.artifactSha256.slice(0, 12));
