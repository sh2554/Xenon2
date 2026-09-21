import { Key, Sparkles, Check, ArrowRight } from "lucide-react";
import clsx from "clsx";
import { PLANS } from "../lib/planFeatures";

/**
 * Minimalist Subscription Plan & Code Redemption Card.
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
  const isUpgraded = currentPlan === "pro" || currentPlan === "max";

  return (
    <div className={clsx("xenon-panel p-5 border border-[var(--border)] space-y-4", className)}>
      {/* Header: Label + Active Tier Badge */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] block">
            Membership
          </span>
          <p className="text-sm font-bold text-[var(--text)] mt-0.5">
            {plan.label} Tier
          </p>
        </div>
        <span
          className={clsx(
            "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
            isUpgraded
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--panel-soft)] text-[var(--muted)] border border-[var(--border)]"
          )}
        >
          {plan.label}
        </span>
      </div>

      {/* Minimal Unified Access Code Input */}
      <div>
        <label className="text-[10px] font-medium text-[var(--muted)] block mb-1.5">
          Redeem Access Code
        </label>
        <div className="relative flex items-center">
          <Key className="absolute left-3 h-3.5 w-3.5 text-[var(--muted)] pointer-events-none" />
          <input
            type="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="e.g. XENON-PRO"
            className="w-full h-10 pl-8 pr-20 rounded-xl bg-[var(--field-bg)] border border-[var(--border)] text-xs text-[var(--text)] uppercase placeholder:normal-case placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)] font-mono transition-colors"
            value={redeemCode}
            onChange={(e) => setRedeemCode?.(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === "Enter" && redeemCode.trim()) onRedeem?.();
            }}
          />
          <button
            type="button"
            className="absolute right-1.5 h-7 px-3 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)] disabled:opacity-40 transition-colors"
            onClick={onRedeem}
            disabled={!redeemCode.trim()}
          >
            Redeem
          </button>
        </div>

        {/* Status / Feedback message */}
        {redeemMessage && (
          <p
            className={clsx(
              "mt-2 text-xs font-medium",
              redeemMessage.toLowerCase().includes("fail") ||
              redeemMessage.toLowerCase().includes("invalid") ||
              redeemMessage.toLowerCase().includes("error")
                ? "text-[var(--danger)]"
                : "text-[var(--success)]"
            )}
          >
            {redeemMessage}
          </p>
        )}
      </div>

      {/* Minimal Footer Link */}
      <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between">
        <button
          type="button"
          className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors"
          onClick={onUpgradeClick}
        >
          <span>Compare plan features</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
