#!/usr/bin/env node
/**
 * ADR-015 scene registry and budget validator.
 *
 *   node scripts/validate-scenes.mjs            registry checks (prebuild)
 *   node scripts/validate-scenes.mjs --bundle   island JS budget check (postbuild, reads
 *                                               .next/react-loadable-manifest.json), plus
 *                                               the ADR-016 homepage hero budget
 *
 * Plain .mjs so it runs on every Node version CI uses (CI runs Node 20, which
 * cannot execute .ts natively) without adding tsx. Exits 1 with clear errors.
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { pathToFileURL } from "node:url";

const ID = /^[a-z0-9][a-z0-9-]{0,63}$/;
const VISIBILITY = ["public", "public_safe_demo", "noindex_review", "authenticated", "private_pilot", "internal_operations"];
const DATA_MODES = ["live_official", "live_derived", "synthetic", "sample", "sample_fallback", "private_approved", "mixed_explicit"];
const MAX_TEXTURE_PX = 2048;
const COMPRESSION_THRESHOLD_BYTES = 500 * 1024;
export const ISLAND_BUDGET_GZIP_BYTES = 400 * 1024;
/** ADR-016: total incremental JS the homepage hero may lazy-load. */
export const HERO_BUDGET_GZIP_BYTES = 100 * 1024;

/** ADR-016: a hero scene renders on the homepage only and has no /labs/scenes page. */
export function isHeroRoute(route) {
  return route === "/" || route === null;
}

/** True when `child` (absolute) is strictly inside `parent` (absolute). */
function isInside(parent, child) {
  const rel = path.relative(parent, child);
  return rel.length > 0 && !rel.startsWith("..") && !path.isAbsolute(rel);
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) out.push({ path: full, symlink: true });
    else if (entry.isDirectory()) out.push(...walk(full));
    else out.push({ path: full, symlink: false });
  }
  return out;
}

/** PNG IHDR width/height, or null for non-PNG files. */
export function pngSize(buffer) {
  const sig = [137, 80, 78, 71, 13, 10, 26, 10];
  if (buffer.length < 24 || !sig.every((b, i) => buffer[i] === b)) return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

/** True when a GLB declares DRACO or meshopt compression in its JSON chunk. */
export function glbIsCompressed(buffer) {
  if (buffer.length < 20 || buffer.toString("ascii", 0, 4) !== "glTF") return false;
  const jsonLength = buffer.readUInt32LE(12);
  const json = buffer.toString("utf8", 20, 20 + jsonLength);
  return /KHR_draco_mesh_compression|EXT_meshopt_compression|KHR_meshopt_compression/.test(json);
}

/**
 * Validates a parsed registry against ADR-015. Pure apart from reading files
 * under `root`. Returns a list of human-readable errors (empty = valid).
 */
export function validateScenes(registry, root) {
  const errors = [];
  if (!Array.isArray(registry)) return ["data/scene-registry.json must be a JSON array."];
  const seen = new Set();
  const heroes = registry.filter((scene) => scene && isHeroRoute(scene.route));
  if (heroes.length > 1) {
    errors.push(`at most one homepage hero scene (route "/") is allowed (ADR-016); found ${heroes.length}`);
  }

  for (const [index, scene] of registry.entries()) {
    const label = `scene[${index}]${scene && typeof scene.id === "string" ? ` "${scene.id}"` : ""}`;
    const fail = (message) => errors.push(`${label}: ${message}`);
    if (!scene || typeof scene !== "object") {
      fail("must be an object");
      continue;
    }
    const { id } = scene;
    if (typeof id !== "string" || !ID.test(id)) {
      fail(`invalid id ${JSON.stringify(id)} (expected ${ID})`);
      continue;
    }
    if (seen.has(id)) fail("duplicate id");
    seen.add(id);

    if (typeof scene.title !== "string" || !scene.title) fail("title is required");
    if (typeof scene.division !== "string" || !scene.division) fail("division is required");
    if (!VISIBILITY.includes(scene.visibility)) fail(`unknown visibility ${JSON.stringify(scene.visibility)}`);
    if (!DATA_MODES.includes(scene.data_mode)) fail(`unknown data_mode ${JSON.stringify(scene.data_mode)}`);
    if (typeof scene.owner !== "string" || !scene.owner || scene.owner.includes("@")) {
      fail("owner must be a team or role, not an email");
    }

    // Route: /labs/scenes/<id> (ADR-015), or "/"/null for the homepage hero (ADR-016).
    if (isHeroRoute(scene.route)) {
      if (!(scene.visibility === "public" || (scene.visibility === "public_safe_demo" && scene.approved_public === true))) {
        fail("the homepage hero must be public or an approved public_safe_demo scene (ADR-016)");
      }
    } else if (typeof scene.route !== "string" || !scene.route.startsWith("/labs/scenes/")) {
      fail(`route must start with /labs/scenes/ (got ${JSON.stringify(scene.route)})`);
    } else if (scene.route !== `/labs/scenes/${id}`) {
      fail(`route must be /labs/scenes/${id}`);
    }

    // public_safe_demo needs explicit approval.
    if (typeof scene.approved_public !== "boolean") fail("approved_public must be a boolean");
    if (scene.visibility === "public_safe_demo" && scene.approved_public !== true) {
      fail("public_safe_demo requires approved_public: true (ADR-015)");
    }

    // Entry component under components/scenes/<id>/ and present.
    const sceneDir = path.resolve(root, "components", "scenes", id);
    const entry = typeof scene.entry_component === "string" ? path.resolve(root, scene.entry_component) : null;
    if (!entry || !isInside(sceneDir, entry)) {
      fail(`entry_component must be under components/scenes/${id}/`);
    } else if (!fs.existsSync(entry)) {
      fail(`entry_component not found: ${scene.entry_component}`);
    }

    // Fallback: v1 SceneIsland renders a static image, so it must be a same-origin
    // image under public/. (ADR-015 also allows 2D components; not yet supported.)
    const fallback = typeof scene.fallback_2d === "string" ? path.resolve(root, scene.fallback_2d) : null;
    if (!fallback) fail("fallback_2d is required");
    else if (!isInside(path.resolve(root, "public"), fallback) || !/\.(png|jpe?g|webp|avif|svg)$/i.test(fallback)) {
      fail("fallback_2d must be an image (png/jpg/webp/avif/svg) under public/ in v1");
    } else if (!fs.existsSync(fallback)) fail(`fallback_2d not found: ${scene.fallback_2d}`);

    // Assets: same-origin directory under public/, within budget, texture and model rules.
    if (!(typeof scene.asset_budget_mb === "number" && scene.asset_budget_mb > 0)) {
      fail("asset_budget_mb must be a positive number");
    }
    const assetsDir = typeof scene.assets_dir === "string" ? path.resolve(root, scene.assets_dir) : null;
    if (!assetsDir || !isInside(path.resolve(root, "public"), assetsDir)) {
      fail("assets_dir must be under public/");
    } else if (!fs.existsSync(assetsDir) || !fs.statSync(assetsDir).isDirectory()) {
      fail(`assets_dir not found: ${scene.assets_dir}`);
    } else {
      let total = 0;
      for (const file of walk(assetsDir)) {
        const rel = path.relative(root, file.path);
        if (file.symlink) {
          fail(`symlinks are not allowed in assets_dir: ${rel}`);
          continue;
        }
        const buffer = fs.readFileSync(file.path);
        total += buffer.length;
        const size = pngSize(buffer);
        if (size && (size.width > MAX_TEXTURE_PX || size.height > MAX_TEXTURE_PX)) {
          fail(`texture ${rel} is ${size.width}x${size.height}; max ${MAX_TEXTURE_PX}x${MAX_TEXTURE_PX}`);
        }
        if (/\.glb$/i.test(file.path) && buffer.length > COMPRESSION_THRESHOLD_BYTES && !glbIsCompressed(buffer)) {
          fail(`model ${rel} is over 500 KB and not DRACO/meshopt-compressed`);
        }
        if (/\.gltf$/i.test(file.path) && /"uri"\s*:\s*"https?:/i.test(buffer.toString("utf8"))) {
          fail(`model ${rel} references a remote URI; assets must be same-origin`);
        }
      }
      const budget = (scene.asset_budget_mb ?? 0) * 1024 * 1024;
      if (budget > 0 && total > budget) {
        fail(`assets_dir is ${(total / 1048576).toFixed(2)} MB; budget ${scene.asset_budget_mb} MB`);
      }
    }

    const limits = scene.resource_limits ?? {};
    if (!Number.isInteger(limits.max_session_seconds) || limits.max_session_seconds < 10 || limits.max_session_seconds > 3600) {
      fail("resource_limits.max_session_seconds must be an integer in [10, 3600]");
    }
    if (!Number.isInteger(limits.fps_floor) || limits.fps_floor < 1 || limits.fps_floor > 60) {
      fail("resource_limits.fps_floor must be an integer in [1, 60]");
    }
    if (typeof scene.passport !== "string" || !fs.existsSync(path.resolve(root, scene.passport))) {
      fail(`passport not found: ${JSON.stringify(scene.passport)}`);
    }
  }
  return errors;
}

/**
 * Gzipped size of the JS the 3D island adds: every chunk that Next.js lists in
 * .next/react-loadable-manifest.json for next/dynamic imports issued from
 * components/scenes/ (the scene code plus three.js and R3F). Chunks shared by
 * several scenes are counted once. Returns null when there is no build output.
 */
export function measureIslandBundle(root) {
  const manifestPath = path.join(root, ".next", "react-loadable-manifest.json");
  if (!fs.existsSync(manifestPath)) return null;
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const chunks = new Set();
  for (const [key, entry] of Object.entries(manifest)) {
    if (!key.startsWith("components/scenes/")) continue;
    for (const file of entry.files ?? []) if (file.endsWith(".js")) chunks.add(file);
  }
  let gzip = 0;
  const files = [];
  for (const file of chunks) {
    const size = zlib.gzipSync(fs.readFileSync(path.join(root, ".next", file))).length;
    gzip += size;
    files.push({ file: `.next/${file}`, gzip: size });
  }
  return { gzip, files };
}

/**
 * ADR-016 homepage hero budget: every chunk loaded by dynamic imports of the hero
 * scene (from SceneIsland) and from its own directory (the homepage mount), counted
 * once. Also returns any chunk shared with non-hero scenes, which must be empty so
 * three.js/R3F never reach the homepage.
 */
export function measureHeroBundle(root, heroIds) {
  const manifestPath = path.join(root, ".next", "react-loadable-manifest.json");
  if (!fs.existsSync(manifestPath) || heroIds.length === 0) return null;
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const isHeroKey = (key) =>
    heroIds.some((id) => key.endsWith(`-> ./${id}`) || key.startsWith(`components/scenes/${id}/`));
  const hero = new Set();
  const others = new Set();
  for (const [key, entry] of Object.entries(manifest)) {
    if (!key.startsWith("components/scenes/")) continue;
    for (const file of entry.files ?? []) {
      if (!file.endsWith(".js")) continue;
      (isHeroKey(key) ? hero : others).add(file);
    }
  }
  // Chunks reached through the hero mount include SceneIsland itself; that is part of the cost.
  let gzip = 0;
  const files = [];
  for (const file of hero) {
    const size = zlib.gzipSync(fs.readFileSync(path.join(root, ".next", file))).length;
    gzip += size;
    files.push({ file: `.next/${file}`, gzip: size });
  }
  const sharedWithR3F = [...hero].filter((file) => others.has(file));
  return { gzip, files, sharedWithR3F };
}

function main() {
  const root = process.cwd();
  if (process.argv.includes("--bundle")) {
    const result = measureIslandBundle(root);
    if (!result) {
      console.log("validate-scenes --bundle: no .next/react-loadable-manifest.json; skipped.");
      return;
    }
    if (result.files.length === 0) {
      console.log("validate-scenes --bundle: no scene chunks in the build; nothing to measure.");
      return;
    }
    const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
    for (const f of result.files) console.log(`  ${f.file}  ${kb(f.gzip)} gz`);
    if (result.gzip > ISLAND_BUDGET_GZIP_BYTES) {
      console.error(`validate-scenes: 3D island is ${kb(result.gzip)} gzipped; budget ${kb(ISLAND_BUDGET_GZIP_BYTES)} (ADR-015).`);
      process.exit(1);
    }
    console.log(`validate-scenes: 3D island ${kb(result.gzip)} gzipped (budget ${kb(ISLAND_BUDGET_GZIP_BYTES)}). OK`);

    const registry = JSON.parse(fs.readFileSync(path.join(root, "data", "scene-registry.json"), "utf8"));
    const heroIds = registry.filter((scene) => isHeroRoute(scene.route)).map((scene) => scene.id);
    const hero = measureHeroBundle(root, heroIds);
    if (hero) {
      for (const f of hero.files) console.log(`  hero: ${f.file}  ${kb(f.gzip)} gz`);
      if (hero.sharedWithR3F.length > 0) {
        console.error(`validate-scenes: homepage hero shares chunks with R3F scenes (ADR-016 forbids three.js on the homepage): ${hero.sharedWithR3F.join(", ")}`);
        process.exit(1);
      }
      if (hero.gzip > HERO_BUDGET_GZIP_BYTES) {
        console.error(`validate-scenes: homepage hero is ${kb(hero.gzip)} gzipped; budget ${kb(HERO_BUDGET_GZIP_BYTES)} (ADR-016).`);
        process.exit(1);
      }
      console.log(`validate-scenes: homepage hero ${kb(hero.gzip)} gzipped (budget ${kb(HERO_BUDGET_GZIP_BYTES)}), no three.js chunks. OK`);
    }
    return;
  }

  const registryPath = path.join(root, "data", "scene-registry.json");
  let registry;
  try {
    registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  } catch (error) {
    console.error(`validate-scenes: cannot read data/scene-registry.json: ${error.message}`);
    process.exit(1);
  }
  const errors = validateScenes(registry, root);
  if (errors.length > 0) {
    console.error(`validate-scenes: ${errors.length} error(s) (ADR-015):`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }
  console.log(`validate-scenes: ${registry.length} scene(s) valid.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main();
}

