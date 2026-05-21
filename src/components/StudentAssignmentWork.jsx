import { useEffect, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import {
  parseAssignment,
  gradeTheorySubmission,
  packSubmission,
} from "../lib/assignmentPayload";
import { BookOpen, Code, CheckCircle, Send, ExternalLink } from "lucide-react";
import clsx from "clsx";

function TheoryQuiz({ assignment, onSubmit, submitting, submitted, initialAnswers }) {
  const parsed = parseAssignment(assignment);
  const questions = parsed.questions || [];
  const [answers, setAnswers] = useState(initialAnswers || {});
  const [graded, setGraded] = useState(null);

  const handleSubmit = async () => {
    const result = gradeTheorySubmission(questions, answers);
    setGraded(result);
    await onSubmit({ answers, score: result.earned, maxScore: result.total });
  };

  if (submitted && graded) {
    return (
      <div className="xenon-panel p-6 text-center space-y-3">
        <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto" />
        <p className="text-xl font-black text-[var(--accent)]">
          {graded.earned} / {graded.total}
        </p>
        <p className="text-sm text-[var(--muted)]">Theory quiz submitted. Your teacher can review your answers.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <div key={q.id} className="xenon-panel p-5 space-y-3">
          <p className="text-xs font-black text-[var(--accent)]">Q{q.num}</p>
          <p className="font-semibold text-sm">{q.text}</p>
          {q.options?.length ? (
            <div className="grid gap-2">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  disabled={submitted}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                  className={clsx(
                    "p-3 rounded-xl border text-left text-sm transition",
                    answers[q.id] === opt
                      ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                      : "border-[var(--border)] hover:border-[var(--muted)]"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <textarea
              className="xenon-input w-full"
              rows={2}
              disabled={submitted}
              placeholder="Write your answer..."
              value={answers[q.id] || ""}
              onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
            />
          )}
        </div>
      ))}
      {!submitted && (
        <button type="button" className="xenon-btn w-full h-12 flex items-center justify-center gap-2" disabled={submitting} onClick={handleSubmit}>
          <Send className="h-4 w-4" /> {submitting ? "Submitting…" : "Submit theory quiz"}
        </button>
      )}
    </div>
  );
}

function ProgrammingTask({ assignment, onSubmit, submitting, submitted, initialCode, onOpenIde }) {
  const parsed = parseAssignment(assignment);
  const [code, setCode] = useState(initialCode || parsed.starterCode || "# Write your solution\n");

  return (
    <div className="space-y-4">
      <div className="xenon-panel p-5">
        <p className="text-sm font-semibold leading-relaxed">{parsed.prompt}</p>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-[var(--muted)] mb-2">Your Python code</p>
        <textarea
          className="xenon-input w-full font-mono text-sm min-h-[220px] leading-relaxed"
          value={code}
          disabled={submitted}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
        />
      </div>
      {!submitted && (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="xenon-btn-subtle flex items-center gap-2"
            onClick={() => onOpenIde?.(code)}
          >
            <ExternalLink className="h-4 w-4" /> Test in full IDE
          </button>
          <button
            type="button"
            className="xenon-btn flex-1 min-w-[140px] flex items-center justify-center gap-2"
            disabled={submitting || !code.trim()}
            onClick={() => onSubmit({ code })}
          >
            <Send className="h-4 w-4" /> {submitting ? "Submitting…" : "Submit program"}
          </button>
        </div>
      )}
      {submitted && (
        <p className="text-sm text-emerald-400 font-bold flex items-center gap-2">
          <CheckCircle className="h-4 w-4" /> Program submitted to your teacher.
        </p>
      )}
    </div>
  );
}

export default function StudentAssignmentWork({ onOpenIde }) {
  const { assignments, submitAssignment, loadMySubmissions } = useAppStore();
  const [submittedIds, setSubmittedIds] = useState(new Set());
  const [activeId, setActiveId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMySubmissions().then((ids) => {
      if (ids?.length) setSubmittedIds(new Set(ids));
    });
  }, [loadMySubmissions, assignments]);

  const structured = assignments
    .map((row) => parseAssignment(row))
    .filter((a) => a.type === "theory" || a.type === "programming");

  const active = structured.find((a) => a.id === activeId);

  const handleSubmit = async (assignmentId, payload) => {
    setSubmitting(true);
    try {
      const packed = packSubmission({
        note: "",
        answers: payload.answers,
        code: payload.code,
      });
      await submitAssignment({
        assignmentId,
        notes: packed.notes,
        submitted_code: packed.submitted_code,
        answers_json: packed.answers_json,
        score: payload.score,
        maxScore: payload.maxScore,
      });
      setSubmittedIds((prev) => new Set([...prev, assignmentId]));
    } catch (e) {
      alert(e?.message || "Could not submit.");
    }
    setSubmitting(false);
  };

  if (!structured.length) {
    return (
      <div className="xenon-panel p-8 text-center">
        <p className="text-sm text-[var(--muted)]">No theory or programming tasks from your teacher yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="xenon-panel p-6">
        <h3 className="text-lg font-black">Class tasks</h3>
        <p className="text-xs text-[var(--muted)] mt-1">Complete theory quizzes and programming tasks set by your teacher.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {structured.map((a) => {
          const done = submittedIds.has(a.id);
          const isTheory = a.type === "theory";
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => setActiveId(a.id)}
              className={clsx(
                "xenon-panel p-5 text-left transition border",
                activeId === a.id ? "border-[var(--accent)] ring-1 ring-[var(--accent)]" : "border-[var(--border)] hover:border-[var(--accent)]/40"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                {isTheory ? <BookOpen className="h-4 w-4 text-[var(--accent)]" /> : <Code className="h-4 w-4 text-[var(--accent)]" />}
                <span className="text-[9px] font-black uppercase text-[var(--muted)]">{isTheory ? "Theory" : "Programming"}</span>
                {done && <CheckCircle className="h-4 w-4 text-emerald-400 ml-auto" />}
              </div>
              <p className="font-bold text-sm">{a.title}</p>
              <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">{a.summary}</p>
            </button>
          );
        })}
      </div>

      {active && (
        <div className="xenon-panel p-6 sm:p-8">
          <h4 className="text-base font-black mb-4">{active.title}</h4>
          {active.type === "theory" ? (
            <TheoryQuiz
              assignment={assignments.find((r) => r.id === active.id)}
              submitting={submitting}
              submitted={submittedIds.has(active.id)}
              onSubmit={(p) => handleSubmit(active.id, p)}
            />
          ) : (
            <ProgrammingTask
              assignment={assignments.find((r) => r.id === active.id)}
              submitting={submitting}
              submitted={submittedIds.has(active.id)}
              onOpenIde={onOpenIde}
              onSubmit={(p) => handleSubmit(active.id, p)}
            />
          )}
        </div>
      )}
    </div>
  );
}
