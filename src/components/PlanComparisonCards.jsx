import { Check } from "lucide-react";
import clsx from "clsx";
import {
  PLANS,
  FREE_FEATURES,
  PRO_EXCLUSIVE_FEATURES,
  MAX_EXCLUSIVE_FEATURES,
} from "../lib/planFeatures";

/**
 * Three-column plan breakdown: Free baseline, Pro-exclusive, Max-exclusive.
 */
export default function PlanComparisonCards({ currentPlan = "free", compact = false }) {
  const tiers = [
    {
      id: "free",
      plan: PLANS.free,
      subtitle: "Always free",
      features: FREE_FEATURES,
      accent: "border-[var(--border)]",
    },
    {
      id: "pro",
      plan: PLANS.pro,
      subtitle: "Student upgrade",
      features: PRO_EXCLUSIVE_FEATURES,
      accent: "border-[var(--warning)]/40",
      headerNote: "Includes all Free features",
    },
    {
      id: "max",
      plan: PLANS.max,
      subtitle: "Teacher / school",
      features: MAX_EXCLUSIVE_FEATURES,
      accent: "border-violet-400/40",
      headerNote: "Includes all Pro + Free",
    },
  ];

  return (
    <div className={clsx("grid gap-4", compact ? "sm:grid-cols-3" : "md:grid-cols-3")}>
      {tiers.map((t) => {
        const isCurrent = currentPlan === t.id;
        return (
          <div
            key={t.id}
            className={clsx(
              "rounded-2xl border p-4 flex flex-col",
              t.accent,
              isCurrent && "ring-2 ring-[var(--accent)] bg-[var(--accent-soft)]"
            )}
          >
            <div className="mb-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">
                {t.subtitle}
              </p>
              <p className="text-lg font-black text-[var(--fg)]">{t.plan.label}</p>
              {t.headerNote && (
                <p className="text-[10px] text-[var(--muted)] mt-1 font-medium">{t.headerNote}</p>
              )}
              {isCurrent && (
                <span className="inline-block mt-2 text-[9px] font-black uppercase bg-[var(--accent)] text-white px-2 py-0.5 rounded">
                  Your plan
                </span>
              )}
            </div>
            <p className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)] mb-2">
              {t.id === "free" ? "Includes" : `${t.plan.label}-only features`}
            </p>
            <ul className="space-y-2 flex-1">
              {t.features.map((f) => (
                <li key={f} className="text-[11px] text-[var(--muted)] flex gap-2 leading-snug">
                  <Check
                    className={clsx(
                      "h-3.5 w-3.5 shrink-0 mt-0.5",
                      t.id === "max" ? "text-violet-400" : t.id === "pro" ? "text-[var(--warning)]" : "text-[var(--success)]"
                    )}
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
