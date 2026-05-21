import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import {
  Shuffle,
  ChevronUp,
  ChevronDown,
  CheckCircle,
  RotateCcw,
  Target,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";
import { PRACTICE_QUESTIONS } from "../lib/practiceQuestions";

const shuffle = (lines) => [...lines].sort(() => Math.random() - 0.5);

const DIFFICULTY_STYLE = {
  Easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Hard: "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function ParsonsProblem() {
  const [index, setIndex] = useState(0);
  const [blocks, setBlocks] = useState(() => shuffle(PRACTICE_QUESTIONS[0].lines));
  const [message, setMessage] = useState("");
  const { profile, enrolledClass, completedPracticeSkills, markPracticeSkillCorrect } = useAppStore();

  const question = PRACTICE_QUESTIONS[index];
  const target = question.lines.join("\n");
  const solved = blocks.join("\n") === target;
  const done = Boolean(completedPracticeSkills?.[question.title]);

  useEffect(() => {
    setBlocks(shuffle(question.lines));
    setMessage("");
  }, [index, question.lines]);

  const move = (from, to) => {
    if (to < 0 || to >= blocks.length) return;
    setBlocks((b) => {
      const next = [...b];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  };

  const check = async () => {
    if (!solved) {
      setMessage("Not quite — reorder the lines until they match a working program.");
      return;
    }
    if (profile?.role !== "student" || !enrolledClass?.id) {
      setMessage("Correct order. Join a class to count this on the leaderboard.");
      return;
    }
    if (done) {
      setMessage("Already counted — pick another challenge.");
      return;
    }
    try {
      await markPracticeSkillCorrect(question.title);
      setMessage("Correct — counted toward your class practice total.");
    } catch (e) {
      setMessage(e?.message || "Correct, but could not update class stats.");
    }
  };

  const completed = useMemo(
    () => PRACTICE_QUESTIONS.filter((q) => completedPracticeSkills?.[q.title]).length,
    [completedPracticeSkills],
  );

  const progressPct = Math.round((completed / PRACTICE_QUESTIONS.length) * 100);

  return (
    <motion.section className="space-y-6 pb-12" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="xenon-panel p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-violet-500/5 pointer-events-none" />
        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black flex items-center gap-2">
              <Target className="h-8 w-8 text-[var(--accent)]" />
              Skills Lab
            </h2>
            <p className="text-sm text-[var(--muted)] mt-2 max-w-lg">
              Reorder scrambled Python lines into a working program. Progress counts toward your class
              leaderboard.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="xenon-panel-muted px-4 py-3 rounded-xl min-w-[100px]">
              <p className="text-[10px] font-black uppercase text-[var(--muted)]">Completed</p>
              <p className="text-xl font-black text-[var(--accent)]">
                {completed}/{PRACTICE_QUESTIONS.length}
              </p>
            </div>
            <div className="xenon-panel-muted px-4 py-3 rounded-xl min-w-[100px]">
              <p className="text-[10px] font-black uppercase text-[var(--muted)]">Progress</p>
              <p className="text-xl font-black">{progressPct}%</p>
            </div>
          </div>
        </div>
        <div className="relative mt-4 h-2 rounded-full bg-[var(--panel-soft)] overflow-hidden">
          <motion.div
            className="h-full bg-[var(--accent)] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-4 space-y-3">
          <p className="text-xs font-black uppercase text-[var(--muted)] px-1">Challenges</p>
          <div className="max-h-[min(520px,60vh)] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {PRACTICE_QUESTIONS.map((q, i) => {
              const isDone = completedPracticeSkills?.[q.title];
              const active = i === index;
              return (
                <button
                  key={q.title}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={clsx(
                    "w-full text-left p-4 rounded-xl border transition-all",
                    active
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] shadow-sm"
                      : "border-[var(--border)] bg-[var(--panel)] hover:border-[var(--accent)]/40",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={clsx(
                        "text-[10px] font-black uppercase px-2 py-0.5 rounded border",
                        DIFFICULTY_STYLE[q.difficulty] || DIFFICULTY_STYLE.Easy,
                      )}
                    >
                      {q.difficulty}
                    </span>
                    {isDone && <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />}
                  </div>
                  <p className="font-bold text-sm mt-2 truncate">{q.title}</p>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="lg:col-span-8 space-y-4">
          <div className="xenon-panel p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-xs font-black uppercase text-[var(--accent)] flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> Current challenge
                </p>
                <h3 className="text-lg font-black mt-1">{question.title}</h3>
                <p className="text-sm text-[var(--muted)] mt-1">{question.description}</p>
              </div>
              <span
                className={clsx(
                  "text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border",
                  DIFFICULTY_STYLE[question.difficulty] || DIFFICULTY_STYLE.Easy,
                )}
              >
                {question.difficulty}
              </span>
            </div>
            {done && (
              <p className="text-xs font-bold text-emerald-400 flex items-center gap-1 mb-4">
                <CheckCircle className="h-4 w-4" /> Completed — pick another to keep practising
              </p>
            )}
          </div>

          <div className="xenon-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-black uppercase text-[var(--muted)]">Code blocks</p>
              <button
                type="button"
                className="xenon-btn-subtle text-xs h-8 gap-1"
                onClick={() => setBlocks(shuffle(question.lines))}
              >
                <Shuffle className="h-3 w-3" /> Shuffle
              </button>
            </div>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {blocks.map((line, i) => (
                  <motion.div
                    key={`${i}-${line.slice(0, 12)}`}
                    layout
                    className="flex items-center gap-2 p-3 rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] font-mono text-sm group hover:border-[var(--accent)]/30"
                  >
                    <span className="text-[var(--muted)] text-xs w-6 font-black">{i + 1}</span>
                    <span className="flex-1 whitespace-pre-wrap break-all">{line || " "}</span>
                    <div className="flex flex-col opacity-70 group-hover:opacity-100">
                      <button
                        type="button"
                        className="p-1 hover:text-[var(--accent)] disabled:opacity-30"
                        onClick={() => move(i, i - 1)}
                        disabled={i === 0}
                        aria-label="Move up"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="p-1 hover:text-[var(--accent)] disabled:opacity-30"
                        onClick={() => move(i, i + 1)}
                        disabled={i === blocks.length - 1}
                        aria-label="Move down"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" className="xenon-btn flex-1 min-w-[140px]" onClick={check}>
                Check answer
              </button>
              <button
                type="button"
                className="xenon-btn-subtle flex items-center gap-1"
                onClick={() => setBlocks(shuffle(question.lines))}
              >
                <RotateCcw className="h-4 w-4" /> Reset order
              </button>
              <button
                type="button"
                className="xenon-btn-subtle"
                onClick={() => setIndex((index + 1) % PRACTICE_QUESTIONS.length)}
              >
                Next challenge
              </button>
            </div>

            {message && (
              <p className="mt-4 text-sm font-medium text-[var(--accent)] p-3 rounded-xl bg-[var(--accent-soft)] border border-[var(--accent)]/20">
                {message}
              </p>
            )}
            {solved && !message && (
              <p className="mt-4 text-sm text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> Order matches — press Check to submit
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
