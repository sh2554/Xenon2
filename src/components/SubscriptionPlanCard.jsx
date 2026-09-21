import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Key, Sparkles, Check, ArrowRight, X, Terminal, Shield } from "lucide-react";
import clsx from "clsx";
import { PLANS } from "../lib/planFeatures";

/**
 * Minimalist Subscription Plan & Code Redemption Card.
 * Includes secret code ("secret") developer preview popup menu.
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
  const [showSecretMenu, setShowSecretMenu] = useState(false);

  const handleRedeemClick = () => {
    const code = (redeemCode || "").trim().toLowerCase();
    if (!code) return;
    if (code === "secret") {
      setShowSecretMenu(true);
      setRedeemCode?.("");
      return;
    }
    onRedeem?.();
  };

  return (
    <>
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
                if (e.key === "Enter" && redeemCode.trim()) handleRedeemClick();
              }}
            />
            <button
              type="button"
              className="absolute right-1.5 h-7 px-3 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)] disabled:opacity-40 transition-colors"
              onClick={handleRedeemClick}
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

      {/* Secret Access "Coming Soon" Popup Modal */}
      <AnimatePresence>
        {showSecretMenu && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              className="fixed inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSecretMenu(false)}
            />

            <motion.div
              className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Background ambient glow */}
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[var(--accent)] opacity-10 blur-3xl pointer-events-none" />

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/30 flex items-center gap-1.5">
                    <Terminal className="h-3 w-3" />
                    <span>Secret Channel</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSecretMenu(false)}
                  className="text-[var(--muted)] hover:text-[var(--text)] p-1 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-[var(--text)] mb-2">
                Coming Soon
              </h3>

              <p className="text-xs text-[var(--muted)] leading-relaxed mb-6">
                You discovered the secret developer preview access code. Experimental tools, AI assistant features, and advanced GCSE Paper 2 algorithm labs are currently in development for Xenon Code.
              </p>

              <div className="space-y-2.5 mb-6">
                {[
                  { label: "AI Code Explainer & Hints", tag: "Alpha" },
                  { label: "Real-Time 1v1 Code Battler", tag: "Preview" },
                  { label: "OCR GCSE J277 Full Mock Suite", tag: "Building" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-3 rounded-xl bg-[var(--panel-soft)] border border-[var(--border)]"
                  >
                    <span className="text-xs font-semibold text-[var(--text)]">
                      {item.label}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[var(--accent-soft)] text-[var(--accent)]">
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowSecretMenu(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold transition-colors shadow-sm"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
