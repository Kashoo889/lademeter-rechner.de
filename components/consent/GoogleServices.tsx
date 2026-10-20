"use client";

import { useEffect } from "react";

type ConsentState = Record<string, string>;

type TcfData = {
  eventStatus?: string;
  gdprApplies?: boolean;
  purpose?: { consents?: Record<string | number, boolean> };
};

declare global {
  interface Window {
    __lrConsent?: ConsentState;
    __tcfapi?: (
      command: string,
      version: number,
      callback: (data: TcfData, success: boolean) => void,
    ) => void;
    gtag?: (...args: unknown[]) => void;
    adsbygoogle?: unknown[];
  }
}

function injectScript(id: string, src: string, attributes: Record<string, string> = {}) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  for (const [key, value] of Object.entries(attributes)) script.setAttribute(key, value);
  document.head.appendChild(script);
}

/** Resolves once the IAB TCF API reports a final consent state (or GDPR does not apply). */
function whenTcfReady(callback: () => void) {
  let done = false;
  const finish = () => {
    if (!done) {
      done = true;
      callback();
    }
  };
  let attempts = 0;
  const poll = window.setInterval(() => {
    attempts += 1;
    if (typeof window.__tcfapi === "function") {
      window.clearInterval(poll);
      window.__tcfapi("addEventListener", 2, (data, success) => {
        if (!success) return;
        const finalDecision = data.eventStatus === "tcloaded" || data.eventStatus === "useractioncomplete";
        const purposeOneGranted = data.purpose?.consents?.[1] === true;
        if (data.gdprApplies === false || (finalDecision && purposeOneGranted)) {
          finish();
        } else if (finalDecision) {
          // Google requires Purpose 1 consent before its ad tag is called in a TCF region.
          window.clearInterval(poll);
        }
      });
    } else if (attempts > 100) {
      // No CMP after ~10 s (blocked or failed): do not load ads at all.
      window.clearInterval(poll);
    }
  }, 100);
}

type GoogleServicesProps = {
  gaId: string | null;
  adsenseClient: string | null;
  adsEnabled: boolean;
  cmpProvider: "google" | "usercentrics" | "cookiebot" | null;
};

/**
 * Loads Google Analytics 4 and the AdSense library under consent control:
 * - GA4 ("basic" consent mode): gtag.js is only requested after the CMP has
 *   granted analytics_storage via Google Consent Mode.
 * - AdSense: with Google's own CMP the AdSense tag carries the consent
 *   message and is loaded directly; with a third-party TCF CMP it is loaded
 *   only after the TCF API reports Purpose 1 consent. A rejection leaves the
 *   ad tag unloaded.
 */
export function GoogleServices({ gaId, adsenseClient, adsEnabled, cmpProvider }: GoogleServicesProps) {
  useEffect(() => {
    if (!gaId) return;
    const loadGa = () => {
      if (window.__lrConsent?.analytics_storage !== "granted") return;
      injectScript("ga4-lib", `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`);
      window.gtag?.("js", new Date());
      window.gtag?.("config", gaId);
      window.removeEventListener("lr:consent", loadGa);
    };
    loadGa();
    window.addEventListener("lr:consent", loadGa);
    return () => window.removeEventListener("lr:consent", loadGa);
  }, [gaId]);

  useEffect(() => {
    if (!adsEnabled || !adsenseClient) return;
    const loadAds = () =>
      injectScript(
        "adsbygoogle-lib",
        `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adsenseClient)}`,
        { crossorigin: "anonymous" },
      );
    if (cmpProvider === "google") {
      loadAds();
    } else {
      whenTcfReady(loadAds);
    }
  }, [adsEnabled, adsenseClient, cmpProvider]);

  return null;
}
