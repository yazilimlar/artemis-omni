import { NextResponse } from "next/server";

export const runtime = "nodejs";

type PilotRequestPayload = {
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

type SquarespaceContact = {
  id?: string;
  firstName?: string;
  lastName?: string;
  primaryEmail?: {
    email?: string;
  };
};

type SquarespaceContactResponse = {
  contact?: SquarespaceContact;
};

type SquarespaceQueryResponse = {
  contacts?: SquarespaceContact[];
};

const maxBodyBytes = 12_000;
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

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > maxBodyBytes) {
    return jsonError("Pilot request is too large.", 413);
  }

  const apiKey = process.env.SQUARESPACE_API_KEY;
  if (!apiKey) {
    return jsonError("Pilot intake backend is not configured yet.", 503);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Submit the request as JSON.", 400);
  }

  if (hasHoneypot(body)) {
    return NextResponse.json({ ok: true, requestId: "received" });
  }

  const parsed = parsePilotRequest(body);
  if (!parsed.ok) {
    return jsonError(parsed.error, 400);
  }

  try {
    const result = await syncSquarespaceContact(parsed.payload, apiKey);

    return NextResponse.json({
      ok: true,
      requestId: result.contactId,
      status: result.status,
    });
  } catch (error) {
    const status = error instanceof SquarespaceError ? error.status : 502;
    console.error("pilot_intake_squarespace_error", {
      status,
      message: error instanceof Error ? error.message : "Unknown Squarespace error",
    });

    return jsonError("Pilot intake could not save the request. Please try again.", status);
  }
}

function parsePilotRequest(body: unknown):
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

function cleanField(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim().slice(0, maxFieldLength);
}

function hasHoneypot(body: unknown) {
  return Boolean(
    body &&
      typeof body === "object" &&
      "website" in body &&
      cleanField((body as Record<string, unknown>).website),
  );
}

async function syncSquarespaceContact(payload: PilotRequestPayload, apiKey: string) {
  const { firstName, lastName } = splitName(payload.name, payload.company);
  const contactBody = {
    firstName,
    lastName,
    locale: "en-US",
    primaryEmail: {
      email: payload.email,
      acceptsMarketing: false,
    },
  };

  const createResponse = await squarespaceRequest(
    "/v1/contacts",
    apiKey,
    {
      method: "POST",
      body: JSON.stringify(contactBody),
    },
    payload,
  );

  if (createResponse.status === 201) {
    const created = (await createResponse.json()) as SquarespaceContactResponse;
    return {
      contactId: created.contact?.id ?? "created",
      status: "created",
    };
  }

  if (createResponse.status === 409) {
    const existing = await findSquarespaceContact(payload.email, apiKey, payload);
    return {
      contactId: existing?.id ?? "existing",
      status: "existing",
    };
  }

  throw await squarespaceError(createResponse);
}

async function findSquarespaceContact(
  email: string,
  apiKey: string,
  payload: PilotRequestPayload,
) {
  const queryResponse = await squarespaceRequest(
    "/v1/contacts/query",
    apiKey,
    {
      method: "POST",
      body: JSON.stringify({
        searchString: email,
        pageSize: 10,
        sortField: "EMAIL",
        sortDirection: "ASCENDING",
      }),
    },
    payload,
  );

  if (!queryResponse.ok) {
    throw await squarespaceError(queryResponse);
  }

  const query = (await queryResponse.json()) as SquarespaceQueryResponse;
  return query.contacts?.find(
    (contact) => contact.primaryEmail?.email?.toLowerCase() === email.toLowerCase(),
  );
}

async function squarespaceRequest(
  path: string,
  apiKey: string,
  init: RequestInit,
  payload: PilotRequestPayload,
) {
  return fetch(`https://api.squarespace.com${path}`, {
    ...init,
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey(payload),
      "User-Agent": "Artemis Omni pilot intake (artemis.agoraxai.com)",
      ...init.headers,
    },
  });
}

async function squarespaceError(response: Response) {
  let message = `Squarespace returned ${response.status}`;
  try {
    const body = (await response.json()) as { message?: string; type?: string; subtype?: string };
    message = [body.type, body.subtype, body.message].filter(Boolean).join(": ") || message;
  } catch {
    // Ignore non-JSON Squarespace errors; status still carries the signal.
  }

  return new SquarespaceError(message, response.status);
}

function splitName(name: string, company: string) {
  const parts = name.split(" ").filter(Boolean);
  const firstName = parts[0] ?? "Pilot";
  const lastName = parts.slice(1).join(" ") || company || "Request";

  return {
    firstName: firstName.slice(0, 50),
    lastName: lastName.slice(0, 50),
  };
}

function idempotencyKey(payload: PilotRequestPayload) {
  const source = [
    payload.email.toLowerCase(),
    payload.company.toLowerCase(),
    payload.module.toLowerCase(),
    new Date().toISOString().slice(0, 10),
  ].join(":");

  let hash = 0;
  for (let index = 0; index < source.length; index += 1) {
    hash = Math.imul(31, hash) + source.charCodeAt(index);
  }

  return `pilot-${Math.abs(hash)}`;
}

function jsonError(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

class SquarespaceError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "SquarespaceError";
  }
}
