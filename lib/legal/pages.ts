import { getMissingOperatorFields, operator, type MissingItem } from "@/lib/legal/operator";

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
  // Eine bewusst nicht veröffentlichte Anschrift steht weiter in check:launch, wird aber nicht als Warnhinweis
  // auf den öffentlichen Seiten angezeigt.
  const all = getMissingOperatorFields(operator).filter((item) => operator.publishAddress || item.field !== "street");
  if (page === "impressum") return all.filter((item) => IMPRESSUM_FIELDS.has(item.field));
  if (page === "datenschutz") return all.filter((item) => PRIVACY_FIELDS.has(item.field));
  return [];
}

/**
 * Legal pages (Impressum, Datenschutz) stay noindex while mandatory operator data that is
 * shown as missing is still open. The recorded legal review does not block indexing.
 * Completed legal and disclosure pages (Cookies, Haftungsausschluss, Nutzungsbedingungen)
 * are indexable.
 */
export function legalNoindex(page: LegalPageRoute): boolean {
  if (page === "impressum" || page === "datenschutz") {
    return missingFor(page).length > 0;
  }
  return false;
}
