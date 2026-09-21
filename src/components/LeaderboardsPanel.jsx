import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Users,
  Globe,
  Search,
  Sparkles,
  Loader2,
  X,
  ExternalLink,
  Target,
  FolderOpen,
  Star,
  Settings2,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import ProfileAvatar from "./ProfileAvatar";
import PlanBadge from "./PlanBadge";
import RankMedal from "./RankMedal";
import { isProOrMax, isMax, normalizePlan } from "../lib/planFeatures";
import {
  getProfileTheme,
  getThemeEffect,
  getThemeMeta,
  getRankStyle,
  sortLeaderboardEntries,
  formatPracticeTime,
} from "../lib/profileThemes";
import { getLevelProgress } from "../lib/progression";

function normalizeClassEntry(entry) {
  const p = entry.profiles || {};
  return {
    id: entry.student_id,
    student_id: entry.student_id,
    first_name: p.first_name || p.username || "Student",
    username: p.username || "unknown",
    level: p.level || 1,
    plan: normalizePlan(p.plan),
    avatar_url: p.avatar_url?.startsWith?.("http") ? p.avatar_url : "",
    profile_theme: getProfileTheme(p),
    experience_points: p.experience_points || 0,
    practice_questions_correct: entry.practice_questions_correct || 0,
    total_projects: entry.total_projects || 0,
    total_time_seconds: entry.total_time_seconds || 0,
    headline: p.headline,
    about_me: p.about_me,
    favorite_topic: p.favorite_topic,
  };
}

function normalizeGlobalEntry(entry) {
  return {
    ...entry,
    avatar_url: entry.avatar_url?.startsWith?.("http") ? entry.avatar_url : "",
    profile_theme: getProfileTheme(entry),
    plan: normalizePlan(entry.plan),
  };
}

function primaryStat(entry, mode) {
  if (mode === "global") {
    return { label: "XP", value: entry.experience_points || 0, icon: Star };
  }
  const solved = entry.practice_questions_correct || 0;
  const projects = entry.total_projects || 0;
  return {
    label: "Class score",
    value: `${solved} solved · ${projects} projects`,
    icon: Target,
    compact: true,
  };
}

function LeaderboardPodium({ entries, mode, onViewProfile }) {
  const top = entries.slice(0, 3);
  if (!top.length) return null;
  const order = top.length >= 3 ? [top[1], top[0], top[2]] : top;

  return (
    <div className="lb-podium grid grid-cols-3 gap-4 items-end mb-6 max-w-3xl mx-auto">
      {order.map((entry, idx) => {
        const rank = top.length >= 3 ? (idx === 0 ? 2 : idx === 1 ? 1 : 3) : idx + 1;
        const isFirst = rank === 1;
        const themeEffect = getThemeEffect(entry.profile_theme || "default");
        const rankStyle = getRankStyle(rank);
        const stat = primaryStat(entry, mode);

        return (
          <button
            key={entry.id || entry.student_id}
            type="button"
            onClick={() => onViewProfile(entry)}
            className={`lb-podium-slot flex flex-col items-center text-center rounded-2xl border p-4 transition-all hover:scale-[1.02] ${
              isFirst ? "pb-7 pt-5 z-10" : "pb-5"
            }`}
            style={{
              minHeight: isFirst ? "10rem" : "8rem",
              borderColor: rankStyle?.border || themeEffect.border,
              background: rankStyle?.bg || themeEffect.bg,
              boxShadow: isFirst ? rankStyle?.glow || themeEffect.shadow : themeEffect.shadow,
            }}
          >
            <RankMedal rank={rank} size={isFirst ? "lg" : "md"} className="mb-2" />
            <ProfileAvatar
              name={entry.first_name || entry.username}
              avatarUrl={entry.avatar_url || undefined}
              size={isFirst ? "md" : "sm"}
            />
            <p className="font-black text-sm mt-2 truncate max-w-[7rem]">
              {entry.first_name || entry.username}
            </p>
            {mode === "global" ? (
              <p className="text-lg font-black mt-1 tabular-nums" style={{ color: themeEffect.accent }}>
                {entry.experience_points || 0}
                <span className="text-[10px] font-bold text-[var(--muted)] ml-1">XP</span>
              </p>
            ) : (
              <div className="mt-2 flex flex-col gap-0.5 w-full px-1">
                <p className="text-xs font-black text-[var(--success)] tabular-nums">
                  {entry.practice_questions_correct || 0} solved
                </p>
                <p className="text-xs font-bold text-[var(--muted)] tabular-nums">
                  {entry.total_projects || 0} projects
                </p>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function LeaderboardRow({ entry, rank, mode, onViewProfile }) {
  const themeId = entry.profile_theme || "default";
  const themeEffect = getThemeEffect(themeId);
  const plan = entry.plan;
  const showPro = isProOrMax(plan);
  const showMax = isMax(plan);
  const rankStyle = getRankStyle(rank);

  return (
    <div
      className="lb-row grid grid-cols-[auto_1fr_auto_auto] sm:grid-cols-[3rem_1fr_minmax(8rem,auto)_auto] items-center gap-3 sm:gap-4 p-4 rounded-2xl border transition-all"
      style={{
        borderColor: rankStyle?.border || themeEffect.border,
        background: rankStyle?.bg || themeEffect.bg,
        boxShadow: rank <= 3 ? rankStyle?.glow || themeEffect.shadow : "none",
      }}
    >
      <RankMedal rank={rank} size="sm" />

      <button
        type="button"
        className="flex items-center gap-3 min-w-0 text-left group"
        onClick={() => onViewProfile(entry)}
      >
        <ProfileAvatar
          name={entry.first_name || entry.username}
          avatarUrl={entry.avatar_url || undefined}
          size="md"
        />
        <div className="min-w-0">
          <p className="font-bold text-sm group-hover:text-[var(--accent)] transition-colors truncate">
            {entry.first_name || entry.username}
          </p>
          <p className="text-[11px] text-[var(--muted)] truncate">@{entry.username}</p>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <PlanBadge plan={plan} size="sm" showGlow />
            {showMax && (
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded border border-violet-400/40 text-violet-300 bg-violet-500/10">
                Max
              </span>
            )}
            {showPro && !showMax && (
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded border border-[var(--warning)]/40 text-[var(--warning)] bg-[var(--warning-soft)]">
                Pro
              </span>
            )}
            <span className="text-[10px] font-bold text-[var(--muted)]">Lv {entry.level || 1}</span>
            {themeEffect.title && (
              <span
                className="text-[9px] font-bold flex items-center gap-0.5"
                style={{ color: themeEffect.accent }}
              >
                <Sparkles className="h-2.5 w-2.5" />
                {themeEffect.title}
              </span>
            )}
          </div>
        </div>
      </button>

      <div className="hidden sm:flex flex-col items-end justify-center gap-1 min-w-[7.5rem]">
        {mode === "global" ? (
          <span
            className="text-base font-black tabular-nums flex items-center gap-1"
            style={{ color: themeEffect.accent }}
          >
            <Star className="h-4 w-4 opacity-70" />
            {entry.experience_points || 0} XP
          </span>
        ) : (
          <>
            <span className="text-sm font-black text-[var(--success)] tabular-nums flex items-center gap-1">
              <Target className="h-3.5 w-3.5 opacity-70" />
              {entry.practice_questions_correct || 0} solved
            </span>
            <span className="text-xs font-bold text-[var(--muted)] tabular-nums flex items-center gap-1">
              <FolderOpen className="h-3.5 w-3.5 opacity-70" />
              {entry.total_projects || 0} projects
            </span>
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
        <div className="flex sm:hidden flex-col items-end text-right gap-0.5">
          {mode === "global" ? (
            <span className="text-sm font-black tabular-nums" style={{ color: themeEffect.accent }}>
              {entry.experience_points || 0} XP
            </span>
          ) : (
            <>
              <span className="text-xs font-black text-[var(--success)]">{entry.practice_questions_correct || 0} solved</span>
              <span className="text-[10px] font-bold text-[var(--muted)]">{entry.total_projects || 0} proj</span>
            </>
          )}
        </div>
        <button
          type="button"
          className="xenon-btn-subtle text-[10px] h-8 px-3 whitespace-nowrap"
          onClick={() => onViewProfile(entry)}
        >
          <ExternalLink className="h-3 w-3 inline mr-1" />
          Profile
        </button>
      </div>
    </div>
  );
}

function PublicProfileModal({ profile, viewMode, onClose }) {
  const themeId = profile.profile_theme || getProfileTheme(profile);
  const themeEffect = getThemeEffect(themeId);
  const themeMeta = getThemeMeta(themeId);
  const plan = normalizePlan(profile.plan);
  const showPro = isProOrMax(plan);
  const showMax = isMax(plan);
  const levelProgress = getLevelProgress(profile.experience_points || 0);
  const isGlobal = viewMode === "global";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        key={themeId}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        onClick={(e) => e.stopPropagation()}
        className="xenon-panel w-full sm:max-w-md max-h-[92vh] overflow-y-auto relative overflow-hidden"
        style={{
          borderColor: themeEffect.border,
          boxShadow: themeEffect.shadow || "var(--shadow-strong)",
          background: `linear-gradient(180deg, color-mix(in srgb, ${themeEffect.accent} 6%, var(--panel)) 0%, var(--panel) 35%)`,
        }}
      >
        <div className="h-32 relative" style={{ background: themeEffect.banner }}>
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `radial-gradient(circle at 30% 20%, ${themeEffect.accent}, transparent 55%)`,
            }}
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg bg-black/30 text-white hover:bg-black/50 transition-colors z-10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          {themeEffect.title && (
            <p
              className="absolute bottom-3 left-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5"
              style={{ color: themeEffect.accent }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {themeEffect.title}
            </p>
          )}
        </div>

        <div className="px-6 pb-8 -mt-14 relative">
          <div className="flex flex-col items-center text-center">
            <div
              className="rounded-full p-1"
              style={{ background: themeEffect.border, boxShadow: themeEffect.shadow }}
            >
              <div className="ring-4 ring-[var(--panel)] rounded-full">
                <ProfileAvatar
                  name={profile.first_name || profile.username}
                  avatarUrl={profile.avatar_url || undefined}
                  size="lg"
                />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <PlanBadge plan={plan} size="md" showGlow />
              {showMax && (
                <span className="text-[10px] font-black uppercase text-violet-300 border border-violet-400/40 px-2 py-0.5 rounded">
                  Max plan
                </span>
              )}
              {showPro && !showMax && (
                <span className="text-[10px] font-black uppercase text-[var(--warning)] border border-[var(--warning)]/40 px-2 py-0.5 rounded">
                  Pro plan
                </span>
              )}
            </div>
            <h3 className="text-2xl font-black mt-4">{profile.first_name || profile.username}</h3>
            <p className="text-sm font-bold" style={{ color: themeEffect.accent }}>
              @{profile.username || "unknown"}
            </p>
            <p className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)] mt-1">
              {themeMeta.label} profile
            </p>
            {profile.headline && (
              <p className="text-sm text-[var(--muted)] mt-2 max-w-sm">{profile.headline}</p>
            )}
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-[10px] font-black uppercase text-[var(--muted)] mb-1">
              <span>Level {levelProgress.level}</span>
              <span>
                {levelProgress.xpIntoLevel} / {levelProgress.xpNeeded} XP
              </span>
            </div>
            <div className="h-2 rounded-full bg-[var(--panel-soft)] overflow-hidden border border-[var(--border)]">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${levelProgress.percent}%`, background: themeEffect.accent }}
              />
            </div>
          </div>

          <div className={`grid gap-3 mt-6 ${isGlobal ? "grid-cols-1" : "grid-cols-2"}`}>
            {isGlobal ? (
              <div
                className="xenon-panel-muted p-5 text-center border-2"
                style={{ borderColor: themeEffect.border, background: themeEffect.bg }}
              >
                <Star className="h-5 w-5 mx-auto mb-2" style={{ color: themeEffect.accent }} />
                <p className="text-[10px] font-black uppercase text-[var(--muted)]">Total XP</p>
                <p className="text-3xl font-black mt-1 tabular-nums" style={{ color: themeEffect.accent }}>
                  {profile.experience_points || 0}
                </p>
              </div>
            ) : (
              <>
                <div
                  className="xenon-panel-muted p-4 text-center border"
                  style={{ borderColor: themeEffect.border, background: themeEffect.bg }}
                >
                  <Target className="h-4 w-4 mx-auto mb-2 text-[var(--success)]" />
                  <p className="text-[10px] font-black uppercase text-[var(--muted)]">Questions solved</p>
                  <p className="text-2xl font-black mt-1 text-[var(--success)] tabular-nums">
                    {profile.practice_questions_correct || 0}
                  </p>
                </div>
                <div
                  className="xenon-panel-muted p-4 text-center border"
                  style={{ borderColor: themeEffect.border, background: themeEffect.bg }}
                >
                  <FolderOpen className="h-4 w-4 mx-auto mb-2" style={{ color: themeEffect.accent }} />
                  <p className="text-[10px] font-black uppercase text-[var(--muted)]">Projects</p>
                  <p className="text-2xl font-black mt-1 tabular-nums" style={{ color: themeEffect.accent }}>
                    {profile.total_projects || 0}
                  </p>
                </div>
                <div
                  className="col-span-2 xenon-panel-muted p-3 text-center border border-[var(--border)]"
                >
                  <p className="text-[10px] font-black uppercase text-[var(--muted)]">Practice time</p>
                  <p className="text-sm font-bold mt-1">{formatPracticeTime(profile.total_time_seconds || 0)}</p>
                </div>
              </>
            )}
          </div>

          {profile.about_me && (
            <div
              className="mt-4 p-4 rounded-xl border text-left"
              style={{ borderColor: themeEffect.border, background: themeEffect.bg }}
            >
              <p className="text-[10px] font-black uppercase text-[var(--muted)] mb-2">About</p>
              <p className="text-sm leading-relaxed">{profile.about_me}</p>
            </div>
          )}

          {profile.favorite_topic && (
            <p className="text-xs text-center text-[var(--muted)] mt-4">
              Favourite topic: <strong className="text-[var(--fg)]">{profile.favorite_topic}</strong>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function LeaderboardsPanel({ onOpenSettings }) {
  const { enrolledClass, loadGlobalLeaderboard, loadPublicProfile, profile: myProfile } = useAppStore();
  const [activeTab, setActiveTab] = useState("class");
  const [sortBy, setSortBy] = useState("solved");
  const [globalLeaderboard, setGlobalLeaderboard] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileViewMode, setProfileViewMode] = useState("class");
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    loadGlobalLeaderboard()
      .then((data) => setGlobalLeaderboard(data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [loadGlobalLeaderboard]);

  useEffect(() => {
    setSortBy(activeTab === "global" ? "xp" : "solved");
  }, [activeTab]);

  const mode = activeTab;

  const classEntries = useMemo(() => {
    const raw = (enrolledClass?.leaderboard || []).map(normalizeClassEntry);
    const filtered = raw.filter((e) =>
      (e.first_name || e.username || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    return sortLeaderboardEntries(filtered, sortBy === "projects" ? "projects" : "solved");
  }, [enrolledClass?.leaderboard, searchTerm, sortBy]);

  const globalEntries = useMemo(() => {
    const raw = globalLeaderboard.map(normalizeGlobalEntry);
    const filtered = raw.filter((e) =>
      (e.first_name || e.username || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    return sortLeaderboardEntries(filtered, "xp");
  }, [globalLeaderboard, searchTerm]);

  const displayEntries = activeTab === "class" ? classEntries : globalEntries;

  const openPublicProfile = async (entry) => {
    const profileId = entry.student_id || entry.id;
    if (!profileId) return;
    setProfileViewMode(activeTab);
    setProfileLoading(true);
    try {
      const full = await loadPublicProfile(profileId);
      const merged = { ...(full || {}), ...(entry.profiles || {}) };
      setSelectedProfile({
        ...merged,
        id: profileId,
        first_name: entry.first_name || full?.first_name || full?.username,
        username: entry.username || full?.username,
        practice_questions_correct:
          entry.practice_questions_correct ?? full?.questions_solved ?? merged.practice_questions_correct ?? 0,
        total_projects: entry.total_projects ?? merged.total_projects ?? 0,
        total_time_seconds: entry.total_time_seconds ?? 0,
        experience_points: entry.experience_points ?? full?.experience_points ?? 0,
        profile_theme: getProfileTheme({ profile_theme: full?.profile_theme, avatar_url: full?.avatar_url, ...entry }),
        plan: entry.plan ?? full?.plan,
        headline: full?.headline || entry.headline,
        about_me: full?.about_me || entry.about_me,
        favorite_topic: full?.favorite_topic || entry.favorite_topic,
      });
    } catch {
      setSelectedProfile({
        ...entry,
        id: profileId,
        profile_theme: getProfileTheme(entry),
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const myPlan = normalizePlan(myProfile?.plan);
  const myTheme = getProfileTheme(myProfile);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="xenon-panel p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
            <h2 className="text-2xl font-black flex items-center gap-2">
              <Trophy className="h-7 w-7 text-[var(--warning)]" />
              Leaderboards
          </h2>
            <p className="text-sm text-[var(--muted)] mt-1 max-w-xl">
              <strong className="text-[var(--fg)]">Class</strong> ranks by questions solved and projects.{" "}
              <strong className="text-[var(--fg)]">Global</strong> ranks by total XP. Open a profile to see their
              theme and stats.
          </p>
        </div>
          <div className="flex flex-wrap gap-2">
            {onOpenSettings && (
              <button
                type="button"
                className="xenon-btn-subtle text-xs h-10 flex items-center gap-2"
                onClick={onOpenSettings}
              >
                <Settings2 className="h-4 w-4" />
                Customise profile
              </button>
            )}
            <div className="flex gap-1 bg-[var(--panel-soft)] p-1 rounded-xl border border-[var(--border)]">
          <button
                type="button"
            onClick={() => setActiveTab("class")}
                className={`px-4 py-2 text-xs font-black rounded-lg flex items-center gap-1.5 transition ${
                  activeTab === "class" ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "text-[var(--muted)]"
                }`}
              >
                <Users className="h-4 w-4" /> Class
          </button>
          <button
                type="button"
            onClick={() => setActiveTab("global")}
                className={`px-4 py-2 text-xs font-black rounded-lg flex items-center gap-1.5 transition ${
                  activeTab === "global" ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "text-[var(--muted)]"
                }`}
              >
                <Globe className="h-4 w-4" /> Global
          </button>
            </div>
          </div>
        </div>

        {myProfile && (
          <div
            className="mt-6 p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3"
            style={{
              borderColor: getThemeEffect(myTheme).border,
              background: getThemeEffect(myTheme).bg,
            }}
          >
            <div className="flex items-center gap-3">
              <ProfileAvatar name={myProfile.first_name || myProfile.username} size="sm" />
              <div>
                <p className="text-xs font-black uppercase text-[var(--muted)]">Your card style</p>
                <p className="text-sm font-bold">
                  {getThemeEffect(myTheme).title || "GCSE Apprentice"} · Level {myProfile.level || 1}
                </p>
              </div>
            </div>
            {isProOrMax(myPlan) && <PlanBadge plan={myPlan} size="sm" showGlow />}
          </div>
        )}
      </div>

      <div className="xenon-panel p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3 justify-between border-b border-[var(--border)] pb-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search students..."
              className="xenon-input pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {activeTab === "class" ? (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-[var(--muted)] hidden sm:inline">Sort</span>
              {[
                { id: "solved", label: "Solved" },
                { id: "projects", label: "Projects" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSortBy(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border transition ${
                    sortBy === s.id
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--muted)]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          ) : (
            <span className="xenon-badge flex items-center gap-1">
              <Star className="h-3 w-3" /> Ranked by XP
          </span>
          )}

          <span className="xenon-badge tabular-nums">{displayEntries.length} students</span>
        </div>

        <div className="hidden sm:grid grid-cols-[3rem_1fr_minmax(8rem,auto)_auto] gap-4 px-4 text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">
          <span>Rank</span>
          <span>Student</span>
          <span className="text-right">{mode === "global" ? "Experience" : "Class progress"}</span>
          <span className="text-right">Action</span>
        </div>

        {isLoading && activeTab === "global" ? (
          <div className="py-16 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)] mx-auto" />
            <p className="text-sm text-[var(--muted)] mt-3">Loading global rankings…</p>
          </div>
        ) : displayEntries.length === 0 ? (
          <p className="text-center py-12 text-sm text-[var(--muted)]">
            {activeTab === "class" && !enrolledClass
              ? "Join a class in Settings to see your class board."
              : "No students match your search."}
          </p>
        ) : (
          <>
            <LeaderboardPodium entries={displayEntries} mode={mode} onViewProfile={openPublicProfile} />
            <div className="space-y-2">
              <p className="xenon-section-label px-1 pt-2">All rankings</p>
              {displayEntries.map((entry, index) => (
                <LeaderboardRow
                  key={entry.id || entry.student_id}
                  entry={entry}
                  rank={index + 1}
                  mode={mode}
                  onViewProfile={openPublicProfile}
                />
              ))}
                          </div>
          </>
        )}
      </div>

      <AnimatePresence mode="wait">
        {profileLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40"
          >
            <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
          </motion.div>
        )}
        {selectedProfile && !profileLoading && (
        <PublicProfileModal 
            key={`${selectedProfile.id}-${selectedProfile.profile_theme}`}
          profile={selectedProfile} 
            viewMode={profileViewMode}
          onClose={() => setSelectedProfile(null)} 
        />
      )}
      </AnimatePresence>
    </motion.div>
  );
}
