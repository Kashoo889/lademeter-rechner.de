/**
 * Rectangle-in-rectangle packing used by the pallet (vehicle floor) and the
 * carton (pallet layer) calculators.
 *
 * Four guillotine-cut patterns are evaluated. All of them are physically
 * loadable without gaps inside a row/lane and are the patterns that load
 * planners actually use:
 *
 * - "laengs":  every item as entered (item length along container length)
 * - "quer":    every item rotated by 90 degrees
 * - "reihen":  front block of "laengs" rows followed by "quer" rows
 *              (classic 33/34 Europaletten mixed loading of a semi-trailer)
 * - "spuren":  side-by-side lanes, some with "laengs" items and some with
 *              "quer" items (e.g. 11 Europaletten in a 20-foot container)
 *
 * Without rotation only "laengs" is used. With rotation the pattern with the
 * highest count wins; on ties the simpler pattern is preferred (in the order
 * listed above). This is not full 2D bin-packing - irregular "pinwheel"
 * patterns are deliberately out of scope.
 */

export type PackingPattern = "laengs" | "quer" | "reihen" | "spuren";

/** One placed item. x runs along the container length, y along its width (both cm). */
export type Placement = {
  x: number;
  y: number;
  /** Extent along the container length. */
  lengthCm: number;
  /** Extent along the container width. */
  widthCm: number;
  rotated: boolean;
};

export type PackingResult = {
  count: number;
  pattern: PackingPattern;
  /** Human-readable German description of the arrangement. */
  description: string;
  /** All slots of the pattern, sorted front to back (x, then y). */
  placements: Placement[];
};

/** floor(a / b) tolerant to IEEE-754 error (e.g. 240 / 80 = 2.9999999999999996). */
export function floorDiv(a: number, b: number): number {
  if (!(b > 0)) return 0;
  return Math.floor(a / b + 1e-9);
}

function uniformSlots(
  containerL: number,
  containerW: number,
  itemL: number,
  itemW: number,
  rotated: boolean,
  offsetX = 0,
  offsetY = 0,
): Placement[] {
  const rows = floorDiv(containerL, itemL);
  const perRow = floorDiv(containerW, itemW);
  const slots: Placement[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < perRow; c++) {
      slots.push({ x: offsetX + r * itemL, y: offsetY + c * itemW, lengthCm: itemL, widthCm: itemW, rotated });
    }
  }
  return slots;
}

function sortSlots(slots: Placement[]): Placement[] {
  return [...slots].sort((a, b) => a.x - b.x || a.y - b.y);
}

type Candidate = { pattern: PackingPattern; slots: Placement[]; description: string };

/**
 * Finds the best supported pattern for placing items of `itemL x itemW` on a
 * `containerL x containerW` area. All values in centimeters.
 */
export function packRectangles(
  containerL: number,
  containerW: number,
  itemL: number,
  itemW: number,
  allowRotation: boolean,
): PackingResult {
  const candidates: Candidate[] = [];

  const laengs = uniformSlots(containerL, containerW, itemL, itemW, false);
  candidates.push({
    pattern: "laengs",
    slots: laengs,
    description: `${floorDiv(containerW, itemW)} nebeneinander × ${floorDiv(containerL, itemL)} Reihen`,
  });

  if (allowRotation) {
    const quer = uniformSlots(containerL, containerW, itemW, itemL, true);
    candidates.push({
      pattern: "quer",
      slots: quer,
      description: `${floorDiv(containerW, itemL)} nebeneinander × ${floorDiv(containerL, itemW)} Reihen (gedreht)`,
    });

    // Mixed rows along the length: a rows "laengs" followed by b rows "quer".
    const maxA = floorDiv(containerL, itemL);
    let bestRows: Candidate | null = null;
    for (let a = 1; a <= maxA; a++) {
      const restL = containerL - a * itemL;
      const b = floorDiv(restL, itemW);
      if (b < 1) continue;
      const front = uniformSlots(a * itemL, containerW, itemL, itemW, false);
      const back = uniformSlots(b * itemW, containerW, itemW, itemL, true, a * itemL, 0);
      const slots = [...front, ...back];
      if (front.length === 0 || back.length === 0) continue;
      if (!bestRows || slots.length > bestRows.slots.length) {
        bestRows = {
          pattern: "reihen",
          slots,
          description: `gemischt: ${a} Reihen à ${floorDiv(containerW, itemW)} längs + ${b} Reihen à ${floorDiv(containerW, itemL)} quer`,
        };
      }
    }
    if (bestRows) candidates.push(bestRows);

    // Mixed lanes across the width: x lanes "laengs" next to y lanes "quer".
    const maxX = floorDiv(containerW, itemW);
    let bestLanes: Candidate | null = null;
    for (let x = 1; x <= maxX; x++) {
      const restW = containerW - x * itemW;
      const y = floorDiv(restW, itemL);
      if (y < 1) continue;
      const left = uniformSlots(containerL, x * itemW, itemL, itemW, false);
      const right = uniformSlots(containerL, y * itemL, itemW, itemL, true, 0, x * itemW);
      if (left.length === 0 || right.length === 0) continue;
      const slots = [...left, ...right];
      if (!bestLanes || slots.length > bestLanes.slots.length) {
        bestLanes = {
          pattern: "spuren",
          slots,
          description: `gemischt: ${x} Spur(en) längs (je ${floorDiv(containerL, itemL)}) + ${y} Spur(en) quer (je ${floorDiv(containerL, itemW)})`,
        };
      }
    }
    if (bestLanes) candidates.push(bestLanes);
  }

  // Highest count wins; candidates are already ordered by preference for ties.
  let best = candidates[0];
  for (const candidate of candidates) {
    if (candidate.slots.length > best.slots.length) best = candidate;
  }

  return {
    count: best.slots.length,
    pattern: best.pattern,
    description: best.description,
    placements: sortSlots(best.slots),
  };
}
