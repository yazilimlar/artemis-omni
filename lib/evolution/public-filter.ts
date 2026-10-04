import type { EvolutionEvent } from "./load";

/**
 * Public-safe projection of the Evolution Archive (ADR-018, /platform).
 *
 * Default is exclusion: an event is returned only when it is of an included type,
 * is on an allowlist, carries no sensitive keyword, and has no internal reference.
 * Allowlisted ADRs and milestones get curated public wording instead of the raw
 * archive text, so internal phrasing never reaches the page. If uncertain, exclude.
 * Pure and side-effect free; the allowlists are exported so they can be extended.
 */

/** Types never shown publicly (internal governance). */
export const EXCLUDED_TYPES: readonly EvolutionEvent["type"][] = [
  "security_fix",
  "registry_changed",
  "product_status_changed",
];

/** Only these types can ever be public. Everything else (routes, products, supersession) is dropped. */
export const INCLUDED_TYPES: readonly EvolutionEvent["type"][] = [
  "milestone_shipped",
  "adr_added",
  "scene_registered",
  "pr_merged",
];

/** Public ADRs by number. Every other ADR is internal. */
export const PUBLIC_ADR_NUMBERS: readonly string[] = ["006", "015", "017", "018", "019"];

/** Curated public one-liners for the allowlisted ADRs. An allowlisted ADR without one is excluded. */
export const PUBLIC_ADR_SUMMARIES: Readonly<Record<string, string>> = {
  "006": "Artemis is an umbrella platform of divisions and products; a branch is a work state, not a product identity.",
  "015": "3D is a progressive enhancement in registered scenes only, with a mandatory 2D fallback and enforced budgets.",
  "017": "Every page presents its subject in a visual grammar native to that subject.",
  "018": "A generated, inspectable record of how the platform was built.",
  "019": "Proven open-source services are composed behind interfaces Artemis defines, rather than rebuilt.",
};

/** Public milestones by event id, with curated public wording. */
export const PUBLIC_MILESTONES: Readonly<Record<string, { title: string; summary: string }>> = {
  "EVT-milestone-M1": {
    title: "M1: Registry-driven labs index",
    summary: "The labs index is built from the product registry.",
  },
  "EVT-milestone-M6": {
    title: "M6: Sandboxed artifact execution",
    summary: "Registered HTML artifacts run in an isolated sandbox with an audit trail.",
  },
  "EVT-milestone-M7": {
    title: "M7: Immersive 3D scene layer",
    summary: "Registered 3D scenes with a 2D fallback and performance budgets.",
  },
};

/** Public merged PRs by number. Anything else is dropped. */
export const PUBLIC_PR_NUMBERS: readonly number[] = [
  66, 69, 70, 71, 72, 75, 76, 78, 79, 80, 81, 83, 84, 86, 89, 90, 91, 92, 93, 96, 99, 100, 103, 111, 116,
];

/** Text that marks an event as internal. Matched case-insensitively unless noted. */
export const SENSITIVE_PATTERNS: readonly RegExp[] = [
  /\bauth(?:entication|enticated|orization)?\b/i,
  /allowlist/i,
  /secret/i,
  /token/i,
  /\bENV\b/, // case-sensitive: "env" inside "development" is fine
  /\.env\b|\benv(?:ironment)? var/i,
  /cookie/i,
  /supabase/i,
  /e-?mail/i,
  /private/i,
  /internal_operations/i,
  /noindex_review/i,
  /resend/i,
  /ip[\s_-]?salt/i,
  // internal routes and workflows
  /\/(?:control|system-map|dashboard|evolution|login|api)\b/i,
  /\((?:control|dashboard|auth|login)\)/i, // conventional-commit scopes
  /\bdashboard\b/i,
  /\bproposals?\b/i,
];

/** References that must never appear: bot or proposal branches, environment variable names. */
const BLOCKED_REFERENCES: readonly RegExp[] = [
  /^(?:bot|proposal|proposals|registry-proposal)\//i,
  /evolution-update/i,
  /^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+$/, // ARTEMIS_IP_SALT, NEXT_PUBLIC_...
];

/** References kept in the public projection: PR numbers and ADR ids only. */
const PUBLIC_REFERENCE = /^(?:PR#\d+|ADR-\d{3})$/;

const isSensitive = (text: string) => SENSITIVE_PATTERNS.some((re) => re.test(text));

/**
 * A PR title may name an ADR. Naming an internal one exposes an internal decision, so the
 * PR is dropped, except where the mention is only a relation ("supersedes ADR-002").
 */
function namesInternalAdr(title: string): boolean {
  const stripped = title.replace(/\b(?:supersedes|superseded by|amends|extends)\s+ADR-\d{3}/gi, "");
  const mentioned = stripped.match(/ADR-(\d{3})/g) ?? [];
  return mentioned.some((m) => !PUBLIC_ADR_NUMBERS.includes(m.slice(4)));
}

function prNumber(event: EvolutionEvent): number | null {
  const ref = event.references.find((r) => /^PR#\d+$/.test(r));
  return ref ? Number(ref.slice(3)) : null;
}

/** "ADR-006: ADR-006 — Title" (archive form) -> "ADR-006: Title". */
function cleanAdrTitle(title: string): string {
  return title.replace(/^(ADR-\d{3}):\s*ADR-\d{3}\s*[—-]\s*/, "$1: ");
}

function publicCopy(event: EvolutionEvent, title: string, summary: string): EvolutionEvent {
  return {
    id: event.id,
    type: event.type,
    date: event.date,
    title,
    summary,
    references: event.references.filter((r) => PUBLIC_REFERENCE.test(r)),
    division: null,
    product: null,
    outcome: "",
  };
}

function toPublic(event: EvolutionEvent): EvolutionEvent | null {
  if (EXCLUDED_TYPES.includes(event.type) || !INCLUDED_TYPES.includes(event.type)) return null;
  if (event.references.some((ref) => BLOCKED_REFERENCES.some((re) => re.test(ref)))) return null;

  // ADR and milestone events are republished with curated wording, so only their raw title
  // must be clean. Every other event is scanned in full (title, summary, outcome).
  const curated = event.type === "adr_added" || event.type === "milestone_shipped";
  if (isSensitive(curated ? event.title : `${event.title}\n${event.summary}\n${event.outcome}`)) return null;

  switch (event.type) {
    case "adr_added": {
      const num = event.id.match(/^EVT-adr-(\d{3})$/)?.[1];
      const summary = num ? PUBLIC_ADR_SUMMARIES[num] : undefined;
      if (!num || !PUBLIC_ADR_NUMBERS.includes(num) || !summary) return null;
      return publicCopy(event, cleanAdrTitle(event.title), summary);
    }
    case "milestone_shipped": {
      const curated = PUBLIC_MILESTONES[event.id];
      return curated ? publicCopy(event, curated.title, curated.summary) : null;
    }
    case "pr_merged": {
      const n = prNumber(event);
      if (n === null || !PUBLIC_PR_NUMBERS.includes(n) || namesInternalAdr(event.title)) return null;
      return publicCopy(event, event.title, `Merged as pull request #${n}.`);
    }
    case "scene_registered": {
      // Only scenes the archive records as public; the outcome is already scanned for internal visibility.
      if (!/visibility=(?:public|public_safe_demo)(?:;|$)/.test(event.outcome)) return null;
      return publicCopy(event, event.title, event.summary);
    }
    default:
      return null;
  }
}

/** The public-safe subset of the archive's events, in the input order. Never throws. */
export function filterForPublic(events: readonly EvolutionEvent[]): EvolutionEvent[] {
  const out: EvolutionEvent[] = [];
  for (const event of events) {
    try {
      const safe = toPublic(event);
      if (safe) out.push(safe);
    } catch {
      // A malformed event is dropped, never passed through.
    }
  }
  return out;
}
