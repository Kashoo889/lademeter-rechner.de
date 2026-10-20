import { describe, expect, it } from "vitest";
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
