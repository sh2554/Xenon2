import clsx from "clsx";
import {
  Check,
  Lock,
  GraduationCap,
  Flower2,
  Moon,
  Zap,
  Sparkles,
  Palette,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import {
  PROFILE_THEMES,
  getProfileTheme,
  getThemeEffect,
  isThemeUnlocked,
  getThemeUnlockHint,
} from "../lib/profileThemes";
import ProfileAvatar from "./ProfileAvatar";
import PlanBadge from "./PlanBadge";
import { isProOrMax, normalizePlan } from "../lib/planFeatures";

const THEME_ICONS = {
  graduation: GraduationCap,
  flower: Flower2,
  moon: Moon,
  zap: Zap,
};

export default function ProfileThemePicker({ showPreview = true, compact = false }) {
  const { profile, enrolledClass, setProfileTheme } = useAppStore();
  const activeTheme = getProfileTheme(profile);
  const effect = getThemeEffect(activeTheme);
  const level = profile?.level || 1;
  const classRank = enrolledClass?.rank || 999;
  const plan = normalizePlan(profile?.plan);

  return (
    <div className={clsx("space-y-6", compact && "space-y-4")}>
      {showPreview && (
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor: effect.border, boxShadow: effect.shadow }}
        >
          <div className="h-20" style={{ background: effect.banner }} />
          <div className="p-5 flex flex-wrap items-center gap-4 bg-[var(--panel-soft)]">
            <ProfileAvatar
              name={profile?.first_name || profile?.username}
              avatarUrl={
                profile?.avatar_url?.startsWith?.("http") ? profile.avatar_url : undefined
              }
              size="lg"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">
                Leaderboard preview
              </p>
              <p className="text-lg font-black flex items-center gap-2 flex-wrap">
                {profile?.first_name || profile?.username || "You"}
                {isProOrMax(plan) && <PlanBadge plan={plan} size="sm" />}
              </p>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                @{profile?.username || "student"} · Level {level}
                {enrolledClass?.rank ? ` · Class rank #${enrolledClass.rank}` : ""}
              </p>
              {effect.title && (
                <p className="text-xs font-bold mt-2 flex items-center gap-1" style={{ color: effect.accent }}>
                  <Sparkles className="h-3 w-3" /> {effect.title}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)]">
          <Palette className="h-5 w-5" />
        </div>
        <div>
          <h3 className={clsx("font-black tracking-tight", compact ? "text-base" : "text-xl")}>
            Public profile & leaderboard style
          </h3>
          <p className="text-xs text-[var(--muted)] mt-0.5 max-w-lg">
            Unlock themes by levelling up or placing on the class board. Your choice appears on
            leaderboards and when others view your profile.
          </p>
        </div>
      </div>

      <div className={clsx("grid gap-4", compact ? "sm:grid-cols-2" : "lg:grid-cols-2")}>
        {PROFILE_THEMES.map((theme) => {
          const unlocked = isThemeUnlocked(theme, { level, classRank });
          const active = activeTheme === theme.id;
          const Icon = THEME_ICONS[theme.icon] || GraduationCap;

          return (
            <button
              key={theme.id}
              type="button"
              disabled={!unlocked}
              onClick={() => setProfileTheme(theme.id)}
              className={clsx(
                "relative text-left rounded-2xl border-2 p-5 transition-all w-full",
                !unlocked && "opacity-55 cursor-not-allowed border-dashed",
                unlocked && active && "border-[var(--accent)] bg-[var(--accent-soft)]",
                unlocked && !active && "border-[var(--border)] hover:border-[var(--accent)]/40"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border"
                  style={{
                    borderColor: getThemeEffect(theme.id).border,
                    background: getThemeEffect(theme.id).bg,
                  }}
                >
                  <Icon className="h-5 w-5" style={{ color: getThemeEffect(theme.id).accent }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black">{theme.label}</p>
                  <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">{theme.description}</p>
                  <ul className="mt-2 space-y-0.5">
                    {theme.perks.map((perk) => (
                      <li key={perk} className="text-[10px] text-[var(--muted)] flex items-center gap-1.5">
                        <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-1.5 mt-4">
                {theme.swatch.map((c) => (
                  <div key={c} className="h-2 flex-1 rounded-full" style={{ backgroundColor: c }} />
                ))}
              </div>

              {!unlocked ? (
                <span className="absolute top-4 right-4 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/25 px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  {getThemeUnlockHint(theme)}
                </span>
              ) : active ? (
                <span className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-black uppercase text-[var(--accent)]">
                  <Check className="h-4 w-4" /> Equipped
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
