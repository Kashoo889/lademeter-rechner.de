/**
 * Decorative top-down trailer (13,6 m x 2,4 m) fully loaded with 33 Europaletten
 * (11 rows x 3). Purely illustrative; the facts beneath mirror the site's own
 * reference data. Animation is CSS-only and disabled for reduced motion.
 */
export function HeroVisual() {
  const columns = 11;
  const rows = 3;
  return (
    <div className="animate-fade-up rounded-2xl border border-white/10 bg-white/[0.05] p-4 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-5" style={{ animationDelay: "0.15s" }}>
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-widest text-slate-400">
        <span>Sattelauflieger 13,6 m</span>
        <span className="rounded-full bg-brand-500/15 px-2 py-0.5 text-brand-300">33 Europaletten</span>
      </div>
      <svg viewBox="0 0 700 140" className="mt-3 h-auto w-full" role="img" aria-label="Draufsicht eines Sattelaufliegers, beladen mit 33 Europaletten in 11 Reihen zu je 3 Paletten">
        <rect x="0.5" y="0.5" width="699" height="139" rx="6" fill="#0f1a31" stroke="#475569" />
        {Array.from({ length: columns }).flatMap((_, column) =>
          Array.from({ length: rows }).map((__, row) => (
            <rect
              key={`${column}-${row}`}
              className="pallet-anim"
              style={{ animationDelay: `${0.25 + column * 0.07 + row * 0.03}s` }}
              x={8 + column * 62.8}
              y={7 + row * 42}
              width={60.8}
              height={40}
              rx={3}
              fill={row === 1 ? "#fb923c" : "#f97316"}
              stroke="#7c2d12"
              strokeWidth={1}
            />
          )),
        )}
      </svg>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[
          ["0,4 ldm", "je Europalette"],
          ["13,6 ldm", "ganzer Sattelzug"],
          ["L × B ÷ 2,4", "Formel"],
        ].map(([value, label]) => (
          <div key={label} className="rounded-lg bg-white/[0.06] px-2 py-2.5">
            <dt className="sr-only">{label}</dt>
            <dd className="num text-sm font-bold text-white sm:text-base">{value}</dd>
            <p className="mt-0.5 text-[11px] text-slate-400" aria-hidden="true">
              {label}
            </p>
          </div>
        ))}
      </dl>
    </div>
  );
}
