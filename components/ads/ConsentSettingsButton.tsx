"use client";

import { cn } from "@/lib/utils";

declare global {
  interface Window {
    googlefc?: {
      callbackQueue?: unknown[];
      showRevocationMessage?: () => void;
    };
  }
}

/**
 * Re-opens Google's consent message ("Datenschutzeinstellungen") so visitors can
 * change or withdraw their choice. Only rendered while ads are active.
 */
export function ConsentSettingsButton({ className }: { className?: string }) {
  function open() {
    const googlefc = (window.googlefc = window.googlefc || {});
    googlefc.callbackQueue = googlefc.callbackQueue || [];
    googlefc.callbackQueue.push({ CONSENT_DATA_READY: () => window.googlefc?.showRevocationMessage?.() });
    window.googlefc.showRevocationMessage?.();
  }

  return (
    <button type="button" onClick={open} className={cn("text-left", className)}>
      Datenschutzeinstellungen
    </button>
  );
}
