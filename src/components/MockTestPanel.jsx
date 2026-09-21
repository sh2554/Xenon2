import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Code,
  BookOpen,
  Send,
  Lock,
  CheckCircle,
  ArrowLeft,
  BarChart3,
  Terminal,
} from "lucide-react";
import clsx from "clsx";
import { useAppStore } from "../store/useAppStore";
import { hasFeature, isMax } from "../lib/planFeatures";
import { MOCK_TESTS } from "../lib/mockTestCatalog";
import { getCompletionByTestId } from "../lib/mockTests";
import { percentToGrade } from "../lib/mockTestGrades";
import SpecHeatmapGrid from "./SpecHeatmapGrid";
import MiniIDEModal from "./MiniIDEModal";

const GRADE_RING = {
  emerald: "border-[var(--success)]/40 bg-[var(--success)]/10 text-[var(--success)]",
  sky: "border-[var(--accent)]/40 bg-[var(--accent-soft)] text-[var(--accent)]",
  amber: "border-[var(--warning)]/40 bg-[var(--warning-soft)] text-[var(--warning)]",
  orange: "border-[var(--warning)]/40 bg-[var(--warning-soft)] text-[var(--warning)]",
  red: "border-[var(--danger)]/40 bg-[var(--danger)]/10 text-[var(--danger)]",
};

export default function MockTestPanel() {
  const { profile, submitMockTest, myMockResults, myHeatmapTopics } = useAppStore();
  const setShowUpgradePrompt = useAppStore((s) => s.setShowUpgradePrompt);
  const plan = profile?.plan;
  const canTake = hasFeature(plan, "mockTests");

  const [activeTestId, setActiveTestId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [miniIDEQuestion, setMiniIDEQuestion] = useState(null);

  const completion = useMemo(() => getCompletionByTestId(myMockResults || []), [myMockResults]);
  const activeTest = MOCK_TESTS.find((t) => t.id === activeTestId) || null;
  const completedCount = Object.keys(completion).length;

  const handleSubmit = async () => {
    if (!activeTest) return;
    setSubmitting(true);
    try {
      const result = await submitMockTest({ testId: activeTest.id, answers });
      setLastResult(result);
      setAnswers({});
      setActiveTestId(null);
    } catch (e) {
      alert(e?.message || "Could not submit mock test.");
    }
    setSubmitting(false);
  };

  if (!canTake) {
    return (
      <div className="xenon-panel p-8 text-center space-y-4">
        <Lock className="h-10 w-10 text-violet-400 mx-auto" />
        <h3 className="text-xl font-black">GCSE Mock Tests</h3>
        <p className="text-sm text-[var(--muted)] max-w-md mx-auto">
          Twelve full mocks (6 theory, 6 programming) with 10 questions each, plus your personal spec
          heatmap, are included on the <strong>School Max</strong> plan. Upgrade in Settings with your access
          code.
        </p>
        <button type="button" className="xenon-btn" onClick={() => setShowUpgradePrompt(true)}>
          View Max features
        </button>
      </div>
    );
  }

  if (activeTest) {
    const isTheory = activeTest.type === "theory";
    return (
      <>
        <div className="space-y-6">
        <div className="xenon-panel p-6 sm:p-8">
          <button
            type="button"
            className="text-xs font-black uppercase text-[var(--muted)] flex items-center gap-2 mb-4 hover:text-[var(--accent)]"
            onClick={() => {
              setActiveTestId(null);
              setAnswers({});
              setLastResult(null);
            }}
          >
            <ArrowLeft className="h-4 w-4" /> Back to all mocks
          </button>
          <h2 className="text-2xl font-black">{activeTest.title}</h2>
          <p className="text-sm text-[var(--muted)] mt-1">{activeTest.subtitle}</p>
          <p className="text-xs font-black uppercase text-[var(--accent)] mt-3">
            {isTheory ? "Multiple choice" : "Programming tasks"} · {activeTest.questions.length} questions
          </p>
        </div>

        <div className="xenon-panel p-6 space-y-4">
          {activeTest.questions.map((q, i) => (
            <div key={q.id} className="xenon-panel-muted p-5 space-y-3">
              <p className="text-xs font-black text-[var(--accent)]">Q{i + 1}</p>
              <p className="text-sm font-semibold">{q.text}</p>
              {isTheory && q.options ? (
                <div className="grid gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                      className={clsx(
                        "p-3 rounded-xl border text-left text-sm transition-colors",
                        answers[q.id] === opt
                          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                          : "border-[var(--border)] hover:border-[var(--accent)]/40",
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setMiniIDEQuestion(q)}
                    className="w-full p-4 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] text-left flex items-center gap-3 hover:bg-[var(--accent-soft)]/80 transition-colors"
                  >
                    <Terminal className="h-5 w-5 text-[var(--accent)] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--accent)]">
                        {answers[q.id] ? "Edit code in mini IDE" : "Open mini IDE to write code"}
                      </p>
                      {answers[q.id] && (
                        <p className="text-xs text-[var(--muted)] mt-0.5 truncate">
                          {answers[q.id].slice(0, 80)}...
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] font-black text-[var(--muted)] bg-[var(--panel)] px-2 py-1 rounded-full border border-[var(--border)]">
                      {answers[q.id] ? "EDIT" : "OPEN"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            className="xenon-btn w-full h-12 flex items-center justify-center gap-2"
            disabled={submitting}
            onClick={handleSubmit}
          >
            <Send className="h-4 w-4" />
            {submitting ? "Submitting…" : "Submit mock test"}
          </button>
        </div>
      </div>

      {miniIDEQuestion && (
        <MiniIDEModal
          question={miniIDEQuestion}
          onClose={() => setMiniIDEQuestion(null)}
          onSubmit={(code) => {
            setAnswers((a) => ({ ...a, [miniIDEQuestion.id]: code }));
            setMiniIDEQuestion(null);
          }}
          onSubmitLabel="Save & Close"
        />
      )}
    </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="xenon-panel p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2">
              <ClipboardCheck className="h-7 w-7 text-violet-400" />
              GCSE Mock Tests
            </h2>
            <p className="text-sm text-[var(--muted)] mt-1 max-w-xl">
              {MOCK_TESTS.length} mocks · 10 questions each. Completed tests show your score and grade.
              Results feed your spec heatmap only.
            </p>
          </div>
          {isMax(plan) && (
            <span className="text-[10px] font-black uppercase text-violet-300 bg-violet-500/10 border border-violet-400/30 px-3 py-1 rounded-lg">
              Max
            </span>
          )}
        </div>
        <div className="relative flex flex-wrap gap-4 mt-6">
          <div className="xenon-panel-muted px-4 py-3 rounded-xl">
            <p className="text-[10px] font-black uppercase text-[var(--muted)]">Completed</p>
            <p className="text-xl font-black">
              {completedCount}/{MOCK_TESTS.length}
            </p>
          </div>
          <div className="xenon-panel-muted px-4 py-3 rounded-xl">
            <p className="text-[10px] font-black uppercase text-[var(--muted)]">Theory mocks</p>
            <p className="text-xl font-black">{MOCK_TESTS.filter((t) => t.type === "theory").length}</p>
          </div>
          <div className="xenon-panel-muted px-4 py-3 rounded-xl">
            <p className="text-[10px] font-black uppercase text-[var(--muted)]">Programming mocks</p>
            <p className="text-xl font-black">{MOCK_TESTS.filter((t) => t.type === "programming").length}</p>
          </div>
        </div>
      </div>

      {lastResult && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="xenon-panel p-6 border-[var(--success)]/30 bg-[var(--success)]/5"
        >
          <p className="font-black text-[var(--success)] flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            {lastResult.testTitle} — {lastResult.percent}% · Grade {lastResult.grade}
          </p>
          <p className="text-xs text-[var(--muted)] mt-1">
            {lastResult.totalCorrect}/{lastResult.totalQuestions} correct. Heatmap updated below.
          </p>
        </motion.div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {MOCK_TESTS.map((test) => {
          const done = completion[test.id];
          const gradeInfo = done ? percentToGrade(done.percent ?? 0) : null;
          return (
            <button
              key={test.id}
              type="button"
              onClick={() => {
                setActiveTestId(test.id);
                setAnswers({});
              }}
              className="xenon-panel p-5 text-left hover:border-[var(--accent)]/50 transition-colors group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {test.type === "theory" ? (
                    <BookOpen className="h-5 w-5 text-[var(--accent)] shrink-0" />
                  ) : (
                    <Code className="h-5 w-5 text-violet-400 shrink-0" />
                  )}
                  <div>
                    <p className="font-black text-sm group-hover:text-[var(--accent)] transition-colors">
                      {test.title}
                    </p>
                    <p className="text-xs text-[var(--muted)] mt-0.5">{test.subtitle}</p>
                  </div>
                </div>
                {done ? (
                  <span
                    className={clsx(
                      "shrink-0 text-[10px] font-black uppercase px-2 py-1 rounded-lg border",
                      GRADE_RING[gradeInfo?.tone || "sky"],
                    )}
                  >
                    {done.grade}
                  </span>
                ) : null}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mt-3">
                10 questions · {test.type === "theory" ? "Theory" : "Programming"}
              </p>
              {done ? (
                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-[var(--success)]">
                  <CheckCircle className="h-4 w-4" />
                  Done · {done.percent ?? Math.round((done.totalCorrect / done.totalQuestions) * 100)}%
                </div>
              ) : (
                <p className="mt-3 text-xs font-bold text-[var(--accent)]">Start mock →</p>
              )}
            </button>
          );
        })}
      </div>

      <div className="xenon-panel p-6">
        <h3 className="text-lg font-black mb-1 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-violet-400" />
          Your spec heatmap
        </h3>
        <p className="text-xs text-[var(--muted)] mb-4">
          Based on {completedCount} completed mock{completedCount === 1 ? "" : "s"}. Empty topics = not tested
          yet.
        </p>
        <SpecHeatmapGrid topics={myHeatmapTopics || []} />
      </div>
    </div>
  );
}
