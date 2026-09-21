import { useState } from "react";
import { Flame, Zap, Snowflake, Clock, CheckCircle, AlertCircle } from "lucide-react";
import clsx from "clsx";
import { useAppStore } from "../store/useAppStore";

export function StreakBadge({ streak, compact = false }) {
  const current = streak?.current || 0;
  if (current < 1 && !streak?.atRisk) return null;

  return (
    <div
      className={clsx(
        "flex items-center gap-3 rounded-xl border px-4 py-3",
        streak?.atRisk
          ? "border-[var(--warning)]/40 bg-[var(--warning-soft)]"
          : "border-[var(--warning)]/25 bg-[var(--warning-soft)]"
      )}
    >
      <div className="relative shrink-0">
        <Flame
          className={clsx(
            compact ? "h-6 w-6" : "h-8 w-8",
            current >= 7 ? "text-[var(--warning)]" : "text-[var(--warning)]"
          )}
        />
        {streak?.doubleXpActive && (
          <Zap className="absolute -top-1 -right-1 h-3.5 w-3.5 text-[var(--accent)] fill-sky-400/30" />
        )}
      </div>
      <div>
        <p className={clsx("font-black leading-none", compact ? "text-base" : "text-lg")}>
          {current} day{current === 1 ? "" : "s"} streak
        </p>
        <p className="text-[10px] font-bold uppercase text-[var(--muted)] mt-0.5">
          Best: {streak?.longest || 0}
          {streak?.atRisk && " · practise today"}
        </p>
      </div>
    </div>
  );
}

export default function StreakBoosters() {
  const streak = useAppStore((s) => s.streak);
  const activateStreakFreezeBooster = useAppStore((s) => s.activateStreakFreezeBooster);
  const activateDoubleXpBooster = useAppStore((s) => s.activateDoubleXpBooster);
  const [status, setStatus] = useState("");
  const [err, setErr] = useState("");

  const handleFreeze = () => {
    setErr("");
    const result = activateStreakFreezeBooster();
    if (result.ok) setStatus(result.message);
    else setErr(result.error || "Could not activate.");
    setTimeout(() => {
      setStatus("");
      setErr("");
    }, 5000);
  };

  const handleDoubleXp = () => {
    setErr("");
    const result = activateDoubleXpBooster();
    if (result.ok) setStatus(result.message);
    else setErr(result.error || "Could not activate.");
    setTimeout(() => {
      setStatus("");
      setErr("");
    }, 5000);
  };

  const doubleXpEnds = streak?.doubleXpUntil
    ? new Date(streak.doubleXpUntil).toLocaleString(undefined, {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="xenon-panel p-6 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">Revision boosters</h3>
          <p className="text-xs text-[var(--muted)] mt-0.5 max-w-md">
            Streak freeze protects one missed day. Double XP doubles all XP earned for 24 hours.
          </p>
        </div>
        <StreakBadge streak={streak} compact />
      </div>

      {streak?.message && !streak?.todayActive && (
        <p className="text-xs font-medium text-[var(--warning)] flex items-center gap-2 p-3 rounded-xl bg-[var(--warning-soft)] border border-[var(--warning)]/20">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {streak.message}
        </p>
      )}

      {status && (
        <p className="text-xs font-bold text-[var(--success)] flex items-center gap-2 p-3 rounded-xl bg-[var(--success)]/10 border border-[var(--success)]/25">
          <CheckCircle className="h-4 w-4" />
          {status}
        </p>
      )}
      {err && (
        <p className="text-xs font-bold text-[var(--danger)] p-3 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/25">{err}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="xenon-panel-muted p-5 flex flex-col gap-4 border border-[var(--border)]">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)]">
              <Snowflake className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold">Streak freeze</p>
              <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">
                Arms a one-time shield. If you skip exactly one day, your streak stays when you return.
              </p>
            </div>
          </div>
          {streak?.freezeArmed ? (
            <span className="text-[10px] font-black uppercase text-[var(--accent)] bg-[var(--accent-soft)] px-3 py-2 rounded-lg border border-[var(--accent)]/25 text-center">
              Freeze armed — ready if you miss a day
            </span>
          ) : (
            <button type="button" className="xenon-btn text-xs h-10 w-full" onClick={handleFreeze}>
              Arm streak freeze
            </button>
          )}
        </div>

        <div className="xenon-panel-muted p-5 flex flex-col gap-4 border border-[var(--border)]">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-[var(--warning-soft)] flex items-center justify-center text-[var(--warning)]">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold">Double XP (24h)</p>
              <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">
                All XP from skills, battles, and challenges is doubled while active.
              </p>
            </div>
          </div>
          {streak?.doubleXpActive ? (
            <span className="text-[10px] font-black uppercase text-[var(--warning)] bg-[var(--warning-soft)] px-3 py-2 rounded-lg border border-[var(--warning)]/25 flex items-center justify-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Active until {doubleXpEnds}
            </span>
          ) : (
            <button type="button" className="xenon-btn text-xs h-10 w-full" onClick={handleDoubleXp}>
              Activate 2× XP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
