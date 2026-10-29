import Script from "next/script";
import { plausibleDomain, plausibleSrc } from "@/lib/analytics/config";
import { isNonProductionVercelDeployment } from "@/lib/deployment";

/** Loads Plausible only when configured, and never on preview/non-production deployments. */
export function PlausibleScript() {
  if (!plausibleDomain || isNonProductionVercelDeployment()) return null;
  return <Script defer data-domain={plausibleDomain} src={plausibleSrc} strategy="afterInteractive" />;
}
