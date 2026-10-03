#!/usr/bin/env node
/**
 * Evolution Archive extractor (ADR-018).
 *
 * Reads git history, ADRs, registries and the verification record, and writes
 * data/evolution.json. The output is derived, never hand-edited, and a pure
 * function of the repository: running it twice on the same state produces
 * byte-identical output. No Date.now(); `generated_at` is the date of the latest
 * non-bot commit.
 *
 * Commits whose subject starts with BOT_SUBJECT are excluded from every
 * source, so merging the bot's own regeneration PR cannot change the output
 * and cannot start a regeneration loop.
 *
 * Usage: node scripts/extract-evolution.mjs [--root <repo>] [--out <file>]
 * Node 20+, standard library only.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const BOT_SUBJECT = "chore: regenerate evolution data";
const FIELD_SEP = "\x1f";
const COMMIT_MARK = "\x1e";

function git(root, args) {
  return execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

const iso = (value) => new Date(value).toISOString();
const short = (sha) => sha.slice(0, 7);
const slug = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** All non-bot commits reachable from HEAD, oldest first, with name-status. */
function readCommits(root) {
  const out = git(root, [
    "log",
    "--reverse",
    "--name-status",
    "--no-renames",
    `--format=${COMMIT_MARK}%H${FIELD_SEP}%aI${FIELD_SEP}%s`,
  ]);
  const commits = [];
  for (const chunk of out.split(COMMIT_MARK)) {
    if (!chunk.trim()) continue;
    const [head, ...rest] = chunk.split("\n");
    const [sha, date, subject] = head.split(FIELD_SEP);
    if (subject.startsWith(BOT_SUBJECT)) continue;
    const files = rest
      .filter(Boolean)
      .map((line) => {
        const [status, ...path] = line.split("\t");
        return { status, path: path.join("\t") };
      });
    commits.push({ sha, date: iso(date), subject, files });
  }
  return commits;
}

function readText(root, rel) {
  const path = join(root, rel);
  return existsSync(path) ? readFileSync(path, "utf8") : null;
}

/** File content at a commit; null when the file does not exist there. */
function showAt(root, sha, rel) {
  try {
    return git(root, ["show", `${sha}:${rel}`]);
  } catch {
    return null;
  }
}

// --- ADRs -----------------------------------------------------------------

function parseAdr(text) {
  const field = (name) => {
    const m = text.match(new RegExp(`^- \\*\\*${name}:\\*\\*\\s*(.+)$`, "mi"));
    return m ? m[1].trim() : null;
  };
  const refs = (value) => (value ? [...new Set(value.match(/ADR-\d{3}/g) ?? [])] : []);
  return {
    title: (text.match(/^# (.+)$/m)?.[1] ?? "").replace(/^ADR-\d{3}\s*-\s*/, ""),
    status: field("Status"),
    date: field("Date"),
    extends: refs(field("Extends")),
    amends: refs(field("Amends")),
    supersedes: refs(field("Supersedes")),
  };
}

function readAdrs(root) {
  const dir = join(root, "decisions");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .map((name) => name.match(/^ADR-(\d{3})-.+\.md$/) && { name, num: name.slice(4, 7) })
    .filter(Boolean)
    .sort((a, b) => a.num.localeCompare(b.num))
    .map(({ name, num }) => ({
      id: `ADR-${num}`,
      num,
      file: `decisions/${name}`,
      ...parseAdr(readFileSync(join(dir, name), "utf8")),
    }));
}

/** ADR-INDEX rows: id -> { summary, supersededBy }. */
function readAdrIndex(root) {
  const text = readText(root, "decisions/ADR-INDEX.md") ?? "";
  const rows = new Map();
  for (const line of text.split("\n")) {
    const m = line.match(/^\| (ADR-\d{3}) \| ([^|]*) \| (.*) \|\s*$/);
    if (!m) continue;
    rows.set(m[1], {
      area: m[2].trim(),
      summary: m[3].trim().replace(/\*\*/g, ""),
      supersededBy: m[3].match(/[Ss]uperseded by (ADR-\d{3})/)?.[1] ?? null,
    });
  }
  return rows;
}

// --- Registries -----------------------------------------------------------

/** Minimal parser for the flat `products:` list in PRODUCT_REGISTRY.yaml. */
export function parseProducts(yaml) {
  const products = [];
  let current = null;
  let inProducts = false;
  for (const line of yaml.split("\n")) {
    if (/^products:\s*$/.test(line)) {
      inProducts = true;
      continue;
    }
    if (!inProducts) continue;
    if (/^\S/.test(line) && !line.startsWith("#")) break;
    const start = line.match(/^  - id:\s*(\S+)\s*$/);
    if (start) {
      current = { id: start[1] };
      products.push(current);
      continue;
    }
    const kv = line.match(/^    ([a-z_]+):\s*(\S.*?)\s*$/);
    if (current && kv && !/^[>|]/.test(kv[2])) current[kv[1]] = kv[2].replace(/\s+#.*$/, "");
  }
  return products;
}

const TRACKED_PRODUCT_FIELDS = ["lifecycle", "maturity", "visibility"];

function productEvents(root, commits) {
  const path = "ENGINEERING/PRODUCT_REGISTRY.yaml";
  const events = [];
  let previous = new Map();
  for (const commit of commits) {
    if (!commit.files.some((f) => f.path === path)) continue;
    const text = showAt(root, commit.sha, path);
    if (text === null) continue;
    const next = new Map(parseProducts(text).map((p) => [p.id, p]));
    for (const [id, product] of next) {
      const before = previous.get(id);
      if (!before) {
        events.push({
          id: `EVT-product-${id}-registered`,
          type: "product_registered",
          date: commit.date,
          title: `Product registered: ${id}`,
          summary: `${id} entered PRODUCT_REGISTRY.yaml (lifecycle ${product.lifecycle ?? "unknown"}).`,
          references: [short(commit.sha), path, ...prRef(commit)],
          division: product.division ?? null,
          product: id,
          outcome: `lifecycle=${product.lifecycle ?? "unknown"}`,
        });
        continue;
      }
      const changes = TRACKED_PRODUCT_FIELDS.filter((k) => before[k] !== product[k]);
      if (changes.length === 0) continue;
      events.push({
        id: `EVT-product-${id}-status-${short(commit.sha)}`,
        type: "product_status_changed",
        date: commit.date,
        title: `Product status changed: ${id}`,
        summary: changes.map((k) => `${k}: ${before[k] ?? "unset"} -> ${product[k] ?? "unset"}`).join("; "),
        references: [short(commit.sha), path, ...prRef(commit)],
        division: product.division ?? null,
        product: id,
        outcome: changes.map((k) => `${k}=${product[k] ?? "unset"}`).join(", "),
      });
    }
    previous = next;
  }
  return events;
}

function sceneEvents(root, commits) {
  const path = "data/scene-registry.json";
  const events = [];
  const seen = new Set();
  for (const commit of commits) {
    if (!commit.files.some((f) => f.path === path)) continue;
    const text = showAt(root, commit.sha, path);
    if (text === null) continue;
    let scenes;
    try {
      scenes = JSON.parse(text);
    } catch {
      continue;
    }
    for (const scene of scenes) {
      if (seen.has(scene.id)) continue;
      seen.add(scene.id);
      events.push({
        id: `EVT-scene-${scene.id}`,
        type: "scene_registered",
        date: commit.date,
        title: `Scene registered: ${scene.title ?? scene.id}`,
        summary: `Scene ${scene.id} registered at ${scene.route}.`,
        references: [short(commit.sha), path, ...prRef(commit)],
        division: scene.division ?? null,
        product: null,
        outcome: `visibility=${scene.visibility ?? "unknown"}; data_mode=${scene.data_mode ?? "unknown"}`,
      });
    }
  }
  return events;
}

// --- Commits --------------------------------------------------------------

const prNumber = (commit) => commit.subject.match(/\(#(\d+)\)\s*$/)?.[1] ?? null;
const prRef = (commit) => {
  const n = prNumber(commit);
  return n ? [`PR#${n}`] : [];
};
const cleanSubject = (subject) => subject.replace(/\s*\(#\d+\)\s*$/, "");

/** Division is not derivable from a commit; only scene and product events carry one. */
function prEvents(commits) {
  const events = [];
  for (const commit of commits) {
    const n = prNumber(commit);
    if (!n) continue;
    const title = cleanSubject(commit.subject);
    const references = [`PR#${n}`, short(commit.sha)];
    events.push({
      id: `EVT-pr-${n}`,
      type: "pr_merged",
      date: commit.date,
      title,
      summary: `${title} (${commit.files.length} files changed).`,
      references,
      division: null,
      product: null,
      outcome: "merged",
    });
    if (/^security(\(|:)/i.test(commit.subject) || /^fix\(security\)/i.test(commit.subject)) {
      events.push({
        id: `EVT-security-pr-${n}`,
        type: "security_fix",
        date: commit.date,
        title,
        summary: `Security change merged in PR #${n}.`,
        references,
        division: null,
        product: null,
        outcome: "merged",
      });
    }
  }
  return events;
}

const REGISTRY_FILE = /^ENGINEERING\/(PRODUCT|DIVISION|TESTBED_MIGRATION)_REGISTRY\.yaml$/;

function registryEvents(commits) {
  const events = [];
  for (const commit of commits) {
    const touched = commit.files.filter((f) => REGISTRY_FILE.test(f.path)).map((f) => f.path);
    if (touched.length === 0) continue;
    events.push({
      id: `EVT-registry-${short(commit.sha)}`,
      type: "registry_changed",
      date: commit.date,
      title: `Registry changed: ${cleanSubject(commit.subject)}`,
      summary: `Touched ${touched.join(", ")}.`,
      references: [short(commit.sha), ...touched, ...prRef(commit)],
      division: null,
      product: null,
      outcome: "committed",
    });
  }
  return events;
}

const ROUTE_FILE = /^(?:src\/)?app\/(.*)\/?(page\.tsx|route\.ts)$/;

function routeOf(path) {
  const m = path.match(ROUTE_FILE);
  if (!m) return null;
  const segments = m[1].split("/").filter((s) => s && !/^\(.*\)$/.test(s));
  return "/" + segments.join("/");
}

function routeEvents(commits) {
  const events = [];
  for (const commit of commits) {
    const seen = new Set();
    for (const { status, path } of commit.files) {
      const route = routeOf(path);
      if (!route || (status !== "A" && status !== "D")) continue;
      const kind = status === "A" ? "added" : "removed";
      const key = `${kind}-${route}`;
      if (seen.has(key)) continue;
      seen.add(key);
      events.push({
        id: `EVT-route-${kind}-${short(commit.sha)}-${slug(route) || "root"}`,
        type: kind === "added" ? "route_added" : "route_removed",
        date: commit.date,
        title: `Route ${kind}: ${route}`,
        summary: `${path} ${kind} in ${short(commit.sha)}.`,
        references: [short(commit.sha), path, ...prRef(commit)],
        division: null,
        product: null,
        outcome: kind,
      });
    }
  }
  return events;
}

function adrEvents(root, commits, adrs, index) {
  const added = new Map();
  for (const commit of commits) {
    for (const f of commit.files) {
      const m = f.path.match(/^decisions\/ADR-(\d{3})-.+\.md$/);
      if (m && f.status === "A" && !added.has(m[1])) added.set(m[1], commit);
    }
  }
  const dateOf = (adr, commit) =>
    /^\d{4}-\d{2}-\d{2}$/.test(adr.date ?? "") ? iso(`${adr.date}T00:00:00Z`) : commit?.date;
  const events = [];
  for (const adr of adrs) {
    const commit = added.get(adr.num);
    const date = dateOf(adr, commit);
    if (!date) continue;
    const refs = [adr.id, adr.file, ...(commit ? [short(commit.sha), ...prRef(commit)] : [])];
    events.push({
      id: `EVT-adr-${adr.num}`,
      type: "adr_added",
      date,
      title: `${adr.id}: ${adr.title}`,
      summary: index.get(adr.id)?.summary ?? adr.title,
      references: refs,
      division: null,
      product: null,
      outcome: adr.status ?? "unknown",
    });
    for (const target of adr.supersedes) {
      events.push({
        id: `EVT-adr-${target.slice(4)}-superseded`,
        type: "adr_superseded",
        date,
        title: `${target} superseded by ${adr.id}`,
        summary: `${adr.id} supersedes ${target}.`,
        references: [target, adr.id, ...(commit ? [short(commit.sha)] : [])],
        division: null,
        product: null,
        outcome: `superseded_by=${adr.id}`,
      });
    }
  }
  return events;
}

/** Milestones are read from the handover's "- M<n>: ... (PR #<n>" lines. */
function milestoneEvents(root, commits) {
  const text = readText(root, "docs/HANDOVER.md") ?? "";
  const byPr = new Map(commits.map((c) => [prNumber(c), c]).filter(([n]) => n));
  const events = [];
  const seen = new Set();
  for (const line of text.split("\n")) {
    const m = line.match(/^- (M\d+): (.+?)\(PR #(\d+)/);
    if (!m || seen.has(m[1])) continue;
    const commit = byPr.get(m[3]);
    if (!commit) continue;
    seen.add(m[1]);
    events.push({
      id: `EVT-milestone-${m[1]}`,
      type: "milestone_shipped",
      date: commit.date,
      title: `${m[1]}: ${m[2].trim().replace(/[\s:]+$/, "")}`,
      summary: `Milestone ${m[1]} shipped via PR #${m[3]}.`,
      references: [`PR#${m[3]}`, short(commit.sha), "docs/HANDOVER.md"],
      division: null,
      product: null,
      outcome: "shipped",
    });
  }
  return events;
}

/** Number of table rows in the "Verified" section of docs/VERIFICATION.md. */
function countVerified(root) {
  const text = readText(root, "docs/VERIFICATION.md");
  if (!text) return 0;
  const section = text.split(/^## /m).find((s) => s.startsWith("Verified"));
  if (!section) return 0;
  return section
    .split("\n")
    .filter((l) => l.startsWith("|") && !/^\|\s*(Capability|-)/.test(l)).length;
}

// --- Assembly -------------------------------------------------------------

export function buildEvolution(root) {
  const commits = readCommits(root);
  const adrs = readAdrs(root);
  const index = readAdrIndex(root);

  const byId = new Map();
  for (const event of [
    ...adrEvents(root, commits, adrs, index),
    ...productEvents(root, commits),
    ...sceneEvents(root, commits),
    ...milestoneEvents(root, commits),
    ...registryEvents(commits),
    ...routeEvents(commits),
    ...prEvents(commits),
  ]) {
    if (!byId.has(event.id)) byId.set(event.id, event);
  }
  const events = [...byId.values()].sort(
    (a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id),
  );

  const productsText = readText(root, "ENGINEERING/PRODUCT_REGISTRY.yaml") ?? "";
  const products = parseProducts(productsText);
  const productsByStatus = {};
  for (const p of products) {
    const status = p.lifecycle ?? "unknown";
    productsByStatus[status] = (productsByStatus[status] ?? 0) + 1;
  }
  let scenes = [];
  try {
    scenes = JSON.parse(readText(root, "data/scene-registry.json") ?? "[]");
  } catch {
    scenes = [];
  }
  const superseded = new Set([
    ...adrs.flatMap((a) => a.supersedes),
    ...[...index].filter(([, r]) => r.supersededBy).map(([id]) => id),
  ]);
  const count = (type) => events.filter((e) => e.type === type).length;

  return {
    _meta: {
      generated_by: "scripts/extract-evolution.mjs",
      generated_at: commits.length ? commits[commits.length - 1].date : "1970-01-01T00:00:00.000Z",
      do_not_edit: true,
    },
    version: 1,
    generated_at: commits.length ? commits[commits.length - 1].date : "1970-01-01T00:00:00.000Z",
    events,
    stats: {
      adrs_total: adrs.length,
      adrs_superseded: superseded.size,
      products_total: products.length,
      products_by_status: Object.fromEntries(Object.entries(productsByStatus).sort()),
      scenes_total: scenes.length,
      milestones_shipped: count("milestone_shipped"),
      prs_merged: count("pr_merged"),
      verified_capabilities: countVerified(root),
    },
  };
}

function parseArgs(argv) {
  const args = { root: process.cwd(), out: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--root") args.root = resolve(argv[++i]);
    else if (argv[i] === "--out") args.out = resolve(argv[++i]);
  }
  args.out ??= join(args.root, "data", "evolution.json");
  return args;
}

function main() {
  const { root, out } = parseArgs(process.argv.slice(2));
  if (git(root, ["rev-parse", "--is-shallow-repository"]).trim() === "true") {
    console.warn("warning: shallow clone; history is incomplete. Use fetch-depth: 0.");
  }
  const data = buildEvolution(root);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(data, null, 2) + "\n");

  const byType = {};
  for (const e of data.events) byType[e.type] = (byType[e.type] ?? 0) + 1;
  console.log(`evolution: ${data.events.length} events -> ${out}`);
  console.log("events by type:", JSON.stringify(byType));
  console.log("stats:", JSON.stringify(data.stats));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
