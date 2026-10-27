import { getMissingOperatorFields, isLegalReviewed, operator, type MissingItem } from "@/lib/legal/operator";

/** Last substantive change of the legal texts (shown as "Stand"). */
export const LEGAL_TEXTS_UPDATED = "2026-10-28";

const IMPRESSUM_FIELDS = new Set([
  "kind",
  "name",
  "representatives",
  "street",
  "postalCode",
  "city",
  "email",
  "phone",
  "editorialResponsible",
  "editorialResponsibilityReview",
  "consumerDisputeStatement",
]);

const PRIVACY_FIELDS = new Set([
  "kind",
  "name",
  "street",
  "postalCode",
  "city",
  "email",
  "phone",
  "euRepresentative",
  "hosting.confirmed",
]);

export type LegalPageRoute = "impressum" | "datenschutz" | "general" | "cookies" | "haftungsausschluss" | "nutzungsbedingungen";

export function missingFor(page: LegalPageRoute): MissingItem[] {
  const all = getMissingOperatorFields(operator);
  if (page === "impressum") return all.filter((item) => IMPRESSUM_FIELDS.has(item.field));
  if (page === "datenschutz") return all.filter((item) => PRIVACY_FIELDS.has(item.field));
  return [];
}

/**
 * Genuinely incomplete legal pages (Impressum, Datenschutz) stay noindex until
 * mandatory operator data is provided and legally reviewed.
 * Completed legal and disclosure pages (Cookies, Haftungsausschluss, Nutzungsbedingungen)
 * are indexable.
 */
export function legalNoindex(page: LegalPageRoute): boolean {
  if (page === "impressum" || page === "datenschutz") {
    return missingFor(page).length > 0 || !isLegalReviewed(operator);
  }
  return false;
}
