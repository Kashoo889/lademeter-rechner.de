import Script from "next/script";
import { adsActive, adsenseClient } from "@/lib/ads/config";

/**
 * Loads the AdSense library, and with it Google's consent message, but only when
 * ads are switched on (lib/ads/config.ts). Renders nothing otherwise.
 */
export function AdSenseScript() {
  if (!adsActive || !adsenseClient) return null;
  return (
    <Script
      id="adsense-library"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
    />
  );
}
