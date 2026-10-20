/**
 * Parses numbers the way German users type them.
 *
 * - "1,2"      -> 1.2   (comma decimal separator)
 * - "1.200,5"  -> 1200.5 (dot thousands separator + comma decimal)
 * - "1.200"    -> 1200  (dot followed by exactly three digits groups = thousands)
 * - "1.25"     -> 1.25  (any other dot is treated as decimal point)
 * - "1 200"    -> 1200  (spaces / non-breaking spaces are ignored)
 *
 * Returns `null` for empty or non-numeric input so callers can distinguish
 * "not entered" from zero.
 */
export function parseDecimal(raw: string | null | undefined): number | null {
  if (raw === null || raw === undefined) return null;
  let value = String(raw).trim().replace(/[\s  ]/g, "");
  if (value === "") return null;

  if (value.includes(",")) {
    value = value.replace(/\./g, "").replace(",", ".");
  } else if (/^-?\d{1,3}(\.\d{3})+$/.test(value)) {
    value = value.replace(/\./g, "");
  }

  if (!/^-?\d*\.?\d+$|^-?\d+\.$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Formats a number for German display (no forced decimals). */
export function formatDecimal(value: number, maximumFractionDigits = 2): string {
  return value.toLocaleString("de-DE", { maximumFractionDigits });
}
