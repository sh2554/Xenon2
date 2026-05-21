import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { PLANS, REDEEM_CODES } from "../lib/planFeatures";
import PlanComparisonCards from "./PlanComparisonCards";

export default function UpgradeModal({ onClose }) {
  const redeemPlanCode = useAppStore((s) => s.redeemPlanCode);
  const getPlan = useAppStore((s) => s.getPlan);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const current = typeof getPlan === "function" ? getPlan() : "free";

  const handleRedeem = async () => {
    try {
      await redeemPlanCode(code);
      setMessage("Plan updated! Refresh open tabs to see new features.");
      setCode("");
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setMessage(err?.message || "Failed to redeem.");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="xenon-panel w-full max-w-4xl p-8 relative shadow-2xl my-8"
        >
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-black mb-1 text-[var(--accent)]">Choose your plan</h2>
          <p className="mb-6 text-sm text-[var(--muted)]">
            Current plan: <strong className="uppercase text-[var(--fg)]">{PLANS[current]?.label || current}</strong>.
            Pro is for students; Max is for teachers and schools. Codes:{" "}
            <code className="text-xs">PRO123</code>, <code className="text-xs">MAX456</code>,{" "}
            <code className="text-xs">FREE</code> (downgrade).
          </p>

          <PlanComparisonCards currentPlan={current} />

          <div className="mt-8 pt-6 border-t border-[var(--border)]">
            <input
              className="xenon-input w-full mb-3"
              placeholder="Enter redemption code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button className="xenon-btn w-full mb-2" type="button" onClick={handleRedeem}>
              Redeem code
            </button>
            {message && <p className="text-sm text-[var(--accent)] mt-2">{message}</p>}
            <p className="text-[10px] text-[var(--muted)] mt-4 text-center">
              Valid codes: {Object.keys(REDEEM_CODES).join(", ")}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
