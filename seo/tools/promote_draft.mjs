// Gibt einen geprüften Entwurf für die Veröffentlichung frei: kopiert ihn nach content/ratgeber/.
//   node seo/tools/promote_draft.mjs seo/drafts/<slug>.md --approved-by "Name"
// Sicherungen:
//  1. Das Qualitäts-Gate (check_draft.mjs) muss bestanden sein.
//  2. --approved-by <Name> ist Pflicht (menschliche Freigabe).
//  3. Vor dem Datum `publishedAt` im Entwurf wird NICHT freigegeben (kein Vorab-Veröffentlichen).
// Das Skript committet und deployt nichts. Danach: npm test, npm run check:seo, dann Freigabe zum Deployment.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { CONTENT_DIR, ROOT, splitDraft } from "./lib.mjs";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--") && a !== args[args.indexOf("--approved-by") + 1] && a !== args[args.indexOf("--today") + 1]);
const approvedBy = args[args.indexOf("--approved-by") + 1];
const todayArg = args.includes("--today") ? args[args.indexOf("--today") + 1] : null;
const dryRun = args.includes("--dry-run");

if (!file || !args.includes("--approved-by") || !approvedBy || approvedBy.startsWith("--")) {
  console.error('Aufruf: node seo/tools/promote_draft.mjs <entwurf.md> --approved-by "Name" [--dry-run]');
  process.exit(2);
}

const { frontmatter } = splitDraft(fs.readFileSync(file, "utf8"));
if (!frontmatter) {
  console.error("Frontmatter fehlt oder ist ungültig.");
  process.exit(1);
}

const today = todayArg ?? new Date().toISOString().slice(0, 10);
if (today < String(frontmatter.publishedAt)) {
  console.error(`Abbruch: Veröffentlichung erst ab ${frontmatter.publishedAt} (heute: ${today}). Keine Vorab-Veröffentlichung.`);
  process.exit(1);
}

const gate = spawnSync(process.execPath, ["--no-warnings", path.join("seo", "tools", "check_draft.mjs"), file], { cwd: ROOT, encoding: "utf8" });
process.stdout.write(gate.stdout);
if (gate.status !== 0) {
  console.error("Abbruch: Qualitäts-Gate nicht bestanden.");
  process.exit(1);
}

const target = path.join(CONTENT_DIR, `${frontmatter.slug}.md`);
if (fs.existsSync(target)) {
  console.error(`Abbruch: ${path.relative(ROOT, target)} existiert bereits (kein Überschreiben).`);
  process.exit(1);
}
if (dryRun) {
  console.log(`Trockenlauf: ${file} würde nach ${path.relative(ROOT, target)} kopiert (Freigabe: ${approvedBy}).`);
  process.exit(0);
}
fs.copyFileSync(file, target);
console.log(`Freigegeben von ${approvedBy}: ${path.relative(ROOT, target)} angelegt. Entwurf bleibt in seo/drafts/ (nach Veröffentlichung löschen oder archivieren).`);
console.log("Weiter: npm test && npm run check:seo, dann Commit/Deployment nur nach Freigabe. Danach in seo/07-editorial-calendar.csv den Status auf „veröffentlicht“ setzen.");
