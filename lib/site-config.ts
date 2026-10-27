/**
 * Central source of truth for site-wide metadata, calculator definitions and
 * navigation.
 *
 * The Lademeter-Rechner lives on the homepage ("/") so that the exact-match
 * domain and the homepage authority reinforce one URL; the former
 * /lademeter-rechner/ route permanently redirects there (next.config.ts).
 */

export const siteConfig = {
  name: "Lademeter Rechner",
  descriptor: "Ladeplanung einfach berechnen",
  // Falls back to the production domain if NEXT_PUBLIC_SITE_URL is unset,
  // e.g. in local development (see .env.example).
  domain: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://lademeter-rechner.de").replace(/\/$/, ""),
  locale: "de-DE",
  description:
    "Kostenlose Online-Rechner für Lademeter, Paletten, Kartons, LKW-Beladung und Volumengewicht – mit Ladeplan, Erklärungen und Quellen.",
  /**
   * Date of the last substantive content/tool update. Used for sitemap
   * lastModified of static pages - update it when you change page content.
   */
  lastUpdated: "2026-10-21",
} as const;

export type CalculatorDefinition = {
  slug: string;
  href: string;
  navLabel: string;
  title: string;
  shortDescription: string;
  primaryKeyword: string;
};

export const calculators: CalculatorDefinition[] = [
  {
    slug: "lademeter-rechner",
    href: "/",
    navLabel: "Lademeter Rechner",
    title: "Lademeter Rechner",
    shortDescription:
      "Lademeter, Stellplätze und frachtpflichtiges Gewicht aus Länge, Breite und Anzahl berechnen.",
    primaryKeyword: "Lademeter berechnen",
  },
  {
    slug: "lkw-palettenrechner",
    href: "/lkw-palettenrechner/",
    navLabel: "LKW Palettenrechner",
    title: "LKW Palettenrechner",
    shortDescription:
      "Wie viele Paletten passen in Sattelzug, Wechselbrücke, 7,5-Tonner oder Container? Mit Ladeplan.",
    primaryKeyword: "wie viele Paletten passen in einen LKW",
  },
  {
    slug: "kartons-pro-palette-rechner",
    href: "/kartons-pro-palette-rechner/",
    navLabel: "Kartons pro Palette",
    title: "Kartons-pro-Palette Rechner",
    shortDescription:
      "Kartons pro Lage und Palette inklusive Verbund-Lagenbild, Höhe und Gewicht berechnen.",
    primaryKeyword: "wie viele Kartons passen auf eine Palette",
  },
  {
    slug: "lkw-beladungsrechner",
    href: "/lkw-beladungsrechner/",
    navLabel: "LKW Beladungsrechner",
    title: "LKW Beladungsrechner",
    shortDescription:
      "Mehrere Ladungspositionen gegen Ladefläche, Nutzlast und Volumen eines Fahrzeugs prüfen.",
    primaryKeyword: "LKW Beladung berechnen",
  },
  {
    slug: "volumengewicht-rechner",
    href: "/volumengewicht-rechner/",
    navLabel: "Volumengewicht Rechner",
    title: "Volumengewicht Rechner",
    shortDescription:
      "Volumengewicht und frachtpflichtiges Gewicht für Luftfracht, Paket, Seefracht oder eigenen Tarif.",
    primaryKeyword: "Volumengewicht berechnen",
  },
  {
    slug: "anhaenger-zuladungsrechner",
    href: "/anhaenger-zuladungsrechner/",
    navLabel: "Anhänger Zuladung",
    title: "Anhänger Zuladungsrechner",
    shortDescription:
      "Zuladung, Anhängelast, Stützlast und Führerscheinklasse für Pkw oder Transporter mit Anhänger prüfen.",
    primaryKeyword: "Anhänger Zuladung berechnen",
  },
  {
    slug: "zuladungsrechner",
    href: "/zuladungsrechner/",
    navLabel: "Zuladung Auto",
    title: "Zuladungsrechner",
    shortDescription:
      "Zuladung von Pkw, Transporter und Wohnmobil aus dem Fahrzeugschein berechnen: Personen, Gepäck, Fahrräder, Wasser und Gas.",
    primaryKeyword: "Zuladung berechnen",
  },
];

export const knowledgeNavigation = [
  { label: "Ratgeber", href: "/ratgeber/" },
  { label: "Fahrzeuge & Maße", href: "/fahrzeuge/" },
  { label: "Lademeter-Tabelle", href: "/lademeter-tabelle/" },
  { label: "Berechnungsgrundlagen", href: "/methodik/" },
] as const;

export const mainNavigation = [
  {
    label: "Rechner",
    href: "/",
    children: calculators.map((tool) => ({
      label: tool.navLabel,
      href: tool.href,
    })),
  },
  {
    label: "Wissen",
    href: "/ratgeber/",
    children: knowledgeNavigation.map((item) => ({ label: item.label, href: item.href })),
  },
  { label: "Fahrzeuge", href: "/fahrzeuge/" },
  { label: "Über uns", href: "/ueber-uns/" },
] as const;

export const footerNavigation = {
  rechner: calculators.map((tool) => ({
    label: tool.navLabel,
    href: tool.href,
  })),
  wissen: [...knowledgeNavigation],
  info: [
    { label: "Über uns", href: "/ueber-uns/" },
    { label: "Kontakt", href: "/kontakt/" },
  ],
  rechtliches: [
    { label: "Impressum", href: "/impressum/" },
    { label: "Datenschutz", href: "/datenschutz/" },
    { label: "Cookie-Richtlinie", href: "/cookies/" },
    { label: "Nutzungsbedingungen", href: "/nutzungsbedingungen/" },
    { label: "Haftungsausschluss", href: "/haftungsausschluss/" },
  ],
} as const;
