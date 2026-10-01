/**
 * Server-only loader for the Artemis governance registries.
 *
 * Reads ENGINEERING/PRODUCT_REGISTRY.yaml and ENGINEERING/DIVISION_REGISTRY.yaml
 * at build time. YAML is parsed through gray-matter's YAML engine (js-yaml
 * safeLoad), because gray-matter is a declared dependency and js-yaml is not.
 *
 * `UNREVIEWED` is a valid value for any classified field: it marks a field that
 * repository evidence or an owner decision has not yet established.
 *
 * Public listing rule (isPubliclyListed, used for /labs default cards):
 * a registry product gets a default card only when ALL of these hold:
 *   - visibility is exactly "public"
 *   - canonical_route is a route path (a string starting with "/"; null and
 *     UNREVIEWED do not qualify)
 *   - lifecycle is not UNREVIEWED
 * Editorial entries (data/labs-editorial.ts) always render, whatever their
 * registry entry says, so curated content is never dropped by this filter.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const UNREVIEWED = "UNREVIEWED" as const;
export type Unreviewed = typeof UNREVIEWED;

const LIFECYCLES = [
  "concept",
  "prototype",
  "testbed",
  "rescue",
  "active_lab",
  "active_product",
  "noindex_draft",
  "private_pilot",
  "retired",
] as const;
const MATURITIES = [
  "internal_experiment",
  "public_safe_demo",
  "public_lab",
  "pilot_ready",
  "production",
] as const;
const VISIBILITIES = [
  "public",
  "public_safe_demo",
  "noindex_review",
  "authenticated",
  "private_pilot",
  "internal_operations",
] as const;
const DATA_MODES = [
  "live_official",
  "live_derived",
  "synthetic",
  "sample",
  "sample_fallback",
  "private_approved",
  "mixed_explicit",
] as const;

export type Lifecycle = (typeof LIFECYCLES)[number] | Unreviewed;
export type Maturity = (typeof MATURITIES)[number] | Unreviewed;
export type Visibility = (typeof VISIBILITIES)[number] | Unreviewed;
export type DataMode = (typeof DATA_MODES)[number] | Unreviewed;

export type RegistryProduct = {
  id: string;
  name: string;
  division: string;
  product_family: string;
  lifecycle: Lifecycle;
  maturity: Maturity;
  visibility: Visibility;
  data_mode: DataMode;
  /** A route path, `UNREVIEWED`, or null when the product has no route. */
  canonical_route: string | null;
  canonical_branch: string | null;
  known_blockers: string[];
  next_gate: string | null;
};

export type RegistryDivision = {
  id: string;
  name: string;
  status: string;
  mission: string;
  product_families: string[];
  public_routes: string[];
};

const REGISTRY_DIR = path.join(process.cwd(), "ENGINEERING");

function readYaml(fileName: string): Record<string, unknown> {
  const filePath = path.join(REGISTRY_DIR, fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  // Wrapping the document as front matter routes it through js-yaml safeLoad.
  return matter(`---\n${raw}\n---\n`).data;
}

function requireString(record: Record<string, unknown>, field: string, owner: string): string {
  const value = record[field];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Registry entry "${owner}" has missing or non-string field "${field}".`);
  }
  return value;
}

function optionalString(record: Record<string, unknown>, field: string, owner: string): string | null {
  const value = record[field];
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") {
    throw new Error(`Registry entry "${owner}" has non-string field "${field}".`);
  }
  return value;
}

function stringList(record: Record<string, unknown>, field: string, owner: string): string[] {
  const value = record[field];
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`Registry entry "${owner}" has non-string-list field "${field}".`);
  }
  return value as string[];
}

function requireEnum<T extends string>(
  record: Record<string, unknown>,
  field: string,
  owner: string,
  allowed: readonly T[],
): T | Unreviewed {
  const value = requireString(record, field, owner);
  if (value === UNREVIEWED || (allowed as readonly string[]).includes(value)) {
    return value as T | Unreviewed;
  }
  throw new Error(`Registry entry "${owner}" has unknown ${field} "${value}".`);
}

function parseProduct(entry: unknown): RegistryProduct {
  if (typeof entry !== "object" || entry === null) {
    throw new Error("Registry products list contains a non-object entry.");
  }
  const record = entry as Record<string, unknown>;
  const id = requireString(record, "id", "<unknown>");
  return {
    id,
    name: requireString(record, "name", id),
    division: requireString(record, "division", id),
    product_family: requireString(record, "product_family", id),
    lifecycle: requireEnum(record, "lifecycle", id, LIFECYCLES),
    maturity: requireEnum(record, "maturity", id, MATURITIES),
    visibility: requireEnum(record, "visibility", id, VISIBILITIES),
    data_mode: requireEnum(record, "data_mode", id, DATA_MODES),
    canonical_route: optionalString(record, "canonical_route", id),
    canonical_branch: optionalString(record, "canonical_branch", id),
    known_blockers: stringList(record, "known_blockers", id),
    next_gate: optionalString(record, "next_gate", id),
  };
}

function parseDivision(entry: unknown): RegistryDivision {
  if (typeof entry !== "object" || entry === null) {
    throw new Error("Registry divisions list contains a non-object entry.");
  }
  const record = entry as Record<string, unknown>;
  const id = requireString(record, "id", "<unknown>");
  return {
    id,
    name: requireString(record, "name", id),
    status: requireString(record, "status", id),
    mission: requireString(record, "mission", id),
    product_families: stringList(record, "product_families", id),
    public_routes: stringList(record, "public_routes", id),
  };
}

let productCache: RegistryProduct[] | null = null;
let divisionCache: RegistryDivision[] | null = null;

export function loadProducts(): RegistryProduct[] {
  if (!productCache) {
    const products = readYaml("PRODUCT_REGISTRY.yaml").products;
    if (!Array.isArray(products)) {
      throw new Error("PRODUCT_REGISTRY.yaml has no products list.");
    }
    const parsed = products.map(parseProduct);
    const seen = new Set<string>();
    for (const product of parsed) {
      if (seen.has(product.id)) {
        throw new Error(`PRODUCT_REGISTRY.yaml has duplicate product id "${product.id}".`);
      }
      seen.add(product.id);
    }
    productCache = parsed;
  }
  return productCache;
}

export function getProduct(id: string): RegistryProduct | undefined {
  return loadProducts().find((product) => product.id === id);
}

export function loadDivisions(): RegistryDivision[] {
  if (!divisionCache) {
    const divisions = readYaml("DIVISION_REGISTRY.yaml").divisions;
    if (!Array.isArray(divisions)) {
      throw new Error("DIVISION_REGISTRY.yaml has no divisions list.");
    }
    divisionCache = divisions.map(parseDivision);
  }
  return divisionCache;
}

/** The product's canonical route when it is a real path, otherwise null. */
export function linkableRoute(product: RegistryProduct): string | null {
  const route = product.canonical_route;
  return route && route.startsWith("/") ? route : null;
}

/** Applies the public listing rule documented at the top of this file. */
export function isPubliclyListed(product: RegistryProduct): boolean {
  return (
    product.visibility === "public" &&
    linkableRoute(product) !== null &&
    product.lifecycle !== UNREVIEWED
  );
}

export type RegistryOverlayEntry<E> = {
  /** Registry entry, or null for editorial-only content. */
  product: RegistryProduct | null;
  /** Editorial overlay, or null when the page should render a default card. */
  editorial: E | null;
};

/**
 * Merges registry products with an editorial overlay keyed by `registryId`.
 *
 * Every editorial entry is kept, in editorial order, so no reviewed content is
 * dropped. Products passing isPubliclyListed without an overlay follow in
 * registry order.
 * Throws when an overlay names an unknown or duplicate registry id.
 */
export function mergeRegistryOverlay<E extends { registryId: string | null }>(
  products: RegistryProduct[],
  editorial: readonly E[],
): RegistryOverlayEntry<E>[] {
  const byId = new Map(products.map((product) => [product.id, product]));
  const overlaid = new Set<string>();

  const editorialEntries = editorial.map((entry) => {
    if (entry.registryId === null) return { product: null, editorial: entry };
    const product = byId.get(entry.registryId);
    if (!product) {
      throw new Error(`Editorial overlay references unknown registry id "${entry.registryId}".`);
    }
    if (overlaid.has(product.id)) {
      throw new Error(`Editorial overlay references registry id "${product.id}" twice.`);
    }
    overlaid.add(product.id);
    return { product, editorial: entry };
  });

  const defaultEntries = products
    .filter((product) => isPubliclyListed(product) && !overlaid.has(product.id))
    .map((product) => ({ product, editorial: null }));

  return [...editorialEntries, ...defaultEntries];
}
