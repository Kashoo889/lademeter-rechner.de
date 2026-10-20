# Lademeter Rechner (lademeter-rechner.de)

Deutschsprachige Website mit Online-Rechnern und Ratgebern für Ladeplanung: Lademeter, Paletten im LKW,
Kartons pro Palette, LKW-Beladung und Volumengewicht. Next.js 16 (App Router), TypeScript, Tailwind CSS 4.

> **Status:** lokal entwickelt, nicht veröffentlicht. Vor dem Livegang müssen Betreiberangaben und
> Rechtsprüfung ergänzt werden – siehe [`docs/LAUNCH-CHECKLIST.md`](docs/LAUNCH-CHECKLIST.md).

## Befehle

```bash
npm install
npm run dev            # lokaler Server auf http://localhost:3000
npm run build          # Produktionsbuild (inkl. TypeScript-Prüfung)
npm run start          # Produktionsbuild lokal starten
npm test               # Unit-Tests der Rechenkerne + Inhalts-Integrität
npm run lint
npm run typecheck
npm run check:launch   # Pre-Launch-Prüfung: listet fehlende Betreiberangaben/Konfiguration (schlägt bis dahin fehl)
```

Voraussetzung: Node.js 22.x (entspricht der Vercel-Laufzeit in `package.json`). Hinweis: Next.js 16 weicht von älteren Versionen ab – lokale Doku unter
`node_modules/next/dist/docs/` (siehe `AGENTS.md`).

## Aufbau

```text
app/                  Routen (Startseite = Lademeter-Rechner)
  lkw-palettenrechner/  kartons-pro-palette-rechner/  lkw-beladungsrechner/  volumengewicht-rechner/
  fahrzeuge/ + [slug]/  lademeter-tabelle/  methodik/  ratgeber/ + [slug]/
  impressum/ datenschutz/ cookies/ nutzungsbedingungen/ haftungsausschluss/ kontakt/ ueber-uns/
  api/kontakt/          Kontaktformular-Endpunkt (nur aktiv mit Mail-Konfiguration)
  ads.txt/ robots.ts sitemap.ts manifest.ts icon.tsx apple-icon.tsx opengraph-image.tsx
components/
  calculator/           Formulare, Ergebnis-Panel, Ladeplan-SVG, Teilen/Drucken
  consent/              Consent Mode v2, CMP-Skripte, GA4/AdSense-Lader (alles consent-gesteuert)
  ads/                  AdSlot (inaktiv ohne Konfiguration)
  content/ layout/ legal/ seo/ ui/
content/ratgeber/      Markdown-Artikel (Frontmatter inkl. faq/sources)
lib/
  calculators/          Rechenkerne + Tests (packing, truckPallets, lademeter, cartonsPerPallet, truckLoading, volumeWeight)
  content/              Artikel-Loader, Fahrzeugtexte, Referenztabellen (aus den Rechenkernen berechnet)
  consent/ legal/ seo/  Konfiguration, Betreiberdaten, Metadaten/JSON-LD
docs/                   Launch-Checkliste, Vercel-Deployment, Consent/AdSense-Setup, Content-Roadmap
```

## Wichtige Entwurfsentscheidungen

- **Berechnung im Browser.** Eingaben werden nicht übertragen; Ergebnisse lassen sich per Link teilen
  (kodierter Parameter `?e=`), kopieren und drucken.
- **Referenzzahlen werden berechnet, nicht getippt.** Tabellen auf Fahrzeug- und Tabellenseiten nutzen
  dieselben Funktionen wie die Rechner (`lib/content/referenceData.ts`).
- **Rechtstexte sind datengetrieben.** `lib/legal/operator.ts` enthält alle Betreiberangaben. Fehlen Pflichtangaben
  oder die Rechtsprüfung, sind die Seiten sichtbar als „nicht vollständig“ markiert, `noindex` und nicht in der Sitemap.
- **Nichts Google-bezogenes ohne Einwilligung.** Siehe [`docs/ADSENSE-CONSENT-SETUP.md`](docs/ADSENSE-CONSENT-SETUP.md).
- **Preview-Deployments** (`VERCEL_ENV` ≠ production) senden `noindex` und ein `Disallow: /` in der robots.txt.
- **Vercel-Konfiguration:** siehe [`docs/VERCEL-DEPLOYMENT.md`](docs/VERCEL-DEPLOYMENT.md); noch nicht deployen, solange `check:launch` fehlschlägt.

## Neue Ratgeber-Artikel

Markdown-Datei in `content/ratgeber/` anlegen. Frontmatter:

```yaml
---
title: "Titel (max. ca. 70 Zeichen)"
description: "120–170 Zeichen"
slug: "dateiname-ohne-md"      # muss dem Dateinamen entsprechen
publishedAt: "2026-10-20"
updatedAt: "2026-10-20"
category: "Grundlagen"
tags: ["lademeter"]
relatedTool: "lademeter-rechner"   # Slug aus lib/site-config.ts
faq:
  - question: "…"
    answer: "…"
sources:
  - title: "…"
    url: "https://…"
---
```

`##`-Überschriften erzeugen das Inhaltsverzeichnis. `npm test` prüft Slug, Metalängen, FAQ und interne Links.

## Weitere Dokumente

`WARP_MASTER_BUILD_SPEC.md` und `Germany_Micro_Niche_Final_Lock_Report.pdf` sind die ursprünglichen Vorgaben
(teilweise überholt: die Rechner sind inzwischen vollständig implementiert und erweitert).
