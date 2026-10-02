import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
// Plain .mjs build script; types are inferred through allowJs.
import {
  HERO_BUDGET_GZIP_BYTES,
  ISLAND_BUDGET_GZIP_BYTES,
  glbIsCompressed,
  measureHeroBundle,
  measureIslandBundle,
  pngSize,
  validateScenes,
} from "../../scripts/validate-scenes.mjs";
import { decideRender } from "@/components/scenes/SceneIsland";
import registry from "@/data/scene-registry.json";

const tmpRoots: string[] = [];
afterEach(() => {
  for (const dir of tmpRoots.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

/** A throwaway repo root with one valid scene's files. */
function fixture(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "scenes-"));
  tmpRoots.push(root);
  fs.mkdirSync(path.join(root, "components/scenes/demo"), { recursive: true });
  fs.writeFileSync(path.join(root, "components/scenes/demo/index.tsx"), "export default () => null;\n");
  fs.writeFileSync(path.join(root, "components/scenes/demo/passport.md"), "# passport\n");
  fs.mkdirSync(path.join(root, "public/textures/demo"), { recursive: true });
  fs.writeFileSync(path.join(root, "public/textures/demo/fallback.png"), fs.readFileSync("public/textures/hello-orb/fallback.png"));
  return root;
}

const valid = {
  id: "demo",
  title: "Demo",
  division: "studio-media",
  route: "/labs/scenes/demo",
  visibility: "authenticated",
  data_mode: "synthetic",
  approved_public: false,
  entry_component: "components/scenes/demo/index.tsx",
  fallback_2d: "public/textures/demo/fallback.png",
  assets_dir: "public/textures/demo",
  asset_budget_mb: 1,
  owner: "studio-media",
  resource_limits: { max_session_seconds: 120, fps_floor: 20 },
  passport: "components/scenes/demo/passport.md",
  created_at: "2026-10-01",
  updated_at: "2026-10-01",
};

describe("validate-scenes", () => {
  it("passes on an empty registry", () => {
    expect(validateScenes([], fixture())).toEqual([]);
  });

  it("passes on a valid scene and on the committed registry", () => {
    expect(validateScenes([valid], fixture())).toEqual([]);
    expect(validateScenes(registry, process.cwd())).toEqual([]);
  });

  it("fails on a missing fallback", () => {
    const root = fixture();
    fs.rmSync(path.join(root, "public/textures/demo/fallback.png"));
    expect(validateScenes([valid], root).join("\n")).toMatch(/fallback_2d not found/);
    expect(validateScenes([{ ...valid, fallback_2d: undefined }], root).join("\n")).toMatch(/fallback_2d is required/);
    expect(validateScenes([{ ...valid, fallback_2d: "components/scenes/demo/index.tsx" }], root).join("\n")).toMatch(
      /must be an image/,
    );
  });

  it("fails on an oversized assets_dir", () => {
    const root = fixture();
    fs.writeFileSync(path.join(root, "public/textures/demo/big.bin"), Buffer.alloc(1024 * 1024 + 1));
    expect(validateScenes([valid], root).join("\n")).toMatch(/budget 1 MB/);
  });

  it("fails on a route not starting with /labs/scenes/", () => {
    const errors = validateScenes([{ ...valid, route: "/labs/demo" }], fixture()).join("\n");
    expect(errors).toMatch(/route must start with \/labs\/scenes\//);
  });

  it("fails on public_safe_demo without approved_public", () => {
    const errors = validateScenes([{ ...valid, visibility: "public_safe_demo", approved_public: false }], fixture());
    expect(errors.join("\n")).toMatch(/public_safe_demo requires approved_public: true/);
  });

  it("fails on entry/asset paths outside their allowed directories and on emails as owner", () => {
    const root = fixture();
    const errors = validateScenes(
      [{ ...valid, entry_component: "components/other/index.tsx", assets_dir: "components/scenes/demo", owner: "a@b.co" }],
      root,
    ).join("\n");
    expect(errors).toMatch(/entry_component must be under components\/scenes\/demo\//);
    expect(errors).toMatch(/assets_dir must be under public\//);
    expect(errors).toMatch(/owner must be a team or role/);
  });

  it("enforces the 2048px texture limit and model compression", () => {
    const root = fixture();
    const png = Buffer.from(fs.readFileSync("public/textures/hello-orb/fallback.png"));
    png.writeUInt32BE(4096, 16); // forge IHDR width
    fs.writeFileSync(path.join(root, "public/textures/demo/huge.png"), png);
    const header = Buffer.alloc(20);
    header.write("glTF", 0, "ascii");
    const json = Buffer.from('{"asset":{"version":"2.0"}}');
    header.writeUInt32LE(json.length, 12);
    fs.writeFileSync(path.join(root, "public/textures/demo/model.glb"), Buffer.concat([header, json, Buffer.alloc(600 * 1024)]));
    const errors = validateScenes([valid], root).join("\n");
    expect(errors).toMatch(/4096x512; max 2048x2048/);
    expect(errors).toMatch(/not DRACO\/meshopt-compressed/);
    expect(pngSize(png)).toEqual({ width: 4096, height: 512 });
    const dracoJson = Buffer.from('{"extensionsUsed":["KHR_draco_mesh_compression"]}');
    const dracoHeader = Buffer.from(header);
    dracoHeader.writeUInt32LE(dracoJson.length, 12);
    expect(glbIsCompressed(Buffer.concat([dracoHeader, dracoJson]))).toBe(true);
    expect(glbIsCompressed(Buffer.concat([header, json]))).toBe(false);
  });
});

describe("island bundle budget", () => {
  it("skips without build output and sums only scene chunks from the loadable manifest", () => {
    const root = fixture();
    expect(measureIslandBundle(root)).toBeNull();
    fs.mkdirSync(path.join(root, ".next/static/chunks"), { recursive: true });
    fs.writeFileSync(path.join(root, ".next/static/chunks/scene.js"), "x".repeat(1000));
    fs.writeFileSync(path.join(root, ".next/static/chunks/other.js"), "y".repeat(1000));
    fs.writeFileSync(
      path.join(root, ".next/react-loadable-manifest.json"),
      JSON.stringify({
        "components/scenes/SceneIsland.tsx -> ./demo": { id: 1, files: ["static/chunks/scene.js"] },
        "components/other/Widget.tsx -> ./x": { id: 2, files: ["static/chunks/other.js"] },
      }),
    );
    const result = measureIslandBundle(root);
    if (!result) throw new Error("expected a bundle measurement");
    expect(result.files.map((f: { file: string }) => f.file)).toEqual([".next/static/chunks/scene.js"]);
    expect(result.gzip).toBeGreaterThan(0);
    expect(ISLAND_BUDGET_GZIP_BYTES).toBe(400 * 1024);
  });
});

describe("ADR-016 homepage hero", () => {
  const hero = { ...valid, route: "/", visibility: "public_safe_demo", approved_public: true };

  it("accepts one approved hero scene with route \"/\" without the /labs/scenes rule", () => {
    expect(validateScenes([hero], fixture())).toEqual([]);
  });

  it("rejects a second hero and an unapproved hero", () => {
    const root = fixture();
    expect(validateScenes([hero, { ...hero, id: "demo2" }], root).join("\n")).toMatch(/at most one homepage hero/);
    expect(validateScenes([{ ...hero, approved_public: false }], root).join("\n")).toMatch(
      /homepage hero must be public or an approved public_safe_demo/,
    );
  });

  it("measures only hero chunks and reports any chunk shared with R3F scenes", () => {
    const root = fixture();
    fs.mkdirSync(path.join(root, ".next/static/chunks"), { recursive: true });
    for (const name of ["three.js", "hero.js", "island.js"]) {
      fs.writeFileSync(path.join(root, ".next/static/chunks", name), name.repeat(200));
    }
    const write = (manifest: object) =>
      fs.writeFileSync(path.join(root, ".next/react-loadable-manifest.json"), JSON.stringify(manifest));
    write({
      "components/scenes/SceneIsland.tsx -> ./demo": { files: ["static/chunks/hero.js"] },
      "components/scenes/demo/HomeHeroScene.tsx -> @/components/scenes/SceneIsland": { files: ["static/chunks/island.js"] },
      "components/scenes/SceneIsland.tsx -> ./orb": { files: ["static/chunks/three.js"] },
    });
    const clean = measureHeroBundle(root, ["demo"]);
    if (!clean) throw new Error("expected a hero measurement");
    expect(clean.files.map((f: { file: string }) => f.file).sort()).toEqual([
      ".next/static/chunks/hero.js",
      ".next/static/chunks/island.js",
    ]);
    expect(clean.sharedWithR3F).toEqual([]);
    expect(HERO_BUDGET_GZIP_BYTES).toBe(100 * 1024);

    write({
      "components/scenes/SceneIsland.tsx -> ./demo": { files: ["static/chunks/hero.js", "static/chunks/three.js"] },
      "components/scenes/SceneIsland.tsx -> ./orb": { files: ["static/chunks/three.js"] },
    });
    expect(measureHeroBundle(root, ["demo"])?.sharedWithR3F).toEqual(["static/chunks/three.js"]);
  });
});

describe("SceneIsland decision function", () => {
  it("renders the scene only when every check passes", () => {
    const ok = { reducedMotion: false, hasWebGL: true, lowDevice: false, fpsBelowFloor: false, errorThrown: false };
    expect(decideRender(ok)).toBe("scene");
    expect(decideRender({ ...ok, ssr: true })).toBe("fallback");
  });
});
