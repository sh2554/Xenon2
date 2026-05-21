export default function SpecHeatmapGrid({ topics = [], compact = false }) {
  if (!topics.length) {
    return <p className="text-sm text-[var(--muted)] italic">No heatmap data yet.</p>;
  }

  return (
    <div className={`grid gap-3 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
      {topics.map((spec) => {
        const isNa = spec.mastery === "n/a";
        const pct = isNa ? 0 : parseInt(spec.mastery, 10) || spec.pct || 0;
        const color = isNa
          ? "border-[var(--border)] bg-[var(--panel-soft)] text-[var(--muted)]"
          : pct >= 80
            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
            : pct >= 60
              ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-300"
              : pct >= 40
                ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                : "border-red-500/50 bg-red-500/10 text-red-400";

        return (
          <div key={spec.topicId || spec.topic} className={`p-3 rounded-xl border ${color}`}>
            <p className="text-[10px] font-black uppercase tracking-wider opacity-70">OCR J277</p>
            <h4 className="text-xs font-bold mt-1 leading-snug">{spec.topic}</h4>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px]">
              <span className="font-bold">{spec.label}</span>
              <span className="font-black">{isNa ? "—" : spec.mastery}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
