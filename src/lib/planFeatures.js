/** Plan tiers, feature gates, and catalog (redeem codes until Stripe). */

export const REDEEM_CODES = {
  PRO123: "pro",
  MAX456: "max",
  FREE: "free",
  RESETMOCK: "resetmock",
};

export const PLANS = {
  free: {
    id: "free",
    label: "Free",
    tagline: "Core GCSE learning for every student",
    projectLimit: 5,
    redeemCode: null,
  },
  pro: {
    id: "pro",
    label: "Pro",
    tagline: "Independent learners — revision & IDE power-ups",
    projectLimit: null,
    redeemCode: "PRO123",
  },
  max: {
    id: "max",
    label: "Max",
    tagline: "Teachers & schools — class analytics & exports",
    projectLimit: null,
    redeemCode: "MAX456",
  },
};

/** Features included on the free plan only (baseline). */
export const FREE_FEATURES = [
  "Python IDE with interactive input()",
  "Theory Hub — core notes, flashcards & quizzes",
  "2 free GCSE past papers (3Q theory + 3Q programming)",
  "Up to 5 saved projects",
  "Join a class, streaks & practice questions",
  "Parsons problems & skills lab",
  "Class & global leaderboards",
  "1v1 friend battles (student)",
  "Profile, friends & achievements",
];

/** Pro-only additions (also included on Max). */
export const PRO_EXCLUSIVE_FEATURES = [
  "Unlimited saved projects",
  "Extended theory notes — examiner-depth sections",
  "Full past paper bank (OCR, AQA, Edexcel-style)",
  "Premium IDE themes (Cyberpunk, OLED, Sakura, etc.)",
  "Custom editor fonts (Fira Code, Space Mono)",
  "Pro member badge on profile & leaderboards",
  "Unlockable leaderboard profile themes (Sakura, OLED, Cyberpunk)",
  "Unlock all programming & theory papers in revision hub",
  "Xenon AI error explain — line numbers & GCSE hints",
];

/** Max-only additions (school / teacher tools; includes everything in Pro). */
export const MAX_EXCLUSIVE_FEATURES = [
  "GCSE mock tests (theory & programming) with personal spec heatmap",
  "Per-student OCR curriculum spec heatmap (from mock tests only)",
  "One-click GCSE roster progress PDF export",
  "Student roster CSV export",
  "Class-wide insights dashboard (teacher)",
  "Plagiarism & AI-copy scanner (when live)",
  "School-scale class management",
];

/**
 * Runtime feature flags — which plans unlock each gate.
 * Pro keys: pro + max. Max keys: max only.
 */
export const FEATURES = {
  unlimitedProjects: ["pro", "max"],
  extendedTheoryNotes: ["pro", "max"],
  allPastPapers: ["pro", "max"],
  premiumIdeSkins: ["pro", "max"],
  proMemberBadge: ["pro", "max"],
  aiErrorExplain: ["pro", "max"],
  timeModule: ["pro", "max"],
  mockTests: ["max"],
  specHeatmapPerStudent: ["max"],
  viewOwnSpecHeatmap: ["max"],
  rosterProgressExport: ["max"],
  rosterCsvExport: ["max"],
  plagiarismScanner: ["max"],
  teacherClassAnalytics: ["max"],
};

/** Full bullet lists per plan (for settings / upgrade UI). */
export const PLAN_FEATURE_LIST = {
  free: [...FREE_FEATURES],
  pro: [
    "Includes everything in Free, plus:",
    ...PRO_EXCLUSIVE_FEATURES,
  ],
  max: [
    "Includes everything in Pro, plus:",
    ...MAX_EXCLUSIVE_FEATURES,
  ],
};

/** Landing page pricing cards — sourced from catalog above. */
export const PRICING_PLANS = [
  {
    id: "free",
    name: "Free Student",
    price: "0",
    description: PLANS.free.tagline,
    features: FREE_FEATURES,
    exclusiveLabel: "Free includes",
    cta: "Start Learning",
    popular: false,
    color: "var(--muted)",
    redeemCode: null,
  },
  {
    id: "pro",
    name: "Pro Student",
    price: "4.99",
    description: PLANS.pro.tagline,
    features: PRO_EXCLUSIVE_FEATURES,
    exclusiveLabel: "Pro adds",
    alsoIncludes: "Everything in Free",
    cta: "Get Pro access",
    popular: true,
    color: "var(--accent)",
    redeemCode: "PRO123",
  },
  {
    id: "max",
    name: "School Max",
    price: "19.99",
    description: PLANS.max.tagline,
    features: MAX_EXCLUSIVE_FEATURES,
    exclusiveLabel: "Max adds (teachers)",
    alsoIncludes: "Everything in Pro + Free",
    cta: "Get Max access",
    popular: false,
    color: "#a78bfa",
    redeemCode: "MAX456",
  },
];

export function normalizePlan(plan) {
  const p = (plan || "free").toLowerCase();
  if (p === "premium") return "pro";
  return PLANS[p] ? p : "free";
}

export function isProOrMax(plan) {
  const p = normalizePlan(plan);
  return p === "pro" || p === "max";
}

export function isProOnly(plan) {
  return normalizePlan(plan) === "pro";
}

export function isMax(plan) {
  return normalizePlan(plan) === "max";
}

export function hasFeature(plan, featureKey) {
  const allowed = FEATURES[featureKey];
  if (!allowed) return false;
  return allowed.includes(normalizePlan(plan));
}

export function getProjectLimit(plan) {
  const tier = PLANS[normalizePlan(plan)];
  return tier?.projectLimit ?? null;
}

export function getPlanBadge(plan) {
  const tier = normalizePlan(plan);
  if (tier === "max") {
    return {
      tier,
      label: "MAX",
      shortLabel: "School Max",
      className: "bg-violet-500/15 text-violet-300 border-violet-400/40",
      glow: "0 0 12px rgba(139, 92, 246, 0.35)",
    };
  }
  if (tier === "pro") {
    return {
      tier,
      label: "PRO",
      shortLabel: "Pro Member",
      className: "bg-amber-500/15 text-amber-300 border-amber-400/40",
      glow: "0 0 12px rgba(251, 191, 36, 0.3)",
    };
  }
  return null;
}

/** Features the user lacks vs required tier (for upgrade prompts). */
export function getUpgradeHint(featureKey) {
  const allowed = FEATURES[featureKey];
  if (!allowed) return null;
  if (allowed.includes("max") && !allowed.includes("pro")) {
    return { tier: "max", label: "School Max" };
  }
  return { tier: "pro", label: "Pro" };
}
