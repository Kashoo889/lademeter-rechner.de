# Vercel-Deployment für lademeter-rechner.de

Stand: 20. Oktober 2026. Diese Anleitung bereitet das Deployment vor; sie ist keine Freigabe zum
Veröffentlichen. Erst deployen, wenn `npm run check:launch` vollständig erfolgreich ist und die
Rechtstexte fachlich geprüft wurden.

## 1. Vor dem Anlegen des Projekts

1. Vercel-Tarif festlegen. Der öffentlich abrufbare Vercel-DPA erklärt seine Geltung für Pro- und
   Enterprise-Kunden. Vor der Verarbeitung echter Besucherdaten daher Tarif, Vertragsbedingungen,
   wirksame Einbeziehung des DPA und Transfer-Folgen fachlich prüfen.
2. Aktuelle Unterauftragsverarbeiter und deren Standorte im Vercel Trust Center prüfen und die
   Änderungsbenachrichtigungen abonnieren.
3. Für das Vercel-Konto Mehrfaktor-Authentifizierung aktivieren und nur notwendige Teamzugriffe vergeben.
4. Alle offenen Punkte in `docs/LAUNCH-CHECKLIST.md` erledigen. `hosting.confirmed` bleibt bis zur
   tatsächlichen Vertrags- und Deployment-Prüfung `false`.

Offizielle Unterlagen:

- Privacy Notice: <https://vercel.com/legal/privacy-notice>
- Data Processing Addendum: <https://vercel.com/legal/dpa>
- Unterauftragsverarbeiter: <https://vercel.com/legal/sub-processors>
- Runtime-Log-Aufbewahrung: <https://vercel.com/docs/logs/runtime>
- Regionen: <https://vercel.com/docs/regions>

## 2. Projekt importieren – später, nicht im Rahmen dieser Vorbereitung

1. Das Git-Repository im Vercel-Dashboard importieren.
2. Root Directory auf das Verzeichnis mit dieser `package.json` setzen.
3. Framework Preset **Next.js** verwenden. Keine eigenen Overrides für Install-, Build- oder
   Output-Command setzen:
   - Install: aus `package-lock.json` (`npm install`/Vercel-Standard)
   - Build: `npm run build`
   - Output: Next.js-Standard
4. Node.js **22.x** auswählen. `package.json` legt dieselbe Hauptversion fest.
5. `vercel.json` beibehalten. Es setzt die Function-Region auf `fra1` (Frankfurt). Statische Seiten,
   JavaScript und CSS werden unabhängig davon über Vercels globales CDN ausgeliefert.
6. Unter *Environment Variables* die Option **Automatically expose System Environment Variables**
   aktivieren. Die Anwendung nutzt `VERCEL`, `VERCEL_ENV` und `VERCEL_TARGET_ENV`, um jede Nicht-
   Produktionsumgebung mit `noindex`, `nofollow` und `Disallow: /` zu sperren.
7. Unter *Deployment Protection* mindestens **Standard Protection / Vercel Authentication** für
   Preview- und Deployment-URLs aktivieren. Die Robots-Sperren bleiben zusätzlich bestehen.

## 3. Umgebungsvariablen

### Sofort erforderlich

| Variable | Production | Preview | Wert/Hinweis |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | erforderlich | erforderlich | `https://lademeter-rechner.de` – auch in Preview immer die spätere Produktions-URL, ohne abschließenden Slash |

Vercel setzt `VERCEL`, `VERCEL_ENV`, `VERCEL_TARGET_ENV`, `VERCEL_URL` und weitere Systemvariablen
selbst. Diese Werte nicht manuell anlegen oder überschreiben.

### Optional, erst bei der jeweiligen Freigabe

| Variable | Sichtbarkeit | Aktivierung |
| --- | --- | --- |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | öffentlich | Erst nach Anlage der Search-Console-Property; Production |
| `NEXT_PUBLIC_CMP_PROVIDER` | öffentlich | `google`, `usercentrics` oder `cookiebot`; erst nach CMP-Prüfung |
| `NEXT_PUBLIC_CMP_ID` | öffentlich | Settings-/Domain-Group-ID für Usercentrics/Cookiebot |
| `NEXT_PUBLIC_COOKIEBOT_FRAMEWORK` | öffentlich | Nur Cookiebot; gegen aktuelle Anbieter-Dokumentation prüfen |
| `NEXT_PUBLIC_GA_ID` | öffentlich | Erst nach Datenschutzfreigabe und CMP-Test |
| `NEXT_PUBLIC_GA_RETENTION_MONTHS` | öffentlich | Muss der tatsächlich in GA4 gewählten Dauer entsprechen |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | öffentlich | Erst nach vorhandenem AdSense-Konto; allein aktiviert noch keine Anzeigen |
| `NEXT_PUBLIC_ADSENSE_ENABLED` | öffentlich | Bis zur Freigabe ausdrücklich `false`; erst danach `true` |
| `NEXT_PUBLIC_ADSENSE_SLOT_SECTION` | öffentlich | Numerische Slot-ID nach AdSense-Freigabe |
| `NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_INTRO` | öffentlich | Numerische Slot-ID nach AdSense-Freigabe |
| `NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_END` | öffentlich | Numerische Slot-ID nach AdSense-Freigabe |
| `RESEND_API_KEY` | geheim/serverseitig | Erst bei aktivem, getesteten Kontaktformular; nur Production |
| `CONTACT_TO_EMAIL` | geheim/serverseitig | Empfängeradresse; nur Production |
| `CONTACT_FROM_EMAIL` | geheim/serverseitig | Bei Resend verifizierter Absender; nur Production |

Für den ersten Preview-Build alle CMP-, GA-, AdSense- und Kontaktformularwerte weglassen;
`NEXT_PUBLIC_ADSENSE_ENABLED=false` belassen. Änderungen an `NEXT_PUBLIC_*`-Werten werden beim Build
fest in die Browser-Bundles eingebunden und erfordern ein neues Deployment.

## 4. Prüfungen vor jedem Deployment

```bash
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run check:launch
```

`check:launch` muss vor einem öffentlichen Produktions-Deployment erfolgreich sein. Ein erwartetes
Fehlschlagen wegen fehlender Betreiberangaben ist kein Grund, die Sperren zu entfernen.

## 5. Preview prüfen

Nach einem späteren Preview-Deployment:

1. `X-Robots-Tag: noindex, nofollow` auf einer HTML-Seite kontrollieren.
2. `/robots.txt` muss `Disallow: /` enthalten.
3. Canonicals und Open-Graph-URLs müssen weiterhin auf `https://lademeter-rechner.de/...` zeigen.
4. `/sitemap.xml` darf unvollständige Rechtsseiten nicht enthalten.
5. Browser-Netzwerk prüfen: Ohne Einwilligung dürfen keine Google-, CMP- oder Resend-Anfragen erfolgen.
6. Security-Header kontrollieren; besonders CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`,
   `Permissions-Policy` und Frame-Schutz.
7. Alle Rechner und die Druck-/Teilen-Funktionen erneut testen.

## 6. Domain und Produktion – erst nach Freigabe

1. `lademeter-rechner.de` als Produktionsdomain hinzufügen.
2. Eine kanonische Hostvariante wählen; empfohlen: Apex-Domain als Ziel und `www` dauerhaft dorthin
   weiterleiten. Die Domain derzeit noch nicht verbinden.
3. DNS-Werte exakt aus dem Vercel-Dashboard übernehmen und ausgestelltes TLS-Zertifikat prüfen.
4. Erst wenn `check:launch` grün ist, eine Production-Deployment-Freigabe durchführen.
5. Danach Live-Crawl, Canonicals, Sitemap, Robots, Statuscodes, Security-Header und Core Web Vitals prüfen.
6. Search Console erst danach verifizieren und die Sitemap einreichen.

## 7. Caching und Protokollierung

- Next.js erzeugt alle Inhaltsseiten statisch; Vercel stellt statische HTML-, CSS- und JavaScript-Artefakte
  über sein CDN bereit. `_next/static` erhält unveränderliche, gehashte Dateinamen.
- Die Kontakt-API bleibt eine dynamische Function und sendet `Cache-Control: no-store`.
- Keine eigenen globalen `Cache-Control`-Header ergänzen: Sie würden Next.js-/Vercel-Revalidierung und
  Deployment-Aktualisierungen leicht verfälschen.
- Runtime-Log-Aufbewahrung ist tarifabhängig. Vor Veröffentlichung den gebuchten Tarif und alle
  Observability-, Web-Analytics-, Speed-Insights- und Log-Drain-Einstellungen dokumentieren. Keine
  optionalen Vercel-Analyseprodukte ohne erneute Datenschutzprüfung aktivieren.

## 8. Rollback

Vor dem Livegang eine verantwortliche Person und ein Verfahren für Rollbacks festlegen. Bei einem Fehler
das vorherige geprüfte Deployment über Vercel zurückrollen; anschließend Canonicals, Robots, Sitemap und
die Kontaktfunktion erneut kontrollieren. Ein Rollback ersetzt keine Meldung oder Reaktion bei einem
Datenschutz- oder Sicherheitsvorfall.
