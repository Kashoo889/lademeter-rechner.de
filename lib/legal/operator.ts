/**
 * ============================================================================
 *  OPERATOR DATA – MUST BE COMPLETED BY THE SITE OPERATOR BEFORE LAUNCH
 * ============================================================================
 *
 * The legal pages (Impressum, Datenschutzerklärung, Kontakt, Über uns, …)
 * are generated from this file. Nothing here may be invented: every `null`
 * must be replaced with real, verified data by the operator.
 *
 * As long as a required field is `null` or `legalReview.reviewed` is false,
 * the affected pages show a clearly visible "unvollständig" notice and are
 * set to `noindex`, and `npm run check:launch` reports what is missing.
 *
 * Legal background (as of 10/2026, no legal advice):
 * - § 5 DDG: name and "ladungsfähige Anschrift" (street address, no PO box);
 *   for legal entities also legal form and authorised representative(s);
 *   e-mail plus a further means of fast, direct communication (phone or a
 *   working contact form); register entry and VAT ID / business ID if any.
 *   A site with advertising income is a "geschäftsmäßiger" digital service
 *   even when run by a private individual.
 * - § 18 Abs. 2 MStV: if applicable, the editorially responsible person must
 *   have permanent residence in Germany. Applicability and the appointment
 *   therefore need professional review for an operator established abroad.
 * - Art. 13 DSGVO: identity and contact details of the controller.
 * - Art. 27 DSGVO: a controller outside the EU/EEA may need a written EU
 *   representative when Art. 3(2) applies. Do not claim an exemption without
 *   a documented professional assessment.
 */

export type OperatorConfig = {
  /** "person" = natural person (Einzelperson/Einzelunternehmen), "company" = juristische Person/Personengesellschaft. */
  kind: "person" | "company" | null;
  /** Full name of the natural person, or the company name incl. legal form (e.g. "Muster GmbH"). */
  name: string | null;
  /** Companies only: authorised representative(s), e.g. "Geschäftsführer: Max Muster". */
  representatives: string | null;
  /** Straße und Hausnummer (bzw. Plot-/Hausnummer). null = nicht angegeben; nichts erfinden. */
  street: string | null;
  /**
   * Weitere bestätigte Adresszeilen vor PLZ und Ort, z. B. Gebäudename und Ortsteil/Siedlung.
   * Sie werden genau so ausgegeben, wie sie bestätigt wurden.
   */
  addressLines: string[];
  /**
   * Erst auf true setzen, wenn der Betreiber bestätigt hat, dass die Adresszeilen auch ohne Straße und
   * Hausnummer eine vollständige, für Post und Zustellungen ausreichende Anschrift sind (z. B. weil der
   * Gebäudename im Zustellgebiet eindeutig ist). Solange `street` fehlt und dies false ist, bleibt die
   * Anschrift als „nicht vollständig bestätigt“ markiert (gelber Hinweis, noindex).
   */
  addressComplete: boolean;
  postalCode: string | null;
  city: string | null;
  /** Provinz/Bundesland, wird hinter dem Ort ausgegeben (z. B. "Punjab"). */
  region: string | null;
  country: string;
  email: string | null;
  /** Phone number; optional if a working contact form is offered as second channel. */
  phone: string | null;
  /** Commercial register, e.g. "Amtsgericht Hamburg, HRB 12345" (only if registered). */
  register: string | null;
  /** USt-IdNr. (§ 27a UStG) or Wirtschafts-IdNr. (§ 139c AO) – only if one has been issued. */
  vatId: string | null;
  /** § 18 Abs. 2 MStV – if applicable, a person with permanent residence in Germany. */
  editorialResponsible: { name: string; address: string } | null;
  /** Reviewed decision whether § 18 Abs. 2 MStV applies to this foreign-established operator. */
  editorialResponsibilityReview: { applies: boolean; reviewedAt: string; reviewer: string } | null;
  /** Exact, reviewed statement on participation in consumer dispute resolution. */
  consumerDisputeStatement: string | null;
  /** Optional authority named after jurisdiction has been professionally determined. */
  supervisoryAuthority: { name: string; url: string } | null;
  /** Representative in the EU under Art. 27 DSGVO, if required. */
  euRepresentative: { name: string; address: string; email: string } | null;
  /** Documented professional conclusion that the Art. 27(2) exemption applies. */
  euRepresentativeExemption: { reason: string; reviewedAt: string; reviewer: string } | null;
  /** Public "Über uns" information (who is behind the site, relevant experience). Optional but strongly recommended for E-E-A-T. */
  about: { authorName: string | null; bio: string | null };
  /** Hosting provider as actually contracted. Must be confirmed once the deployment exists. */
  hosting: {
    provider: string | null;
    privacyPolicyUrl: string | null;
    dpaUrl: string | null;
    subprocessorsUrl: string | null;
    runtimeLogsUrl: string | null;
    /** Set to true once the hosting contract (incl. DPA) is concluded and matches this description. */
    confirmed: boolean;
  };
  /** Set by the operator after a lawyer / legal-text service has reviewed the legal pages. */
  legalReview: { reviewed: boolean; reviewedAt: string | null; reviewer: string | null };
};

export const operator: OperatorConfig = {
  kind: "person",
  name: "Muhammad Kashif",
  representatives: null,
  // Bestätigte Anschrift (21.10.2026): Israr Boys Hostel, Nashiman Iqbal Phase 1, Lahore, Punjab 54000, Pakistan.
  // Straße und Hausnummer wurden NICHT genannt und dürfen nicht ergänzt werden, solange sie nicht bestätigt sind.
  street: null,
  addressLines: ["Israr Boys Hostel", "Nashiman Iqbal Phase 1"],
  addressComplete: false,
  postalCode: "54000",
  city: "Lahore",
  region: "Punjab",
  country: "Pakistan",
  email: "mkashifshah10@gmail.com",
  phone: null,
  register: null,
  vatId: null,
  editorialResponsible: null,
  editorialResponsibilityReview: null,
  consumerDisputeStatement: null,
  supervisoryAuthority: null,
  euRepresentative: null,
  euRepresentativeExemption: null,
  about: { authorName: "Muhammad Kashif", bio: null },
  hosting: {
    provider: "Vercel Inc.",
    privacyPolicyUrl: "https://vercel.com/legal/privacy-notice",
    dpaUrl: "https://vercel.com/legal/dpa",
    subprocessorsUrl: "https://vercel.com/legal/sub-processors",
    runtimeLogsUrl: "https://vercel.com/docs/logs/runtime",
    confirmed: false,
  },
  legalReview: { reviewed: false, reviewedAt: null, reviewer: null },
};

export type MissingItem = { field: string; label: string };

/** Lists the mandatory operator details that are still missing. */
export function getMissingOperatorFields(config: OperatorConfig = operator): MissingItem[] {
  const missing: MissingItem[] = [];
  if (!config.kind) missing.push({ field: "kind", label: "Art des Betreibers (Privatperson/Einzelunternehmen oder Gesellschaft)" });
  if (!config.name) missing.push({ field: "name", label: "Vollständiger Name bzw. Firma inkl. Rechtsform" });
  if (config.kind === "company" && !config.representatives)
    missing.push({ field: "representatives", label: "Vertretungsberechtigte Person(en)" });
  if (!config.street && config.addressLines.length === 0) {
    missing.push({ field: "street", label: "Straße und Hausnummer (ladungsfähige Anschrift, kein Postfach)" });
  } else if (!config.street && !config.addressComplete) {
    missing.push({
      field: "street",
      label: `Anschrift: Straße und Hausnummer (bzw. Plot-/Hausnummer) ergänzen oder bestätigen, dass „${config.addressLines.join(", ")}“ für Post und Zustellungen ausreicht`,
    });
  }
  if (!config.postalCode) missing.push({ field: "postalCode", label: "Postleitzahl" });
  if (!config.city) missing.push({ field: "city", label: "Ort" });
  if (!config.email) missing.push({ field: "email", label: "E-Mail-Adresse" });
  if (!config.phone && !contactFormConfigured())
    missing.push({
      field: "phone",
      label: "Zweiter schneller Kontaktweg: Telefonnummer oder funktionierendes Kontaktformular (Mail-Versand konfigurieren)",
    });
  if (config.country !== "Deutschland" && !config.editorialResponsibilityReview)
    missing.push({
      field: "editorialResponsibilityReview",
      label: "Rechtlich prüfen, ob § 18 Abs. 2 MStV anwendbar ist; falls ja, verantwortliche Person mit ständigem Aufenthalt in Deutschland benennen",
    });
  if (config.editorialResponsibilityReview?.applies && !config.editorialResponsible)
    missing.push({ field: "editorialResponsible", label: "Redaktionell verantwortliche Person mit ständigem Aufenthalt in Deutschland" });
  if (config.country === "Pakistan" && !config.euRepresentative && !config.euRepresentativeExemption)
    missing.push({
      field: "euRepresentative",
      label: "EU-Vertretung nach Art. 27 DSGVO benennen oder eine fachlich geprüfte Ausnahme nach Art. 27 Abs. 2 dokumentieren",
    });
  if (!config.consumerDisputeStatement)
    missing.push({ field: "consumerDisputeStatement", label: "Geprüfte Erklärung zur Verbraucherstreitbeilegung" });
  if (!config.hosting.provider || !config.hosting.privacyPolicyUrl || !config.hosting.dpaUrl || !config.hosting.confirmed)
    missing.push({
      field: "hosting.confirmed",
      label: "Vercel-Tarif, Vertrags-/DPA-Geltung, Kontoeinstellungen, Verarbeitungsorte und Log-Aufbewahrung des tatsächlichen Deployments bestätigen",
    });
  return missing;
}

/**
 * True when the contact form can actually deliver messages (see app/api/kontakt/route.ts):
 * needs the Resend API key and the operator e-mail address as recipient.
 */
export function contactFormConfigured(config: OperatorConfig = operator): boolean {
  return Boolean(process.env.RESEND_API_KEY && config.email);
}

export function isLegalReviewed(config: OperatorConfig = operator): boolean {
  return config.legalReview.reviewed;
}

/** Legal pages are "complete" only with all mandatory data AND a recorded legal review. */
export function isLegalComplete(config: OperatorConfig = operator): boolean {
  return getMissingOperatorFields(config).length === 0 && isLegalReviewed(config);
}

/**
 * Anschrift als Zeilenliste in deutscher Schreibweise: Zeilen vor der PLZ, "PLZ Ort, Region", Land.
 * Gibt null zurück, solange weder Straße noch bestätigte Adresszeilen oder PLZ/Ort vorliegen.
 */
export function formatAddressLines(config: OperatorConfig = operator): string[] | null {
  const lines = [config.street, ...config.addressLines].filter((line): line is string => Boolean(line));
  if (lines.length === 0 || !config.postalCode || !config.city) return null;
  const place = [`${config.postalCode} ${config.city}`, config.region].filter(Boolean).join(", ");
  return [...lines, place, config.country];
}
