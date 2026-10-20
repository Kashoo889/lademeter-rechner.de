"use client";

type CmpProvider = "google" | "usercentrics" | "cookiebot";

declare global {
  interface Window {
    Cookiebot?: { renew?: () => void };
    __ucCmp?: { showSecondLayer?: () => void };
    UC_UI?: { showSecondLayer?: () => void };
    googlefc?: { callbackQueue?: unknown[]; showRevocationMessage?: () => void };
  }
}

/**
 * Re-opens the consent dialog so users can change or withdraw their consent
 * as easily as they gave it (Art. 7 Abs. 3 DSGVO). Rendered only when a CMP
 * is configured.
 */
export function ConsentSettingsButton({
  provider,
  className,
  label = "Cookie-Einstellungen",
}: {
  provider: CmpProvider | null;
  className?: string;
  label?: string;
}) {
  if (!provider) return null;

  function open() {
    if (provider === "cookiebot") {
      window.Cookiebot?.renew?.();
    } else if (provider === "usercentrics") {
      // CMP v3 API, with the v2 API as fallback.
      if (window.__ucCmp?.showSecondLayer) window.__ucCmp.showSecondLayer();
      else window.UC_UI?.showSecondLayer?.();
    } else if (provider === "google") {
      window.googlefc = window.googlefc || {};
      window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
      window.googlefc.callbackQueue.push(() => window.googlefc?.showRevocationMessage?.());
    }
  }

  return (
    <button type="button" onClick={open} className={className}>
      {label}
    </button>
  );
}
