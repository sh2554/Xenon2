import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAppStore } from "../store/useAppStore";
import { translateSupabaseError } from "../lib/errorTranslator";
import {
  parseAssignment,
  buildDescription,
  buildTheoryMeta,
  buildProgrammingMeta,
  parseSubmissionPayload,
  createQuestionId,
} from "../lib/assignmentPayload";
import { BookOpen, Code, Plus, Trash2, ClipboardList, ChevronDown, ChevronUp } from "lucide-react";

function SubmissionReview({ submission: s }) {
  const { answers, code, note } = parseSubmissionPayload(s);
  const [feedback, setFeedback] = useState(s.feedback || "");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);
    try {
      await supabase.from("assignment_submissions").update({ feedback }).eq("id", s.id);
    } catch {}
    setSending(false);
  };

  return (
    <div className="rounded-xl border border-[var(--border)] p-4 space-y-3 bg-[var(--panel-soft)]">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-bold">{s.profiles?.first_name || s.profiles?.username || "Student"}</p>
        <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
          Submitted
        </span>
      </div>
      {s.score != null && s.max_score != null && (
        <p className="text-sm font-black text-[var(--accent)]">
          Auto-score: {s.score} / {s.max_score}
        </p>
      )}
      {note && <p className="text-xs text-[var(--muted)]">{note}</p>}
      {answers && (
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase text-[var(--muted)]">Theory answers</p>
          <pre className="text-xs p-3 rounded-lg bg-black/20 overflow-x-auto font-mono">
            {JSON.stringify(answers, null, 2)}
          </pre>
        </div>
      )}
      {code && (
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase text-[var(--muted)]">Submitted code</p>
          <pre className="text-xs p-3 rounded-lg bg-[#07101a] text-sky-300 overflow-x-auto font-mono whitespace-pre-wrap">
            {code}
          </pre>
        </div>
      )}
      <textarea
        className="xenon-input text-xs w-full"
        rows={2}
        placeholder="Teacher feedback..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <button type="button" className="xenon-btn-subtle text-xs h-8" onClick={handleSend} disabled={sending}>
        {sending ? "Saving…" : "Save feedback"}
      </button>
    </div>
  );
}

const emptyQuestion = () => ({
  id: createQuestionId(),
  text: "",
  answer: "",
  options: ["", "", "", ""],
  points: 1,
});

export default function ClassAssignmentsBuilder({ cls }) {
  const { postAssignment, deleteAssignment, loadSubmissions, databaseWarnings } = useAppStore();
  const [taskType, setTaskType] = useState("theory");
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [prompt, setPrompt] = useState("");
  const [starterCode, setStarterCode] = useState("# Write your solution below\nprint(2 + 5)");
  const [questions, setQuestions] = useState([emptyQuestion(), emptyQuestion(), emptyQuestion()]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [subsLoading, setSubsLoading] = useState(false);

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
      setErr("");
    } catch (error) {
      setErr(translateSupabaseError(error, "Could not load assignments."));
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [cls.id]);

  const addQuestion = () => {
    if (questions.length >= 10) return;
    setQuestions((q) => [...q, emptyQuestion()]);
  };

  const updateQuestion = (id, field, value) => {
    setQuestions((q) => q.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeQuestion = (id) => {
    setQuestions((q) => (q.length <= 1 ? q : q.filter((item) => item.id !== id)));
  };

  const submit = async () => {
    if (!title.trim()) {
      setErr("Title is required.");
      return;
    }
    setErr("");
    try {
      if (taskType === "theory") {
        const valid = questions.filter((q) => q.text.trim() && q.answer.trim());
        if (!valid.length) {
          setErr("Add at least one complete theory question with an answer.");
          return;
        }
        const meta = buildTheoryMeta({ questions: valid });
        const summary = `Theory quiz — ${valid.length} question${valid.length > 1 ? "s" : ""}`;
        await postAssignment({
          classId: cls.id,
          title: title.trim(),
          description: buildDescription(summary, meta),
          dueDate,
          assignmentType: "theory",
          contentJson: meta,
        });
      } else {
        if (!prompt.trim()) {
          setErr("Programming task description is required.");
          return;
        }
        const meta = buildProgrammingMeta({ prompt, starterCode });
        const summary = `Programming — ${prompt.trim().slice(0, 80)}`;
        await postAssignment({
          classId: cls.id,
          title: title.trim(),
          description: buildDescription(summary, meta),
          dueDate,
          assignmentType: "programming",
          contentJson: meta,
        });
      }
      setTitle("");
      setPrompt("");
      setStarterCode("# Write your solution below\n");
      setQuestions([emptyQuestion(), emptyQuestion(), emptyQuestion()]);
      await load();
    } catch (e) {
      setErr(e?.message || "Could not create assignment.");
    }
  };

  const viewSubs = async (assignmentId) => {
    if (expandedId === assignmentId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(assignmentId);
    setSubsLoading(true);
    const data = await loadSubmissions(assignmentId);
    setSubmissions(data);
    setSubsLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="xenon-panel p-6 sm:p-8 border-[var(--accent)]/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-11 w-11 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)]">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-black">Create class task</h3>
            <p className="text-xs text-[var(--muted)]">Theory quizzes (up to 10) or live programming — students submit in-app.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border transition ${
              taskType === "theory"
                ? "bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--muted)]"
            }`}
            onClick={() => setTaskType("theory")}
          >
            <BookOpen className="h-4 w-4" /> Theory quiz
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border transition ${
              taskType === "programming"
                ? "bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--muted)]"
            }`}
            onClick={() => setTaskType("programming")}
          >
            <Code className="h-4 w-4" /> Programming task
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-4">
          <input
            className="xenon-input"
            placeholder="Task title (e.g. Week 3 — CPU & Python)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input className="xenon-input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>

        {taskType === "theory" ? (
          <div className="space-y-4">
            <p className="text-xs text-[var(--muted)]">
              Add multiple-choice (4 options) or short-answer questions. Students answer in a quiz form.
            </p>
            {questions.map((q, idx) => (
              <div key={q.id} className="xenon-panel-muted p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[var(--accent)]">Question {idx + 1}</span>
                  <button type="button" className="text-[var(--muted)] hover:text-red-400" onClick={() => removeQuestion(q.id)}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <input
                  className="xenon-input w-full"
                  placeholder="e.g. What are the three stages of the CPU cycle?"
                  value={q.text}
                  onChange={(e) => updateQuestion(q.id, "text", e.target.value)}
                />
                <p className="text-[10px] font-bold uppercase text-[var(--muted)]">Options (leave blank for short answer)</p>
                {q.options.map((opt, oi) => (
                  <input
                    key={oi}
                    className="xenon-input w-full text-sm"
                    placeholder={`Option ${oi + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const next = [...q.options];
                      next[oi] = e.target.value;
                      updateQuestion(q.id, "options", next);
                    }}
                  />
                ))}
                <input
                  className="xenon-input w-full border-emerald-500/30"
                  placeholder="Correct answer / mark scheme"
                  value={q.answer}
                  onChange={(e) => updateQuestion(q.id, "answer", e.target.value)}
                />
              </div>
            ))}
            {questions.length < 10 && (
              <button type="button" className="xenon-btn-subtle text-xs flex items-center gap-2" onClick={addQuestion}>
                <Plus className="h-4 w-4" /> Add question ({questions.length}/10)
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              className="xenon-input w-full min-h-[80px]"
              placeholder="Task: e.g. Write a program that prints the result of 2 + 5"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div>
              <p className="text-[10px] font-black uppercase text-[var(--muted)] mb-2">Starter code (optional)</p>
              <textarea
                className="xenon-input w-full font-mono text-sm min-h-[120px]"
                value={starterCode}
                onChange={(e) => setStarterCode(e.target.value)}
              />
            </div>
          </div>
        )}

        <button type="button" className="xenon-btn mt-6 w-full sm:w-auto" onClick={submit}>
          Publish to class
        </button>
        {err && <p className="text-sm text-red-400 mt-3">{err}</p>}
        {databaseWarnings?.assignments && <p className="text-sm text-amber-400 mt-2">{databaseWarnings.assignments}</p>}
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-black uppercase tracking-widest text-[var(--muted)]">Published tasks</h4>
        {!assignments.length ? (
          <p className="text-sm text-[var(--muted)]">No tasks yet.</p>
        ) : (
          assignments.map((row) => {
            const parsed = parseAssignment(row);
            const typeLabel = parsed.type === "theory" ? "Theory quiz" : parsed.type === "programming" ? "Programming" : "Legacy";
            return (
              <div key={row.id} className="xenon-panel p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold">{row.title}</p>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-[var(--accent-soft)] text-[var(--accent)]">
                        {typeLabel}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[var(--muted)]">{parsed.summary}</p>
                    {parsed.type === "theory" && (
                      <p className="text-xs text-[var(--muted)] mt-1">{parsed.questions?.length || 0} questions</p>
                    )}
                    {row.due_date && (
                      <p className="text-xs text-[var(--muted)] mt-1">Due {new Date(row.due_date).toLocaleDateString()}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="xenon-btn-subtle text-xs" onClick={() => viewSubs(row.id)}>
                      {expandedId === row.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      Submissions
                    </button>
                    <button type="button" className="xenon-btn-ghost text-xs" onClick={() => deleteAssignment(row.id).then(load)}>
                      Delete
                    </button>
                  </div>
                </div>
                {expandedId === row.id && (
                  <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-3">
                    {subsLoading ? (
                      <p className="text-sm text-[var(--muted)]">Loading…</p>
                    ) : submissions.length ? (
                      submissions.map((s) => <SubmissionReview key={s.id} submission={s} />)
                    ) : (
                      <p className="text-sm text-[var(--muted)]">No submissions yet.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
