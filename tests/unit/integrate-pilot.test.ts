import { afterEach, describe, expect, it, vi } from "vitest";
import { shouldPlayVideo } from "@/components/home/HeroVideo";
import { ROLES, toPilotRequestPayload, validatePilotForm, type PilotFormValues } from "@/components/integrate/PilotForm";
import { POST } from "@/app/api/pilot-requests/route";

const valid: PilotFormValues = {
  name: "Ada Example",
  email: "ada@example.com",
  company: "Example Civil",
  role: "Project Controls Manager",
  workflow: "Monthly forecast vs. actuals reconciliation for the paving program.",
  website: "",
};

describe("HeroVideo playback gate", () => {
  it("plays on a normal connection without reduced motion", () => {
    expect(shouldPlayVideo({ reducedMotion: false, effectiveType: "4g" })).toBe(true);
    expect(shouldPlayVideo({ reducedMotion: false })).toBe(true);
  });

  it("keeps the poster for reduced motion, save-data and slow networks", () => {
    expect(shouldPlayVideo({ reducedMotion: true })).toBe(false);
    expect(shouldPlayVideo({ reducedMotion: false, saveData: true })).toBe(false);
    for (const effectiveType of ["slow-2g", "2g", "3g"]) {
      expect(shouldPlayVideo({ reducedMotion: false, effectiveType })).toBe(false);
    }
  });
});

describe("PilotForm validation", () => {
  it("accepts a complete form", () => {
    expect(validatePilotForm(valid)).toBeNull();
  });

  it("rejects missing required fields, a bad email, and an unknown role", () => {
    expect(validatePilotForm({ ...valid, name: " " })).toMatch(/required/);
    expect(validatePilotForm({ ...valid, workflow: "" })).toMatch(/required/);
    expect(validatePilotForm({ ...valid, email: "not-an-email" })).toMatch(/valid work email/);
    expect(validatePilotForm({ ...valid, role: "Astronaut" })).toMatch(/role/);
  });

  it("offers exactly the briefed roles", () => {
    expect(ROLES).toEqual([
      "Executive / C-Suite",
      "Project Controls Manager",
      "CFO",
      "Civil / Structural Engineer",
      "General Contractor",
      "Other",
    ]);
  });
});

describe("existing /api/pilot-requests accepts the /integrate payload", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  const post = (body: unknown) =>
    POST(new Request("http://localhost/api/pilot-requests", { method: "POST", body: JSON.stringify(body) }));

  it("passes the route's validation (Squarespace mocked, no network)", async () => {
    vi.stubEnv("SQUARESPACE_API_KEY", "test-key-not-real");
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ contact: { id: "c-1" } }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await post(toPilotRequestPayload(valid));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, requestId: "c-1", status: "created" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const sent = JSON.parse(String((fetchMock.mock.calls[0] as unknown[])[1] && ((fetchMock.mock.calls[0] as unknown[])[1] as RequestInit).body));
    expect(sent.primaryEmail).toEqual({ email: "ada@example.com", acceptsMarketing: false });
  });

  it("is rejected by the route when a required field is missing", async () => {
    vi.stubEnv("SQUARESPACE_API_KEY", "test-key-not-real");
    vi.stubGlobal("fetch", vi.fn());
    const { painPoint: _omit, ...missing } = toPilotRequestPayload(valid);
    const response = await post(missing);
    expect(response.status).toBe(400);
  });

  it("returns 503 when the intake backend is not configured", async () => {
    vi.stubEnv("SQUARESPACE_API_KEY", "");
    const response = await post(toPilotRequestPayload(valid));
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ ok: false });
  });
});
