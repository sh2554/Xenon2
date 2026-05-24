import clsx from "clsx";
import { ShieldCheck } from "lucide-react";
import { PLANS } from "../lib/planFeatures";

/**
 * Subscription plan card — matches Settings sidebar design (no public codes shown).
 */
export default function SubscriptionPlanCard({
  currentPlan = "free",
  redeemCode = "",
  setRedeemCode,
  redeemMessage = "",
  onRedeem,
  onUpgradeClick,
  className,
}) {
  const plan = PLANS[currentPlan] || PLANS.free;

  return (
    <div className={clsx("xenon-panel p-6 border border-[var(--border)]", className)}>
      <div className="flex items-center gap-2.5 text-[var(--accent)] mb-4">
        <ShieldCheck className="h-5 w-5 shrink-0" strokeWidth={2.5} />
        <span className="text-xs font-black uppercase tracking-[0.2em]">Subscription Plan</span>
      </div>

      <p className="text-sm text-[var(--fg)]">
        Current plan: <strong className="uppercase font-black">{plan.label}</strong>
      </p>
      <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">{plan.tagline}</p>
      <p className="text-[11px] text-[var(--muted)] mt-3 leading-relaxed">
        <strong className="text-[var(--warning)] font-bold">Pro</strong> = student revision.{" "}
        <strong className="text-violet-300 font-bold">Max</strong> = teacher tools (includes Pro).
      </p>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder="Enter access code"
          className="subscription-code-input flex-1 min-w-0 h-10 px-3 rounded-xl text-sm font-medium"
          value={redeemCode}
          onChange={(e) => setRedeemCode?.(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onRedeem?.();
          }}
        />
        <button
          type="button"
          className="shrink-0 h-10 px-4 rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] text-xs font-black uppercase tracking-wide text-[var(--fg)] hover:border-[var(--accent)]/40 hover:text-[var(--accent)] transition-colors"
          onClick={onRedeem}
        >
          Redeem
        </button>
      </div>
      {redeemMessage ? (
        <p className="mt-2 text-xs font-medium text-[var(--accent)]">{redeemMessage}</p>
      ) : null}

      <button
        type="button"
        className="mt-4 w-full h-11 rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] text-sm font-black text-[var(--fg)] hover:bg-[var(--ghost-bg)] transition-colors"
        onClick={onUpgradeClick}
      >
        Compare plans &amp; upgrade
      </button>
    </div>
  );
}
