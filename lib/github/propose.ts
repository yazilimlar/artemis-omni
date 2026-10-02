import "server-only";
import { CST, Composer, Parser, isMap, isScalar, isSeq, parseDocument } from "yaml";
import { siteConfig } from "@/lib/site";
import type { ProposalField } from "./validate-proposal";

/**
 * Registry proposals via GitHub pull request (ADR-013). Server-only: the token
 * never reaches the browser. The app opens a PR and never writes main.
 */

const REPO = "yazilimlar/artemis-omni";
const REGISTRY_PATH = "ENGINEERING/PRODUCT_REGISTRY.yaml";
const API = "https://api.github.com";
export const TOKEN_ENV = "GITHUB_PROPOSAL_TOKEN";

export type RegistryEdit = {
  output: string;
  /** Previous value as a form string (YAML null becomes "null"). */
  oldValue: string;
  /** 1-based line number of the edited line. */
  line: number;
  changedLines: number;
};

function lineOf(source: string, offset: number): number {
  let line = 1;
  for (let i = 0; i < offset; i++) if (source.charCodeAt(i) === 10) line++;
  return line;
}

/**
 * Edits one field of one product through the yaml CST layer, so every other
 * byte of the file stays as it was. Throws unless the result differs from the
 * source on exactly one line, that line is the target field, and the edited
 * file re-parses to the intended value.
 */
export function applyRegistryEdit(
  source: string,
  productId: string,
  field: ProposalField,
  newValue: string,
): RegistryEdit {
  const tokens = [...new Parser().parse(source)];
  const docs = [...new Composer({ keepSourceTokens: true }).compose(tokens)];
  if (docs.length !== 1 || docs[0].errors.length > 0) {
    throw new Error("Registry YAML did not parse as a single valid document.");
  }

  const products = docs[0].get("products", true);
  if (!isSeq(products)) throw new Error("Registry has no products sequence.");
  const product = products.items.find((item) => isMap(item) && item.get("id") === productId);
  if (!isMap(product)) throw new Error(`Product "${productId}" is not in the registry on main.`);

  const pair = product.items.find((item) => isScalar(item.key) && item.key.value === field);
  if (!pair || !isScalar(pair.value) || !pair.value.srcToken || !pair.value.range) {
    throw new Error(
      `Product "${productId}" has no scalar "${field}" field; adding fields is a schema change.`,
    );
  }
  const current = pair.value.value;
  const oldValue = current === null ? "null" : String(current);
  if (oldValue === newValue) throw new Error(`${field} is already "${newValue}" on main.`);

  CST.setScalarValue(pair.value.srcToken as CST.FlowScalar, newValue);
  const output = tokens.map((token) => CST.stringify(token)).join("");

  // Guard (ADR-013): exactly one changed line, and it is the target field.
  const before = source.split("\n");
  const after = output.split("\n");
  const changed = before.flatMap((text, index) => (text === after[index] ? [] : [index]));
  const targetLine = lineOf(source, pair.value.range[0]);
  if (before.length !== after.length || changed.length !== 1 || changed[0] + 1 !== targetLine) {
    const detail = changed
      .slice(0, 5)
      .map((index) => `L${index + 1}: - ${before[index]} | + ${after[index]}`)
      .join("\n");
    throw new Error(
      `re-serialization would touch non-target lines (${changed.length} changed, line count ${before.length} -> ${after.length}):\n${detail}`,
    );
  }
  if (!after[changed[0]].trimStart().startsWith(`${field}:`)) {
    throw new Error(`Edited line is not the "${field}" field: ${after[changed[0]]}`);
  }

  // Guard: the edited file re-parses with the intended value.
  const reparsed = parseDocument(output);
  const check = reparsed.errors.length === 0 ? reparsed.get("products", true) : null;
  const checkProduct = isSeq(check)
    ? check.items.find((item) => isMap(item) && item.get("id") === productId)
    : null;
  // get(field, true) returns the scalar node; plain get() maps YAML null to undefined.
  const parsedNode = isMap(checkProduct) ? checkProduct.get(field, true) : undefined;
  const parsedValue = isScalar(parsedNode) ? parsedNode.value : undefined;
  const expected = newValue === "null" ? null : newValue;
  if (parsedValue !== expected) {
    throw new Error(`Edited registry re-parses to ${JSON.stringify(parsedValue)}, not ${JSON.stringify(expected)}.`);
  }

  return { output, oldValue, line: targetLine, changedLines: changed.length };
}

async function github<T>(token: string, path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "artemis-omni-proposals",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
    },
    cache: "no-store",
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${init?.method ?? "GET"} ${path} failed: ${response.status} ${body}`);
  }
  return (await response.json()) as T;
}

function compactTimestamp(date: Date): string {
  return date.toISOString().replace(/[-:T]/g, "").slice(0, 14);
}

export type ProposeParams = {
  userId: string;
  userRole: string;
  productId: string;
  field: ProposalField;
  newValue: string;
  reason: string;
};

export async function proposeRegistryChange(
  params: ProposeParams,
): Promise<{ prUrl: string; prNumber: number }> {
  if (params.userRole !== "owner") throw new Error("Only owner role can submit registry proposals.");
  const token = process.env[TOKEN_ENV];
  if (!token) throw new Error(`${TOKEN_ENV} is not configured.`);

  const userIdShort = params.userId.slice(0, 8);
  const branchPrefix = `proposal/${userIdShort}-${params.productId}-`;

  // a. main commit
  const ref = await github<{ object: { sha: string } }>(token, `/repos/${REPO}/git/ref/heads/main`);
  const commitSha = ref.object.sha;

  // b. registry at that commit
  const file = await github<{ content: string; sha: string }>(
    token,
    `/repos/${REPO}/contents/${REGISTRY_PATH}?ref=${commitSha}`,
  );
  const source = Buffer.from(file.content, "base64").toString("utf8");
  const blobSha = file.sha;

  // c. rate limit: one open proposal per user per product
  const open = await github<Array<{ head: { ref: string } }>>(
    token,
    `/repos/${REPO}/pulls?state=open&base=main&per_page=100`,
  );
  if (open.some((pr) => pr.head.ref.startsWith(branchPrefix))) {
    throw new Error("an open proposal for this product already exists");
  }

  // d. CST edit with the one-line guard
  const edit = applyRegistryEdit(source, params.productId, params.field, params.newValue);

  // e. branch from the commit that was read
  const submittedAt = new Date();
  const branch = `${branchPrefix}${compactTimestamp(submittedAt)}`;
  await github(token, `/repos/${REPO}/git/refs`, {
    method: "POST",
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: commitSha }),
  });

  // f. commit the file using the read-time blob SHA (stale writes fail)
  const title = `proposal: ${params.productId} ${params.field} -> ${params.newValue}`;
  await github(token, `/repos/${REPO}/contents/${REGISTRY_PATH}`, {
    method: "PUT",
    body: JSON.stringify({
      message: `${title}\n\nSubmitted from /control/propose by user ${userIdShort} (owner). ADR-013.`,
      content: Buffer.from(edit.output, "utf8").toString("base64"),
      branch,
      sha: blobSha,
    }),
  });

  // g. open the PR; a human reviews and merges it
  const body = [
    "Registry proposal submitted from the Artemis web app (ADR-013).",
    "",
    `- **Submitter:** user \`${userIdShort}\` (Supabase user id prefix; no email, the repository is public)`,
    "- **Role:** owner",
    `- **Submitted (UTC):** ${submittedAt.toISOString()}`,
    `- **Product:** \`${params.productId}\``,
    `- **Field:** \`${params.field}\`: \`${edit.oldValue}\` -> \`${params.newValue}\``,
    `- **Read-time blob SHA:** \`${blobSha}\` (main @ \`${commitSha.slice(0, 7)}\`)`,
    `- **Lines changed:** ${edit.changedLines} (line ${edit.line})`,
    `- **Source:** ${siteConfig.url}/control/propose`,
    "",
    "### Reason",
    "",
    params.reason
      .trim()
      .split("\n")
      .map((line) => `> ${line}`)
      .join("\n"),
    "",
    "> Note: Inline comments on the edited line may predate the change.",
  ].join("\n");
  const pr = await github<{ html_url: string; number: number }>(token, `/repos/${REPO}/pulls`, {
    method: "POST",
    body: JSON.stringify({ title, head: branch, base: "main", body, draft: false }),
  });

  return { prUrl: pr.html_url, prNumber: pr.number };
}
