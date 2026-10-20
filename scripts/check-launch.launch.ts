import { describe, expect, it } from "vitest";
import { describeConsentSetup } from "@/lib/consent/config";
import { getMissingOperatorFields, isLegalReviewed, operator } from "@/lib/legal/operator";

/**
 * Pre-launch checklist: `npm run check:launch`.
 * Every failing test names something that must be done before the site is
 * published. This is deliberately NOT part of `npm test`.
 */

describe("Betreiberangaben (Impressum, Datenschutz, Kontakt)", () => {
  const missing = getMissingOperatorFields(operator);
  it("alle Pflichtangaben in lib/legal/operator.ts sind ausgefüllt", () => {
    expect(missing.map((item) => item.label)).toEqual([]);
  });
  it("die Rechtstexte wurden rechtlich geprüft (operator.legalReview.reviewed)", () => {
    expect(isLegalReviewed(operator)).toBe(true);
  });
});

describe("Einwilligung und Werbung", () => {
  const status = describeConsentSetup();
  it("GA-ID ohne CMP wird nicht geladen (nur Warnung)", () => {
    expect(status.gaIdIgnoredWithoutCmp).toBe(false);
  });
  it("AdSense ohne CMP wird nicht geladen (nur Warnung)", () => {
    expect(status.adsIgnoredWithoutCmp).toBe(false);
  });
  it("wenn Werbung aktiv ist, ist eine zertifizierte CMP konfiguriert", () => {
    expect(!status.adsActive || status.cmpConfigured).toBe(true);
  });
});
