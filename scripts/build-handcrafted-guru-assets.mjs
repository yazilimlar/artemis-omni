#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SOURCE = process.argv[2];
const PROJECT_ROOT = process.cwd();
const LAB_ID = "handcrafted-guru-selection-v00";
const PUBLIC_BASE_PATH = `/standalone/assets/${LAB_ID}`;
const OUTPUT_DIR = path.join(PROJECT_ROOT, "public", "standalone", "assets", LAB_ID);

const assetPlan = [
  {
    id: "time-atlas-troy-interface",
    match: (name) => /image-gen-1/i.test(name),
    title: "Artemis Time Atlas Troy interface",
    role: "game-ui-target",
    focus: ["Troy", "timeline", "consult guide", "mobile HUD"],
  },
  {
    id: "strategy-aegean-wide",
    match: (name) => /10\.20\.25 PM/i.test(name),
    title: "Aegean wide strategy board",
    role: "strategy-reference",
    focus: ["Aegean", "Crete", "Rhodes", "island routes"],
  },
  {
    id: "coastal-command-screenshot",
    match: (name) => /10\.21\.28 PM/i.test(name),
    title: "Coastal command screenshot",
    role: "camera-reference",
    focus: ["coastal camera", "banners", "turn-based map feel"],
  },
  {
    id: "troy-ilion-600bc",
    match: (name) => /75812963|troy/i.test(name),
    title: "Troy Ilion c. 600 BC",
    role: "site-plate",
    focus: ["Troy", "Dardanelles", "Mount Ida", "citadel"],
  },
  {
    id: "ephesus-100ad",
    match: (name) => /aerial view of ancient ephesus|ephesus/i.test(name),
    title: "Ephesus c. 100 AD",
    role: "site-plate",
    focus: ["Ephesus", "Library of Celsus", "harbor", "Mount Pion"],
  },
  {
    id: "patara-150ad",
    match: (name) => /aerial view of ancient patara|patara/i.test(name),
    title: "Patara c. 150 AD",
    role: "site-plate",
    focus: ["Patara", "Lycian harbor", "beach", "theater"],
  },
  {
    id: "turkish-aegean-coastline-route",
    match: (name) => /turkish aegean coastline travel/i.test(name),
    title: "Turkish Aegean coastline route",
    role: "regional-plate",
    focus: ["Cesme", "Izmir", "Ephesus", "Didim", "Bodrum"],
  },
  {
    id: "turkish-aegean-coastline-beauty",
    match: (name) => /turkish aegean coastal beauty/i.test(name),
    title: "Turkish Aegean coastal beauty",
    role: "regional-plate",
    focus: ["Kusadasi", "Ephesus", "Didim", "Bodrum", "olive hills"],
  },
  {
    id: "turkiye-anatolia-ornate",
    match: (name) => /ornate map/i.test(name) && /anatolia/i.test(name),
    title: "Turkiye and Anatolia ornate map",
    role: "country-plate",
    focus: ["Istanbul", "Ankara", "Cappadocia", "Ephesus", "Antalya"],
  },
];

function usage() {
  console.error(
    "Usage: node scripts/build-handcrafted-guru-assets.mjs <archive.zip|source-directory>",
  );
}

function ensureSource() {
  if (!SOURCE) {
    usage();
    process.exit(1);
  }
  if (!fs.existsSync(SOURCE)) {
    console.error(`Source not found: ${SOURCE}`);
    process.exit(1);
  }
}

function extractIfNeeded(source) {
  const stat = fs.statSync(source);
  if (stat.isDirectory()) return { root: source, cleanup: null };

  if (!/\.zip$/i.test(source)) {
    console.error("Source must be a .zip archive or a directory.");
    process.exit(1);
  }

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), `${LAB_ID}-`));
  execFileSync("ditto", ["-x", "-k", source, tempRoot], { stdio: "pipe" });
  return {
    root: tempRoot,
    cleanup: () => fs.rmSync(tempRoot, { recursive: true, force: true }),
  };
}

function listImageFiles(root) {
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "__MACOSX" || entry.name.startsWith("._")) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (/\.(png|jpe?g|webp)$/i.test(entry.name)) {
        files.push(fullPath);
      }
    }
  };
  walk(root);
  return files;
}

function normalizedName(filePath) {
  return path.basename(filePath).normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

function getDimensions(filePath) {
  try {
    const output = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", filePath], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    const width = Number(output.match(/pixelWidth:\s+(\d+)/)?.[1] ?? 0);
    const height = Number(output.match(/pixelHeight:\s+(\d+)/)?.[1] ?? 0);
    return { width, height };
  } catch {
    return { width: 0, height: 0 };
  }
}

function convertToJpeg(sourcePath, outputPath) {
  try {
    execFileSync(
      "sips",
      [
        "-s",
        "format",
        "jpeg",
        "-s",
        "formatOptions",
        "88",
        "--resampleHeightWidthMax",
        "1800",
        sourcePath,
        "--out",
        outputPath,
      ],
      { stdio: "pipe" },
    );
    return outputPath;
  } catch {
    const fallback = outputPath.replace(/\.jpg$/i, path.extname(sourcePath).toLowerCase());
    fs.copyFileSync(sourcePath, fallback);
    console.warn(`sips conversion failed for ${sourcePath}; copied original to ${fallback}`);
    return fallback;
  }
}

function buildAssets(sourceRoot, sourceLabel) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const files = listImageFiles(sourceRoot);
  const used = new Set();
  const assets = [];

  for (const plan of assetPlan) {
    const match = files.find((file) => {
      if (used.has(file)) return false;
      return plan.match(normalizedName(file).toLowerCase());
    });

    if (!match) {
      assets.push({
        ...plan,
        missing: true,
        sourceName: null,
        path: null,
        width: 0,
        height: 0,
      });
      continue;
    }

    used.add(match);
    const outputName = `${plan.id}.jpg`;
    const outputPath = path.join(OUTPUT_DIR, outputName);
    const writtenPath = convertToJpeg(match, outputPath);
    const dimensions = getDimensions(writtenPath);

    assets.push({
      ...plan,
      missing: false,
      sourceName: normalizedName(match),
      path: `${PUBLIC_BASE_PATH}/${path.basename(writtenPath)}`,
      width: dimensions.width,
      height: dimensions.height,
    });
  }

  const unmatched = files
    .filter((file) => !used.has(file))
    .map((file) => normalizedName(file))
    .sort();

  const manifest = {
    name: "Artemis Atlas Handcrafted Guru Selection v00",
    slug: "artemis-atlas-handcrafted-guru-selection-v00",
    labId: LAB_ID,
    version: "v00",
    sourceArchive: path.basename(sourceLabel),
    generatedAt: new Date().toISOString(),
    outputBasePath: PUBLIC_BASE_PATH,
    pipeline: [
      "ingest attached archive",
      "normalize filenames",
      "convert curated plates to browser-safe jpeg",
      "write public asset manifest",
      "load manifest in standalone lab",
    ],
    assets,
    unmatchedSourceFiles: unmatched,
  };

  fs.writeFileSync(path.join(OUTPUT_DIR, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "pipeline-record.json"),
    `${JSON.stringify(
      {
        generatedAt: manifest.generatedAt,
        command: "node scripts/build-handcrafted-guru-assets.mjs <archive.zip|source-directory>",
        outputBasePath: PUBLIC_BASE_PATH,
        curatedAssetCount: assets.filter((asset) => !asset.missing).length,
        missingAssets: assets.filter((asset) => asset.missing).map((asset) => asset.id),
      },
      null,
      2,
    )}\n`,
  );

  return manifest;
}

ensureSource();
const { root, cleanup } = extractIfNeeded(SOURCE);

try {
  const manifest = buildAssets(root, SOURCE);
  const built = manifest.assets.filter((asset) => !asset.missing).length;
  const missing = manifest.assets.filter((asset) => asset.missing).map((asset) => asset.id);
  console.log(`Built ${built} curated assets in ${OUTPUT_DIR}`);
  if (missing.length) {
    console.log(`Missing planned assets: ${missing.join(", ")}`);
  }
  if (manifest.unmatchedSourceFiles.length) {
    console.log(`Unmatched source files: ${manifest.unmatchedSourceFiles.join(", ")}`);
  }
} finally {
  cleanup?.();
}
