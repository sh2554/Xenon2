import { Crown, Sparkles } from "lucide-react";
import { getPlanBadge } from "../lib/planFeatures";

export default function PlanBadge({ plan, size = "sm", showGlow = false }) {
  const badge = getPlanBadge(plan);
  if (!badge) return null;

  const sizeClass =
    size === "lg"
      ? "text-[10px] px-2.5 py-1"
      : size === "md"
        ? "text-[9px] px-2 py-0.5"
        : "text-[8px] px-1.5 py-0.5";

  return (
    <span
      className={`font-black uppercase tracking-wider border rounded leading-none inline-flex items-center gap-1 ${sizeClass} ${badge.className}`}
      style={showGlow ? { boxShadow: badge.glow } : undefined}
      title={badge.shortLabel}
    >
      {badge.tier === "max" ? (
        <Crown className="h-2.5 w-2.5 shrink-0" strokeWidth={2.5} />
      ) : (
        <Sparkles className="h-2.5 w-2.5 shrink-0" strokeWidth={2.5} />
      )}
      {badge.label}
    </span>
  );
}
