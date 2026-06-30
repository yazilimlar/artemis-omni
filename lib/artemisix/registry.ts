// SERVER ONLY. Self-discovering module registry for ArtemisIX.
// Scans public/artemisix/apps for bundled demonstrator HTML files and classifies
// each via the taxonomy. Drop a new .html into that folder and it auto-registers
// on the next request — the catalogue maintains itself.
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { classify, type Classification } from "./taxonomy";

export interface ModuleRecord extends Classification {
  slug: string;
  title: string;
  href: string;
  sizeKb: number;
  updated: string; // ISO
}

const APPS_DIR = path.join(process.cwd(), "public", "artemisix", "apps");

let cache: { at: number; modules: ModuleRecord[] } | null = null;
const TTL_MS = 15_000; // brief cache keeps scans fast under load

function extractTitle(html: string, slug: string): string {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].trim() : slug;
}

/** Scan + classify all bundled apps. Cached for TTL_MS. */
export async function getModules(): Promise<ModuleRecord[]> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.modules;

  let files: string[] = [];
  try {
    files = (await readdir(APPS_DIR)).filter((f) => f.toLowerCase().endsWith(".html"));
  } catch {
    return [];
  }

  const modules = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.html$/i, "");
      const full = path.join(APPS_DIR, file);
      const [html, info] = await Promise.all([
        readFile(full, "utf8").catch(() => ""),
        stat(full).catch(() => null),
      ]);
      const title = extractTitle(html, slug);
      const cls = classify(slug, title);
      return {
        ...cls,
        slug,
        title,
        href: `/artemisix/apps/${file}`,
        sizeKb: info ? Math.round(info.size / 1024) : 0,
        updated: info ? info.mtime.toISOString() : new Date().toISOString(),
      } satisfies ModuleRecord;
    }),
  );

  modules.sort((a, b) =>
    a.department === b.department
      ? a.moduleCode.localeCompare(b.moduleCode)
      : a.department.localeCompare(b.department),
  );

  cache = { at: Date.now(), modules };
  return modules;
}

/** Live counts for the registry header / API. */
export async function getRegistryStats() {
  const modules = await getModules();
  const byDept = new Map<string, number>();
  const byDim = new Map<string, number>();
  for (const m of modules) {
    byDept.set(m.department, (byDept.get(m.department) ?? 0) + 1);
    byDim.set(m.dimension, (byDim.get(m.dimension) ?? 0) + 1);
  }
  return {
    total: modules.length,
    byDepartment: Object.fromEntries(byDept),
    byDimension: Object.fromEntries(byDim),
  };
}
