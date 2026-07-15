import { createHash } from "node:crypto";

export type PilotRequestPayload = {
  name: string;
  company: string;
  email: string;
  industry: string;
  currentSystems: string;
  painPoint: string;
  module: string;
  timeline: string;
  message: string;
  sourcePage: string;
};

const maxFieldLength = 1_200;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const requiredFields: Array<keyof PilotRequestPayload> = [
  "name",
  "company",
  "email",
  "industry",
  "currentSystems",
  "painPoint",
  "module",
  "timeline",
];

export function parsePilotRequest(body: unknown):
  | { ok: true; payload: PilotRequestPayload }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Submit a valid pilot request." };
  }

  const source = body as Record<string, unknown>;
  const payload: PilotRequestPayload = {
    name: cleanField(source.name),
    company: cleanField(source.company),
    email: cleanField(source.email).toLowerCase(),
    industry: cleanField(source.industry),
    currentSystems: cleanField(source.currentSystems),
    painPoint: cleanField(source.painPoint),
    module: cleanField(source.module),
    timeline: cleanField(source.timeline),
    message: cleanField(source.message),
    sourcePage: cleanField(source.sourcePage),
  };

  const missing = requiredFields.find((field) => !payload[field]);
  if (missing) {
    return { ok: false, error: "Complete all required fields." };
  }

  if (!emailPattern.test(payload.email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  return { ok: true, payload };
}

export function hasHoneypot(body: unknown) {
  return Boolean(
    body &&
      typeof body === "object" &&
      "website" in body &&
      cleanField((body as Record<string, unknown>).website),
  );
}

export function pilotRequestId(payload: PilotRequestPayload) {
  const canonical = JSON.stringify([
    payload.email,
    payload.company,
    payload.module,
    payload.timeline,
    payload.painPoint,
    payload.message,
  ]);
  const digest = createHash("sha256").update(canonical).digest("hex").slice(0, 16);
  return `pilot-${digest}`;
}

function cleanField(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim().slice(0, maxFieldLength);
}
