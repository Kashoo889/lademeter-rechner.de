// Kopiert die fertigen Download-Dateien von seo/assets nach public/downloads (Quelle der Wahrheit: seo/assets).
// Aufruf: node seo/tools/sync_downloads.mjs
import fs from "node:fs";
import path from "node:path";

const files = [
  "Lademeter-Berechnung-Excel-Vorlage.xlsx",
  "Aufgabenblatt-Lademeter-berechnen.pdf",
  "Aufgabenblatt-Lademeter-berechnen-ohne-Loesungen.pdf",
];
const from = path.join("seo", "assets");
const to = path.join("public", "downloads");
fs.mkdirSync(to, { recursive: true });
for (const file of files) {
  fs.copyFileSync(path.join(from, file), path.join(to, file));
  console.log("kopiert:", file);
}
