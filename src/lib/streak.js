/** Daily streak + revision boosters (per-user localStorage + fallback). */

export const STREAK_FREEZE_COST = 0;
export const DOUBLE_XP_DURATION_MS = 24 * 60 * 60 * 1000;

export function getLocalDateKey(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return getLocalDateKey(new Date());
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDateKey(key) {
  if (!key) return null;
  if (key instanceof Date) return isNaN(key.getTime()) ? null : key;
  // Handle ISO string or timestamp by splitting on T or space
  const clean = String(key).split("T")[0].split(" ")[0].trim();
  const parts = clean.split("-").map(Number);
  if (parts.length === 3 && parts.every((n) => !isNaN(n))) {
    const [y, m, d] = parts;
    const date = new Date(y, m - 1, d);
    return isNaN(date.getTime()) ? null : date;
  }
  const fallback = new Date(key);
  return isNaN(fallback.getTime()) ? null : fallback;
}

export function daysBetweenLocal(fromKey, toKey) {
  const from = parseDateKey(fromKey);
  const to = parseDateKey(toKey);
  if (!from || !to) return null;
  // Normalize both to calendar midnight
  const fromMidnight = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const toMidnight = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  const diff = Math.round((toMidnight.getTime() - fromMidnight.getTime()) / 86400000);
  return isNaN(diff) ? null : diff;
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
    if (raw) {
      const parsed = JSON.parse(raw);
      return normalizeStreakData(parsed);
    }
    // Fallback: check generic current key if user key is empty
    const genericRaw = localStorage.getItem("xenon-streak-current");
    if (genericRaw) {
      const parsed = JSON.parse(genericRaw);
      return normalizeStreakData(parsed);
    }
    return migrateLegacyStreak(userId);
  } catch {
    return defaultStreakData();
  }
}

function migrateLegacyStreak(userId) {
  try {
    const legacy = JSON.parse(localStorage.getItem("xenon-streak") || "{}");
    if (legacy.current || legacy.lastDate) {
      const cleanDate = legacy.lastDate ? getLocalDateKey(legacy.lastDate) : null;
      const data = normalizeStreakData({
        current: legacy.current || 1,
        longest: Math.max(legacy.longest || 0, legacy.current || 1),
        lastActiveDate: cleanDate,
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
  const rawDate = data.lastActiveDate || data.lastDate || null;
  const cleanDate = rawDate ? getLocalDateKey(rawDate) : null;
  return {
    current: Math.max(0, Number(data.current) || 0),
    longest: Math.max(0, Number(data.longest) || 0),
    lastActiveDate: cleanDate,
    freezeArmed: Boolean(data.freezeArmed),
    doubleXpUntil: data.doubleXpUntil || null,
  };
}

export function saveStreakData(userId, data) {
  if (typeof window === "undefined") return;
  const normalized = normalizeStreakData(data);
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(normalized));
    localStorage.setItem("xenon-streak-current", JSON.stringify(normalized));
  } catch {}
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
export function syncStreak(userId, { markActivity = false, forceIncrement = false } = {}) {
  const today = getLocalDateKey();
  let data = loadStreakData(userId);
  let { current, longest, lastActiveDate, freezeArmed, doubleXpUntil } = data;

  const gap = lastActiveDate ? daysBetweenLocal(lastActiveDate, today) : null;
  let status = "active";
  let message = null;

  if (forceIncrement) {
    current = Math.max(current, 0) + 1;
    lastActiveDate = today;
    longest = Math.max(longest, current);
    data = { current, longest, lastActiveDate, freezeArmed, doubleXpUntil };
    saveStreakData(userId, data);
    return buildView(userId, data, "extended", "Streak incremented.", 0);
  }

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
    } else if (gap === 2 && !freezeArmed) {
      status = "at_risk";
      message = "Practice today to protect your streak.";
    } else if (gap >= 3) {
      current = 0;
      status = "broken";
      message = "Streak lost — practise today to start again.";
      saveStreakData(userId, { ...data, current: 0 });
    }
    return buildView(userId, { current, longest, lastActiveDate, freezeArmed, doubleXpUntil }, status, message, gap);
  }

  // markActivity === true
  if (!lastActiveDate) {
    current = Math.max(current, 1);
    status = "started";
  } else if (gap === 0) {
    // Already active today: keep active streak at current value
    current = Math.max(current, 1);
    status = "active";
  } else if (gap === 1) {
    // Next day: extend streak!
    current = Math.max(current, 0) + 1;
    status = "extended";
    message = "Streak extended.";
  } else if (gap === 2) {
    // Day 2 grace window or freeze
    if (freezeArmed) {
      current = Math.max(current, 0) + 1;
      freezeArmed = false;
      status = "freeze_used";
      message = "Streak freeze used — streak saved.";
    } else {
      // 48h grace period
      current = Math.max(current, 0) + 1;
      status = "extended";
      message = "Streak saved just in time.";
    }
  } else {
    // 3+ days missed: restart streak at 1
    current = 1;
    status = gap >= 3 ? "restarted" : "started";
    message = gap >= 3 ? "New streak started." : null;
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
    message: "Streak freeze armed. If you miss a day, your streak is protected once.",
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
