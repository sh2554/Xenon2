import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import ErrorBoundary from "./components/ErrorBoundary";
import BackgroundAnimation from "./components/BackgroundAnimation";
import AuthGate from "./components/AuthGate";
import SharedCodeView from "./components/SharedCodeView";
import NotFoundPage from "./components/NotFoundPage";
import InitOverlay from "./components/InitOverlay";
import ProfileSetupModal from "./components/ProfileSetupModal";
import XenonIDE from "./components/XenonIDE";
import SettingsPanel from "./components/SettingsPanel";
import ClassDashboard from "./components/ClassDashboard";
import StudentAssignmentWork from "./components/StudentAssignmentWork";
import StreakBoosters, { StreakBadge } from "./components/StreakBoosters";
import MockTestPanel from "./components/MockTestPanel";
import { hasFeature } from "./lib/planFeatures";
import { parseAssignment } from "./lib/assignmentPayload";
import ParsonsProblem from "./components/ParsonsProblem";
import ChallengeArena from "./components/ChallengeArena";
import TheoryPanel from "./components/TheoryPanel";
import PastPapersPanel from "./components/PastPapersPanel";
import SavedProjectsView from "./components/SavedProjectsView";
import SiteFooter from "./components/SiteFooter";
import UpgradeModal from "./components/UpgradeModal";
import PlanBadge from "./components/PlanBadge";
import { getProjectLimit, isProOrMax, normalizePlan } from "./lib/planFeatures";
import ProfileAvatar from "./components/ProfileAvatar";
import AchievementsPanel from "./components/AchievementsPanel";
import LeaderboardsPanel from "./components/LeaderboardsPanel";
import { getLevelProgress, getRankBadge } from "./lib/progression";
import { useAppStore } from "./store/useAppStore";
import { 
  Home, Code, BookOpen, FolderOpen, Trophy, Settings, 
  LogOut, Menu, X, Zap, Flame, Star, Award, ChevronRight, ChevronDown, ClipboardCheck,
  User, LayoutDashboard, Target, FileText, ShoppingBag, Sparkles,
  TrendingUp, Clock, Plus
} from "lucide-react";


const motionProps = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const formatPracticeTime = (seconds = 0) => {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${totalSeconds}s`;
};

const LOAD_HINTS = [
  { after: 2500, text: "Checking your account details..." },
  { after: 5000, text: "If you just signed up, please check your email and click the verification link." },
  { after: 9000, text: "Still loading - this is taking longer than usual." },
  { after: 13000, text: "If you have not verified your email yet, look for a message from Xenon Code in your inbox." },
  { after: 18000, text: "Account not found or session expired. Try refreshing the page or signing in again." },
];

function LoadingScreen() {
  const [hint, setHint] = useState(null);

  useEffect(() => {
    const timers = LOAD_HINTS.map(({ after, text }) => setTimeout(() => setHint(text), after));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="xenon-shell flex min-h-screen flex-col items-center justify-center px-4 relative">
      <BackgroundAnimation />
      {/* Subtle background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--accent)] opacity-[0.03] blur-[120px]" />
      </div>
      
      <motion.div 
        className="xenon-panel mx-auto w-full max-w-sm p-10 text-center relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img src="/favicon.svg" alt="Xenon Code" className="mx-auto mb-6 h-14 w-14 rounded-2xl shadow-xl shadow-[var(--accent-glow)]" />
        <p className="text-base font-semibold">Loading Xenon Code...</p>
        <div className="mt-4 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="inline-block h-2 w-2 rounded-full bg-[var(--accent)]"
              style={{ animation: `pulse 1.2s ease-in-out ${i * 0.3}s infinite` }}
            />
          ))}
        </div>
        {hint ? (
          <motion.p 
            className="mt-6 text-xs leading-relaxed text-[var(--muted)]"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {hint}
          </motion.p>
        ) : null}
      </motion.div>
    </div>
  );
}

function HomeView({ profile, enrolledClass, projectsCount, challengeCount, onNavigate }) {
  const levelProgress = getLevelProgress(profile?.experience_points || 0);
  const rankBadge = getRankBadge(enrolledClass?.rank);
  
  return (
    <motion.section className="space-y-6" {...motionProps}>
      {/* Welcome Banner */}
      <motion.div 
        className="xenon-hero-panel relative overflow-hidden p-8 sm:p-10"
        whileHover={{ borderColor: "var(--accent)" }}
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[var(--accent)] opacity-[0.04] blur-[100px] pointer-events-none" />
        
        <div className="relative">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--border)]">
            <span className="xenon-kicker">Student Dashboard</span>
            <span className="text-xs font-medium font-mono text-[var(--muted)] flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              {formatPracticeTime(enrolledClass?.total_time_seconds || 0)} practice
            </span>
          </div>
          
          <motion.h1 
            className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Welcome back, <span className="text-gradient-purple">{profile?.first_name || "Coder"}</span>
          </motion.h1>
          <motion.p 
            className="mt-3 max-w-2xl text-sm text-[var(--muted)] leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Your Python environment and GCSE curriculum progress are synced. Pick up where you left off or explore new challenges.
          </motion.p>
          
          <motion.div 
            className="mt-8 flex flex-wrap gap-3 pt-6 border-t border-[var(--border)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button className="xenon-btn px-6 py-3" onClick={() => onNavigate("code")}>
              <Code className="mr-2 h-4 w-4" /> Continue Coding
            </button>
            <button className="xenon-btn-ghost px-6 py-3" onClick={() => onNavigate("theory")}>
              <BookOpen className="mr-2 h-4 w-4" /> View Theory Hub
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {[
          { 
            label: "Level Progress", 
            icon: Star, 
            value: `LVL ${levelProgress.level}`,
            extra: (
              <div className="mt-3 pt-3 border-t border-[var(--border)]">
                <div className="flex justify-between text-[10px] font-medium text-[var(--muted)] mb-1.5">
                  <span>{profile?.experience_points || 0} XP</span>
                  <span>{levelProgress.percent}%</span>
                </div>
                <div className="h-1.5 w-full bg-[var(--panel-soft)] rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-[var(--accent)] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress.percent}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            )
          },
          { 
            label: "Class Rank", 
            icon: Trophy, 
            value: enrolledClass?.rank ? `#${enrolledClass.rank}` : "---",
            subtitle: rankBadge ? rankBadge.label : "Unranked"
          },
          { 
            label: "Saved Work", 
            icon: FolderOpen, 
            value: projectsCount,
            subtitle: "Python Labs"
          },
          { 
            label: "1v1 Battles", 
            icon: Zap, 
            value: challengeCount,
            subtitle: "Active Battles"
          },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            className="xenon-panel p-5 group cursor-pointer"
            variants={staggerItem}
            whileHover={{ scale: 1.02, borderColor: "var(--accent)" }}
            onClick={() => {
              if (card.label === "Saved Work") onNavigate("projects");
              if (card.label === "1v1 Battles") onNavigate("challenge");
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">{card.label}</span>
              <card.icon className="h-4 w-4 text-[var(--accent)] group-hover:animate-bounce-soft" />
            </div>
            <p className="text-2xl font-bold tracking-tight">{card.value}</p>
            {card.subtitle && (
              <div className="mt-3 pt-3 border-t border-[var(--border)]">
                <span className="text-[10px] font-medium text-[var(--muted)]">{card.subtitle}</span>
              </div>
            )}
            {card.extra}
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

function StudentClassView({ onNavigateToIde }) {
  const {
    enrolledClass,
    announcements,
    assignments,
    streak,
    submitAssignment,
    loadMySubmissions,
    setActiveProjectCode,
    profile,
  } = useAppStore();
  const studentPlan = profile?.plan;
  const [submittedIds, setSubmittedIds] = useState(new Set());
  const [submittingId, setSubmittingId] = useState(null);
  const [noteMap, setNoteMap] = useState({});
  useEffect(() => {
    if (enrolledClass) {
      loadMySubmissions().then((ids) => {
        if (ids?.length) setSubmittedIds(new Set(ids));
      }).catch(() => {});
    }
  }, [enrolledClass, loadMySubmissions]);

  const legacyAssignments = assignments.filter((a) => parseAssignment(a).type === "legacy");

  const handleLegacySubmit = async (assignmentId) => {
    setSubmittingId(assignmentId);
    try {
      await submitAssignment({ assignmentId, notes: noteMap[assignmentId] || "" });
      setSubmittedIds((prev) => new Set([...prev, assignmentId]));
    } catch {}
    setSubmittingId(null);
  };

  const openAssignmentInIde = (code) => {
    if (code) setActiveProjectCode(code);
    onNavigateToIde?.();
  };

  return (
    <motion.section className="space-y-4" {...motionProps}>
      <div className="xenon-panel p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">My Class</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Your class activity, ranking, assignments, and updates.</p>
          </div>
          <StreakBadge streak={streak} />

        </div>
      </div>

      {!enrolledClass ? (
        <div className="xenon-panel p-6">
          <p className="text-sm text-[var(--muted)]">You are not connected to a class yet. Go to Settings and enter a class code.</p>
        </div>
      ) : (
        <>
          <div className="xenon-panel p-6">
            <h3 className="text-lg font-semibold">Class Overview</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <motion.div className="xenon-panel-muted p-4" whileHover={{ borderColor: "var(--accent)" }}>
                <p className="xenon-kicker">Class</p>
                <p className="mt-2 text-lg font-semibold">{enrolledClass.name}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">Code {enrolledClass.class_code}</p>
              </motion.div>
              <motion.div className="xenon-panel-muted p-4" whileHover={{ borderColor: "var(--accent)" }}>
                <p className="xenon-kicker">Your Rank</p>
                <p className="mt-2 text-lg font-semibold">{enrolledClass.rank ? `#${enrolledClass.rank}` : "Unranked"}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">Skills correct, then projects, then time</p>
              </motion.div>
              <motion.div className="xenon-panel-muted p-4" whileHover={{ borderColor: "var(--accent)" }}>
                <p className="xenon-kicker">Teacher</p>
                <p className="mt-2 text-lg font-semibold">{enrolledClass.profiles?.first_name || "Unknown"}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">@{enrolledClass.profiles?.username || "teacher"}</p>
              </motion.div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <motion.div className="xenon-panel-muted p-4" whileHover={{ borderColor: "var(--accent)" }}>
                <p className="xenon-kicker">Practice Time</p>
                <p className="mt-2 text-xl font-semibold">{formatPracticeTime(enrolledClass.total_time_seconds || 0)}</p>
              </motion.div>
              <motion.div className="xenon-panel-muted p-4" whileHover={{ borderColor: "var(--accent)" }}>
                <p className="xenon-kicker">Projects</p>
                <p className="mt-2 text-xl font-semibold">{enrolledClass.total_projects || 0}</p>
              </motion.div>
              <motion.div className="xenon-panel-muted p-4" whileHover={{ borderColor: "var(--accent)" }}>
                <p className="xenon-kicker">Skills Correct</p>
                <p className="mt-2 text-xl font-semibold">{enrolledClass.practice_questions_correct || 0}</p>
              </motion.div>
            </div>
          </div>

          {announcements.length > 0 ? (
            <div className="xenon-panel p-6">
              <h3 className="text-lg font-semibold">Announcements</h3>
              <div className="mt-4 space-y-3">
                {announcements.map((announcement) => (
                  <motion.div 
                    key={announcement.id} 
                    className="xenon-panel-muted p-4" 
                    style={{ borderLeft: "3px solid var(--accent)" }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <p className="text-sm leading-relaxed">{announcement.message}</p>
                    <p className="mt-2 text-xs text-[var(--muted)]">{new Date(announcement.created_at).toLocaleString()}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : null}

          <StudentAssignmentWork onOpenIde={openAssignmentInIde} />

          {legacyAssignments.length > 0 ? (
            <div className="xenon-panel p-6">
              <h3 className="text-lg font-semibold">Other class tasks</h3>
              <p className="text-xs text-[var(--muted)] mt-1">Practice-goal assignments from your teacher.</p>
              <div className="mt-4 space-y-4">
                {legacyAssignments.map((assignment) => {
                  const done = submittedIds.has(assignment.id);
                  const submitting = submittingId === assignment.id;
                  const isOverdue = assignment.due_date && new Date(assignment.due_date) < new Date();
                  const questionsCompleted = enrolledClass?.practice_questions_correct || 0;
                  const hasGoal = !!assignment.question_goal;
                  const goalMet = !hasGoal || questionsCompleted >= assignment.question_goal;
                  const progressPct = hasGoal ? Math.min(100, Math.round((questionsCompleted / assignment.question_goal) * 100)) : 100;
                  const parsed = parseAssignment(assignment);
                  return (
                    <div key={assignment.id} className="xenon-panel-muted p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold">{assignment.title}</p>
                          <p className="mt-1 text-sm text-[var(--muted)]">{parsed.summary || assignment.description}</p>
                          {assignment.due_date ? (
                            <p className={clsx("mt-1 text-xs font-semibold", isOverdue ? "text-[var(--danger)]" : "text-[var(--muted)]")}>
                              Due: {new Date(assignment.due_date).toLocaleDateString()} {isOverdue ? "(overdue)" : ""}
                            </p>
                          ) : null}
                          {hasGoal && !done ? (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className={clsx("font-semibold", goalMet ? "text-[var(--success)]" : "text-[var(--accent)]")}>
                                  {goalMet
                                    ? `Goal reached - ${questionsCompleted} / ${assignment.question_goal} questions`
                                    : `${questionsCompleted} / ${assignment.question_goal} questions completed`}
                                </span>
                                <span className="text-[var(--muted)]">{progressPct}%</span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ background: goalMet ? "var(--success, #22c55e)" : "var(--accent)" }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progressPct}%` }}
                                  transition={{ duration: 0.8 }}
                                />
                              </div>
                            </div>
                          ) : null}
                        </div>
                        {done ? (
                          <span className="xenon-badge shrink-0" style={{ borderColor: "var(--success)", color: "var(--success)", background: "rgba(26,110,62,0.1)" }}>
                            Submitted
                          </span>
                        ) : (
                          <button
                            className="xenon-btn shrink-0"
                            disabled={submitting || !goalMet}
                            onClick={() => handleLegacySubmit(assignment.id)}
                          >
                            {submitting ? "Submitting..." : goalMet ? "Mark as Submitted" : `Locked - ${progressPct}%`}
                          </button>
                        )}
                      </div>
                      {!done ? (
                        <textarea
                          className="xenon-input mt-3 w-full resize-none text-sm"
                          rows={2}
                          placeholder="Optional note to your teacher..."
                          value={noteMap[assignment.id] || ""}
                          onChange={(event) => setNoteMap((prev) => ({ ...prev, [assignment.id]: event.target.value }))}
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          <StreakBoosters />

          {/* Class Roster Directory */}
          <div className="xenon-panel p-6">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <h3 className="text-lg font-bold">Classmates Directory</h3>
                <p className="text-xs text-[var(--muted)] mt-0.5">GCSE revision levels and statistics of your school peers.</p>
              </div>
              <span className="xenon-badge">
                {enrolledClass.leaderboard?.length || 0} Enrolled
              </span>
            </div>
            
            <motion.div 
              className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {(enrolledClass.leaderboard || []).map((peer) => {
                const peerPlan = peer.profiles?.plan;
                const peerIsPro = isProOrMax(peerPlan);

                return (
                  <motion.div 
                    key={peer.student_id} 
                    className="xenon-panel-muted p-4 flex flex-col justify-between gap-3 relative overflow-hidden"
                    variants={staggerItem}
                    whileHover={{ scale: 1.02, borderColor: "var(--accent)" }}
                  >
                    {peerIsPro && (
                      <div className="absolute top-2 right-2">
                        <PlanBadge plan={peerPlan} size="sm" />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center font-bold text-sm text-[var(--accent)] border border-[var(--accent)]/20 shadow-sm">
                        {(peer.profiles?.first_name || "S")[0].toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm truncate">
                          {peer.profiles?.first_name || peer.profiles?.username || "Student"}
                        </p>
                        <p className="text-[10px] text-[var(--muted)] truncate">
                          @{peer.profiles?.username || "student"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[9px] uppercase font-medium text-[var(--muted)]">Level</span>
                        <p className="font-bold text-sm text-[var(--accent)]">{peer.profiles?.level || 1}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase font-medium text-[var(--muted)]">Correct</span>
                        <p className="font-bold text-sm text-[var(--success)]">{peer.practice_questions_correct || 0}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </>
      )}
    </motion.section>
  );
}

function AchievementsView() {
  const { achievements, databaseWarnings, profile } = useAppStore();

  return (
    <motion.div {...motionProps}>
      <AchievementsPanel
        title="Achievements"
        subtitle={profile?.role === "student" ? "Your milestones, streak awards, and classroom badges." : "Sign in as a student to unlock classroom achievements."}
        achievements={achievements}
        warning={databaseWarnings.achievements}
      />
    </motion.div>
  );
}
export default function App() {
  const user = useAppStore((s) => s.user);
  const profile = useAppStore((s) => s.profile);
  const authHydrated = useAppStore((s) => s.authHydrated);
  const bootstrap = useAppStore((s) => s.bootstrap);
  const initAuthListener = useAppStore((s) => s.initAuthListener);
  const cleanupAuthListener = useAppStore((s) => s.cleanupAuthListener);
  const recoverAuthState = useAppStore((s) => s.recoverAuthState);
  const isSharePage = window.location.pathname.startsWith("/share/");

  useEffect(() => {
    bootstrap();
    initAuthListener();
    return () => cleanupAuthListener();
  }, [bootstrap, initAuthListener, cleanupAuthListener]);

  useEffect(() => {
    const timer = setTimeout(() => {
      recoverAuthState();
    }, 4500);
    return () => clearTimeout(timer);
  }, [recoverAuthState]);

  if (!isSharePage && !authHydrated) return <LoadingScreen />;
  if (!isSharePage && !user) return <AuthGate initialMode="landing" />;
  if (!isSharePage && user && !profile) return <LoadingScreen />;

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/share/:slug" element={<SharedCodeView />} />
        <Route path="/" element={<DashboardShell />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

function DashboardShell() {
  const profile = useAppStore((s) => s.profile);
  const enrolledClass = useAppStore((s) => s.enrolledClass);
  const projects = useAppStore((s) => s.projects);
  const friendChallenges = useAppStore((s) => s.friendChallenges);
  const showInitOverlay = useAppStore((s) => s.showInitOverlay);
  const showProfileSetup = useAppStore((s) => s.showProfileSetup);
  const loadTeacherClasses = useAppStore((s) => s.loadTeacherClasses);
  const loadStudentClass = useAppStore((s) => s.loadStudentClass);
  const signOut = useAppStore((s) => s.signOut);
  const streak = useAppStore((s) => s.streak);
  const databaseWarnings = useAppStore((s) => s.databaseWarnings);
  const showUpgradePrompt = useAppStore((s) => s.showUpgradePrompt);
  const setShowUpgradePrompt = useAppStore((s) => s.setShowUpgradePrompt);
  const refreshStreak = useAppStore((s) => s.refreshStreak);
  const newProject = useAppStore((s) => s.newProject);
  const bootstrap = useAppStore((s) => s.bootstrap);
  const recoverAuthState = useAppStore((s) => s.recoverAuthState);

  useEffect(() => {
    if (profile?.role === "teacher") loadTeacherClasses();
    if (profile?.role === "student") loadStudentClass();
  }, [profile?.role, loadTeacherClasses, loadStudentClass]);

  useEffect(() => {
    const user = useAppStore.getState().user;
    if (!user || profile?.role !== "student") return;
    const onVisible = () => {
      if (document.visibilityState === "visible") refreshStreak();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [profile?.role, refreshStreak]);

  const [tab, setTab] = useState(() => {
    const hash = window.location.hash.replace("#", "");
    return hash || "home";
  });
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [theoryTarget, setTheoryTarget] = useState({ paper: null, unitId: null });

  const sections = [
    {
      key: "programming",
      label: "Programming",
      items: [
        { id: "code", label: "Python IDE", icon: Code },
        { id: "projects", label: "My Projects", icon: FolderOpen },
        { id: "parsons", label: "Skills Lab", icon: Target },
        ...(profile?.role === "student" ? [{ id: "challenge", label: "1v1 Battles", icon: Zap }] : []),
      ],
    },
    {
      key: "theory",
      label: "Theory",
      items: [
        { id: "theory", label: "Theory Hub", icon: BookOpen },
        { id: "pastpapers", label: "GCSE Papers", icon: FileText },
        ...(profile?.role === "student" ? [{ id: "mocktests", label: "Mock Tests", icon: ClipboardCheck }] : []),
      ],
    },
    {
      key: "other",
      label: "Other",
      items: [
        { id: "class", label: profile?.role === "teacher" ? "Class Manager" : "My Class", icon: Home },
        ...(profile?.role === "student" ? [{ id: "leaderboards", label: "Leaderboards", icon: Trophy }] : []),
        ...(profile?.role === "student" ? [{ id: "achievements", label: "Achievements", icon: Award }] : []),
        { id: "settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  const navItems = [
    { id: "home", label: "Dashboard", icon: LayoutDashboard },
    ...sections.flatMap((s) => s.items),
  ];

  const [expandedSections, setExpandedSections] = useState({
    programming: true,
    theory: true,
    other: true,
  });

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    const parentSection = sections.find((s) => s.items.some((i) => i.id === tab));
    if (parentSection && !expandedSections[parentSection.key]) {
      setExpandedSections((prev) => ({ ...prev, [parentSection.key]: true }));
    }
  }, [tab]);

  const currentNav = navItems.find((n) => n.id === tab);
  const levelProgress = getLevelProgress(profile?.experience_points || 0);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)] relative">
      <BackgroundAnimation />
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation (Gizmo.ai Inspiration) */}
      <motion.aside 
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[var(--border)] bg-[var(--panel)] transition-transform lg:static lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-[var(--border)]">
          <img src="/favicon.svg" alt="Xenon Code" className="h-8 w-8 rounded-xl object-contain shadow-md shrink-0" />
          <div className="min-w-0 flex-1">
            <span className="text-base font-bold tracking-tight block leading-none text-[var(--text)] truncate">Xenon Code</span>
            <span className="text-[10px] font-medium text-[var(--muted)]">Platform v2.0</span>
          </div>
        </div>

        {/* Scrollable Nav Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 xenon-scroll">
          {/* Main Dashboard Link */}
          <button
            onClick={() => {
              setTab("home");
              setSidebarOpen(false);
            }}
            className={clsx(
              "flex w-full items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-2xl transition-all",
              tab === "home"
                ? "bg-[var(--accent-soft)] text-[var(--accent)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--panel-soft)]"
            )}
          >
            <LayoutDashboard className={clsx("h-4 w-4 shrink-0", tab === "home" ? "text-[var(--accent)]" : "text-[var(--muted)]")} />
            <span className="flex-1 text-left">Dashboard</span>
            {tab === "home" && (
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
            )}
          </button>

          {/* Expandable Sections */}
          <div className="space-y-3 pt-1">
            {sections.map((section) => {
              const isExpanded = !!expandedSections[section.key];

              return (
                <div key={section.key} className="space-y-1">
                  {/* Section Toggle Header */}
                  <button
                    type="button"
                    onClick={() => toggleSection(section.key)}
                    className="flex w-full items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] hover:text-[var(--text)] transition-colors group"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{section.label}</span>
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-[var(--panel-soft)] text-[var(--muted)]">
                        {section.items.length}
                      </span>
                    </div>
                    <ChevronDown
                      className={clsx(
                        "h-3.5 w-3.5 transition-transform duration-200 text-[var(--muted)] group-hover:text-[var(--text)]",
                        !isExpanded && "-rotate-90"
                      )}
                    />
                  </button>

                  {/* Collapsible Items List */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden space-y-1"
                      >
                        {section.items.map((item) => {
                          const isActive = tab === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setTab(item.id);
                                setSidebarOpen(false);
                              }}
                              className={clsx(
                                "flex w-full items-center gap-3 px-3.5 py-2 text-sm font-semibold rounded-2xl transition-all",
                                isActive
                                  ? "bg-[var(--accent-soft)] text-[var(--accent)] shadow-sm"
                                  : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--panel-soft)]"
                              )}
                            >
                              <item.icon
                                className={clsx(
                                  "h-4 w-4 shrink-0",
                                  isActive ? "text-[var(--accent)]" : "text-[var(--muted)]"
                                )}
                              />
                              <span className="flex-1 text-left">{item.label}</span>
                              {isActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
                              )}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Action Pill Buttons */}
          <div className="pt-3 space-y-2 border-t border-[var(--border)]">
            <button
              onClick={() => {
                setTab("code");
                setSidebarOpen(false);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Zap className="h-4 w-4 fill-current" />
              <span>Launch Python IDE</span>
            </button>
            <button
              onClick={() => {
                try {
                  newProject?.();
                  setTab("code");
                  setSidebarOpen(false);
                } catch (e) {
                  setShowUpgradePrompt(true);
                }
              }}
              className="w-full py-2 px-3 rounded-xl bg-[var(--panel-soft)] text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--border)] border border-transparent flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Lab Project</span>
            </button>
          </div>
        </div>

        {/* User Card */}
        <div className="border-t border-[var(--border)] p-3">
          <div 
            onClick={() => setTab("settings")}
            className="flex items-center gap-3 p-2.5 bg-[var(--panel-soft)] border border-[var(--border)] rounded-2xl group cursor-pointer hover:bg-[var(--ghost-bg)] transition-colors"
          >
            <ProfileAvatar name={profile?.full_name || profile?.username} avatarUrl={profile?.avatar_url} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--text)]">
                {profile?.first_name || profile?.username || "User"}
              </p>
              <p className="truncate text-[10px] text-[var(--muted)]">
                {normalizePlan(profile?.plan) === "max" ? "Max Plan" : isProOrMax(profile?.plan) ? "Pro Plan" : profile?.role === "teacher" ? "Teacher" : "Student"}
              </p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); signOut(); }}
              className="p-1.5 text-[var(--muted)] hover:text-[var(--danger)] transition-colors"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--panel)] px-6 lg:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-[var(--muted)] hover:text-[var(--text)] rounded-lg border border-[var(--border)] hover:border-[var(--accent)]/30 transition-colors"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-[var(--text)]">{currentNav?.label || "Workspace"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              {((streak?.current || 0) > 0 || streak?.atRisk) && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-medium bg-[var(--panel-soft)]">
                  <Flame className="h-3.5 w-3.5 text-orange-400" />
                  <span>{streak?.current || 0}d streak</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-medium bg-[var(--panel-soft)]">
                <Star className="h-3.5 w-3.5 text-[var(--accent)]" />
                <span>LVL {levelProgress.level}</span>
              </div>
            </div>

            <div className="h-5 w-px bg-[var(--border)] hidden sm:block" />

            <motion.button 
              className="flex items-center gap-2 border border-[var(--border)] px-3 py-1.5 rounded-lg hover:border-[var(--accent)]/30 transition-colors bg-[var(--panel-soft)]" 
              onClick={() => setTab("settings")}
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-xs font-medium hidden md:inline">{profile?.first_name || "User"}</span>
              <ProfileAvatar name={profile?.full_name || profile?.username} avatarUrl={profile?.avatar_url} size="sm" />
            </motion.button>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <div className="mx-auto max-w-6xl pb-16">
            <AnimatePresence mode="wait">
              {tab === "home" && (
                <HomeView 
                  key="home"
                  profile={profile} 
                  enrolledClass={enrolledClass} 
                  projectsCount={projects.length}
                  challengeCount={friendChallenges.length}
                  onNavigate={setTab} 
                />
              )}
              {tab === "code" && <motion.div key="code" {...motionProps}><XenonIDE /></motion.div>}
              {tab === "theory" && (
                <motion.div key="theory" {...motionProps}>
                  <TheoryPanel 
                    initialPaper={theoryTarget.paper} 
                    initialUnitId={theoryTarget.unitId} 
                    onClearTarget={() => setTheoryTarget({ paper: null, unitId: null })} 
                  />
                </motion.div>
              )}
              {tab === "projects" && <SavedProjectsView key="projects" onOpenIde={() => setTab("code")} />}
              {tab === "parsons" && <motion.div key="parsons" {...motionProps}><ParsonsProblem /></motion.div>}
              {tab === "challenge" && profile?.role === "student" && <motion.div key="challenge" {...motionProps}><ChallengeArena /></motion.div>}
              {tab === "achievements" && profile?.role === "student" && <AchievementsView key="achievements" />}
              {tab === "leaderboards" && profile?.role === "student" && (
                <LeaderboardsPanel key="leaderboards" onOpenSettings={() => setTab("settings")} />
              )}
              {tab === "class" && (
                profile?.role === "teacher" 
                  ? <motion.div key="class" {...motionProps}><ClassDashboard /></motion.div> 
                  : <StudentClassView key="view-class" onNavigateToIde={() => setTab("code")} />
              )}
              {tab === "pastpapers" && <motion.div key="pastpapers" {...motionProps}><PastPapersPanel onNavigateToIde={setTab} /></motion.div>}
              {tab === "mocktests" && profile?.role === "student" && (
                <motion.div key="mocktests" {...motionProps}><MockTestPanel /></motion.div>
              )}
              {tab === "settings" && <motion.div key="settings" {...motionProps}><SettingsPanel /></motion.div>}
            </AnimatePresence>
          </div>

          <SiteFooter />
        </div>
      </main>

      {showUpgradePrompt && (
        <UpgradeModal onClose={() => setShowUpgradePrompt(false)} />
      )}
      {showInitOverlay && <InitOverlay />}
      {showProfileSetup && <ProfileSetupModal />}

      {/* Database Warnings Portal */}
      {Object.keys(databaseWarnings || {}).length > 0 && (
        <div className="fixed bottom-5 right-5 z-[100] max-w-sm pointer-events-none">
          <motion.div 
            className="glass-card bg-[var(--warning-soft)] p-4 shadow-2xl pointer-events-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex gap-3">
              <Target className="h-4 w-4 text-[var(--warning)] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[var(--warning)]">System Notice</p>
                <p className="mt-1.5 text-[11px] text-[var(--warning)] leading-relaxed font-medium">
                  Database migration needed. Run SQL in <code className="bg-black/15 px-1 rounded font-mono text-[10px]">supabase_migrations.sql</code> to enable all features.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
