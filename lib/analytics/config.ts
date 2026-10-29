/**
 * Cookiefreie Reichweitenmessung (Plausible Analytics). Standardmäßig AUS.
 *
 * Aktivierung: NEXT_PUBLIC_PLAUSIBLE_DOMAIN auf die in Plausible angelegte Domain setzen (z. B. lademeter-rechner.de).
 * Optional NEXT_PUBLIC_PLAUSIBLE_SRC mit der Script-Adresse aus dem Plausible-Konto (https://...), sonst die
 * Standardadresse. Ohne Domain wird nichts geladen und die Datenschutzerklärung nennt keine Messung.
 */
const domainRaw = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim() || null;
const srcRaw = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC?.trim() || null;

export const plausibleDomain = domainRaw && /^[a-z0-9]([a-z0-9.-]*[a-z0-9])?\.[a-z]{2,}$/i.test(domainRaw) ? domainRaw : null;
export const plausibleSrc = srcRaw && /^https:\/\/[^\s"'<>]+$/.test(srcRaw) ? srcRaw : "https://plausible.io/js/script.js";
export const analyticsActive = Boolean(plausibleDomain);
