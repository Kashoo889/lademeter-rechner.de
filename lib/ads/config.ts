/**
 * Build-time AdSense configuration. Everything is OFF by default.
 *
 * Phase 1 (before approval): set NEXT_PUBLIC_ADSENSE_CLIENT only. This adds the
 *   AdSense verification meta tag and serves /ads.txt; no script is loaded and
 *   no ad is shown.
 * Phase 2 (after approval): also set NEXT_PUBLIC_ADSENSE_ENABLED="true" and the
 *   slot IDs. Only then the AdSense script is loaded. Consent for the EEA is
 *   handled by Google's own "Datenschutz & Mitteilungen" message, which must be
 *   published in the AdSense account before enabling (it is delivered through
 *   the AdSense script itself - no separate consent tool is needed).
 */

const PUBLISHER_ID_PATTERN = /^ca-pub-\d{16}$/;

const clientRaw = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || null;

export const adsenseClient = clientRaw && PUBLISHER_ID_PATTERN.test(clientRaw) ? clientRaw : null;

/** True only when ads are explicitly switched on AND a valid publisher ID exists. */
export const adsActive = Boolean(adsenseClient && process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true");

export type AdPlacement = "section-break" | "article-end";

/** Numeric data-ad-slot IDs from the AdSense account. Placements without an ID stay empty. */
export const adSlots: Record<AdPlacement, string | null> = {
  "section-break": process.env.NEXT_PUBLIC_ADSENSE_SLOT_SECTION?.trim() || null,
  "article-end": process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_END?.trim() || null,
};
