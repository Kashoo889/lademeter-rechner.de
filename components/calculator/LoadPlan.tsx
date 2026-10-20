import type { Placement } from "@/lib/calculators/packing";

type LoadPlanProps = {
  /** Container length (horizontal axis) in cm. */
  lengthCm: number;
  /** Container width (vertical axis) in cm. */
  widthCm: number;
  placements: Placement[];
  title: string;
  /** e.g. "Stirnwand" for a vehicle, undefined for a pallet. */
  frontLabel?: string;
  /** Items stacked per position (shown as "×2"). */
  layers?: number;
};

/**
 * Top-down SVG sketch of the computed arrangement. Purely illustrative - the
 * same numbers are available as text in the result panel, so the SVG is
 * marked up with a title/description for assistive technology.
 */
export function LoadPlan({ lengthCm, widthCm, placements, title, frontLabel, layers = 1 }: LoadPlanProps) {
  if (!(lengthCm > 0) || !(widthCm > 0)) return null;
  const pad = Math.max(lengthCm, widthCm) * 0.02;
  const showNumbers = placements.length <= 60;
  const fontSize = Math.min(...placements.map((p) => Math.min(p.lengthCm, p.widthCm)), widthCm) * 0.32;
  const descId = `loadplan-desc-${Math.round(lengthCm)}-${Math.round(widthCm)}-${placements.length}`;

  return (
    <figure className="rounded-xl border border-slate-200 bg-white p-3">
      <svg
        viewBox={`${-pad} ${-pad} ${lengthCm + pad * 2} ${widthCm + pad * 2}`}
        className="h-auto w-full"
        role="img"
        aria-labelledby={`${descId}-t ${descId}`}
      >
        <title id={`${descId}-t`}>{title}</title>
        <desc id={descId}>
          {`Draufsicht: ${placements.length} belegte Stellplätze auf ${Math.round(lengthCm)} × ${Math.round(widthCm)} cm${layers > 1 ? `, je ${layers} Lagen gestapelt` : ""}.`}
        </desc>
        <rect x={0} y={0} width={lengthCm} height={widthCm} fill="#f1f5f9" stroke="#1e293b" strokeWidth={pad * 0.4} />
        {frontLabel ? <rect x={-pad * 0.6} y={0} width={pad * 0.6} height={widthCm} fill="#1e293b" /> : null}
        {placements.map((p, index) => (
          <g key={`${p.x}-${p.y}`}>
            <rect
              x={p.x + pad * 0.08}
              y={p.y + pad * 0.08}
              width={Math.max(0, p.lengthCm - pad * 0.16)}
              height={Math.max(0, p.widthCm - pad * 0.16)}
              rx={pad * 0.15}
              fill={p.rotated ? "#fdba74" : "#f97316"}
              stroke="#7c2d12"
              strokeWidth={pad * 0.08}
            />
            {showNumbers && fontSize > 0 ? (
              <text
                x={p.x + p.lengthCm / 2}
                y={p.y + p.widthCm / 2}
                fontSize={fontSize}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#1c0a02"
                fontFamily="sans-serif"
              >
                {index + 1}
              </text>
            ) : null}
          </g>
        ))}
      </svg>
      <figcaption className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <span>{title}</span>
        <span className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-sm bg-[#f97316]" aria-hidden="true" /> längs
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-sm bg-[#fdba74]" aria-hidden="true" /> gedreht
          </span>
          {layers > 1 ? <span>je Stellplatz {layers} Lagen</span> : null}
          {frontLabel ? <span>▮ {frontLabel} links</span> : null}
        </span>
      </figcaption>
    </figure>
  );
}
