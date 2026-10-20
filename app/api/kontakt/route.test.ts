import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST, _resetRateLimits } from "./route";

describe("POST /api/kontakt/", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, RESEND_API_KEY: "re_test_key_123" };
    _resetRateLimits();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
    _resetRateLimits();
    vi.restoreAllMocks();
  });

  function makeRequest(
    body: unknown,
    options: {
      contentType?: string;
      secFetchSite?: string;
      ip?: string;
    } = {},
  ) {
    const { contentType = "application/json", secFetchSite = "same-origin", ip = "127.0.0.1" } = options;
    const headers = new Headers();
    if (contentType) headers.set("content-type", contentType);
    if (secFetchSite) headers.set("sec-fetch-site", secFetchSite);
    headers.set("x-forwarded-for", ip);

    return new Request("https://lademeter-rechner.de/api/kontakt/", {
      method: "POST",
      headers,
      body: typeof body === "string" ? body : JSON.stringify(body),
    });
  }

  const validPayload = {
    name: "Max Mustermann",
    email: "max@example.com",
    subject: "Frage zur Berechnung",
    message: "Hallo, ich habe eine Frage zur Lademeter-Berechnung für Wechselbrücken.",
    website: "",
    elapsedMs: 5000,
    privacyAcknowledged: true,
  };

  it("returns 503 when RESEND_API_KEY is not configured", async () => {
    delete process.env.RESEND_API_KEY;
    const response = await POST(makeRequest(validPayload));
    expect(response.status).toBe(503);
    const data = await response.json();
    expect(data).toEqual({ ok: false, error: "not-configured" });
  });

  it("rejects non-JSON requests with 415", async () => {
    const response = await POST(makeRequest("plain text", { contentType: "text/plain" }));
    expect(response.status).toBe(415);
  });

  it("blocks cross-site requests with 403", async () => {
    const response = await POST(makeRequest(validPayload, { secFetchSite: "cross-site" }));
    expect(response.status).toBe(403);
  });

  it("handles malformed JSON with 400", async () => {
    const response = await POST(makeRequest("not json {", { contentType: "application/json" }));
    expect(response.status).toBe(400);
  });

  it("enforces validation on required fields and returns 422", async () => {
    const response = await POST(
      makeRequest({
        name: "A",
        email: "not-an-email",
        message: "short",
        privacyAcknowledged: false,
        elapsedMs: 5000,
      }),
    );
    expect(response.status).toBe(422);
    const data = await response.json();
    expect(data.ok).toBe(false);
    expect(data.fields).toHaveProperty("name");
    expect(data.fields).toHaveProperty("email");
    expect(data.fields).toHaveProperty("message");
    expect(data.fields).toHaveProperty("privacyAcknowledged");
  });

  it("silently swallows honeypot submissions (returns 200 without sending email)", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const response = await POST(makeRequest({ ...validPayload, website: "http://spambot.com" }));
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ ok: true });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("silently swallows submissions that are implausibly fast (< 3000ms)", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const response = await POST(makeRequest({ ...validPayload, elapsedMs: 1500 }));
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ ok: true });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("successfully delivers email via Resend and formats request correctly", async () => {
    let capturedUrl = "";
    let capturedInit: RequestInit | undefined;

    vi.spyOn(globalThis, "fetch").mockImplementation(async (url, init) => {
      capturedUrl = String(url);
      capturedInit = init;
      return new Response(JSON.stringify({ id: "resend_msg_123" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });

    const response = await POST(makeRequest(validPayload));
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ ok: true });

    expect(capturedUrl).toBe("https://api.resend.com/emails");
    expect(capturedInit?.method).toBe("POST");
    expect(capturedInit?.headers).toMatchObject({
      Authorization: "Bearer re_test_key_123",
      "Content-Type": "application/json",
    });

    const sentBody = JSON.parse(String(capturedInit?.body));
    expect(sentBody.to).toEqual(["mkashifshah10@gmail.com"]);
    expect(sentBody.reply_to).toBe("max@example.com");
    expect(sentBody.subject).toBe("[Kontakt lademeter-rechner.de] Frage zur Berechnung");
    expect(sentBody.text).toContain("Max Mustermann");
    expect(sentBody.html).toContain("Max Mustermann");
    expect(sentBody.html).toContain("max@example.com");
  });

  it("returns 502 when Resend API fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("Internal Server Error", { status: 500 }));

    const response = await POST(makeRequest(validPayload));
    expect(response.status).toBe(502);
    const data = await response.json();
    expect(data).toEqual({ ok: false, error: "delivery-failed" });
  });

  it("rate limits rapid submissions from the same IP with 429", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: "ok" }), { status: 200, headers: { "content-type": "application/json" } }),
    );

    const ip = "192.168.100.50";
    for (let i = 0; i < 5; i++) {
      const res = await POST(makeRequest(validPayload, { ip }));
      expect(res.status).toBe(200);
    }

    const rateLimitedRes = await POST(makeRequest(validPayload, { ip }));
    expect(rateLimitedRes.status).toBe(429);
    const data = await rateLimitedRes.json();
    expect(data).toEqual({ ok: false, error: "rate-limited" });
  });
});
