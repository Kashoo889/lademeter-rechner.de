# Einwilligung (TCF/Consent Mode v2) und AdSense – Einrichtung

Stand der Recherche: Oktober 2026. Google-Vorgaben ändern sich; vor dem Livegang die aktuellen
Seiten prüfen:

- Zertifizierte CMPs: <https://support.google.com/adsense/answer/13554116>
- Google-CMP-Pflicht für AdSense in EWR/UK/Schweiz: <https://support.google.com/adsense/answer/13554020>
- Anforderungen EWR/UK/Schweiz: <https://blog.google/products/ads-commerce/new-consent-management-platform-requirements-for-serving-ads-in-the-eea-and-uk/>
- Consent Mode: <https://developers.google.com/tag-platform/security/guides/consent>

## Grundsätze dieses Projekts

Eine Google-zertifizierte CMP ist für AdSense im EWR, Vereinigten Königreich und in der Schweiz
erforderlich, bestätigt aber nicht automatisch die Einhaltung von DSGVO oder TDDDG. Anbieter- und
Verarbeitungsangaben, Rechtsgrundlagen, Drittlandtransfers und die konkrete Banner-Konfiguration müssen
vor Aktivierung separat geprüft werden.

1. **Ohne CMP wird nichts von Google geladen.** `lib/consent/config.ts` ignoriert `NEXT_PUBLIC_GA_ID` und
   `NEXT_PUBLIC_ADSENSE_ENABLED`, solange keine CMP vollständig konfiguriert ist.
2. **Consent Mode v2 mit Default „denied“** (`ad_storage`, `ad_user_data`, `ad_personalization`,
   `analytics_storage`, …) wird *vor* der CMP gesetzt (`components/consent/ConsentScripts.tsx`).
3. **GA4 („Basic“-Modus):** `gtag.js` wird erst angefordert, nachdem die CMP `analytics_storage = granted`
   gemeldet hat (`components/consent/GoogleServices.tsx`).
4. **AdSense:** Bei einer Drittanbieter-CMP wird die Bibliothek nur geladen, wenn die TCF-API für einen
   EWR-Nutzer eine abschließende Entscheidung **und Purpose 1 = erlaubt** meldet. Bei Ablehnung bleibt das
   Werbeskript ungeladen. Bei Google als CMP trägt der AdSense-Tag selbst die Consent-Mitteilung.
5. **Widerruf:** Der Footer-Link „Cookie-Einstellungen“ erscheint automatisch, sobald eine CMP aktiv ist.
6. Es werden **keine IDs im Code** gespeichert; alles kommt aus Umgebungsvariablen.

## Option A: Google „Datenschutz & Mitteilungen“ (kostenlos, im AdSense-Konto)

Nur möglich, wenn bereits ein AdSense-Konto besteht. Dann:

1. AdSense → Datenschutz & Mitteilungen → Mitteilung für EWR/UK/CH mit Auswahl „Einwilligen / Optionen verwalten / Ablehnen“ erstellen und veröffentlichen.
2. `NEXT_PUBLIC_CMP_PROVIDER=google`, `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-…` und
   `NEXT_PUBLIC_ADSENSE_ENABLED=true`. Ohne aktiviertes AdSense gilt diese Variante absichtlich nicht als
   konfiguriert, weil die Google-Mitteilung über den AdSense-Tag ausgeliefert wird.
3. Hinweis: Für die Einwilligung zu *Google Analytics* ist die Google-Mitteilung nicht ideal; dafür besser Option B.

## Option B: Drittanbieter-CMP (Usercentrics / Cookiebot)

1. Konto anlegen, TCF aktivieren, Google Ad Technology Provider und die benötigten Zwecke konfigurieren.
2. Usercentrics: `NEXT_PUBLIC_CMP_PROVIDER=usercentrics`, `NEXT_PUBLIC_CMP_ID=<Settings-ID>`.
   Cookiebot: `NEXT_PUBLIC_CMP_PROVIDER=cookiebot`, `NEXT_PUBLIC_CMP_ID=<Domain-Group-ID>` (ggf. `NEXT_PUBLIC_COOKIEBOT_FRAMEWORK`).
3. Im CMP-Dashboard „Google Consent Mode“ aktivieren (Consent Updates werden über `gtag('consent','update',…)` gemeldet; der Code erkennt sie).
4. Im Banner „Ablehnen“ **gleichwertig** zu „Zustimmen“ anbieten (Anforderung deutscher Aufsichtsbehörden).

Andere zertifizierte CMPs (z. B. Didomi, consentmanager) lassen sich analog ergänzen: Script in
`ConsentScripts.tsx` einbinden und Provider in `lib/consent/config.ts` registrieren.

## Reihenfolge bis zur Werbung

1. Seite live, Rechtstexte vollständig und geprüft, genug hochwertige Inhalte.
2. CMP einrichten, im Browser testen (Ablehnen → keine Google-Requests).
3. AdSense-Konto beantragen, Seite hinzufügen (`NEXT_PUBLIC_ADSENSE_CLIENT` setzt Meta-Tag und `ads.txt`).
4. Nach Freigabe Anzeigenblöcke anlegen, Slot-IDs in den Variablen eintragen, `NEXT_PUBLIC_ADSENSE_ENABLED=true`.

## Platzierungsregeln

Anzeigen erscheinen nur zwischen Inhaltsabschnitten (`section-break`, `article-end`; optional
`article-intro`), nie neben Eingabefeldern, „Berechnen“-Button oder Ergebnissen, gekennzeichnet als „Anzeige“,
mit reservierter Mindesthöhe gegen Layoutsprünge. Druckansicht blendet Anzeigen aus.

## Datenschutztext

Die Datenschutzerklärung (`app/datenschutz/page.tsx`) und die Cookie-Richtlinie (`app/cookies/page.tsx`) passen sich an
die konfigurierten Dienste an (CMP, GA4, AdSense). Nach Änderung der Konfiguration die Texte rechtlich neu
prüfen lassen. Die Cookie-Namen und Laufzeiten Dritter sind Richtwerte; maßgeblich ist die Liste im CMP-Dashboard.
