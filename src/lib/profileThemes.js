/** Leaderboard & public profile card themes — unlocks, visuals, shared helpers. */

export const THEME_IDS = ["default", "pink-glass", "oled", "cyberpunk"];

export const PROFILE_THEMES = [
  {
    id: "default",
    label: "GCSE Apprentice",
    shortTitle: "Apprentice",
    description: "Clean blue accent. Available to every student.",
    minLevel: 1,
    rankReq: null,
    icon: "graduation",
    swatch: ["#2455c3", "#60a5fa", "#edf4ff"],
    perks: ["Standard leaderboard row", "Public profile card"],
  },
  {
    id: "pink-glass",
    label: "Sakura Spark",
    shortTitle: "Sakura Spark",
    description: "Rose glow on your leaderboard row and profile modal.",
    minLevel: 5,
    rankReq: 3,
    icon: "flower",
    swatch: ["#ec4899", "#f472b6", "#1f0f1c"],
    perks: ["Pink border glow on leaderboards", "Title badge under your name", "Profile banner tint"],
  },
  {
    id: "oled",
    label: "Dark Mode Overlord",
    shortTitle: "Overlord",
    description: "High-contrast monochrome frame for top revisers.",
    minLevel: 8,
    rankReq: null,
    icon: "moon",
    swatch: ["#ffffff", "#3f3f46", "#000000"],
    perks: ["OLED-style row highlight", "Silver rank frame", "Profile banner tint"],
  },
  {
    id: "cyberpunk",
    label: "Cyberpunk Wizard",
    shortTitle: "Cyberpunk Wizard",
    description: "Neon purple — for class #1 or level 10+.",
    minLevel: 10,
    rankReq: 1,
    icon: "zap",
    swatch: ["#e879f9", "#2dd4bf", "#1e0b36"],
    perks: ["Strongest leaderboard glow", "Wizard title on class board", "Animated profile border"],
  },
];

export const THEME_EFFECTS = {
  cyberpunk: {
    border: "rgba(232, 121, 249, 0.45)",
    bg: "rgba(232, 121, 249, 0.06)",
    shadow: "0 0 20px rgba(232, 121, 249, 0.22)",
    banner: "linear-gradient(135deg, rgba(232,121,249,0.25), rgba(45,212,191,0.12))",
    title: "Cyberpunk Wizard",
    accent: "#e879f9",
  },
  "pink-glass": {
    border: "rgba(244, 114, 182, 0.45)",
    bg: "rgba(244, 114, 182, 0.06)",
    shadow: "0 0 18px rgba(244, 114, 182, 0.2)",
    banner: "linear-gradient(135deg, rgba(244,114,182,0.22), rgba(236,72,153,0.08))",
    title: "Sakura Spark",
    accent: "#f472b6",
  },
  oled: {
    border: "rgba(255, 255, 255, 0.35)",
    bg: "rgba(0, 0, 0, 0.35)",
    shadow: "0 0 16px rgba(255, 255, 255, 0.12)",
    banner: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(63,63,70,0.4))",
    title: "Dark Mode Overlord",
    accent: "#e4e4e7",
  },
  default: {
    border: "rgba(79, 184, 255, 0.28)",
    bg: "rgba(79, 184, 255, 0.04)",
    shadow: "none",
    banner: "linear-gradient(135deg, rgba(36,85,195,0.15), transparent)",
    title: null,
    accent: "var(--accent)",
  },
};

export const RANK_STYLES = {
  1: {
    label: "1st",
    border: "rgba(255, 215, 0, 0.45)",
    bg: "rgba(255, 215, 0, 0.1)",
    glow: "0 0 22px rgba(255, 215, 0, 0.18)",
    iconClass: "text-amber-400",
    ring: "ring-amber-400/50",
  },
  2: {
    label: "2nd",
    border: "rgba(192, 192, 192, 0.45)",
    bg: "rgba(192, 192, 192, 0.08)",
    glow: "0 0 18px rgba(192, 192, 192, 0.14)",
    iconClass: "text-slate-300",
    ring: "ring-slate-400/40",
  },
  3: {
    label: "3rd",
    border: "rgba(205, 127, 50, 0.45)",
    bg: "rgba(205, 127, 50, 0.1)",
    glow: "0 0 16px rgba(205, 127, 50, 0.14)",
    iconClass: "text-orange-400",
    ring: "ring-orange-400/40",
  },
};

export function getThemeMeta(themeId) {
  return PROFILE_THEMES.find((t) => t.id === themeId) || PROFILE_THEMES[0];
}

export function getThemeEffect(themeId) {
  return THEME_EFFECTS[themeId] || THEME_EFFECTS.default;
}

export function getRankStyle(rank) {
  return RANK_STYLES[rank] || null;
}

/** Resolve stored theme (profile_theme column or legacy avatar_url theme id). */
export function getProfileTheme(profile = {}) {
  const candidates = [profile.profile_theme, profile.avatar_url].filter(Boolean);
  for (const raw of candidates) {
    if (THEME_IDS.includes(raw)) return raw;
    if (typeof raw === "string" && !raw.startsWith("http") && THEME_IDS.includes(raw.trim())) {
      return raw.trim();
    }
  }
  return "default";
}

export function isThemeUnlocked(theme, { level = 1, classRank = 999 } = {}) {
  if (!theme || theme.id === "default") return true;
  const lvl = Math.max(1, Number(level) || 1);
  const rank = Number(classRank) || 999;
  if (lvl >= theme.minLevel) return true;
  if (theme.rankReq != null && rank > 0 && rank <= theme.rankReq) return true;
  return false;
}

export function getThemeUnlockHint(theme) {
  const parts = [];
  if (theme.minLevel > 1) parts.push(`Level ${theme.minLevel}`);
  if (theme.rankReq != null) {
    parts.push(theme.rankReq === 1 ? "1st in class" : `Top ${theme.rankReq} in class`);
  }
  return parts.join(" or ");
}

export function sortLeaderboardEntries(entries, sortBy = "xp") {
  const list = [...entries];
  const key =
    sortBy === "solved"
      ? (e) => e.practice_questions_correct ?? e.questions_solved ?? 0
      : sortBy === "projects"
        ? (e) => e.total_projects ?? 0
        : (e) => e.experience_points ?? 0;
  return list.sort((a, b) => key(b) - key(a));
}

export function formatPracticeTime(seconds = 0) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${total}s`;
}
