import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import AuthGate from "./components/AuthGate";
import InitOverlay from "./components/InitOverlay";
import ProfileSetupModal from "./components/ProfileSetupModal";
import XenonIDE from "./components/XenonIDE";
import SettingsPanel from "./components/SettingsPanel";
import ClassDashboard from "./components/ClassDashboard";
import ParsonsProblem from "./components/ParsonsProblem";
import ChallengeArena from "./components/ChallengeArena";
import TheoryPanel from "./components/TheoryPanel";
import SiteFooter from "./components/SiteFooter";
import ProfileAvatar from "./components/ProfileAvatar";
import AchievementsPanel from "./components/AchievementsPanel";
import { getLevelProgress, getRankBadge } from "./lib/progression";
import { useAppStore } from "./store/useAppStore";
import { 
  Home, Code, BookOpen, FolderOpen, Trophy, Settings, 
  LogOut, Menu, X, Zap, Flame, Star, Award, ChevronRight,
  User, LayoutDashboard, Target
} from "lucide-react";


const motionProps = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.18, ease: "easeOut" },
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
    <div className="xenon-shell flex min-h-screen flex-col items-center justify-center px-4">
      <div className="xenon-panel mx-auto w-full max-w-sm p-8 text-center">
        <img src="/xenon-logo.svg" alt="Xenon Code" className="mx-auto mb-5 h-12 w-12 rounded-xl" />
        <p className="text-base font-semibold">Loading Xenon Code...</p>
        <div className="mt-3 flex justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
              style={{ animation: `pulse 1.2s ease-in-out ${i * 0.3}s infinite` }}
            />
          ))}
        </div>
        {hint ? <p className="mt-6 text-xs leading-relaxed text-[var(--muted)]">{hint}</p> : null}
      </div>
    </div>
  );
}

function HomeView({ profile, enrolledClass, projectsCount, challengeCount, onNavigate }) {
  const levelProgress = getLevelProgress(profile?.experience_points || 0);
  const rankBadge = getRankBadge(enrolledClass?.rank);
  
  return (
    <motion.section className="space-y-6" {...motionProps}>
      {/* Welcome Banner */}
      <div className="xenon-hero-panel relative overflow-hidden p-8 sm:p-10">
        <div className="absolute top-0 right-0 -m-8 h-64 w-64 rounded-full bg-[var(--accent)] opacity-[0.05] blur-3xl" />
        <div className="relative z-10">
          <span className="xenon-pill bg-[var(--accent-soft)] text-[var(--accent)] border-none">Student Workspace</span>
          <h1 className="text-4xl font-black mt-6 tracking-tight">Welcome back, {profile?.first_name || "Coder"}!</h1>
          <p className="xenon-subtitle mt-4 max-w-2xl text-base opacity-80">
            You've spent {formatPracticeTime(enrolledClass?.total_time_seconds || 0)} practicing Python this week. Keep up the great work!
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button className="xenon-btn h-12 px-6" onClick={() => onNavigate("code")}>
              <Code className="mr-2 h-4 w-4" /> Continue Coding
            </button>
            <button className="xenon-btn-ghost h-12 px-6" onClick={() => onNavigate("theory")}>
              <BookOpen className="mr-2 h-4 w-4" /> View Theory
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="xenon-panel group p-6 transition-all hover:border-[var(--accent)]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Level Progress</p>
            <Star className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-4 text-3xl font-black">Level {levelProgress.level}</p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase text-[var(--muted)]">
              <span>{profile?.experience_points || 0} XP</span>
              <span>Next Level</span>
            </div>
            <div className="challenge-progress-track mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--panel-soft)]">
              <motion.div 
                className="h-full bg-gradient-to-r from-[var(--accent)] to-sky-400"
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress.percent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        <div className="xenon-panel p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Class Rank</p>
            <Trophy className="h-4 w-4 text-[var(--accent)]" />
          </div>
          <p className="mt-4 text-3xl font-black">{enrolledClass?.rank ? `#${enrolledClass.rank}` : "---"}</p>
          <div className="mt-4 flex items-center gap-2">
            {rankBadge ? (
              <span className="flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[10px] font-bold text-[var(--accent)]">
                <Award className="h-3 w-3" /> {rankBadge.label}
              </span>
            ) : (
              <span className="text-[10px] font-medium text-[var(--muted)]">No rank assigned yet</span>
            )}
          </div>
        </div>

        <div className="xenon-panel p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Saved Work</p>
            <FolderOpen className="h-4 w-4 text-sky-400" />
          </div>
          <p className="mt-4 text-3xl font-black">{projectsCount}</p>
          <p className="mt-2 text-[10px] font-medium text-[var(--muted)] uppercase tracking-wide">Python Projects</p>
        </div>

        <div className="xenon-panel p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">1v1 Battles</p>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-4 text-3xl font-black">{challengeCount}</p>
          <p className="mt-2 text-[10px] font-medium text-[var(--muted)] uppercase tracking-wide">Active Challenges</p>
        </div>
      </div>
    </motion.section>
  );
}



function SavedProjects({ onOpenIde }) {
  const { projects, openProject, loadProjects, newProject } = useAppStore();

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <motion.section className="xenon-panel p-6 sm:p-8" {...motionProps}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Saved Projects</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Open an old project or start a new one.</p>
        </div>
        <button
          className="xenon-btn"
          onClick={() => {
            newProject();
            onOpenIde();
          }}
        >
          New Project
        </button>
      </div>

      {!projects.length ? (
        <div className="xenon-panel-muted mt-6 p-10 flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-2xl bg-[var(--panel-soft)] flex items-center justify-center mb-4">
            <FolderOpen className="h-8 w-8 text-[var(--muted)]" />
          </div>
          <p className="font-bold">No projects yet</p>
          <p className="mt-1 text-sm text-[var(--muted)] max-w-xs">
            Start your first Python project to see it listed here. Your code is saved automatically as you type.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <button
              key={project.id}
              className="xenon-panel-muted group flex items-center gap-4 p-4 text-left transition hover:border-[var(--accent)]"
              onClick={() => {
                openProject(project);
                onOpenIde();
              }}
            >
              <div className="h-12 w-12 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] group-hover:scale-110 transition-transform">
                <Code className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-black">{project.title || "Untitled Project"}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mt-0.5">
                  Edited {new Date(project.updated_at).toLocaleDateString()}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
            </button>
          ))}

        </div>
      )}
    </motion.section>
  );
}

function StudentClassView() {
  const { enrolledClass, announcements, assignments, streak, submitAssignment } = useAppStore();
  const [submittedIds, setSubmittedIds] = useState(new Set());
  const [submittingId, setSubmittingId] = useState(null);
  const [noteMap, setNoteMap] = useState({});

  const handleSubmit = async (assignmentId) => {
    setSubmittingId(assignmentId);
    try {
      await submitAssignment({ assignmentId, notes: noteMap[assignmentId] || "" });
      setSubmittedIds((prev) => new Set([...prev, assignmentId]));
    } catch {}
    setSubmittingId(null);
  };

  const MEDALS = {
    1: { icon: "🥇", label: "1st Place", bg: "rgba(255,215,0,0.12)", border: "rgba(255,190,0,0.45)", text: "#8a6000" },
    2: { icon: "🥈", label: "2nd Place", bg: "rgba(192,192,192,0.14)", border: "rgba(160,160,160,0.5)", text: "#5a5a5a" },
    3: { icon: "🥉", label: "3rd Place", bg: "rgba(205,127,50,0.14)", border: "rgba(180,100,30,0.45)", text: "#7a4a10" },
  };

  return (
    <motion.section className="space-y-4" {...motionProps}>
      <div className="xenon-panel p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">My Class</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Your class activity, ranking, assignments, and updates.</p>
          </div>
          {(streak?.current || 0) > 0 ? (
            <div className="xenon-panel-muted flex items-center gap-3 p-4">
              <div className="relative">
                <Flame className={clsx("h-8 w-8", streak.current >= 7 ? "text-amber-400" : "text-orange-500")} />
                {streak.current >= 7 && <Zap className="absolute -top-1 -right-1 h-4 w-4 text-sky-400" />}
              </div>
              <div>
                <p className="text-lg font-black leading-none">{streak.current} Day Streak</p>
                <p className="mt-1 text-[10px] font-bold uppercase text-[var(--muted)]">Best: {streak.longest}</p>
              </div>
            </div>
          ) : null}

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
              <div className="xenon-panel-muted p-4">
                <p className="xenon-kicker">Class</p>
                <p className="mt-2 text-lg font-semibold">{enrolledClass.name}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">Code {enrolledClass.class_code}</p>
              </div>
              <div className="xenon-panel-muted p-4">
                <p className="xenon-kicker">Your Rank</p>
                <p className="mt-2 text-lg font-semibold">{enrolledClass.rank ? `#${enrolledClass.rank}` : "Unranked"}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">Skills correct, then projects, then time</p>
              </div>
              <div className="xenon-panel-muted p-4">
                <p className="xenon-kicker">Teacher</p>
                <p className="mt-2 text-lg font-semibold">{enrolledClass.profiles?.first_name || "Unknown"}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">@{enrolledClass.profiles?.username || "teacher"}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="xenon-panel-muted p-4">
                <p className="xenon-kicker">Practice Time</p>
                <p className="mt-2 text-xl font-semibold">{formatPracticeTime(enrolledClass.total_time_seconds || 0)}</p>
              </div>
              <div className="xenon-panel-muted p-4">
                <p className="xenon-kicker">Projects</p>
                <p className="mt-2 text-xl font-semibold">{enrolledClass.total_projects || 0}</p>
              </div>
              <div className="xenon-panel-muted p-4">
                <p className="xenon-kicker">Skills Correct</p>
                <p className="mt-2 text-xl font-semibold">{enrolledClass.practice_questions_correct || 0}</p>
              </div>
            </div>
          </div>

          {announcements.length > 0 ? (
            <div className="xenon-panel p-6">
              <h3 className="text-lg font-semibold">Announcements</h3>
              <div className="mt-4 space-y-3">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="xenon-panel-muted p-4" style={{ borderLeft: "3px solid var(--accent)" }}>
                    <p className="text-sm leading-relaxed">{announcement.message}</p>
                    <p className="mt-2 text-xs text-[var(--muted)]">{new Date(announcement.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {assignments.length > 0 ? (
            <div className="xenon-panel p-6">
              <h3 className="text-lg font-semibold">Assignments</h3>
              <div className="mt-4 space-y-4">
                {assignments.map((assignment) => {
                  const done = submittedIds.has(assignment.id);
                  const submitting = submittingId === assignment.id;
                  const isOverdue = assignment.due_date && new Date(assignment.due_date) < new Date();
                  const questionsCompleted = enrolledClass?.practice_questions_correct || 0;
                  const hasGoal = !!assignment.question_goal;
                  const goalMet = !hasGoal || questionsCompleted >= assignment.question_goal;
                  const progressPct = hasGoal ? Math.min(100, Math.round((questionsCompleted / assignment.question_goal) * 100)) : 100;
                  return (
                    <div key={assignment.id} className="xenon-panel-muted p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold">{assignment.title}</p>
                          <p className="mt-1 text-sm text-[var(--muted)]">{assignment.description}</p>
                          {assignment.due_date ? (
                            <p className={clsx("mt-1 text-xs font-semibold", isOverdue ? "text-red-500" : "text-[var(--muted)]")}>
                              Due: {new Date(assignment.due_date).toLocaleDateString()} {isOverdue ? "(overdue)" : ""}
                            </p>
                          ) : null}
                          {hasGoal && !done ? (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className={clsx("font-semibold", goalMet ? "text-green-400" : "text-[var(--accent)]")}>
                                  {goalMet
                                    ? `Goal reached — ${questionsCompleted} / ${assignment.question_goal} questions`
                                    : `${questionsCompleted} / ${assignment.question_goal} questions completed`}
                                </span>
                                <span className="text-[var(--muted)]">{progressPct}%</span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all"
                                  style={{
                                    width: `${progressPct}%`,
                                    background: goalMet ? "var(--success, #22c55e)" : "var(--accent)",
                                  }}
                                />
                              </div>
                              {!goalMet && (
                                <p className="mt-1.5 text-xs text-[var(--muted)]">
                                  Complete {assignment.question_goal - questionsCompleted} more question{assignment.question_goal - questionsCompleted === 1 ? "" : "s"} in the Practice tab to unlock submission.
                                </p>
                              )}
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
                            title={!goalMet ? `Complete ${assignment.question_goal - questionsCompleted} more questions to unlock` : undefined}
                            onClick={() => handleSubmit(assignment.id)}
                          >
                            {submitting ? "Submitting..." : goalMet ? "Mark as Submitted" : `Locked — ${progressPct}% done`}
                          </button>
                        )}
                      </div>
                      {!done ? (
                        <textarea
                          className="xenon-input mt-3 w-full resize-none text-sm"
                          rows={2}
                          placeholder="Optional: add a note to your teacher..."
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

          <div className="xenon-panel p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">Class Leaderboard</h3>
              <span className="xenon-badge">{(enrolledClass.leaderboard || []).length} students</span>
            </div>
            <div className="mt-4 space-y-3">
              {(enrolledClass.leaderboard || []).map((entry) => {
                const medal = MEDALS[entry.rank] || null;
                return (
                  <div
                    key={entry.student_id}
                    className="xenon-panel-muted flex flex-wrap items-center justify-between gap-3 p-4"
                    style={medal ? { borderColor: medal.border, background: medal.bg } : undefined}
                  >
                    <div className="flex items-center gap-4">
                      {medal ? <span className="text-2xl leading-none">{medal.icon}</span> : <span className="xenon-pill">#{entry.rank}</span>}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{entry.profiles?.first_name || entry.profiles?.username || "Student"}</p>
                          {medal ? (
                            <span className="rounded px-1.5 py-0.5 text-xs font-bold" style={{ background: medal.bg, color: medal.text, border: `1px solid ${medal.border}` }}>
                              {medal.label}
                            </span>
                          ) : null}
                          <span className="xenon-badge">Lvl {entry.profiles?.level || 1}</span>
                        </div>
                        <p className="text-sm text-[var(--muted)]">@{entry.profiles?.username || "unknown"}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="xenon-badge">{entry.practice_questions_correct || 0} questions</span>
                      <span className="xenon-badge">{entry.total_projects || 0} projects</span>
                      <span className="xenon-badge">{formatPracticeTime(entry.total_time_seconds || 0)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
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
  const enrolledClass = useAppStore((s) => s.enrolledClass);
  const projects = useAppStore((s) => s.projects);
  const friendChallenges = useAppStore((s) => s.friendChallenges);
  const showInitOverlay = useAppStore((s) => s.showInitOverlay);
  const showProfileSetup = useAppStore((s) => s.showProfileSetup);
  const bootstrap = useAppStore((s) => s.bootstrap);
  const recoverAuthState = useAppStore((s) => s.recoverAuthState);
  const loadTeacherClasses = useAppStore((s) => s.loadTeacherClasses);
  const loadStudentClass = useAppStore((s) => s.loadStudentClass);
  const initAuthListener = useAppStore((s) => s.initAuthListener);
  const cleanupAuthListener = useAppStore((s) => s.cleanupAuthListener);
  const signOut = useAppStore((s) => s.signOut);
  const streak = useAppStore((s) => s.streak);
  const databaseWarnings = useAppStore((s) => s.databaseWarnings);
  const [tab, setTab] = useState("home");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

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

  useEffect(() => {
    if (profile?.role === "teacher") loadTeacherClasses();
    if (profile?.role === "student") loadStudentClass();
  }, [profile?.role, loadTeacherClasses, loadStudentClass]);

  const navItems = [
    { id: "home", label: "Dashboard", icon: LayoutDashboard },
    { id: "code", label: "Python IDE", icon: Code },
    { id: "theory", label: "Theory Hub", icon: BookOpen },
    { id: "projects", label: "My Projects", icon: FolderOpen },
    { id: "parsons", label: "Skills Lab", icon: Target },
    ...(profile?.role === "student" ? [{ id: "challenge", label: "1v1 Battles", icon: Zap }] : []),
    ...(profile?.role === "student" ? [{ id: "achievements", label: "Achievements", icon: Award }] : []),
    { id: "class", label: profile?.role === "teacher" ? "Class Manager" : "My Class", icon: Home },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (!authHydrated) return <LoadingScreen />;
  if (!user) return <AuthGate initialMode="landing" />;

  const currentNav = navItems.find(n => n.id === tab);
  const levelProgress = getLevelProgress(profile?.experience_points || 0);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--fg)]">
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

      {/* Sidebar Navigation */}
      <motion.aside 
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[var(--border)] bg-[var(--panel)] transition-transform lg:static lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-20 items-center gap-3 px-6">
          <img src="/xenon-logo.svg" alt="Xenon" className="h-10 w-10 rounded-xl" />
          <span className="text-xl font-black tracking-tight">XENON CODE</span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setTab(item.id);
                setSidebarOpen(false);
              }}
              className={clsx(
                "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all",
                tab === item.id 
                  ? "bg-[var(--accent-soft)] text-[var(--accent)] shadow-inner" 
                  : "text-[var(--muted)] hover:bg-[var(--panel-soft)] hover:text-[var(--fg)]"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
              {tab === item.id && <motion.div layoutId="nav-active" className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />}
            </button>
          ))}
        </div>

        {/* User Card in Sidebar */}
        <div className="mt-auto p-4 border-t border-[var(--border)]">
          <div className="xenon-panel-muted flex items-center gap-3 p-3">
            <ProfileAvatar name={profile?.full_name || profile?.username} avatarUrl={profile?.avatar_url} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{profile?.first_name || profile?.username || "Coder"}</p>
              <p className="truncate text-[10px] font-medium text-[var(--muted)] uppercase tracking-wider">{profile?.role || "Student"}</p>
            </div>
            <button 
              onClick={signOut}
              className="rounded-lg p-2 text-[var(--muted)] hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--panel)] px-6 lg:px-10 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[var(--muted)] hover:text-[var(--fg)]"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[var(--accent-soft)] rounded-lg">
                <LayoutDashboard className="h-4 w-4 text-[var(--accent)]" />
                <span className="text-xs font-black text-[var(--accent)] uppercase tracking-widest">Dashboard</span>
              </div>
              <div className="h-8 w-px bg-[var(--border)] hidden lg:block" />
              <div>
                <h2 className="text-lg font-black tracking-tight">{currentNav?.label || "Workspace"}</h2>
                <p className="hidden text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] md:block">
                  Portal / {currentNav?.id || "dashboard"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              {(streak?.current || 0) > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-sm transition-transform hover:scale-105 cursor-default">
                  <Flame className="h-4 w-4 fill-current" />
                  <span className="text-sm font-black">{streak.current}</span>
                </div>
              )}
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-soft)] shadow-sm transition-transform hover:scale-105 cursor-default">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-black">Level {levelProgress.level}</span>
              </div>
            </div>

            <div className="h-8 w-px bg-[var(--border)] hidden sm:block mx-2" />

            <button className="flex items-center gap-3 hover:opacity-80 transition-opacity" onClick={() => setTab("settings")}>
              <div className="text-right hidden md:block">
                <p className="text-xs font-black leading-none">{profile?.first_name || "User"}</p>
                <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mt-1">Settings</p>
              </div>
              <ProfileAvatar name={profile?.full_name || profile?.username} avatarUrl={profile?.avatar_url} size="sm" />
            </button>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar relative">
          <div className="mx-auto max-w-7xl pb-20">
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
              {tab === "theory" && <motion.div key="theory" {...motionProps}><TheoryPanel /></motion.div>}
              {tab === "projects" && <SavedProjects key="projects" onOpenIde={() => setTab("code")} />}
              {tab === "parsons" && <motion.div key="parsons" {...motionProps}><ParsonsProblem /></motion.div>}
              {tab === "challenge" && profile?.role === "student" && <motion.div key="challenge" {...motionProps}><ChallengeArena /></motion.div>}
              {tab === "achievements" && profile?.role === "student" && <AchievementsView key="achievements" />}
              {tab === "class" && (
                profile?.role === "teacher" 
                  ? <motion.div key="class" {...motionProps}><ClassDashboard /></motion.div> 
                  : <StudentClassView key="view-class" />
              )}
              {tab === "settings" && <motion.div key="settings" {...motionProps}><SettingsPanel /></motion.div>}
            </AnimatePresence>
          </div>

          <SiteFooter />
        </div>
      </main>

      {showInitOverlay && <InitOverlay onBootstrap={bootstrap} />}
      {showProfileSetup && (
        <ProfileSetupModal 
          profile={profile} 
          onRecover={recoverAuthState}
          onRefresh={() => location.reload()} 
        />
      )}


      {/* Database Warnings Portal */}
      {Object.keys(databaseWarnings || {}).length > 0 && (
        <div className="fixed bottom-6 right-6 z-[100] max-w-sm pointer-events-none">
          <div className="xenon-panel border-amber-500/50 bg-amber-500/10 p-5 shadow-2xl backdrop-blur-xl pointer-events-auto">
            <div className="flex gap-3">
              <Target className="h-5 w-5 text-amber-500 shrink-0" />
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-amber-500">System Warning</p>
                <p className="mt-2 text-[11px] text-amber-200/80 leading-relaxed font-medium">
                  Database migration required. Run the SQL in <code className="bg-black/20 px-1 rounded">supabase_migrations.sql</code> to enable all portal features.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

