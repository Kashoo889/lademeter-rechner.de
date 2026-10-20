/* eslint-disable @next/next/no-before-interactive-script-outside-document -- App Router: beforeInteractive scripts are allowed in components rendered by the root layout (node_modules/next/dist/docs/01-app/03-api-reference/02-components/script.md); this rule only knows pages/_document. */
import Script from "next/script";
import { consentConfig, googleServicesActive } from "@/lib/consent/config";

/**
 * Loaded in the root layout. Renders nothing unless Google services are
 * configured together with a CMP (see lib/consent/config.ts).
 *
 * Order matters:
 * 1. Google Consent Mode v2 defaults: everything "denied" before any Google
 *    tag can run. The dataLayer is observed so that consent updates written
 *    by the CMP (gtag('consent','update',...)) are mirrored into
 *    window.__lrConsent and announced via the "lr:consent" event, which the
 *    GA loader uses ("basic" consent mode: GA is not loaded without consent).
 * 2. The CMP script (beforeInteractive, as recommended for consent managers).
 */
export function ConsentScripts() {
  if (!googleServicesActive) return null;
  const { cmpProvider, cmpId, cookiebotFramework } = consentConfig;

  const consentDefaults = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
window.__lrConsent = window.__lrConsent || {};
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
(function(){
  var push = window.dataLayer.push;
  window.dataLayer.push = function(){
    for (var i = 0; i < arguments.length; i++) {
      var entry = arguments[i];
      if (entry && entry[0] === 'consent' && entry[1] === 'update' && entry[2] && typeof entry[2] === 'object') {
        for (var key in entry[2]) { window.__lrConsent[key] = entry[2][key]; }
        try { window.dispatchEvent(new CustomEvent('lr:consent', { detail: window.__lrConsent })); } catch (e) {}
      }
    }
    return push.apply(window.dataLayer, arguments);
  };
})();`;

  return (
    <>
      <Script id="consent-mode-defaults" strategy="beforeInteractive">
        {consentDefaults}
      </Script>
      {cmpProvider === "usercentrics" && cmpId ? (
        <>
          {/* TCF stub first, so __tcfapi exists before the CMP UI has loaded. */}
          <Script id="usercentrics-tcf-stub" src="https://web.cmp.usercentrics.eu/tcf/stub.js" strategy="beforeInteractive" />
          <Script
            id="usercentrics-cmp"
            src="https://web.cmp.usercentrics.eu/ui/loader.js"
            data-settings-id={cmpId}
            data-tcf-enabled="true"
            strategy="beforeInteractive"
          />
        </>
      ) : null}
      {cmpProvider === "cookiebot" && cmpId ? (
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid={cmpId}
          data-framework={cookiebotFramework}
          data-blockingmode="manual"
          strategy="beforeInteractive"
        />
      ) : null}
    </>
  );
}
