import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatAddressLines, operator, publicAddressLines } from "@/lib/legal/operator";
import { legalNoindex, missingFor } from "@/lib/legal/pages";

describe("public legal pages", () => {
  // The contact form counts as second contact channel only when the mail service is configured (as in production).
  beforeEach(() => vi.stubEnv("RESEND_API_KEY", "test-key"));
  afterEach(() => vi.unstubAllEnvs());

  it("does not publish the address while the operator withholds it, but keeps it stored", () => {
    expect(operator.publishAddress).toBe(false);
    expect(publicAddressLines(operator)).toBeNull();
    expect(formatAddressLines(operator)).not.toBeNull();
    expect(publicAddressLines({ ...operator, publishAddress: true })).toEqual(formatAddressLines(operator));
  });

  it("shows no street warning on the public Impressum when the address is withheld", () => {
    expect(missingFor("impressum").map((item) => item.field)).not.toContain("street");
    expect(legalNoindex("impressum")).toBe(false);
  });

  it("keeps the Datenschutz noindex while Art. 27 DSGVO and hosting remain open", () => {
    const fields = missingFor("datenschutz").map((item) => item.field);
    expect(fields).toEqual(expect.arrayContaining(["euRepresentative", "hosting.confirmed"]));
    expect(legalNoindex("datenschutz")).toBe(true);
  });

  it("keeps the non-legal info pages indexable", () => {
    expect(legalNoindex("cookies")).toBe(false);
    expect(legalNoindex("haftungsausschluss")).toBe(false);
    expect(legalNoindex("nutzungsbedingungen")).toBe(false);
  });
});
