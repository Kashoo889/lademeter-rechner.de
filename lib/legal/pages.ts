import { getMissingOperatorFields, isLegalReviewed, operator, type MissingItem } from "@/lib/legal/operator";

/** Last substantive change of the legal texts (shown as "Stand"). */
export const LEGAL_TEXTS_UPDATED = "2026-10-20";

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

export function missingFor(page: "impressum" | "datenschutz" | "general"): MissingItem[] {
  const all = getMissingOperatorFields(operator);
  if (page === "impressum") return all.filter((item) => IMPRESSUM_FIELDS.has(item.field));
  if (page === "datenschutz") return all.filter((item) => PRIVACY_FIELDS.has(item.field));
  return all.filter((item) => ["name", "street", "postalCode", "city", "email"].includes(item.field));
}

/** Legal pages stay noindex until complete and reviewed. */
export function legalNoindex(page: "impressum" | "datenschutz" | "general"): boolean {
  return missingFor(page).length > 0 || !isLegalReviewed(operator);
}
