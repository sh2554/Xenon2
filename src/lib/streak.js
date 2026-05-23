/** Daily streak + revision boosters (per-user localStorage). */

export const STREAK_FREEZE_COST = 0;
export const DOUBLE_XP_DURATION_MS = 24 * 60 * 60 * 1000;

export function getLocalDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function daysBetweenLocal(fromKey, toKey) {
  if (!fromKey || !toKey) return null;
  const [fy, fm, fd] = fromKey.split("-").map(Number);
  const [ty, tm, td] = toKey.split("-").map(Number);
  const from = new Date(fy, fm - 1, fd);
  const to = new Date(ty, tm - 1, td);
  return Math.round((to - from) / 86400000);
}

function storageKey(userId) {
  return `xenon-streak-v2-${userId || "guest"}`;
}

export function loadStreakData(userId) {
  if (typeof window === "undefined") {
    return defaultStreakData();
  }
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return migrateLegacyStreak(userId);
    const parsed = JSON.parse(raw);
    return normalizeStreakData(parsed);
  } catch {
    return defaultStreakData();
  }
}

function migrateLegacyStreak(userId) {
  try {
    const legacy = JSON.parse(localStorage.getItem("xenon-streak") || "{}");
    if (legacy.current || legacy.lastDate) {
      const data = normalizeStreakData({
        current: legacy.current || 0,
        longest: legacy.longest || 0,
        lastActiveDate: legacy.lastDate || null,
      });
      saveStreakData(userId, data);
      return data;
    }
  } catch {}
  return defaultStreakData();
}

function defaultStreakData() {
  return {
    current: 0,
    longest: 0,
    lastActiveDate: null,
    freezeArmed: false,
    doubleXpUntil: null,
  };
}

function normalizeStreakData(data = {}) {
  return {
    current: Math.max(0, Number(data.current) || 0),
    longest: Math.max(0, Number(data.longest) || 0),
    lastActiveDate: data.lastActiveDate || null,
    freezeArmed: Boolean(data.freezeArmed),
    doubleXpUntil: data.doubleXpUntil || null,
  };
}

export function saveStreakData(userId, data) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userId), JSON.stringify(normalizeStreakData(data)));
}

export function isDoubleXpActive(data) {
  if (!data?.doubleXpUntil) return false;
  return Date.parse(data.doubleXpUntil) > Date.now();
}

export function getXpMultiplier(data) {
  return isDoubleXpActive(data) ? 2 : 1;
}

/**
 * Sync streak state. Call with markActivity when the student revises (login, skill, XP).
 */
export function syncStreak(userId, { markActivity = false } = {}) {
  const today = getLocalDateKey();
  let data = loadStreakData(userId);
  let { current, longest, lastActiveDate, freezeArmed, doubleXpUntil } = data;

  const gap = lastActiveDate ? daysBetweenLocal(lastActiveDate, today) : null;
  let status = "active";
  let message = null;

  if (!markActivity) {
    if (!lastActiveDate) {
      status = "new";
    } else if (gap === 0) {
      status = "active";
    } else if (gap === 1) {
      status = "at_risk";
      message = "Practice today to keep your streak.";
    } else if (gap === 2 && freezeArmed) {
      status = "freeze_ready";
      message = "Streak freeze will protect you when you practise today.";
    } else if (gap >= 2) {
      current = 0;
      status = "broken";
      message = "Streak lost — practise today to start again.";
      saveStreakData(userId, { ...data, current: 0 });
    }
    return buildView(userId, { current, longest, lastActiveDate, freezeArmed, doubleXpUntil }, status, message, gap);
  }

  // markActivity === true
  if (!lastActiveDate) {
    current = 1;
    status = "started";
  } else if (gap === 0) {
    current = Math.max(current, 1);
    status = "active";
  } else if (gap === 1) {
    current = Math.max(current, 1) + 1;
    status = "extended";
    message = "Streak extended.";
  } else if (gap === 2 && freezeArmed) {
    current = Math.max(current, 1) + 1;
    freezeArmed = false;
    status = "freeze_used";
    message = "Streak freeze used — streak saved.";
  } else {
    current = 1;
    status = gap >= 2 ? "restarted" : "started";
    message = gap >= 2 ? "New streak started." : null;
  }

  lastActiveDate = today;
  longest = Math.max(longest, current);
  data = { current, longest, lastActiveDate, freezeArmed, doubleXpUntil };
  saveStreakData(userId, data);

  return buildView(userId, data, status, message, 0);
}

function buildView(userId, data, status, message, gap) {
  const today = getLocalDateKey();
  const doubleXp = isDoubleXpActive(data);
  return {
    current: data.current,
    longest: data.longest,
    lastActiveDate: data.lastActiveDate,
    freezeArmed: data.freezeArmed,
    doubleXpActive: doubleXp,
    doubleXpUntil: data.doubleXpUntil,
    todayActive: data.lastActiveDate === today,
    atRisk: status === "at_risk",
    status,
    message,
    gap,
    xpMultiplier: doubleXp ? 2 : 1,
  };
}

export function activateStreakFreeze(userId) {
  const data = loadStreakData(userId);
  if (data.freezeArmed) {
    return { ok: false, error: "Streak freeze is already armed." };
  }
  if ((data.current || 0) < 1) {
    return { ok: false, error: "Start a streak before using a freeze." };
  }
  const next = { ...data, freezeArmed: true };
  saveStreakData(userId, next);
  return {
    ok: true,
    message: "Streak freeze armed. If you miss tomorrow, your streak is protected once.",
    streak: syncStreak(userId, { markActivity: false }),
  };
}

export function activateDoubleXp(userId) {
  const data = loadStreakData(userId);
  const until = new Date(Date.now() + DOUBLE_XP_DURATION_MS).toISOString();
  const next = { ...data, doubleXpUntil: until };
  saveStreakData(userId, next);
  return {
    ok: true,
    message: "Double XP active for 24 hours.",
    streak: syncStreak(userId, { markActivity: false }),
  };
}
