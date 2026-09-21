import { Trophy, Medal } from "lucide-react";
import clsx from "clsx";
import { getRankStyle } from "../lib/profileThemes";

export default function RankMedal({ rank, size = "md", className = "" }) {
  const style = getRankStyle(rank);
  if (!style) {
    return (
      <span
        className={clsx(
          "inline-flex items-center justify-center font-mono font-black text-[var(--muted)] rounded-lg bg-[var(--panel-soft)] border border-[var(--border)]",
          size === "lg" ? "h-11 w-11 text-sm" : "h-9 w-9 text-xs",
          className
        )}
      >
        #{rank}
      </span>
    );
  }

  const iconSize = size === "lg" ? "h-6 w-6" : size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const box = size === "lg" ? "h-11 w-11" : size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const Icon = rank === 1 ? Trophy : Medal;

  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center rounded-xl border ring-1",
        box,
        style.ring,
        className
      )}
      style={{ borderColor: style.border, background: style.bg, boxShadow: style.glow }}
      title={`${style.label} place`}
    >
      <Icon className={clsx(iconSize, style.iconClass)} strokeWidth={2.25} />
    </span>
  );
}
