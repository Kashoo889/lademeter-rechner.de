import { describe, expect, it } from "vitest";
import { CONTACT_LIMITS, looksLikeSpam, validateContact, type ContactPayload } from "./contact";

const valid: ContactPayload = {
  name: "Max Mustermann",
  email: "max@example.de",
  subject: "Frage zur Berechnung",
  message: "Das ist eine ausreichend lange Nachricht.",
  website: "",
  elapsedMs: 5000,
  privacyAcknowledged: true,
};

describe("contact validation", () => {
  it("accepts a complete, plausible request", () => {
    expect(validateContact(valid)).toEqual({});
    expect(looksLikeSpam(valid)).toBe(false);
  });

  it("rejects missing identity, invalid mail, short text and missing acknowledgement", () => {
    expect(validateContact({ name: " ", email: "invalid", message: "kurz" })).toEqual({
      name: expect.any(String),
      email: expect.any(String),
      message: expect.any(String),
      privacyAcknowledged: expect.any(String),
    });
  });

  it("enforces the message length limit", () => {
    expect(validateContact({ ...valid, message: "x".repeat(CONTACT_LIMITS.message + 1) }).message).toContain(
      String(CONTACT_LIMITS.message),
    );
  });

  it("identifies the honeypot and implausibly fast submissions", () => {
    expect(looksLikeSpam({ ...valid, website: "https://spam.example" })).toBe(true);
    expect(looksLikeSpam({ ...valid, elapsedMs: 2999 })).toBe(true);
    expect(looksLikeSpam({ ...valid, elapsedMs: undefined })).toBe(true);
  });
});
