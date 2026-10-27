import { getAllArticles, type Article } from "@/lib/content/ratgeber";
import { DOWNLOADS_LIVE, excelAsset, worksheetAsset } from "@/lib/downloads";

/**
 * Topic clusters for internal linking (see seo/04-themencluster-und-interne-verlinkung.md).
 *
 * Every article belongs to exactly one cluster: via the optional `cluster:` frontmatter field, or - for the
 * first articles - via SLUG_CLUSTER below. A test (clusters.test.ts) fails when an article has no cluster, so
 * new articles cannot be published without joining the link structure.
 */
export const CLUSTER_IDS = [
  "lademeter",
  "paletten",
  "volumengewicht",
  "fahrzeuge",
  "versand",
  "ladungssicherung",
  "vorschriften",
  "container",
  "palettierung",
  "schuettgewicht",
] as const;

export type ClusterId = (typeof CLUSTER_IDS)[number];

export type ClusterLink = { href: string; label: string; description: string };

type Cluster = {
  id: ClusterId;
  label: string;
  /** Curated, evergreen links (calculators, reference pages, hubs). Only existing URLs. */
  links: ClusterLink[];
};

const sattelzug: ClusterLink = { href: "/fahrzeuge/sattelzug/", label: "Sattelzug: Maße, Lademeter, Paletten", description: "Ladefläche und Palettenzahl des Standard-Sattelaufliegers." };

export const CLUSTERS: Record<ClusterId, Cluster> = {
  lademeter: {
    id: "lademeter",
    label: "Lademeter",
    links: [
      { href: "/", label: "Lademeter-Rechner", description: "Lademeter, Bodenstellplätze und frachtpflichtiges Gewicht berechnen." },
      { href: "/lademeter-tabelle/", label: "Lademeter-Tabelle", description: "Richtwerte für Paletten und Fahrzeuge zum Nachschlagen." },
      sattelzug,
      { href: "/methodik/", label: "Berechnungsgrundlagen", description: "Formeln, Annahmen und Grenzen der Rechner." },
    ],
  },
  paletten: {
    id: "paletten",
    label: "Paletten",
    links: [
      { href: "/lkw-palettenrechner/", label: "LKW-Palettenrechner", description: "Wie viele Paletten passen in den LKW? Mit Ladeplan." },
      { href: "/lademeter-tabelle/", label: "Lademeter-Tabelle", description: "Lademeter je Palettentyp und Palettenanzahl." },
      { href: "/kartons-pro-palette-rechner/", label: "Kartons-pro-Palette-Rechner", description: "Kartons pro Lage und Palette mit Lagenbild." },
    ],
  },
  volumengewicht: {
    id: "volumengewicht",
    label: "Volumengewicht und Fracht",
    links: [
      { href: "/volumengewicht-rechner/", label: "Volumengewicht-Rechner", description: "Volumengewicht und frachtpflichtiges Gewicht berechnen." },
      { href: "/ratgeber/lademeter-in-kg-umrechnen/", label: "Lademeter in kg umrechnen", description: "Faktor und Abrechnung bei Speditionen." },
      { href: "/", label: "Lademeter-Rechner", description: "Lademeter und frachtpflichtiges Gewicht je Sendung." },
    ],
  },
  fahrzeuge: {
    id: "fahrzeuge",
    label: "Fahrzeuge und Ladeflächen",
    links: [
      { href: "/fahrzeuge/", label: "Fahrzeuge und Maße", description: "Übersicht aller Fahrzeuge mit Ladefläche, Lademetern und Paletten." },
      sattelzug,
      { href: "/fahrzeuge/megatrailer/", label: "Megatrailer: Maße und Paletten", description: "Mehr Innenhöhe, gleiche Fläche: was das bringt." },
      { href: "/lkw-palettenrechner/", label: "LKW-Palettenrechner", description: "Palettenzahl je Fahrzeug berechnen." },
      { href: "/lkw-beladungsrechner/", label: "LKW-Beladungsrechner", description: "Ladung gegen Fläche, Nutzlast und Volumen prüfen." },
    ],
  },
  versand: {
    id: "versand",
    label: "Versand und Frachtkosten",
    links: [
      { href: "/lkw-beladungsrechner/", label: "LKW-Beladungsrechner", description: "Mehrere Positionen gegen ein Fahrzeug prüfen." },
      { href: "/volumengewicht-rechner/", label: "Volumengewicht-Rechner", description: "Frachtpflichtiges Gewicht für Paket, Luft- und Seefracht." },
      { href: "/ratgeber/lademeter-in-kg-umrechnen/", label: "Lademeter in kg umrechnen", description: "Wie Speditionen Lademeter und Gewicht verknüpfen." },
    ],
  },
  ladungssicherung: {
    id: "ladungssicherung",
    label: "Ladungssicherung",
    links: [
      { href: "/ratgeber/lkw-beladung-richtig-planen/", label: "LKW-Beladung planen", description: "Checkliste in 7 Schritten mit Beispiel." },
      { href: "/lkw-beladungsrechner/", label: "LKW-Beladungsrechner", description: "Fläche, Gewicht und Volumen vorab prüfen." },
      { href: "/ratgeber/achslast-und-gesamtgewicht-lkw/", label: "Nutzlast und Lastverteilung", description: "Nutzlast ausrechnen, Ladung verteilen." },
      { href: "/anhaenger-zuladungsrechner/", label: "Anhänger-Zuladungsrechner", description: "Zuladung, Anhängelast und Stützlast für Pkw mit Anhänger." },
      { href: "/zuladungsrechner/", label: "Zuladungsrechner", description: "Freie Zuladung von Pkw, Transporter und Wohnmobil." },
    ],
  },
  vorschriften: {
    id: "vorschriften",
    label: "Gewichte, Maße und Vorschriften",
    links: [
      { href: "/lkw-beladungsrechner/", label: "LKW-Beladungsrechner", description: "Nutzlast, Fläche und Volumen prüfen." },
      { href: "/fahrzeuge/", label: "Fahrzeuge und Maße", description: "Innenmaße und Nutzlasten gängiger Fahrzeuge." },
      { href: "/ratgeber/ladungssicherung-lkw-grundlagen/", label: "Ladungssicherung im LKW", description: "Pflichten, Verantwortliche und Hilfsmittel." },
      { href: "/anhaenger-zuladungsrechner/", label: "Anhänger-Zuladungsrechner", description: "Zuladung, Anhängelast und Stützlast für Pkw mit Anhänger." },
    ],
  },
  container: {
    id: "container",
    label: "Container und See-/Luftfracht",
    links: [
      { href: "/fahrzeuge/container-20-fuss/", label: "20-Fuß-Container", description: "Innenmaße und Palettenanzahl." },
      { href: "/fahrzeuge/container-40-fuss/", label: "40-Fuß-Container und High Cube", description: "Innenmaße und Palettenanzahl." },
      { href: "/lkw-palettenrechner/", label: "Palettenrechner", description: "Paletten im Container berechnen." },
    ],
  },
  palettierung: {
    id: "palettierung",
    label: "Kartons und Palettierung",
    links: [
      { href: "/kartons-pro-palette-rechner/", label: "Kartons-pro-Palette-Rechner", description: "Lagenbild, Höhe und Gewicht berechnen." },
      { href: "/lkw-palettenrechner/", label: "LKW-Palettenrechner", description: "Wie viele Paletten passen ins Fahrzeug?" },
      { href: "/ratgeber/europaletten-und-palettenarten/", label: "Palettenarten im Überblick", description: "Euro-, Industrie- und Halbpalette im Vergleich." },
    ],
  },
  schuettgewicht: {
    id: "schuettgewicht",
    label: "Schüttgewicht und Dichte",
    links: [
      { href: "/lkw-beladungsrechner/", label: "LKW-Beladungsrechner", description: "Gewicht und Volumen gegen die Nutzlast prüfen." },
      { href: "/ratgeber/achslast-und-gesamtgewicht-lkw/", label: "Nutzlast und Lastverteilung", description: "Nutzlast ausrechnen, Ladung verteilen." },
      { href: "/volumengewicht-rechner/", label: "Volumengewicht-Rechner", description: "Gewicht je Kubikmeter und Abrechnungsgewicht." },
    ],
  },
};

/** Clusters of the existing articles; new articles use the `cluster:` frontmatter field instead. */
export const SLUG_CLUSTER: Record<string, ClusterId> = {
  "was-sind-lademeter": "lademeter",
  "lademeter-in-kg-umrechnen": "lademeter",
  "lademeter-oder-kubikmeter-unterschied": "lademeter",
  "stapelfaktor-lademeter": "lademeter",
  "europaletten-und-palettenarten": "paletten",
  "kartons-pro-palette-berechnen": "palettierung",
  "lkw-beladung-richtig-planen": "fahrzeuge",
  "stueckgut-teilladung-komplettladung": "versand",
  "ladungssicherung-lkw-grundlagen": "ladungssicherung",
  "achslast-und-gesamtgewicht-lkw": "vorschriften",
};

export function isClusterId(value: unknown): value is ClusterId {
  return typeof value === "string" && (CLUSTER_IDS as readonly string[]).includes(value);
}

export function getClusterIdForArticle(article: Pick<Article, "slug"> & { cluster?: string }): ClusterId | undefined {
  if (isClusterId(article.cluster)) return article.cluster;
  return SLUG_CLUSTER[article.slug];
}

/**
 * Links shown in the "Mehr zum Thema" block: curated links first, then sibling articles of the same cluster.
 * The current page is excluded; at most `limit` links.
 */
export function getClusterNavLinks(clusterId: ClusterId, currentPath: string, limit = 6): { label: string; links: ClusterLink[] } {
  const cluster = CLUSTERS[clusterId];
  const curated = [...cluster.links];
  if (DOWNLOADS_LIVE && clusterId === "lademeter") {
    curated.push(
      { href: excelAsset.path, label: "Excel-Vorlage Lademeter", description: "Kostenlose Vorlage zum Download." },
      { href: worksheetAsset.path, label: "Aufgabenblatt Lademeter", description: "12 Aufgaben mit Lösungen für Unterricht und Ausbildung." },
    );
  }
  const siblings: ClusterLink[] = getAllArticles()
    .filter((article) => getClusterIdForArticle(article) === clusterId)
    .map((article) => ({ href: `/ratgeber/${article.slug}/`, label: article.title, description: article.category }));

  const seen = new Set<string>([currentPath]);
  const links: ClusterLink[] = [];
  for (const link of [...siblings, ...curated]) {
    if (seen.has(link.href)) continue;
    seen.add(link.href);
    links.push(link);
    if (links.length >= limit) break;
  }
  return { label: cluster.label, links };
}
