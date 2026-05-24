import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../store/useAppStore";

export default function InitOverlay() {
  const { profile, finishInitOverlay } = useAppStore();
  const script = useMemo(
    () =>
      [
        "> Xenon Code initialized.",
        `> Welcome, ${profile?.first_name || "User"}.`,
        "> Disabling gravity... Ready.",
      ].join("\n"),
    [profile?.first_name],
  );
  const [display, setDisplay] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let index = 0;
    let readyTimer;
    setDisplay("");
    setReady(false);

    const timer = setInterval(() => {
      index += 1;
      setDisplay(script.slice(0, index));
      if (index >= script.length) {
        clearInterval(timer);
        readyTimer = setTimeout(() => setReady(true), 250);
      }
    }, 28);

    return () => {
      clearInterval(timer);
      clearTimeout(readyTimer);
    };
  }, [script]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 p-4 text-[var(--success)]">
      <div className="xenon-scanlines absolute inset-0 opacity-30" />
      <motion.div
        className="mx-auto flex min-h-full max-w-5xl items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-full rounded-[32px] border border-[var(--success)]/20 bg-black/80 p-6 shadow-[0_0_80px_rgba(0,255,140,0.08)] backdrop-blur sm:p-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="xenon-code text-xs uppercase tracking-[0.3em] text-[var(--success)]/70">Initialization Console</p>
              <h2 className="mt-2 xenon-code text-2xl text-[var(--success)]">Boot Sequence</h2>
            </div>
            <span className="rounded-full border border-[var(--success)]/20 px-3 py-1 xenon-code text-xs text-[var(--success)]/80">
              ONLINE
            </span>
          </div>

          <div className="rounded-[28px] border border-[var(--success)]/10 bg-black/60 p-5">
            <pre className="xenon-code min-h-[180px] whitespace-pre-wrap text-lg leading-8">
              {display}
              <span className="animate-pulse">_</span>
            </pre>
          </div>

          {ready && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex justify-end">
              <button className="rounded-2xl border border-[var(--success)]/30 bg-[var(--success)]/10 px-5 py-3 xenon-code text-sm text-[var(--success)] transition hover:bg-[var(--success)]/15" onClick={finishInitOverlay}>
                Continue To Workspace
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
