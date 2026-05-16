import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import { supabase } from "../lib/supabase";
import { translateSupabaseError } from "../lib/errorTranslator";
import { 
  Trophy, School, Users, Clock, BookOpen, Send, Trash2, Calendar, Target, 
  RefreshCw, LayoutDashboard, Megaphone, ClipboardList, Shield, X, Plus, ChevronRight, BarChart3, Search
} from "lucide-react";


const formatPracticeTime = (seconds = 0) => {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${totalSeconds}s`;
};

const MEDALS = {
  1: { icon: <Trophy className="h-5 w-5 text-amber-400" />, label: "1st Place", bg: "rgba(255,215,0,0.12)", border: "rgba(255,190,0,0.45)", text: "#8a6000" },
  2: { icon: <Trophy className="h-5 w-5 text-slate-400" />, label: "2nd Place", bg: "rgba(192,192,192,0.14)", border: "rgba(160,160,160,0.5)", text: "#5a5a5a" },
  3: { icon: <Trophy className="h-5 w-5 text-orange-400" />, label: "3rd Place", bg: "rgba(205,127,50,0.14)", border: "rgba(180,100,30,0.45)", text: "#7a4a10" },
};


const CARD_ACCENTS = [
  "#4fb8ff", "#a78bfa", "#34d399", "#fb923c",
  "#f87171", "#fbbf24", "#38bdf8", "#e879f9", "#2dd4bf",
];

function getAccent(str = "") {
  const hash = str.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return CARD_ACCENTS[hash % CARD_ACCENTS.length];
}

// ─── Announcements ─────────────────────────────────────────────────────────────

function ClassAnnouncementsPanel({ cls }) {
  const { postAnnouncement, deleteAnnouncement, databaseWarnings } = useAppStore();
  const [message, setMessage] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("class_announcements")
        .select("*")
        .eq("class_id", cls.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setAnnouncements(data || []);
      setLoaded(true);
      setErr("");
    } catch (error) {
      setErr(translateSupabaseError(error, "Could not load announcements."));
      setLoaded(true);
    }
    setLoading(false);
  };

  const submit = async () => {
    if (!message.trim()) return;
    setErr("");
    try {
      await postAnnouncement({ classId: cls.id, message });
      setMessage("");
      await load();
    } catch (e) { setErr(e?.message || "Could not post."); }
  };

  const remove = async (id) => {
    try { await deleteAnnouncement(id); await load(); } catch {}
  };

  if (!loaded) return (
    <div className="mt-4 flex justify-center py-10">
      <div className="h-8 w-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="mt-4 space-y-4">
      <div className="flex gap-2">
        <textarea
          className="xenon-input flex-1 resize-none"
          rows={2}
          placeholder="Type an announcement for your students..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="xenon-btn self-start" onClick={submit}>Post</button>
      </div>
      {err && <p className="text-sm text-red-500">{err}</p>}
      {databaseWarnings?.announcements && (
        <p className="text-sm text-amber-400">{databaseWarnings.announcements}</p>
      )}
      {!announcements.length ? (
        <p className="text-sm text-[var(--muted)]">No announcements yet.</p>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className="xenon-panel-muted flex items-start justify-between gap-3 p-4">
              <div>
                <p className="text-sm leading-relaxed">{a.message}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">{new Date(a.created_at).toLocaleString()}</p>
              </div>
              <button className="xenon-btn-ghost text-xs" onClick={() => remove(a.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Assignments ───────────────────────────────────────────────────────────────

function ClassAssignmentsPanel({ cls }) {
  const { postAssignment, deleteAssignment, loadSubmissions, databaseWarnings } = useAppStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [questionGoal, setQuestionGoal] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [subsLoading, setSubsLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("class_assignments")
        .select("*")
        .eq("class_id", cls.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setAssignments(data || []);
      setLoaded(true);
      setErr("");
    } catch (error) {
      setErr(translateSupabaseError(error, "Could not load assignments."));
      setLoaded(true);
    }
    setLoading(false);
  };

  const submit = async () => {
    if (!title.trim() || !description.trim()) { setErr("Title and description are required."); return; }
    setErr("");
    try {
      await postAssignment({ classId: cls.id, title, description, dueDate, questionGoal });
      setTitle(""); setDescription(""); setDueDate(""); setQuestionGoal("");
      await load();
    } catch (e) { setErr(e?.message || "Could not post assignment."); }
  };

  const remove = async (id) => {
    try { await deleteAssignment(id); await load(); } catch {}
  };

  const viewSubs = async (assignmentId) => {
    if (expandedId === assignmentId) { setExpandedId(null); return; }
    setExpandedId(assignmentId);
    setSubsLoading(true);
    const data = await loadSubmissions(assignmentId);
    setSubmissions(data);
    setSubsLoading(false);
  };

  if (!loaded) return (
    <div className="mt-4 flex justify-center py-10">
      <div className="h-8 w-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="mt-4 space-y-4">
      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-3">
          <input className="xenon-input" placeholder="Assignment title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="xenon-input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <input className="xenon-input" type="number" min="1" placeholder="Questions to complete (e.g. 20)" value={questionGoal} onChange={(e) => setQuestionGoal(e.target.value)} />
        </div>
        <textarea
          className="xenon-input w-full resize-none"
          rows={3}
          placeholder="Describe the task. If you set a question target, students must reach that number of practice questions before they can submit."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="xenon-btn" onClick={submit}>Set Assignment</button>
        {err && <p className="text-sm text-red-500">{err}</p>}
        {databaseWarnings?.assignments && <p className="text-sm text-amber-400">{databaseWarnings.assignments}</p>}
      </div>

      {!assignments.length ? (
        <p className="text-sm text-[var(--muted)]">No assignments set yet.</p>
      ) : (
        <div className="space-y-3">
          {assignments.map((a) => (
            <div key={a.id} className="xenon-panel-muted p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{a.title}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{a.description}</p>
                  {a.question_goal ? (
                    <p className="mt-2 text-xs font-semibold text-[var(--accent)]">
                      Requires {a.question_goal} questions completed before submit unlocks
                    </p>
                  ) : null}
                  {a.due_date && (
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      Due: {new Date(a.due_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button className="xenon-btn-subtle text-xs" onClick={() => viewSubs(a.id)}>
                    {expandedId === a.id ? "Hide Submissions" : "View Submissions"}
                  </button>
                  <button className="xenon-btn-ghost text-xs" onClick={() => remove(a.id)}>Delete</button>
                </div>
              </div>
              {expandedId === a.id && (
                <div className="mt-4 border-t border-[var(--border)] pt-4">
                  {subsLoading ? (
                    <p className="text-sm text-[var(--muted)]">Loading submissions...</p>
                  ) : !submissions.length ? (
                    <p className="text-sm text-[var(--muted)]">No submissions yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {submissions.map((s) => (
                        <div key={s.id} className="rounded border border-[var(--border)] p-3">
                          <p className="text-sm font-semibold">
                            {s.profiles?.first_name || s.profiles?.username || "Student"}
                          </p>
                          {s.notes && <p className="mt-1 text-xs text-[var(--muted)]">{s.notes}</p>}
                          <p className="mt-1 text-xs text-[var(--muted)]">
                            Submitted: {new Date(s.submitted_at).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Class detail view (shown after selecting a card) ─────────────────────────

function ClassDetailView({ cls, onBack, removeStudentFromClass }) {
  const [tab, setTab] = useState("overview");
  const accent = getAccent(cls.name);

  const TABS = [
    { id: "overview", label: "Insights", icon: LayoutDashboard },
    { id: "announcements", label: "Announcements", icon: Megaphone },
    { id: "assignments", label: "Assignments", icon: ClipboardList },
    { id: "students", label: "Student List", icon: Users },
  ];

  return (
    <motion.div 
      className="min-h-screen lg:flex gap-8" 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }}
    >
      {/* Dashboard Sidebar */}
      <aside className="lg:w-72 space-y-6">
        <button
          className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--muted)] hover:text-[var(--accent)] transition"
          onClick={onBack}
        >
          <ChevronRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" /> Back to Hub
        </button>

        <div className="xenon-panel p-6 border-none bg-gradient-to-br from-[#0d1726] to-transparent">
          <div className="h-1.5 w-12 rounded-full mb-4" style={{ background: accent }} />
          <h2 className="text-2xl font-black tracking-tighter line-clamp-2">{cls.name}</h2>
          <div className="mt-4 flex items-center gap-2">
            <span className="xenon-pill xenon-code text-sm py-1.5">{cls.class_code}</span>
          </div>
        </div>

        <nav className="space-y-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-sm transition-all ${
                tab === t.id 
                  ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-soft)]" 
                  : "text-[var(--muted)] hover:bg-white/5 hover:text-[var(--fg)]"
              }`}
            >
              <t.icon className={`h-5 w-5 ${tab === t.id ? "opacity-100" : "opacity-40"}`} />
              {t.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-1 space-y-8 mt-10 lg:mt-0">
        {/* Overview Tab */}
        {tab === "overview" && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { label: "Active Students", val: (cls.class_members || []).length, icon: Users, color: "blue" },
                { label: "Total Practice", val: formatPracticeTime((cls.class_members || []).reduce((s, m) => s + (m.total_time_seconds || 0), 0)), icon: Clock, color: "purple" },
                { label: "Total Knowledge", val: (cls.class_members || []).reduce((s, m) => s + (m.practice_questions_correct || 0), 0), icon: Target, color: "green" }
              ].map((stat, i) => (
                <div key={i} className="xenon-panel p-6 border-none bg-white/[0.02]">
                  <div className={`h-10 w-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-400 mb-4`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">{stat.label}</p>
                  <p className="mt-1 text-3xl font-black">{stat.val}</p>
                </div>
              ))}
            </div>

            {/* Leaderboard Section */}
            <div className="xenon-panel p-8 border-none bg-gradient-to-br from-[#0d1726] to-transparent">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black tracking-tight">Top Performance</h3>
                  <p className="text-sm text-[var(--muted)]">Calculated by accuracy, streak, and project depth.</p>
                </div>
                <Trophy className="h-8 w-8 text-amber-400 opacity-20" />
              </div>
              
              <div className="space-y-3">
                {(cls.leaderboard || cls.class_members || []).slice(0, 5).map((member, index) => {
                  const rank = index + 1;
                  const medal = MEDALS[rank];
                  return (
                    <div
                      key={member.student_id}
                      className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[var(--accent)]/30 transition-all"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-10 text-center font-black text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors">
                          {medal ? medal.icon : `#${rank}`}
                        </div>
                        <div>
                          <p className="font-black text-sm">
                            {member.profiles?.first_name || member.profiles?.username || "Student"}
                          </p>
                          <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">
                            @{member.profiles?.username || "unknown"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-xs font-black text-sky-400">{member.practice_questions_correct || 0}</p>
                          <p className="text-[8px] font-black uppercase text-[var(--muted)]">Accuracy</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black">{formatPracticeTime(member.total_time_seconds || 0)}</p>
                          <p className="text-[8px] font-black uppercase text-[var(--muted)]">Time</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {tab === "announcements" && (
          <div className="space-y-6">
             <div className="max-w-xl">
               <h3 className="text-2xl font-black tracking-tight">Classroom Broadcast</h3>
               <p className="mt-1 text-sm text-[var(--muted)]">Push real-time updates and instructions to all students.</p>
             </div>
             <div className="xenon-panel p-8 border-none bg-white/[0.02]">
               <ClassAnnouncementsPanel cls={cls} />
             </div>
          </div>
        )}

        {/* Assignments Tab */}
        {tab === "assignments" && (
          <div className="space-y-6">
             <div className="max-w-xl">
               <h3 className="text-2xl font-black tracking-tight">Skills Lab Control</h3>
               <p className="mt-1 text-sm text-[var(--muted)]">Set curriculum goals and monitor live submissions.</p>
             </div>
             <div className="xenon-panel p-8 border-none bg-white/[0.02]">
               <ClassAssignmentsPanel cls={cls} />
             </div>
          </div>
        )}

        {/* Students Tab (Detailed List) */}
        {tab === "students" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black tracking-tight">Student Directory</h3>
                <p className="text-sm text-[var(--muted)]">Complete roster and individual performance metrics.</p>
              </div>
              <button className="xenon-btn-subtle text-xs"><Plus className="h-3 w-3 mr-2" /> Export CSV</button>
            </div>

            <div className="xenon-panel p-0 overflow-hidden border-none bg-white/[0.01]">
              <div className="xenon-scroll overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">
                      <th className="px-8 py-5">Profile</th>
                      <th className="px-8 py-5">Questions</th>
                      <th className="px-8 py-5">Projects</th>
                      <th className="px-8 py-5">Practice Time</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(cls.class_members || []).length ? (
                      cls.class_members.map((member) => (
                        <tr key={member.student_id} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-sky-400 flex items-center justify-center text-white font-black text-xs">
                                {(member.profiles?.first_name?.[0] || member.profiles?.username?.[0] || "?").toUpperCase()}
                              </div>
                              <div>
                                <p className="font-black text-sm">{member.profiles?.first_name || "—"}</p>
                                <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">@{member.profiles?.username || "—"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-sm">{member.practice_questions_correct || 0}</span>
                              <BarChart3 className="h-3 w-3 text-green-400 opacity-40" />
                            </div>
                          </td>
                          <td className="px-8 py-6 font-bold text-sm">{member.total_projects || 0}</td>
                          <td className="px-8 py-6 text-sm font-medium">{formatPracticeTime(member.total_time_seconds || 0)}</td>
                          <td className="px-8 py-6 text-right">
                            <button
                              className="xenon-btn-subtle text-[10px] h-8 px-4 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeStudentFromClass({ classId: cls.id, studentId: member.student_id })}
                            >
                              Revoke Access
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-8 py-10 text-[var(--muted)] font-medium italic" colSpan={5}>No active student sessions detected.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </motion.div>
  );
}

// ─── Class card (grid tile) ────────────────────────────────────────────────────

function ClassTile({ cls, onClick }) {
  const accent = getAccent(cls.name);
  const studentCount = (cls.class_members || []).length;

  return (
    <motion.button
      className="xenon-panel group w-full overflow-hidden rounded-2xl text-left transition"
      onClick={onClick}
      whileHover={{ y: -3, scale: 1.01 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Accent banner */}
      <div className="relative flex h-28 items-end p-4" style={{ background: `linear-gradient(135deg, ${accent}33, ${accent}18)`, borderBottom: `2px solid ${accent}55` }}>
        <div
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl text-lg font-black"
          style={{ background: accent + "33", color: accent }}
        >
          {cls.name.charAt(0).toUpperCase()}
        </div>
        <div className="font-mono text-xs tracking-widest opacity-60">{cls.class_code}</div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold leading-snug">{cls.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">{cls.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            <span className="xenon-badge">{studentCount} student{studentCount !== 1 ? "s" : ""}</span>
          </div>
          <span className="text-xs text-[var(--muted)] opacity-0 transition group-hover:opacity-100">
            Open →
          </span>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Main ClassDashboard ───────────────────────────────────────────────────────

export default function ClassDashboard() {
  const { classes, createClass, joinClassAsTeacher, removeStudentFromClass, loadTeacherClasses, databaseWarnings } = useAppStore();

  const [selectedId, setSelectedId] = useState(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [joinStatus, setJoinStatus] = useState("");

  const [refreshing, setRefreshing] = useState(false);

  const selectedClass = classes.find((c) => c.id === selectedId) || null;

  const submitCreate = async () => {
    setCreateError("");
    if (!name.trim() || !description.trim()) { setCreateError("Class name and description are required."); return; }
    setCreating(true);
    try {
      await createClass({ name: name.trim(), description: description.trim() });
      setName(""); setDescription("");
      setShowCreateForm(false);
    } catch (err) { setCreateError(err?.message || "Could not create class."); }
    setCreating(false);
  };

  const submitJoin = async () => {
    setJoinError(""); setJoinStatus("");
    setJoining(true);
    try {
      await joinClassAsTeacher(joinCode);
      setJoinCode("");
      setJoinStatus("Joined! The class has been added to your list.");
      setShowJoinForm(false);
    } catch (err) { setJoinError(err?.message || "Could not join class."); }
    setJoining(false);
  };

  const refreshClasses = async () => {
    setRefreshing(true);
    try { await loadTeacherClasses(); } catch {}
    setRefreshing(false);
  };

  // ── Detail view ──
  if (selectedClass) {
    return (
      <ClassDetailView
        cls={selectedClass}
        onBack={() => setSelectedId(null)}
        removeStudentFromClass={removeStudentFromClass}
      />
    );
  }

  // ── Card grid ──
  return (
    <div className="space-y-8 pb-12">
      {/* Dynamic Header */}
      <motion.section 
        className="xenon-panel p-10 sm:p-14 relative overflow-hidden bg-gradient-to-br from-[#0d1726] to-transparent border-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <School className="h-64 w-64" />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="xenon-pill bg-[var(--accent-soft)] text-[var(--accent)] border-none px-4 py-1.5 font-black text-[10px] uppercase tracking-widest">
                Instructor Command Center
              </span>
              <h1 className="mt-6 text-4xl font-black tracking-tighter sm:text-6xl">Teacher Portal</h1>
              <p className="mt-4 text-lg text-[var(--muted)] font-medium leading-relaxed">
                Manage your classrooms, track student progress in real-time, and deploy assignments across the Xenon network.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                className="xenon-btn h-14 px-8 shadow-xl shadow-[var(--accent-soft)]"
                onClick={() => { setShowCreateForm((v) => !v); setShowJoinForm(false); setCreateError(""); }}
              >
                {showCreateForm ? <X className="h-5 w-5" /> : <><Plus className="mr-2 h-5 w-5" /> Create Class</>}
              </button>
              <button
                className="xenon-btn-subtle h-14 px-8"
                onClick={() => { setShowJoinForm((v) => !v); setShowCreateForm(false); setJoinError(""); setJoinStatus(""); }}
              >
                {showJoinForm ? <X className="h-5 w-5" /> : <><Users className="mr-2 h-5 w-5" /> Co-Teach</>}
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-10">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">Managed Classes</p>
              <p className="text-3xl font-black">{classes.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">Total Students</p>
              <p className="text-3xl font-black">{classes.reduce((acc, c) => acc + (c.student_count || 0), 0)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">Active Today</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-black text-green-400">—</p>
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">Lab Uptime</p>
              <p className="text-3xl font-black text-sky-400">99.9%</p>
            </div>
          </div>
        </div>

        {/* Dynamic Forms */}
        <AnimatePresence>
          {(showCreateForm || showJoinForm) && (
            <motion.div
              className="mt-10 p-8 rounded-3xl bg-white/[0.02] border border-white/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {showCreateForm ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black tracking-tight">Deploy New Classroom</h3>
                    <p className="text-sm text-[var(--muted)]">Enter the details for your new instructional environment.</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] ml-1">Class Name</label>
                      <input
                        className="xenon-input h-14 rounded-2xl"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Computer Science Year 11"
                        onKeyDown={(e) => e.key === "Enter" && submitCreate()}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] ml-1">Focus / Period</label>
                      <input
                        className="xenon-input h-14 rounded-2xl"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g. Period 3 / GCSE Track"
                        onKeyDown={(e) => e.key === "Enter" && submitCreate()}
                      />
                    </div>
                  </div>
                  <button className="xenon-btn h-14 px-10" disabled={creating} onClick={submitCreate}>
                    {creating ? "Initialising..." : "Deploy Class"}
                  </button>
                  {createError && <p className="text-sm text-red-500 font-bold">{createError}</p>}
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black tracking-tight">Co-Teacher Access</h3>
                    <p className="text-sm text-[var(--muted)]">Ask the lead instructor for the secure access code.</p>
                  </div>
                  <div className="flex gap-3">
                    <input
                      className="xenon-input h-14 w-64 rounded-2xl font-mono text-xl uppercase tracking-[0.3em] text-center"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      placeholder="XXXX-XXXX"
                      maxLength={8}
                      onKeyDown={(e) => e.key === "Enter" && submitJoin()}
                    />
                    <button className="xenon-btn h-14 px-10" disabled={joining} onClick={submitJoin}>
                      {joining ? "Joining..." : "Gain Access"}
                    </button>
                  </div>
                  {joinError && <p className="text-sm text-red-500 font-bold">{joinError}</p>}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Global Notifications */}
      {joinStatus && !showJoinForm && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="xenon-panel-muted p-4 border-green-500/20 bg-green-500/5 text-green-400 font-bold text-sm text-center">
          {joinStatus}
        </motion.div>
      )}

      {/* Class Inventory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--muted)]">Classroom Inventory</h3>
          <button className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)] hover:opacity-80 transition" onClick={refreshClasses}>
            {refreshing ? "Syncing..." : "Sync Database"}
          </button>
        </div>
        
        {classes.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {classes.map((cls) => (
              <ClassTile key={cls.id} cls={cls} onClick={() => setSelectedId(cls.id)} />
            ))}
          </div>
        ) : (
          !showCreateForm && !showJoinForm && (
            <div className="xenon-panel p-20 text-center flex flex-col items-center">
              <div className="h-20 w-20 rounded-[2.5rem] bg-[var(--panel-soft)] flex items-center justify-center mb-6 border border-white/5 shadow-inner">
                <School className="h-10 w-10 text-[var(--muted)] opacity-50" />
              </div>
              <p className="font-black text-2xl tracking-tight">No Active Classrooms</p>
              <p className="mt-3 text-[var(--muted)] max-w-sm font-medium leading-relaxed">
                Initialise your first instructional environment to begin monitoring student progress and deploying assignments.
              </p>
              <button className="mt-8 xenon-btn h-12 px-8" onClick={() => setShowCreateForm(true)}>
                Get Started
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
