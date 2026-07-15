import { NextResponse } from "next/server";
import {
  hasPhoneNotificationChannel,
  loadPilotNotificationConfig,
  sendEmailNotification,
  sendPhoneNotifications,
} from "@/lib/pilot-intake/notifications";
import {
  hasHoneypot,
  parsePilotRequest,
  pilotRequestId,
  type PilotRequestPayload,
} from "@/lib/pilot-intake/payload";

export const runtime = "nodejs";

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

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > maxBodyBytes) {
    return jsonError("Pilot request is too large.", 413);
  }

  const squarespaceApiKey = process.env.SQUARESPACE_API_KEY;
  const notificationConfig = loadPilotNotificationConfig();
  if (!squarespaceApiKey || !notificationConfig.email || !hasPhoneNotificationChannel(notificationConfig)) {
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
    const requestId = pilotRequestId(parsed.payload);
    const receivedAt = new Date().toISOString();
    const contact = await syncSquarespaceContact(parsed.payload, squarespaceApiKey, requestId);

    await sendEmailNotification(
      parsed.payload,
      requestId,
      receivedAt,
      notificationConfig.email,
    );

    const phoneNotifications = await sendPhoneNotifications(
      parsed.payload,
      requestId,
      notificationConfig.twilio!,
    );
    if (phoneNotifications.sent.length === 0) {
      throw new NotificationError("All configured phone notification channels failed.", {
        failed: phoneNotifications.failed,
      });
    }
    if (phoneNotifications.failed.length > 0) {
      console.warn("pilot_intake_partial_phone_notification", {
        requestId,
        failed: phoneNotifications.failed,
      });
    }

    return NextResponse.json({
      ok: true,
      requestId,
      status: contact.status,
      notifications: {
        email: "sent",
        phone: phoneNotifications.sent,
      },
    });
  } catch (error) {
    const status = error instanceof SquarespaceError ? error.status : 502;
    console.error("pilot_intake_submission_error", {
      status,
      message: error instanceof Error ? error.message : "Unknown Squarespace error",
      detail: error instanceof NotificationError ? error.detail : undefined,
    });

    return jsonError("Pilot intake could not save and notify the team. Please try again.", status);
  }
}

async function syncSquarespaceContact(
  payload: PilotRequestPayload,
  apiKey: string,
  requestId: string,
) {
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
    requestId,
  );

  if (createResponse.status === 201) {
    const created = (await createResponse.json()) as SquarespaceContactResponse;
    return {
      contactId: created.contact?.id ?? "created",
      status: "created",
    };
  }

  if (createResponse.status === 409) {
    const existing = await findSquarespaceContact(payload.email, apiKey, requestId);
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
  requestId: string,
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
    requestId,
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
  requestId: string,
) {
  return fetch(`https://api.squarespace.com${path}`, {
    ...init,
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": requestId,
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

class NotificationError extends Error {
  constructor(
    message: string,
    readonly detail: unknown,
  ) {
    super(message);
    this.name = "NotificationError";
  }
}
