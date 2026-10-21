// Erzeugt das Aufgabenblatt "Lademeter berechnen" als HTML. Alle Lösungen werden mit den Rechenkernen
// von lademeter-rechner.de (lib/calculators/lademeter.ts) berechnet - nichts ist von Hand eingetippt.
// Aufruf: node seo/tools/build_worksheet_html.mjs ausgabe.html
// PDF: HTML im Browser öffnen und "Als PDF drucken" (A4, Hochformat, Hintergrundgrafiken an) oder per Playwright.
import fs from "node:fs";
import { calculateLademeter } from "../../lib/calculators/lademeter.ts";

const out = process.argv[2] || "Aufgabenblatt-Lademeter-berechnen.html";
// --ohne-loesungen: Schülerfassung (Aufgaben ohne Lösungen, Bewertungsvorschlag und Lehrkräfte-Hinweise)
const STUDENT = process.argv.includes("--ohne-loesungen");
const VERSION = "1.0";
const STAND = "20.10.2026";

const de = (x, d = 2) => x.toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });
const de0 = (x) => x.toLocaleString("de-DE", { maximumFractionDigits: 0 });
const calc = (unit, items, factor = null) => calculateLademeter({ unit, items, kgPerLoadingMeter: factor });
const item = (length, width, quantity, extra = {}) => ({ length, width, quantity, ...extra });

// ---------- Aufgaben (Text + Lösung aus dem Rechenkern) ----------
const tasks = [];

{ const r = calc("m", [item(1.2, 0.8, 1)]);
  tasks.push({ level: "A", pts: 1, text: "Eine Europalette misst 1,20 m × 0,80 m. Berechnen Sie, wie viele Lademeter sie belegt.",
    steps: ["Grundfläche: 1,20 m × 0,80 m = 0,96 m²", "Lademeter: 0,96 m² ÷ 2,4 m = 0,40"], answer: `${de(r.totalLoadingMeters)} ldm` }); }

{ const r = calc("m", [item(1.2, 1.0, 1)]);
  tasks.push({ level: "A", pts: 1, text: "Eine Industriepalette misst 1,20 m × 1,00 m. Wie viele Lademeter belegt sie?",
    steps: ["Grundfläche: 1,20 m × 1,00 m = 1,20 m²", "Lademeter: 1,20 m² ÷ 2,4 m = 0,50"], answer: `${de(r.totalLoadingMeters)} ldm` }); }

{ const r = calc("m", [item(1.2, 0.8, 10)]);
  tasks.push({ level: "A", pts: 2, text: "Zehn Europaletten stehen nebeneinander auf dem Boden und sind nicht stapelbar. Wie viele Bodenstellplätze und Lademeter werden benötigt?",
    steps: ["Bodenstellplätze: 10 (nicht stapelbar)", "Lademeter: 10 × 0,40 = 4,0"], answer: `${r.totalFloorPositions} Bodenstellplätze, ${de(r.totalLoadingMeters, 1)} ldm` }); }

{ const r = calc("m", [item(1.2, 0.8, 10, { stackLayers: 2 })]);
  tasks.push({ level: "A", pts: 2, text: "Dieselben zehn Europaletten dürfen zweilagig gestapelt werden. Wie viele Bodenstellplätze und Lademeter werden jetzt benötigt?",
    steps: ["Bodenstellplätze: 10 ÷ 2 Lagen = 5", "Lademeter: 5 × 0,40 = 2,0"], answer: `${r.totalFloorPositions} Bodenstellplätze, ${de(r.totalLoadingMeters, 1)} ldm` }); }

{ const r = calc("m", [item(1.2, 1.0, 7, { stackLayers: 2 })]);
  tasks.push({ level: "B", pts: 3, text: "Sieben Industriepaletten (1,20 m × 1,00 m) dürfen zweilagig gestapelt werden. Wie viele Lademeter entstehen? Beachten Sie die ungerade Anzahl.",
    steps: ["Bodenstellplätze: 7 ÷ 2 = 3,5 → aufrunden auf 4", "Lademeter: 4 × 0,50 = 2,0"], answer: `${r.totalFloorPositions} Bodenstellplätze, ${de(r.totalLoadingMeters, 1)} ldm` }); }

{ const r = calc("m", [item(1.2, 0.8, 8), item(1.2, 1.0, 6)]);
  tasks.push({ level: "B", pts: 4, text: "Eine Sendung besteht aus 8 Europaletten und 6 Industriepaletten, alle nicht stapelbar. (a) Wie viele Lademeter ergibt die Sendung? (b) Welchen Anteil eines Sattelzugs mit 13,6 Lademetern belegt sie, und wie viele Lademeter bleiben frei?",
    steps: ["Europaletten: 8 × 0,40 = 3,2 ldm", "Industriepaletten: 6 × 0,50 = 3,0 ldm", "Summe: 3,2 + 3,0 = 6,2 ldm", `Anteil: 6,2 ÷ 13,6 = ${de(r.semiTrailerSharePercent)} %`, `Rest: 13,6 − 6,2 = ${de(13.6 - r.totalLoadingMeters, 1)} ldm`],
    answer: `(a) ${de(r.totalLoadingMeters, 1)} ldm; (b) ${de(r.semiTrailerSharePercent)} %, Rest ${de(13.6 - r.totalLoadingMeters, 1)} ldm` }); }

{ const r = calc("cm", [item(85, 65, 20)]);
  tasks.push({ level: "B", pts: 3, text: "20 Kisten mit den Maßen 85 cm × 65 cm sind nicht stapelbar. Wie viele Lademeter benötigen sie? Runden Sie das Ergebnis auf zwei Dezimalstellen.",
    steps: ["In Meter umrechnen: 0,85 m × 0,65 m = 0,5525 m²", "Je Kiste: 0,5525 ÷ 2,4 = 0,2302 ldm", `Gesamt: 20 × 0,2302 ≈ ${de(r.totalLoadingMeters)} ldm`], answer: `${de(r.totalLoadingMeters)} ldm` }); }

{ const r = calc("cm", [item(110, 90, 12, { stackLayers: 3 })]);
  tasks.push({ level: "B", pts: 4, text: "12 Kisten (110 cm × 90 cm) dürfen dreilagig gestapelt werden. Bestimmen Sie Bodenstellplätze, Lademeter und die belegte Grundfläche in m².",
    steps: ["Bodenstellplätze: 12 ÷ 3 = 4", "Grundfläche je Stellplatz: 1,10 m × 0,90 m = 0,99 m²", `Grundfläche: 4 × 0,99 = ${de(r.totalFootprintSqm)} m²`, `Lademeter: 0,99 ÷ 2,4 × 4 = ${de(r.totalLoadingMeters)}`],
    answer: `${r.totalFloorPositions} Bodenstellplätze, ${de(r.totalFootprintSqm)} m², ${de(r.totalLoadingMeters)} ldm` }); }

{ const r = calc("mm", [item(1240, 835, 9)]);
  tasks.push({ level: "B", pts: 3, text: "Neun Behälter mit 1.240 mm × 835 mm Grundfläche stehen nicht stapelbar im Fahrzeug. Rechnen Sie in Meter um und bestimmen Sie die Lademeter (zwei Dezimalstellen).",
    steps: ["In Meter: 1,240 m × 0,835 m = 1,0354 m²", "Je Behälter: 1,0354 ÷ 2,4 = 0,4314 ldm", `Gesamt: 9 × 0,4314 ≈ ${de(r.totalLoadingMeters)} ldm`], answer: `${de(r.totalLoadingMeters)} ldm` }); }

{ const r = calc("m", [item(1.2, 0.8, 10, { weight: 420 })], 1850);
  tasks.push({ level: "C", pts: 4, text: "10 Europaletten wiegen je 420 kg (nicht stapelbar). Die Spedition rechnet mit 1.850 kg je Lademeter. Bestimmen Sie das tatsächliche Gewicht, das Lademetergewicht und das frachtpflichtige Gewicht.",
    steps: ["Lademeter: 10 × 0,40 = 4,0 ldm", `Tatsächliches Gewicht: 10 × 420 kg = ${de0(r.totalWeightKg)} kg`, `Lademetergewicht: 4,0 × 1.850 kg = ${de0(r.loadingMeterWeightKg)} kg`, `Frachtpflichtig ist der höhere Wert: ${de0(r.chargeableWeightKg)} kg (Lademetergewicht)`],
    answer: `${de0(r.totalWeightKg)} kg / ${de0(r.loadingMeterWeightKg)} kg / ${de0(r.chargeableWeightKg)} kg` }); }

{ const r = calc("m", [item(1.2, 1.0, 6, { weight: 1100 })], 1850);
  tasks.push({ level: "C", pts: 4, text: "6 Industriepaletten wiegen je 1.100 kg (nicht stapelbar). Faktor der Spedition: 1.850 kg je Lademeter. Welches Gewicht ist frachtpflichtig, und warum?",
    steps: ["Lademeter: 6 × 0,50 = 3,0 ldm", `Lademetergewicht: 3,0 × 1.850 kg = ${de0(r.loadingMeterWeightKg)} kg`, `Tatsächliches Gewicht: 6 × 1.100 kg = ${de0(r.totalWeightKg)} kg`, `Frachtpflichtig: ${de0(r.chargeableWeightKg)} kg – hier ist das tatsächliche Gewicht höher als das Lademetergewicht`],
    answer: `${de0(r.chargeableWeightKg)} kg (tatsächliches Gewicht)` }); }

{ const withStack = calc("m", [item(1.2, 0.8, 10, { stackLayers: 2 })]);
  const without = calc("m", [item(1.2, 0.8, 10)]);
  tasks.push({ level: "C", pts: 4, text: "Zehn Europaletten sind je 1,40 m hoch. Die Innenhöhe des Fahrzeugs beträgt 2,70 m (Planungswert). (a) Ist zweilagiges Stapeln möglich? (b) Wie viele Lademeter sind dann anzusetzen? (c) Nennen Sie zwei weitere Punkte, die vor dem Stapeln geprüft werden müssen.",
    steps: ["(a) Zwei Lagen: 2 × 1,40 m = 2,80 m. Das ist mehr als die Innenhöhe von 2,70 m – zweilagiges Stapeln ist nicht möglich.",
      `(b) Es bleibt bei 10 Bodenstellplätzen: ${de(without.totalLoadingMeters, 1)} ldm (statt ${de(withStack.totalLoadingMeters, 1)} ldm bei zweilagigem Stapeln).`,
      "(c) z. B. Belastbarkeit/Stapelbarkeit der Ware, Ladungssicherung, Vorgaben der Spedition, Gewicht der oberen Lage."],
    answer: `(a) nein; (b) ${de(without.totalLoadingMeters, 1)} ldm; (c) z. B. Belastbarkeit, Ladungssicherung` }); }

const levelName = { A: "Grundlagen", B: "Anwendung", C: "Praxis" };
const totalPts = tasks.reduce((s, t) => s + t.pts, 0);

const css = `
@page { size: A4; margin: 16mm 15mm 18mm; }
* { box-sizing: border-box; }
body { font-family: "Segoe UI", Arial, sans-serif; font-size: 10.5pt; color: #0b1324; line-height: 1.45; margin: 0; }
h1 { font-size: 22pt; margin: 0; letter-spacing: -0.5px; } h2 { font-size: 13pt; margin: 16px 0 6px; padding-bottom: 3px; border-bottom: 2px solid #f97316; page-break-after: avoid; }
h3 { font-size: 11pt; margin: 12px 0 4px; }
.top { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #0b1324; padding-bottom: 8px; }
.brand { font-size: 9pt; color: #475569; text-align: right; } .sub { color: #475569; margin-top: 3px; }
.fields { display: flex; gap: 14px; margin: 10px 0 4px; font-size: 9.5pt; } .fields span { flex: 1; border-bottom: 1px solid #94a3b8; padding-bottom: 14px; color: #64748b; }
.box { border: 1px solid #cbd5e1; border-left: 5px solid #f97316; background: #fff7ed; padding: 8px 12px; margin: 10px 0; page-break-inside: avoid; }
.box.n { background: #f8fafc; border-left-color: #0b1324; } .formula { font-weight: 700; margin: 3px 0; }
.task { border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; margin: 8px 0; page-break-inside: avoid; }
.task .h { display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 3px; } .tag { font-size: 8.5pt; font-weight: 600; color: #9a3412; background: #ffedd5; border-radius: 9px; padding: 0 7px; }
.pts { font-weight: 400; color: #64748b; font-size: 9pt; } .space { height: 34px; border-bottom: 1px dotted #cbd5e1; margin-top: 4px; }
.sol { border-left: 4px solid #0b1324; padding: 4px 12px; margin: 8px 0; page-break-inside: avoid; } .sol ol, .sol ul { margin: 3px 0 3px 18px; padding: 0; } .ans { font-weight: 700; color: #9a3412; }
.pb { page-break-before: always; } small, .small { color: #475569; font-size: 8.8pt; }
table { border-collapse: collapse; width: 100%; margin: 6px 0; font-size: 9.5pt; } th { background: #0b1324; color: #fff; text-align: left; padding: 4px 8px; } td { border-bottom: 1px solid #e2e8f0; padding: 3px 8px; }
`;

const taskHtml = tasks.map((t, i) => `<div class="task"><div class="h"><span>Aufgabe ${i + 1} <span class="tag">${levelName[t.level]}</span></span><span class="pts">${t.pts} ${t.pts === 1 ? "Punkt" : "Punkte"}</span></div>${t.text}<div class="space"></div></div>`).join("\n");
const solHtml = tasks.map((t, i) => `<div class="sol"><b>Aufgabe ${i + 1}</b> <span class="small">(${t.pts} P.)</span><ol>${t.steps.map((s) => `<li>${s}</li>`).join("")}</ol><div class="ans">Ergebnis: ${t.answer}</div></div>`).join("\n");

const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Aufgabenblatt: Lademeter berechnen${STUDENT ? " (ohne Lösungen)" : ""}</title><style>${css}</style></head><body>
<div class="top"><div><h1>Lademeter berechnen</h1><div class="sub">Aufgabenblatt für Ausbildung und Unterricht · Spedition und Logistik · 12 Aufgaben${STUDENT ? "" : " mit Lösungen"}</div></div><div class="brand"><b>lademeter-rechner.de</b><br>Version ${VERSION} · Stand ${STAND}</div></div>
<div class="fields"><span>Name:</span><span>Klasse/Kurs:</span><span>Datum:</span></div>

<h2>Lernziele</h2>
<ul><li>Die Lademeter-Formel anwenden und Maße in Meter umrechnen.</li><li>Bodenstellplätze bei gestapelter Ware bestimmen (Anzahl ÷ Lagen, aufrunden).</li><li>Lademetergewicht und frachtpflichtiges Gewicht bestimmen und die Auslastung eines Fahrzeugs einschätzen.</li></ul>

<div class="box"><b>Merkkasten – Rechenkonvention dieses Blatts</b>
<div class="formula">Lademeter = Länge [m] × Breite [m] ÷ 2,4 m × Bodenstellplätze</div>
<div class="formula">Bodenstellplätze = Anzahl ÷ Stapellagen (aufrunden)</div>
<div class="formula">Lademetergewicht = Lademeter × Faktor [kg je ldm]</div>
<div class="formula">Frachtpflichtiges Gewicht = höherer Wert aus tatsächlichem Gewicht und Lademetergewicht</div>
<div class="small">2,4 m ist die in der Branche übliche Referenzbreite der Ladefläche (Planungsgröße, keine Norm). Ein Standard-Sattelzug wird mit 13,6 m Ladelänge = 13,6 Lademetern angesetzt. Rechnen Sie, wenn nicht anders angegeben, auf zwei Dezimalstellen.</div></div>

<h2>Aufgaben <span class="pts">(insgesamt ${totalPts} Punkte)</span></h2>
${taskHtml}

${STUDENT ? `<div class="small" style="margin-top:14px"><b>Lizenz:</b> © lademeter-rechner.de, CC BY 4.0 – Nutzung, Vervielfältigung und Anpassung sind mit Quellenangabe „lademeter-rechner.de“ erlaubt. Alle Angaben ohne Gewähr. Lösungen und Hinweise für Lehrkräfte: lademeter-rechner.de/lademeter-aufgaben/</div>` : `<div class="pb"></div>
<h2>Lösungen mit Rechenweg</h2>
${solHtml}
<div class="box n"><b>Bewertungsvorschlag:</b> ${totalPts} Punkte insgesamt. Teilpunkte für richtigen Rechenweg bei Folgefehlern. Das ist ein Vorschlag; Lehrkräfte können die Punkte anpassen.</div>

<h2>Hinweise für Lehrkräfte</h2>
<ul class="small">
<li><b>Konvention statt Norm:</b> Die Lademeter-Formel ist eine Branchenkonvention. Speditionen können abweichend runden (z. B. auf 0,1 ldm oder ganze Lademeter) oder andere Faktoren (kg je Lademeter) ansetzen. Die Aufgaben verwenden die exakten Rechenwerte.</li>
<li><b>Stapeln:</b> Die Rechnung setzt voraus, dass Ware tatsächlich stapelbar und sicher gesichert werden kann (Innenhöhe, Belastbarkeit, Ladungssicherung). Aufgabe 12 greift das auf. Der Wert 2,70 m Innenhöhe ist ein Planungswert, keine Herstellerangabe.</li>
<li><b>Eigene Aufgaben:</b> Alle Aufgaben und Zahlen wurden eigens für dieses Blatt erstellt. Sie stammen nicht aus IHK-Prüfungen oder Verlagswerken; solche Aufgaben dürfen nicht kopiert werden.</li>
<li><b>Prüfung der Lösungen:</b> Alle Ergebnisse wurden mit den Rechenkernen des Online-Rechners berechnet (Rechenweg: ${"lademeter-rechner.de/methodik/"}). Nachrechnen: lademeter-rechner.de.</li>
<li><b>Lizenz:</b> © lademeter-rechner.de, CC BY 4.0 – Nutzung, Vervielfältigung und Anpassung sind mit Quellenangabe „lademeter-rechner.de“ erlaubt. Alle Angaben ohne Gewähr.</li>
</ul>
`}
</body></html>`;

fs.writeFileSync(out, html, "utf8");
console.log(`geschrieben: ${out} (${tasks.length} Aufgaben, ${totalPts} Punkte)`);
console.log(JSON.stringify(tasks.map((t, i) => ({ n: i + 1, answer: t.answer })), null, 0));
