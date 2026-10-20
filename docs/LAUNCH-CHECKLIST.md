# Launch-Checkliste (lademeter-rechner.de)

Automatisch prüfbar: `npm run check:launch` listet alle fehlenden Betreiberangaben und
Konfigurationsprobleme. `npm test`, `npm run lint`, `npm run typecheck` und `npm run build` müssen grün sein.

## 1. Angaben, die nur der Betreiber liefern kann (Pflicht)

Alle Werte werden in **`lib/legal/operator.ts`** eingetragen. Nichts davon darf erfunden werden.

| Feld | Warum | Rechtsgrundlage |
| --- | --- | --- |
| `kind`, `name` | Vollständiger Name (Person) bzw. Firma inkl. Rechtsform; bestätigt: Einzelperson, Muhammad Kashif | § 5 DDG |
| `representatives` | Nur bei Gesellschaften: Vertretungsberechtigte | § 5 DDG |
| `street`, `postalCode`, `city` | Ladungsfähige Anschrift (kein Postfach) | § 5 DDG |
| `email` | Elektronische Kontaktaufnahme; bestätigt: mkashifshah10@gmail.com | § 5 DDG |
| `phone` **oder** funktionierendes Kontaktformular | Zweiter schneller, unmittelbarer Kontaktweg | § 5 DDG |
| `register`, `vatId` | Nur falls vorhanden (Handelsregister, USt-IdNr./Wirtschafts-IdNr.) | § 5 DDG |
| `editorialResponsibilityReview` | Bei Sitz in Pakistan fachlich klären, ob § 18 Abs. 2 MStV anwendbar ist | § 1 Abs. 7, § 18 Abs. 2 MStV |
| `editorialResponsible` | Falls § 18 Abs. 2 MStV anwendbar ist: natürliche Person mit ständigem Aufenthalt in Deutschland | § 18 Abs. 2 MStV |
| `euRepresentative` oder `euRepresentativeExemption` | EU-Vertretung benennen oder die enge Ausnahme fachlich prüfen und dokumentieren | Art. 3 Abs. 2, Art. 27 DSGVO |
| `consumerDisputeStatement` | Tatsächlich zutreffende, rechtlich geprüfte Erklärung zur Verbraucherstreitbeilegung | VSBG |
| `supervisoryAuthority` | Optional: nur eintragen, wenn die Zuständigkeit für den Betreiber in Pakistan fachlich bestimmt wurde | Art. 77 DSGVO |
| `hosting.*` | Vercel ist als geplanter Anbieter mit offiziellen Links eingetragen; Tarif, DPA-Geltung und reale Konfiguration bleiben zu bestätigen | Art. 28, 44 ff. DSGVO |
| `about.authorName`, `about.bio` | Optional, aber stark empfohlen (E-E-A-T, Über uns) | – |
| `legalReview.*` | Erst setzen, **nachdem** ein Anwalt oder ein Rechtstext-Dienst die Seiten geprüft hat | – |

Solange Pflichtangaben fehlen oder keine Rechtsprüfung eingetragen ist, zeigen Impressum, Datenschutz,
Cookies, Nutzungsbedingungen und Haftungsausschluss einen gelben „nicht vollständig“-Hinweis, sind
`noindex` und stehen nicht in der Sitemap.

Hinweis zur Anschrift: Für das geplante werbefinanzierte Angebot wird eine vollständige, tatsächlich
erreichbare ladungsfähige Anschrift benötigt; ein Postfach genügt nicht. Wer die Privatanschrift nicht
veröffentlichen möchte, sollte rechtlich prüfen lassen, ob eine echte zustellfähige Geschäftsadresse
infrage kommt. Keine Scheinadresse verwenden.

Der Betreiber sitzt in Pakistan und richtet das Angebot an Deutschland. Deshalb müssen die räumliche
Anwendbarkeit der DSGVO, eine Vertretung in der EU nach Art. 27 DSGVO und die Anwendbarkeit des MStV
vor Veröffentlichung fachlich geprüft werden. Eine Google-zertifizierte CMP ersetzt diese Prüfung nicht.

## 2. Hosting & Domain (außerhalb dieses Repos)

- [ ] Domain registrieren, `www` → Apex (oder umgekehrt) 301-weiterleiten
- [ ] Vercel-Projekt nach `docs/VERCEL-DEPLOYMENT.md` konfigurieren; Systemvariablen automatisch exponieren und Preview Protection aktivieren
- [ ] Vercel-Tarif festlegen. Der veröffentlichte DPA nennt Pro/Enterprise; Geltung für das tatsächliche Konto fachlich und vertraglich bestätigen
- [ ] Function-Region `fra1`, aktuelle Unterauftragsverarbeiter, US-/Drittlandverarbeitung, Runtime-Log-Frist und optionale Observability-Funktionen im tatsächlichen Projekt prüfen
- [ ] Erst danach `hosting.confirmed = true` setzen und den Hosting-Abschnitt erneut rechtlich prüfen lassen
- [ ] Search Console (Domain-Property) + Bing Webmaster Tools verifizieren, `sitemap.xml` einreichen

## 3. Einwilligung, Analyse, Werbung

- [ ] Zertifizierte CMP wählen und in der Produktionsumgebung `NEXT_PUBLIC_CMP_PROVIDER` / `NEXT_PUBLIC_CMP_ID` setzen — Details: `docs/ADSENSE-CONSENT-SETUP.md` (Google-CMP nur zusammen mit aktiviertem AdSense; für GA-only Usercentrics/Cookiebot verwenden)
- [ ] Optional GA4: `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GA_RETENTION_MONTHS` (GA lädt erst nach Einwilligung)
- [ ] AdSense erst **nach** Livegang, Indexierbarkeit, vollständigen Rechtstexten und einer eigenständigen, nützlichen Website beantragen. Google nennt keine feste Mindestzahl an Seiten oder Besuchen.
- [ ] AdSense als **Einzelperson in Pakistan** anlegen: Name exakt wie beim Bankkonto, Zahlungsland Pakistan,
      vollständige postzustellfähige pakistanische Adresse für die PIN und gültige Telefonnummer mit `+92`.
      Das Zahlungsland kann im bestehenden AdSense-Konto nicht nachträglich geändert werden.
- [ ] Nach Freigabe: `NEXT_PUBLIC_ADSENSE_CLIENT`, Slot-IDs, `NEXT_PUBLIC_ADSENSE_ENABLED=true`

## 4. Kontaktformular

- [ ] Resend-Konto, Absenderdomain verifizieren, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` setzen
- [ ] Testnachricht senden (die Datenschutzerklärung beschreibt Resend automatisch, sobald alle drei Variablen gesetzt sind; wenn Sie einen anderen Dienst nutzen, `app/api/kontakt/route.ts` und den Datenschutztext anpassen)

## 5. Inhalte & Qualität

- [ ] Ratgeber fachlich gegenlesen (insbesondere Rechtsbezüge: § 22 StVO, § 34 StVZO, § 412 HGB)
- [ ] Fahrzeug-Richtwerte (`lib/calculators/vehicles.ts`) mit eigenen Quellen abgleichen
- [ ] Autor:in und Foto/Kurzprofil für „Über uns“ ergänzen
- [ ] Inhalte anhand echter Nutzerfragen und fachlicher Lücken erweitern; keine künstliche Seitenquote oder dünne Varianten produzieren
- [ ] Core Web Vitals nach Livegang mit PageSpeed Insights/CrUX prüfen

## 6. Nach dem Livegang

- [ ] Rich-Results-Test für Breadcrumb/Article/WebApplication (FAQ-Rich-Results sind für diese Website-Kategorie nicht verfügbar; die sichtbaren FAQ bleiben normale Inhalte)
- [ ] Einwilligungs-Banner in Browsern testen (Ablehnen, Zustimmen, Widerrufen über Footer-Link)
- [ ] Netzwerkanalyse: ohne Zustimmung dürfen keine Requests an Google (Tag Manager, Syndication, DoubleClick) gehen
