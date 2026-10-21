// Liest Testfälle (JSON) und gibt die Ergebnisse der Rechenkerne von lademeter-rechner.de aus.
// Aufruf: node seo/tools/core_expected.mjs cases.json > expected.json
import fs from "node:fs";
import { calculateLademeter } from "../../lib/calculators/lademeter.ts";

const cases = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const out = cases.map((c) => {
  const result = calculateLademeter({
    unit: c.unit,
    kgPerLoadingMeter: c.factor ?? null,
    items: c.rows.map((r) => ({
      length: r.length ?? null,
      width: r.width ?? null,
      height: r.height ?? null,
      quantity: r.quantity ?? 0,
      weight: r.weight ?? null,
      stackLayers: r.layers ?? null,
    })),
  });
  return result && { ...result, utilizationNotes: undefined };
});
console.log(JSON.stringify(out));
