# WARP MASTER BUILD SPECIFICATION
## Project: lademeter-rechner.de

> This file is the single source of truth for the initial website build.
> Warp must read this entire document before changing or creating files.
> Do not implement real calculator formulas in this phase. Calculator logic will be built and validated separately later.

---

# 1. Project Goal

Build a production-ready, German-language SEO website for:

**Domain:** `lademeter-rechner.de`

**Micro-niche:**  
LKW-Ladeplanung, Lademeter, Palettenberechnung, Karton-/Palettenplanung und Ladeflächenauslastung.

**Primary traffic source:** Google organic search in Germany.

**Primary monetization:** Google AdSense later.

**Audience:**
- Speditionen
- Logistikunternehmen
- Disponenten
- Lager-/Versandmitarbeiter
- E-Commerce-/Fulfillment-Teams
- KMU mit regelmäßigem Warenversand
- Personen, die Paletten-, LKW- oder Lademeter-Berechnungen benötigen

The website must feel like a focused German logistics utility resource, not a generic “100 calculators” website.

---

# 2. Critical Build Rule

## DO NOT BUILD REAL CALCULATOR LOGIC YET

The calculation engines will be implemented separately later.

For this build:

- create the complete UI/UX shell for every tool;
- create realistic form layouts;
- create reusable input/result components;
- create placeholder result states;
- create integration-ready TypeScript interfaces;
- create clearly marked TODO integration points;
- do not invent formulas;
- do not invent logistics assumptions;
- do not return fake calculated results;
- do not hardcode unverified calculation logic.

Every calculator page must be visually complete and ready for the real calculation module to be inserted later.

---

# 3. Preferred Technical Stack

Use:

- Next.js with App Router
- TypeScript
- Tailwind CSS
- Server Components by default
- Client Components only where interaction requires them
- semantic HTML
- reusable components
- static generation wherever practical
- no unnecessary heavy libraries
- no external UI framework unless there is a strong reason
- no database required for V1
- no authentication required
- no paid API required
- deployment target: Vercel

Keep dependencies minimal.

The architecture must remain easy for another AI/developer to continue later.

---

# 4. Language and Market

Primary language: **German**

Primary country: **Germany**

All public-facing UI text must be German.

Code, component names, comments and internal documentation may be English.

Use German conventions where relevant:

- decimal comma in displayed examples where appropriate
- metric units
- mm, cm, m
- kg
- m³
- Lademeter / ldm
- Europalette terminology
- German logistics vocabulary

Do not create English pages in V1.

---

# 5. Brand Direction

The visual identity should communicate:

- logistics
- precision
- practical calculation
- trust
- efficiency
- professional B2B utility

Avoid:
- playful calculator-site design;
- excessive gradients;
- generic AI-looking layouts;
- crypto/SaaS neon styling;
- cluttered dashboards;
- oversized animations;
- fake testimonials;
- fake company statistics.

Design style:

- clean
- modern
- technical
- lightweight
- professional
- strong spacing
- high readability
- mobile-first
- clear visual hierarchy

Use a restrained neutral palette with one strong logistics/industrial accent.

Do not spend time creating a complex logo. Use a clean text-based wordmark initially:

**Lademeter Rechner**

Optional descriptor:

**Ladeplanung einfach berechnen**

---

# 6. Global Site Architecture

Create these primary routes:

```text
/
├── lademeter-rechner/
├── lkw-palettenrechner/
├── kartons-pro-palette-rechner/
├── lkw-beladungsrechner/
├── ratgeber/
│   ├── page/[page] if pagination becomes necessary
│   └── [slug]/
├── ueber-uns/
├── kontakt/
├── impressum/
├── datenschutz/
└── cookies/
```

Prepare the site so future topic hubs can be added under `/ratgeber/`.

Do not create dozens of thin pages during this phase.

---

# 7. Primary Navigation

Desktop navigation:

- Rechner
  - Lademeter Rechner
  - LKW Palettenrechner
  - Kartons pro Palette
  - LKW Beladungsrechner
- Ratgeber
- Über uns

Right-side CTA:
**Lademeter berechnen**

Mobile navigation must be fully accessible and easy to use.

---

# 8. Homepage

Route:

`/`

Primary SEO/topic purpose:

Establish the site as a complete German resource for Lademeter, Paletten und LKW-Ladeplanung.

## Homepage sections

### 8.1 Header
Clean sticky or standard header.

### 8.2 Hero

H1 idea:

**Lademeter, Paletten und LKW-Beladung einfach berechnen**

Supporting text should explain that the website provides practical online tools for planning loading space, pallets and transport capacity.

Primary CTA:

**Lademeter berechnen**

Secondary CTA:

**Alle Rechner ansehen**

Do not claim calculations are already operational if tool logic is still placeholder-only in development.

### 8.3 Main Tool Cards

Show all four tools:

1. Lademeter Rechner
2. LKW Palettenrechner
3. Kartons-pro-Palette Rechner
4. LKW Beladungsrechner

Each card requires:

- short German description
- relevant icon
- link to tool
- consistent design

### 8.4 “Was sind Lademeter?” educational section

Short useful explanation.

Link to future detailed guide.

### 8.5 Common logistics reference section

Examples:

- Europalette
- Industriepalette
- Standard-Sattelzug
- Ladefläche
- Nutzlast vs. Volumen vs. Lademeter

Only use broadly established facts if included.
Do not invent technical capacities or numbers if not verified.

### 8.6 How the tools work

Three-step explanation:

1. Maße eingeben
2. Ladung konfigurieren
3. Ergebnis erhalten

### 8.7 Ratgeber section

Show latest 3–6 articles using reusable article cards.

### 8.8 FAQ section

Create useful general FAQs around:

- Lademeter
- Paletten
- LKW Ladefläche
- Ladeplanung

FAQ content must be concise and not stuffed with keywords.

Add FAQ structured data only when page content actually contains those FAQs and it is appropriate.

### 8.9 Final CTA

Link to primary tool.

### 8.10 Footer

Include:

- Rechner links
- Ratgeber
- Über uns
- Kontakt
- Impressum
- Datenschutz
- Cookies

---

# 9. Tool Page Template

All four calculator pages should use a consistent reusable template.

Recommended structure:

1. Breadcrumbs
2. H1
3. short intent-focused introduction
4. calculator UI
5. placeholder result panel
6. explanation of what the calculator does
7. how to use it
8. worked-example placeholder area
9. relevant definitions
10. common mistakes
11. related tools
12. related articles
13. FAQs
14. disclaimer / calculation note

Do not put long SEO text before the calculator.

The tool should appear high on the page.

---

# 10. Tool 1 — Lademeter Rechner

Route:

`/lademeter-rechner/`

Primary keyword:

**Lademeter berechnen**

Secondary keyword:

**Lademeter Rechner**

Create a polished calculator UI shell.

Potential form fields for UI planning only:

- Ladungsart
- Länge
- Breite
- Höhe
- Anzahl
- Gewicht
- stapelbar: ja/nein
- Einheit

However:

**Do not implement calculation formulas.**

Create:

```ts
type LademeterInput = {
  length: number | null
  width: number | null
  height?: number | null
  quantity: number
  weight?: number | null
  stackable?: boolean
  unit: 'mm' | 'cm' | 'm'
}
```

The exact interface can be improved during implementation.

Create a result component capable of later displaying:

- calculated ldm
- total footprint
- total volume
- total weight
- utilization notes

Display placeholder state such as:

**„Ergebnis erscheint hier nach Eingabe der Ladungsdaten.“**

Do not show fabricated results.

---

# 11. Tool 2 — LKW Palettenrechner

Route:

`/lkw-palettenrechner/`

Primary intent:

**Wie viele Paletten passen in einen LKW?**

UI should allow future support for:

- vehicle type
- pallet type
- custom pallet dimensions
- pallet count
- rotation option
- stacking option

Prepare preset UI options visually for:

- Europalette
- Industriepalette
- Benutzerdefiniert

Vehicle presets may be shown as generic labels but do not hardcode unverified capacity results.

Future result area should support:

- pallet positions
- used loading area
- remaining loading area
- utilization %
- possible layout visualization

---

# 12. Tool 3 — Kartons-pro-Palette Rechner

Route:

`/kartons-pro-palette-rechner/`

Primary intent:

**Wie viele Kartons passen auf eine Palette?**

UI planning fields:

- carton length
- carton width
- carton height
- carton weight
- pallet type
- custom pallet dimensions
- maximum pallet height
- maximum pallet weight
- rotation allowed
- optional overhang rule

Future result area should support:

- cartons per layer
- number of layers
- total cartons
- loaded height
- total weight
- utilization
- visual layer/layout representation

No geometry algorithm yet.

---

# 13. Tool 4 — LKW Beladungsrechner

Route:

`/lkw-beladungsrechner/`

This should eventually become the most advanced tool.

The V1 website should only build the UI shell and data model.

Prepare UX for multiple cargo rows/items:

- item name
- length
- width
- height
- quantity
- weight
- stackable
- palletized/not palletized

Allow UI actions:

- add item
- duplicate item
- remove item
- clear list

Prepare future result sections for:

- total volume
- total weight
- total loading meters
- estimated loading-area utilization
- vehicle suitability
- layout

No actual optimization algorithm yet.

---

# 14. Reusable Tool Components

Create a clean reusable component architecture, for example:

```text
components/
├── calculator/
│   ├── CalculatorShell.tsx
│   ├── CalculatorHeader.tsx
│   ├── NumberField.tsx
│   ├── UnitSelect.tsx
│   ├── QuantityField.tsx
│   ├── ResultPanel.tsx
│   ├── ResultMetric.tsx
│   ├── ToolNotice.tsx
│   └── ToolActions.tsx
```

Keep presentation separate from calculation logic.

Future calculation engines should be insertable under a structure such as:

```text
lib/
└── calculators/
    ├── lademeter.ts
    ├── truckPallets.ts
    ├── cartonsPerPallet.ts
    └── truckLoading.ts
```

Do not populate these engines with invented logic in this build.

---

# 15. Ratgeber / Content System

Create:

`/ratgeber/`

Requirements:

- article listing page
- article card
- category/tag-ready structure
- individual SEO-friendly article routes
- table of contents for longer articles
- author/reviewer component ready for future use
- published/updated date fields
- related article section
- related calculator CTA
- breadcrumbs

Prefer a simple content architecture.

Markdown/MDX is acceptable and preferred for V1 unless there is a strong reason to introduce a CMS.

Recommended content directory:

```text
content/
└── ratgeber/
```

Each article should support metadata such as:

```yaml
title:
description:
slug:
publishedAt:
updatedAt:
category:
tags:
relatedTool:
```

Do not generate 100 low-quality articles.

Create a small number of sample/demo content entries only if required to validate templates.

Clearly mark demo content.

---

# 16. Initial SEO Architecture

Every indexable page must have:

- unique title
- unique meta description
- canonical URL
- Open Graph metadata
- appropriate robots directive
- semantic H1/H2 hierarchy

Set:

`metadataBase` to the production domain when appropriate:

`https://lademeter-rechner.de`

Create:

- `sitemap.ts`
- `robots.ts`
- favicon/icon placeholders
- Open Graph image framework
- clean URL structure
- breadcrumb support

Do not keyword-stuff.

---

# 17. Structured Data

Prepare reusable JSON-LD helpers for:

- WebSite
- Organization or WebSite publisher identity
- BreadcrumbList
- Article
- FAQPage where appropriate
- WebApplication or SoftwareApplication only if semantically valid for the calculators later

Do not create fake ratings.

Do not create fake reviews.

Do not use Review schema without real review data.

Do not create fake author credentials.

---

# 18. Internal Linking

The site must be built with intentional internal linking.

Every tool page should link to:

- at least 2 relevant tools
- relevant Ratgeber articles

Every Ratgeber article template should support:

- a primary related tool CTA
- 2–4 related articles

Homepage links prominently to all four calculators.

Use descriptive German anchor text naturally.

---

# 19. Technical SEO

Implement:

- static/server-rendered content
- crawlable navigation
- no content hidden behind client-side rendering unnecessarily
- one H1 per primary page
- logical heading hierarchy
- canonical URLs
- XML sitemap
- robots.txt
- no accidental noindex
- no duplicate trailing-slash variants
- no broken internal links
- proper 404 page
- metadata fallbacks

---

# 20. Performance

Target excellent Core Web Vitals.

Requirements:

- avoid heavy JS
- optimize fonts
- lazy-load non-critical media
- use `next/image` where applicable
- avoid layout shift
- avoid unnecessary animations
- do not autoplay media
- keep calculator UI responsive
- reduce hydration where possible

Do not add third-party scripts during the initial build unless necessary.

---

# 21. Accessibility

Minimum expectations:

- keyboard usable
- visible focus states
- semantic form labels
- accessible error messages
- sufficient contrast
- proper button elements
- no clickable divs
- skip-to-content link
- accessible mobile navigation
- aria attributes only where actually needed

---

# 22. AdSense-Ready Layout

Do not integrate live AdSense yet.

Create tasteful optional ad-slot components that can later be enabled.

Possible locations:

- after introductory content on article pages
- mid-article
- near article end
- between content sections where UX is not harmed

For calculator pages:

Never place an ad where it can be confused with:
- a calculate button;
- a form control;
- a result;
- a navigation control.

Do not create intrusive layouts.

Create a reusable component such as:

```tsx
<AdSlot placement="article-mid" />
```

Default it to disabled or placeholder mode.

---

# 23. Analytics Integration Readiness

Prepare a simple location for future:

- Google Analytics 4
- Google Search Console verification
- Google AdSense
- consent-aware analytics initialization

Do not add fake IDs.

Use environment variables or config placeholders.

Example:

```env
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_ADSENSE_CLIENT=
NEXT_PUBLIC_SITE_URL=https://lademeter-rechner.de
```

---

# 24. Legal / Privacy Pages

Create structural pages for:

- Impressum
- Datenschutz
- Cookie-Einstellungen / Cookies
- Kontakt

Important:

Do not fabricate company identity, owner address, phone, tax number, registration data, legal representative or other legal details.

Use clearly marked placeholders where business-specific information is required.

Do not claim that generic placeholder legal text is legally sufficient.

The implementation must make it easy to replace legal text before production launch.

Prepare the site for a consent-management solution, but do not add a heavy CMP unless explicitly requested.

---

# 25. Contact Page

Create `/kontakt/`.

Do not require backend email functionality in V1 unless it can be added safely without unnecessary infrastructure.

A simple contact form UI can be present with:

- Name
- E-Mail
- Betreff
- Nachricht

If no backend exists, clearly leave integration as TODO instead of pretending messages are sent.

---

# 26. About Page

Create `/ueber-uns/`.

Positioning:

The site provides practical digital tools and understandable guides for transport-space and load-planning calculations.

Do not invent:
- years of experience;
- staff;
- office locations;
- customer counts;
- certifications;
- logistics qualifications.

Keep claims factual and modest.

---

# 27. Trust Elements

Use trust through product quality, not fabricated social proof.

Allowed:

- transparent methodology section
- formula/methodology link placeholders
- “Zuletzt aktualisiert” support
- clear assumptions
- input validation
- explanation of limitations
- sources/references component for future calculator methodology

Do not add:

- fake customer logos
- fake ratings
- “10,000 customers”
- fake testimonials
- invented expert names

---

# 28. Error and Empty States

Design:

- missing-input states
- invalid-number states
- negative-value prevention
- unrealistic-value warning capability
- loading state for future calculations
- reset state
- placeholder result state
- mobile validation experience

Do not let forms break the page.

---

# 29. Responsive Requirements

Test layouts at minimum for:

- 320px
- 375px
- 768px
- 1024px
- 1440px

Calculator forms must be easy to use on mobile.

Tables must not overflow silently.

Tool results should remain readable on small screens.

---

# 30. Project Documentation

Create a root-level:

`README.md`

It should document:

- project purpose
- setup
- commands
- environment variables
- folder structure
- deployment
- where calculator logic will later live
- how to add a new Ratgeber article
- how metadata is managed
- how to enable future analytics/AdSense

Also create:

`docs/CALCULATOR-INTEGRATION.md`

This should explain exactly where the later Claude-built calculator engines should be connected.

---

# 31. Suggested Folder Structure

A clean architecture is preferred, similar to:

```text
app/
├── layout.tsx
├── page.tsx
├── lademeter-rechner/
│   └── page.tsx
├── lkw-palettenrechner/
│   └── page.tsx
├── kartons-pro-palette-rechner/
│   └── page.tsx
├── lkw-beladungsrechner/
│   └── page.tsx
├── ratgeber/
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
├── ueber-uns/
├── kontakt/
├── impressum/
├── datenschutz/
└── cookies/

components/
├── layout/
├── calculator/
├── content/
├── seo/
└── ui/

content/
└── ratgeber/

docs/
└── CALCULATOR-INTEGRATION.md

lib/
├── calculators/
├── content/
├── seo/
└── utils/

public/
```

Adapt if Next.js conventions require changes, but keep it understandable.

---

# 32. Warp Execution Strategy

Do NOT try to produce everything blindly in one uncontrolled pass.

Before implementation:

1. inspect the current folder/repository;
2. summarize the intended architecture;
3. identify any conflicts;
4. create a short implementation plan;
5. then begin development.

Implement in this order:

## Phase 1
Project foundation
- Next.js
- TypeScript
- Tailwind
- layout
- fonts
- global styles
- reusable UI

## Phase 2
Global site
- header
- navigation
- footer
- homepage
- responsive behavior

## Phase 3
Calculator UI system
- reusable calculator components
- four calculator pages
- placeholders only
- no real formulas

## Phase 4
Ratgeber system
- content model
- index
- article template
- related content

## Phase 5
SEO
- metadata
- sitemap
- robots
- breadcrumbs
- structured data framework
- canonical URLs

## Phase 6
Supporting pages
- About
- Contact
- Impressum placeholder
- Datenschutz placeholder
- Cookies placeholder
- 404

## Phase 7
Ad/analytics readiness
- disabled ad slots
- environment variables
- analytics integration points

## Phase 8
QA
- mobile
- accessibility
- build errors
- lint
- broken links
- metadata
- no fake calculator results
- no invented claims

---

# 33. Required QA Before Declaring Completion

Warp must check:

- `npm run build` passes
- TypeScript passes
- no major lint issues
- no broken imports
- no broken internal links
- every navigation item works
- all four calculator pages exist
- calculators show placeholder states rather than fabricated results
- mobile navigation works
- forms are keyboard accessible
- metadata exists
- canonical setup is correct
- sitemap works
- robots works
- Ratgeber route works
- sample article route works
- legal placeholders are visibly marked for replacement
- no fake testimonials/reviews
- no fake business data
- no fake calculator output
- no accidental English UI
- no generic lorem ipsum
- no unnecessary dependencies

---

# 34. Completion Report Required From Warp

At the end of the build, provide:

1. what was implemented;
2. files/folders created;
3. routes created;
4. remaining TODOs;
5. any assumptions made;
6. anything requiring owner data;
7. calculator integration points;
8. SEO implementation summary;
9. deployment steps;
10. exact next step for Claude calculator development.

Do not claim the website is calculator-complete until the real calculation modules have been implemented and validated.

---

# 35. Explicitly Out of Scope for Warp Build Phase

Do NOT spend build time on:

- real Lademeter formulas;
- pallet optimization algorithms;
- 2D/3D truck loading optimization;
- carton nesting algorithms;
- route planning;
- freight pricing;
- user accounts;
- saved projects;
- database;
- payment system;
- subscription SaaS;
- multilingual site;
- mobile app;
- complex admin panel;
- AI chatbot;
- fabricated blog library;
- fake testimonials;
- fake company history.

These can only be introduced later if explicitly approved.

---

# 36. Final Product Standard

The result of this Warp phase should look and behave like a serious production website whose calculation engines are deliberately pending.

It should be:

- visually finished;
- technically clean;
- SEO-ready;
- content-ready;
- AdSense-ready in structure;
- easy to deploy;
- easy to continue;
- easy for Claude to add calculator logic without rebuilding the site.

The website must remain tightly focused on:

**Lademeter + Paletten + Kartons + LKW-Ladeplanung**

Do not broaden the project into a generic logistics-calculator portal.

---

# FINAL INSTRUCTION TO WARP

Read this specification completely before coding.

First inspect the repository and produce a concise implementation plan.

Then build the website phase-by-phase.

When a requirement is unclear, prefer the simplest maintainable implementation and document the decision.

Never invent calculator formulas, legal/business identity data, statistics, reviews, credentials or technical facts.

The real calculator engines will be added in a later phase.
