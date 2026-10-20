/**
 * Build-time configuration of consent management, analytics and advertising.
 *
 * Safety rules enforced here (not just documented):
 * - Google Analytics and AdSense can only be activated when a consent
 *   management platform (CMP) is configured. Without a CMP nothing is loaded.
 * - AdSense additionally requires NEXT_PUBLIC_ADSENSE_ENABLED="true" and a
 *   syntactically valid publisher ID (ca-pub-0000000000000000).
 *
 * Supported CMPs (all IAB TCF v2.x integrations that appear on Google's list
 * of certified CMPs at the time of writing - verify the current list at
 * https://support.google.com/adsense/answer/13554116 before going live):
 * - "google":       Google "Datenschutz & Mitteilungen" (Privacy & messaging)
 *                   configured in the AdSense account; served via the AdSense tag.
 * - "usercentrics": Usercentrics CMP v3 (needs NEXT_PUBLIC_CMP_ID = settings ID).
 * - "cookiebot":    Cookiebot by Usercentrics (needs NEXT_PUBLIC_CMP_ID = domain group ID).
 */

export type CmpProvider = "google" | "usercentrics" | "cookiebot";

const PUBLISHER_ID_PATTERN = /^ca-pub-\d{16}$/;
const GA_ID_PATTERN = /^G-[A-Z0-9]{4,}$/;

function readProvider(): CmpProvider | null {
  const value = process.env.NEXT_PUBLIC_CMP_PROVIDER?.trim().toLowerCase();
  return value === "google" || value === "usercentrics" || value === "cookiebot" ? value : null;
}

const cmpProvider = readProvider();
const cmpId = process.env.NEXT_PUBLIC_CMP_ID?.trim() || null;
const adsenseClientRaw = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || null;
const gaIdRaw = process.env.NEXT_PUBLIC_GA_ID?.trim() || null;
const adsRequested = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

/** A CMP counts as configured when the provider is known and (if required) its ID is set. */
const cmpConfigured =
  cmpProvider === "google"
    ? Boolean(adsRequested && adsenseClientRaw && PUBLISHER_ID_PATTERN.test(adsenseClientRaw))
    : cmpProvider !== null && Boolean(cmpId);

export const adsenseClient = adsenseClientRaw && PUBLISHER_ID_PATTERN.test(adsenseClientRaw) ? adsenseClientRaw : null;

export const consentConfig = {
  cmpProvider: cmpConfigured ? cmpProvider : null,
  cmpId: cmpConfigured ? cmpId : null,
  /** TCF framework attribute for Cookiebot (check Cookiebot docs for the current value). */
  cookiebotFramework: process.env.NEXT_PUBLIC_COOKIEBOT_FRAMEWORK?.trim() || "TCFv2.2",
  gaId: cmpConfigured && gaIdRaw && GA_ID_PATTERN.test(gaIdRaw) ? gaIdRaw : null,
  adsenseClient,
  adsEnabled: cmpConfigured && adsRequested && adsenseClient !== null,
  /** Ad unit IDs per placement (numeric data-ad-slot values from the AdSense account). */
  adSlots: {
    "section-break": process.env.NEXT_PUBLIC_ADSENSE_SLOT_SECTION ?? null,
    "article-intro": process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_INTRO ?? null,
    "article-end": process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_END ?? null,
  } as Record<string, string | null>,
} as const;

/** True when any consent-requiring Google service is active. */
export const googleServicesActive = Boolean(consentConfig.gaId || consentConfig.adsEnabled);

/** Human-readable status used by the launch-readiness check and legal pages. */
export function describeConsentSetup() {
  return {
    cmpProvider,
    cmpConfigured,
    analyticsActive: Boolean(consentConfig.gaId),
    adsActive: consentConfig.adsEnabled,
    gaIdIgnoredWithoutCmp: Boolean(gaIdRaw) && !cmpConfigured,
    adsIgnoredWithoutCmp: adsRequested && !cmpConfigured,
  };
}
