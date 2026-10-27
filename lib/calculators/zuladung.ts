/**
 * Zuladungsrechner für Pkw, Transporter und Wohnmobil (zulässige Gesamtmasse bis 7.500 kg).
 *
 * Alle Angaben in Kilogramm. Regeln (gelesen auf gesetze-im-internet.de und im Leitfaden des
 * Kraftfahrt-Bundesamts zur Zulassungsbescheinigung, Stand Juli 2026):
 *
 * - § 34 Abs. 3 StVZO: zulässige Achslast und zulässiges Gesamtgewicht sind im Betrieb einzuhalten.
 * - KBA-Leitfaden: Feld F.1 technisch zulässige Gesamtmasse (inkl. Stützlast), F.2 im Mitgliedstaat zulässige
 *   Gesamtmasse (für Klassen L, M1, N1 gleich F.1), Feld G Masse des in Betrieb befindlichen Fahrzeugs (Leermasse),
 *   Feld 22 kann auf Antrag die tatsächliche Masse enthalten.
 * - § 42 Abs. 3 StVZO: Leergewicht = betriebsfertig, Kraftstoff zu 90 %, Systeme für andere Flüssigkeiten zu 100 %
 *   (Abwasser ausgenommen), bei Kraftfahrzeugen zuzüglich 75 kg Fahrer.
 *
 * Offen gelassen: Achslasten (erfordern Fahrzeugdaten, die Nutzer meist nicht haben) und Abweichungen der
 * Leermasse laut Papieren von der tatsächlichen Masse. Beides wird im Ergebnis ausdrücklich genannt.
 */

import type { CheckTone } from "@/lib/calculators/anhaengerZuladung";

export type FahrzeugArt = "pkw" | "transporter" | "wohnmobil";

export type ZuladungInput = {
  art: FahrzeugArt;
  /** Zulässige Gesamtmasse (Feld F.2, ersatzweise F.1; bei Abweichung der kleinere Wert). */
  zgg: number | null;
  /** Leermasse (Feld G), ersatzweise tatsächliche Masse aus Feld 22 oder Wägung. */
  leer: number | null;
  /** Mitfahrer ohne Fahrer. */
  personen: number | null;
  /** Gewicht je Mitfahrer, Standard 75 kg. */
  gewichtProPerson: number | null;
  /** Gewicht des Fahrers, Standard 75 kg (in der Leermasse üblicherweise enthalten). */
  fahrer: number | null;
  /** Gepäck und Ladung im Fahrzeug. */
  gepaeck: number | null;
  /** Nach der Erstzulassung ergänztes Zubehör (Dachbox, Träger, Markise, Aufbauten). */
  zubehoer: number | null;
  /** Fahrräder und ihr Gewicht je Rad. */
  raeder: number | null;
  gewichtProRad: number | null;
  /** Wohnmobil: Frischwasser in Litern und Gas in kg. */
  wasserLiter: number | null;
  gasKg: number | null;
  /** Wohnmobil: Wasser und Gas sind laut Papieren bereits in der Leermasse enthalten. */
  wasserGasInLeermasse: boolean;
  /** Stützlast eines Anhängers auf der Kupplung. */
  stuetzlast: number | null;
};

export type ZuladungItem = { id: string; label: string; kg: number; hint?: string };

export type ZuladungResult = {
  max: number;
  items: ZuladungItem[];
  belegt: number;
  rest: number;
  auslastungProzent: number;
  tone: Exclude<CheckTone, "info">;
  summary: string;
  notes: string[];
};

export type ZuladungFieldErrors = Partial<Record<keyof ZuladungInput, string>>;

export const FAHRER_PAUSCHALE_KG = 75;
export const MAX_ZGG_KG = 7500;
const KNAPP_ANTEIL = 0.05;
const WASSER_KG_PRO_LITER = 1;

const nf = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });
const kg = (value: number) => `${nf.format(Math.round(value * 10) / 10)} kg`;

const present = (value: number | null | undefined): value is number =>
  typeof value === "number" && Number.isFinite(value);

export function validateZuladung(input: ZuladungInput): ZuladungFieldErrors {
  const errors: ZuladungFieldErrors = {};
  const positive = (key: keyof ZuladungInput, label: string) => {
    const v = input[key] as number | null;
    if (v !== null && (!Number.isFinite(v) || v <= 0)) errors[key] = `${label}: bitte eine Zahl größer 0 angeben.`;
  };
  const nonNegative = (key: keyof ZuladungInput, label: string) => {
    const v = input[key] as number | null;
    if (v !== null && (!Number.isFinite(v) || v < 0)) errors[key] = `${label}: bitte eine Zahl ab 0 angeben.`;
  };
  positive("zgg", "Zulässige Gesamtmasse");
  positive("leer", "Leermasse");
  nonNegative("gewichtProPerson", "Gewicht je Person");
  nonNegative("fahrer", "Fahrergewicht");
  nonNegative("gepaeck", "Gepäck");
  nonNegative("zubehoer", "Zubehör");
  nonNegative("gewichtProRad", "Gewicht je Fahrrad");
  nonNegative("wasserLiter", "Frischwasser");
  nonNegative("gasKg", "Gas");
  nonNegative("stuetzlast", "Stützlast");
  if (input.personen !== null && (!Number.isInteger(input.personen) || input.personen < 0 || input.personen > 20))
    errors.personen = "Mitfahrer: bitte eine ganze Zahl von 0 bis 20 angeben.";
  if (input.raeder !== null && (!Number.isInteger(input.raeder) || input.raeder < 0 || input.raeder > 20))
    errors.raeder = "Fahrräder: bitte eine ganze Zahl von 0 bis 20 angeben.";
  if (present(input.zgg) && input.zgg > MAX_ZGG_KG)
    errors.zgg = "Dieser Rechner gilt für Fahrzeuge bis 7.500 kg zulässiger Gesamtmasse.";
  if (present(input.zgg) && present(input.leer) && input.leer >= input.zgg)
    errors.leer = "Die Leermasse muss kleiner als die zulässige Gesamtmasse sein.";
  return errors;
}

/** Berechnet die Zuladung. Gibt `null` zurück, wenn Gesamtmasse oder Leermasse fehlen oder Eingaben fehlerhaft sind. */
export function calculateZuladung(input: ZuladungInput): ZuladungResult | null {
  if (Object.keys(validateZuladung(input)).length > 0) return null;
  if (!present(input.zgg) || !present(input.leer)) return null;

  const max = input.zgg - input.leer;
  const items: ZuladungItem[] = [];

  const personen = input.personen ?? 0;
  const proPerson = input.gewichtProPerson ?? FAHRER_PAUSCHALE_KG;
  if (personen > 0) items.push({ id: "mitfahrer", label: `Mitfahrer (${personen} × ${kg(proPerson)})`, kg: personen * proPerson });

  const fahrerMehr = Math.max(0, (input.fahrer ?? FAHRER_PAUSCHALE_KG) - FAHRER_PAUSCHALE_KG);
  if (fahrerMehr > 0)
    items.push({
      id: "fahrer",
      label: "Fahrer über 75 kg",
      kg: fahrerMehr,
      hint: "Ein Fahrer mit 75 kg ist üblicherweise bereits in der Leermasse enthalten (vgl. § 42 Abs. 3 StVZO).",
    });

  if (present(input.gepaeck) && input.gepaeck > 0) items.push({ id: "gepaeck", label: "Gepäck und Ladung", kg: input.gepaeck });
  if (present(input.zubehoer) && input.zubehoer > 0)
    items.push({ id: "zubehoer", label: "Zubehör nach der Erstzulassung", kg: input.zubehoer });

  const raeder = input.raeder ?? 0;
  if (raeder > 0 && present(input.gewichtProRad) && input.gewichtProRad > 0)
    items.push({ id: "raeder", label: `Fahrräder (${raeder} × ${kg(input.gewichtProRad)})`, kg: raeder * input.gewichtProRad });

  if (input.art === "wohnmobil" && !input.wasserGasInLeermasse) {
    if (present(input.wasserLiter) && input.wasserLiter > 0)
      items.push({ id: "wasser", label: `Frischwasser (${nf.format(input.wasserLiter)} l)`, kg: input.wasserLiter * WASSER_KG_PRO_LITER });
    if (present(input.gasKg) && input.gasKg > 0) items.push({ id: "gas", label: "Gas", kg: input.gasKg });
  }

  if (present(input.stuetzlast) && input.stuetzlast > 0)
    items.push({ id: "stuetzlast", label: "Stützlast des Anhängers", kg: input.stuetzlast, hint: "Die Stützlast drückt auf die Kupplung und zählt zum Gewicht des Zugfahrzeugs." });

  const belegt = items.reduce((sum, item) => sum + item.kg, 0);
  const rest = max - belegt;
  const tone: ZuladungResult["tone"] = rest < 0 ? "danger" : rest < Math.max(10, max * KNAPP_ANTEIL) ? "warning" : "success";
  const summary =
    rest < 0
      ? `Das Fahrzeug ist um ${kg(-rest)} überladen (Zuladung ${kg(max)}, belegt ${kg(belegt)}).`
      : tone === "warning"
        ? `Es wird knapp: ${kg(rest)} bleiben von ${kg(max)} Zuladung. Wiegen Sie vor der Fahrt.`
        : `Es bleiben ${kg(rest)} von ${kg(max)} Zuladung.`;

  const notes: string[] = [
    `Rechnung: zulässige Gesamtmasse ${kg(input.zgg)} − Leermasse ${kg(input.leer)} = ${kg(max)} Zuladung; davon ist ${kg(belegt)} belegt (§ 34 Abs. 3 StVZO: das zulässige Gesamtgewicht muss im Betrieb eingehalten werden).`,
    "Zusätzlich zum Gesamtgewicht müssen die zulässigen Achslasten stimmen. Sie lassen sich ohne Fahrzeugdaten nicht berechnen: Schwere Ladung gehört mittig und tief, im Zweifel wiegen Sie auf einer Fahrzeugwaage.",
    "Die Leermasse im Fahrzeugschein (Feld G) kann von der tatsächlichen Masse abweichen, etwa durch Ausstattung und Zubehör. Steht in Feld 22 eine tatsächliche Masse, verwenden Sie diese oder das gewogene Leergewicht.",
    "Maßgeblich sind immer die Eintragungen in Ihren Fahrzeugpapieren. Der Rechner ersetzt weder Wiegen noch Rechtsberatung.",
  ];
  if (input.art === "wohnmobil") {
    notes.push(
      input.wasserGasInLeermasse
        ? "Wasser und Gas wurden nicht abgezogen, weil Sie angegeben haben, dass sie bereits in der Leermasse enthalten sind. Prüfen Sie das im Datenblatt Ihres Herstellers."
        : "Wasser und Gas werden abgezogen. Sind sie laut Datenblatt bereits in der Leermasse enthalten, rechnen Sie zu vorsichtig: Haken bei „bereits in der Leermasse enthalten“ setzen.",
    );
  }
  return { max, items, belegt, rest, auslastungProzent: max > 0 ? (belegt / max) * 100 : 0, tone, summary, notes };
}
