import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import { Trophy, Shield, Star, Award, Zap, Users, Globe, Search, Sparkles } from "lucide-react";
import ProfileAvatar from "./ProfileAvatar";

const MEDALS = {
  1: { icon: "🥇", label: "1st Place", bg: "rgba(255, 215, 0, 0.08)", border: "rgba(255, 215, 0, 0.4)", text: "#ffeb3b", glow: "0 0 20px rgba(255, 215, 0, 0.15)" },
  2: { icon: "🥈", label: "2nd Place", bg: "rgba(192, 192, 192, 0.08)", border: "rgba(192, 192, 192, 0.4)", text: "#e0e0e0", glow: "0 0 20px rgba(192, 192, 192, 0.12)" },
  3: { icon: "🥉", label: "3rd Place", bg: "rgba(205, 127, 50, 0.08)", border: "rgba(205, 127, 50, 0.4)", text: "#ffab91", glow: "0 0 20px rgba(205, 127, 50, 0.1)" },
};

const THEME_GLOWS = {
  cyberpunk: { border: "rgba(232, 121, 249, 0.45)", bg: "rgba(232, 121, 249, 0.04)", shadow: "0 0 15px rgba(232, 121, 249, 0.25)", title: "👑 Cyberpunk Wizard" },
  "pink-glass": { border: "rgba(244, 114, 182, 0.45)", bg: "rgba(244, 114, 182, 0.04)", shadow: "0 0 15px rgba(244, 114, 182, 0.25)", title: "🌸 Sakura Spark" },
  oled: { border: "rgba(255, 255, 255, 0.35)", bg: "rgba(0, 0, 0, 0.95)", shadow: "0 0 15px rgba(255, 255, 255, 0.15)", title: "🌌 Dark Mode Overlord" },
  default: { border: "rgba(79, 184, 255, 0.25)", bg: "rgba(79, 184, 255, 0.02)", shadow: "none", title: "⭐ GCSE Apprentice" }
};

export default function LeaderboardsPanel() {
  const { enrolledClass, loadGlobalLeaderboard, profile } = useAppStore();
  const [activeTab, setActiveTab] = useState("class");
  const [globalLeaderboard, setGlobalLeaderboard] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    loadGlobalLeaderboard()
      .then((data) => {
        setGlobalLeaderboard(data || []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [loadGlobalLeaderboard]);

  const filteredClassLeaderboard = (enrolledClass?.leaderboard || []).filter(entry => {
    const name = (entry.profiles?.first_name || entry.profiles?.username || "").toLowerCase();
    return name.includes(searchTerm.toLowerCase());
  });

  const filteredGlobalLeaderboard = globalLeaderboard.filter(entry => {
    const name = (entry.first_name || entry.username || "").toLowerCase();
    return name.includes(searchTerm.toLowerCase());
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -8 }} 
      className="space-y-6"
    >
      {/* Header card */}
      <div className="xenon-panel p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-400" /> Leaderboard Arena
          </h2>
          <p className="text-xs text-[var(--muted)] mt-1">
            Flex your coding level, unlock exclusive profile glows, and see how you stack up against GCSE candidates.
          </p>
        </div>
        <div className="flex gap-2 bg-[var(--panel-soft)] p-1 rounded-xl border border-[var(--border)]">
          <button
            onClick={() => setActiveTab("class")}
            className={`px-4 py-2 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "class" 
                ? "bg-[var(--accent-soft)] text-[var(--accent)]" 
                : "text-[var(--muted)] hover:text-white"
            }`}
          >
            <Users className="h-4 w-4" /> My Class
          </button>
          <button
            onClick={() => setActiveTab("global")}
            className={`px-4 py-2 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "global" 
                ? "bg-[var(--accent-soft)] text-[var(--accent)]" 
                : "text-[var(--muted)] hover:text-white"
            }`}
          >
            <Globe className="h-4 w-4" /> Global Arena
          </button>
        </div>
      </div>

      {/* Roster lists */}
      <div className="xenon-panel p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search user..."
              className="xenon-input pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <span className="xenon-badge">
            {activeTab === "class" 
              ? `${filteredClassLeaderboard.length} enrolled school peers` 
              : `${filteredGlobalLeaderboard.length} top candidates globally`}
          </span>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-sm text-[var(--muted)]">
            <div className="h-6 w-6 animate-spin border-2 border-[var(--accent)] border-t-transparent rounded-full mx-auto mb-2" />
            Retrieving scores and synced theme templates...
          </div>
        ) : (
          <div className="space-y-3">
            {activeTab === "class" ? (
              filteredClassLeaderboard.length === 0 ? (
                <p className="text-center py-6 text-sm text-[var(--muted)]">No classmates found matching search.</p>
              ) : (
                filteredClassLeaderboard.map((entry, index) => {
                  const rank = index + 1;
                  const medal = MEDALS[rank] || null;
                  const profileTheme = entry.profiles?.profile_theme || (entry.profiles?.username === "shahzain_j" ? "cyberpunk" : entry.profiles?.username === "izzah_k" ? "pink-glass" : "default");
                  const themeEffect = THEME_GLOWS[profileTheme] || THEME_GLOWS.default;
                  const isPro = profileTheme !== "default" || entry.profiles?.plan === "premium";

                  return (
                    <div
                      key={entry.student_id}
                      onClick={() => setSelectedProfile({
                        ...entry.profiles,
                        practice_questions_correct: entry.practice_questions_correct,
                        total_projects: entry.total_projects,
                        total_time_seconds: entry.total_time_seconds,
                        plan: entry.profiles?.plan || (isPro ? "premium" : "free")
                      })}
                      className="xenon-panel-muted flex flex-wrap items-center justify-between gap-3 p-4 transition-all border rounded-xl cursor-pointer hover:scale-[1.01]"
                      style={{
                        borderColor: medal?.border || themeEffect.border,
                        background: medal?.bg || themeEffect.bg,
                        boxShadow: medal?.glow || themeEffect.shadow
                      }}
                    >
                      <div className="flex items-center gap-4">
                        {medal ? (
                          <span className="text-2xl leading-none">{medal.icon}</span>
                        ) : (
                          <span className="xenon-pill font-mono min-w-8 text-center text-xs">#{rank}</span>
                        )}
                        <ProfileAvatar name={entry.profiles?.first_name || entry.profiles?.username} avatarUrl={entry.profiles?.avatar_url} size="md" />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-sm text-white flex items-center gap-1.5">
                              {entry.profiles?.first_name || entry.profiles?.username || "Student"}
                              {isPro && (
                                <span className="text-[8px] font-black uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-400/25 px-1.5 py-0.5 rounded leading-none">
                                  Pro
                                </span>
                              )}
                            </p>
                            <span className="xenon-badge text-[10px]">Level {entry.profiles?.level || 1}</span>
                          </div>
                          <p className="text-[11px] text-[var(--muted)] mt-0.5 flex items-center gap-1.5">
                            <span>@{entry.profiles?.username || "unknown"}</span>
                            {isPro && (
                              <span className="text-[9px] font-bold text-amber-300 flex items-center gap-0.5 font-mono">
                                <Sparkles className="h-2.5 w-2.5 fill-current" /> {themeEffect.title}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="xenon-badge">{entry.practice_questions_correct || 0} Solved</span>
                        <span className="xenon-badge">{entry.total_projects || 0} Projects</span>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              filteredGlobalLeaderboard.length === 0 ? (
                <p className="text-center py-6 text-sm text-[var(--muted)]">No candidates found matching search.</p>
              ) : (
                filteredGlobalLeaderboard.map((entry, index) => {
                  const rank = index + 1;
                  const medal = MEDALS[rank] || null;
                  const profileTheme = entry.profile_theme || (entry.username === "shahzain_j" ? "cyberpunk" : entry.username === "izzah_k" ? "pink-glass" : "default");
                  const themeEffect = THEME_GLOWS[profileTheme] || THEME_GLOWS.default;
                  const isPro = profileTheme !== "default" || entry.plan === "premium";

                  return (
                    <div
                      key={entry.id}
                      onClick={() => setSelectedProfile(entry)}
                      className="xenon-panel-muted flex flex-wrap items-center justify-between gap-3 p-4 transition-all border rounded-xl cursor-pointer hover:scale-[1.01]"
                      style={{
                        borderColor: medal?.border || themeEffect.border,
                        background: medal?.bg || themeEffect.bg,
                        boxShadow: medal?.glow || themeEffect.shadow
                      }}
                    >
                      <div className="flex items-center gap-4">
                        {medal ? (
                          <span className="text-2xl leading-none">{medal.icon}</span>
                        ) : (
                          <span className="xenon-pill font-mono min-w-8 text-center text-xs">#{rank}</span>
                        )}
                        <ProfileAvatar name={entry.first_name || entry.username} avatarUrl={entry.avatar_url} size="md" />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-sm text-white flex items-center gap-1.5">
                              {entry.first_name || entry.username || "Coder"}
                              {isPro && (
                                <span className="text-[8px] font-black uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-400/25 px-1.5 py-0.5 rounded leading-none">
                                  Pro
                                </span>
                              )}
                            </p>
                            <span className="xenon-badge text-[10px]">Level {entry.level || 1}</span>
                          </div>
                          <p className="text-[11px] text-[var(--muted)] mt-0.5 flex items-center gap-1.5">
                            <span>@{entry.username || "unknown"}</span>
                            {isPro && (
                              <span className="text-[9px] font-bold text-amber-300 flex items-center gap-0.5 font-mono">
                                <Sparkles className="h-2.5 w-2.5 fill-current" /> {themeEffect.title}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="xenon-badge font-mono text-[var(--accent)] font-bold">{entry.experience_points || 0} XP</span>
                        <span className="xenon-badge">{entry.practice_questions_correct || 0} Solved</span>
                        <span className="xenon-badge">{entry.total_projects || 0} Projects</span>
                        <span className="xenon-badge">{Math.floor((entry.total_time_seconds || 0) / 60)} mins</span>
                      </div>
                    </div>
                  );
                })
              )
            )}
          </div>
        )}
      </div>

      {selectedProfile && (
        <PublicProfileModal 
          profile={selectedProfile} 
          onClose={() => setSelectedProfile(null)} 
        />
      )}
    </motion.div>
  );
}

function PublicProfileModal({ profile, onClose }) {
  const profileTheme = profile.profile_theme || "default";
  const themeEffect = THEME_GLOWS[profileTheme] || THEME_GLOWS.default;
  const isPro = profileTheme !== "default" || profile.plan === "premium";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="xenon-panel p-8 max-w-md w-full relative overflow-hidden"
        style={{
          borderColor: themeEffect.border,
          background: "var(--panel-bg)",
          boxShadow: themeEffect.shadow
        }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--muted)] hover:text-white">✕</button>
        
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <ProfileAvatar name={profile.first_name || profile.username} avatarUrl={profile.avatar_url} size="lg" />
            {isPro && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full whitespace-nowrap">
                PRO MEMBER
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-2xl font-black">{profile.first_name || profile.username || "Student"}</h3>
            <p className="text-[var(--accent)] font-bold">@{profile.username || "unknown"}</p>
            {isPro && (
              <p className="text-xs font-bold text-amber-300 mt-1 flex items-center justify-center gap-1 font-mono">
                <Sparkles className="h-3 w-3 fill-current" /> {themeEffect.title}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 w-full mt-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
              <p className="text-[10px] uppercase font-black text-[var(--muted)]">Level</p>
              <p className="text-xl font-black text-white">{profile.level || 1}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
              <p className="text-[10px] uppercase font-black text-[var(--muted)]">Total XP</p>
              <p className="text-xl font-black text-[var(--accent)]">{profile.experience_points || 0}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
              <p className="text-[10px] uppercase font-black text-[var(--muted)]">Questions</p>
              <p className="text-xl font-black text-emerald-400">{profile.practice_questions_correct || 0}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
              <p className="text-[10px] uppercase font-black text-[var(--muted)]">Projects</p>
              <p className="text-xl font-black text-amber-400">{profile.total_projects || 0}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
