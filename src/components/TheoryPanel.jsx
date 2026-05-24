import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { THEORY_UNITS } from "../lib/theoryContent";
import { useAppStore } from "../store/useAppStore";
import { hasFeature } from "../lib/planFeatures";
import {
  BookOpen,
  Layers,
  Clock,
  ChevronDown,
  ChevronLeft,
  Search,
  Shuffle,
  Trophy,
  Award,
  BookMarked,
  FileText,
  HelpCircle,
  Check,
  X,
  RotateCcw,
  ArrowRight,
  Bookmark,
  PenLine,
  GraduationCap,
  Sparkles,
  Target,
  ChevronRight,
  Play
} from "lucide-react";

// ─── Flashcard component ───────────────────────────────────────────────────────

function Flashcard({ card, onKnow, onLearn, cardKey }) {
  const [flipped, setFlipped] = useState(false);

  // Reset flip state when card changes
  useEffect(() => {
    setFlipped(false);
  }, [cardKey]);

  const flip = () => setFlipped((v) => !v);

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="relative w-full max-w-xl cursor-pointer"
        style={{ perspective: "1500px" }}
        onClick={flip}
      >
        <div
          className="relative w-full transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            display: "grid",
            gridTemplateColumns: "1fr",
            gridTemplateRows: "1fr",
          }}
        >
          {/* Front */}
          <div
            className="xenon-panel flex flex-col items-center justify-center gap-4 rounded-[2.5rem] p-10 text-center shadow-xl"
            style={{ 
              backfaceVisibility: "hidden",
              gridArea: "1 / 1 / 2 / 2",
              minHeight: "300px"
            }}
          >
            <div className="h-12 w-12 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] mb-2">
              <HelpCircle className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">Question — Tap to reveal</span>
            <p className="text-2xl font-black tracking-tight leading-tight">{card.q}</p>
          </div>
          
          {/* Back */}
          <div
            className="xenon-panel flex flex-col items-center justify-center gap-4 rounded-[2.5rem] p-10 text-center shadow-2xl"
            style={{ 
              backfaceVisibility: "hidden", 
              transform: "rotateY(180deg)", 
              background: "linear-gradient(135deg, var(--panel-muted), var(--bg-soft))",
              gridArea: "1 / 1 / 2 / 2",
              minHeight: "300px"
            }}
          >
            <div className="h-12 w-12 rounded-2xl bg-[var(--success)]/10 flex items-center justify-center text-[var(--success)] mb-2">
              <Check className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--success)]">Correct Answer</span>
            <p className="text-xl font-bold leading-relaxed text-[var(--text)]">{card.a}</p>
          </div>
        </div>
      </div>

      <div className="h-12 flex items-center justify-center">
        {flipped ? (
          <motion.div
            className="flex gap-3"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              className="rounded-lg border border-[var(--danger)]/40 bg-[var(--danger)]/10 px-5 py-2.5 text-sm font-semibold text-[var(--danger)] transition hover:bg-[var(--danger)]/20 flex items-center gap-2"
              onClick={(e) => { e.stopPropagation(); onLearn(); }}
            >
              <RotateCcw className="h-4 w-4" />
              Still learning
            </button>
            <button
              className="rounded-lg border border-[var(--success)]/40 bg-[var(--success)]/10 px-5 py-2.5 text-sm font-semibold text-[var(--success)] transition hover:bg-[var(--success)]/20 flex items-center gap-2"
              onClick={(e) => { e.stopPropagation(); onKnow(); }}
            >
              <Check className="h-4 w-4" />
              Know it
            </button>
          </motion.div>
        ) : (
          <p className="text-xs text-[var(--muted)]">Tap the card to see the answer</p>
        )}
      </div>
    </div>
  );
}

// ─── Flashcard session ─────────────────────────────────────────────────────────

function FlashcardSession({ cards, onExit, shuffle: shouldShuffle = false }) {
  const shuffleCards = useCallback((items) => [...items].sort(() => Math.random() - 0.5), []);
  
  const [queue, setQueue] = useState(() => {
    const initialCards = cards.map((c, i) => ({ ...c, _id: i }));
    return shouldShuffle ? shuffleCards(initialCards) : initialCards;
  });
  const [weak, setWeak] = useState([]);
  const [known, setKnown] = useState(0);
  const [done, setDone] = useState(false);
  const [cardKey, setCardKey] = useState(0);

  const current = queue[0];

  const advance = (cardId, isKnown) => {
    setQueue((prev) => prev.filter((c) => c._id !== cardId));
    if (isKnown) {
      setKnown((n) => n + 1);
    } else {
      setWeak((prev) => [...prev, cards.find((c, i) => i === cardId) || current]);
    }
    if (queue.length === 1) setDone(true);
    setCardKey((k) => k + 1);
  };

  const retryWeak = () => {
    setQueue(weak.map((c, i) => ({ ...c, _id: i })));
    setWeak([]);
    setKnown(0);
    setDone(false);
    setCardKey((k) => k + 1);
  };

  const total = cards.length;
  const progress = Math.round(((total - queue.length) / total) * 100);

  if (done) {
    const percentage = Math.round((known / total) * 100);
    const ResultIcon = weak.length === 0 ? Trophy : percentage >= 70 ? Award : BookOpen;
    
    return (
      <motion.div className="flex flex-col items-center gap-6 py-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="h-16 w-16 rounded-2xl bg-[var(--accent)]/20 flex items-center justify-center">
          <ResultIcon className="h-8 w-8 text-[var(--accent)]" />
        </div>
        <div>
          <p className="text-2xl font-bold">{weak.length === 0 ? "Perfect score!" : percentage >= 70 ? "Great job!" : "Keep practising!"}</p>
          <p className="mt-2 text-[var(--muted)]">
            {known} / {total} cards known ({percentage}%)
            {weak.length > 0 ? ` — ${weak.length} still to practise` : ""}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {weak.length > 0 && (
            <button className="xenon-btn flex items-center gap-2" onClick={retryWeak}>
              <RotateCcw className="h-4 w-4" />
              Retry {weak.length} weak card{weak.length !== 1 ? "s" : ""}
            </button>
          )}
          <button className="xenon-btn-ghost flex items-center gap-2" onClick={onExit}>
            <ChevronLeft className="h-4 w-4" />
            Back to Notes
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="mb-1 flex justify-between text-xs text-[var(--muted)]">
            <span>{total - queue.length} of {total}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <button className="xenon-btn-ghost text-xs flex items-center gap-1" onClick={onExit}>
          <X className="h-3.5 w-3.5" />
          Exit
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={cardKey}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.2 }}
        >
          <Flashcard
            card={current}
            cardKey={cardKey}
            onKnow={() => advance(current._id, true)}
            onLearn={() => advance(current._id, false)}
          />
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center gap-2">
        {queue.map((c, i) => (
          <div
            key={c._id}
            className="h-1 w-6 rounded-full"
            style={{ background: i === 0 ? "var(--accent)" : "rgba(255,255,255,0.15)" }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Quiz Mode ─────────────────────────────────────────────────────────────────

function QuizMode({ cards, onExit }) {
  const [shuffledCards] = useState(() => [...cards].sort(() => Math.random() - 0.5));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [selfScore, setSelfScore] = useState(null);

  const current = shuffledCards[currentIndex];
  const total = shuffledCards.length;

  const calculateScore = (input, correct) => {
    const clean = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
    const user = clean(input);
    const target = clean(correct);
    
    // Exact match
    if (user === target) return 1;
    
    // Keyword match
    const keywords = correct.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const matches = keywords.filter(k => user.includes(clean(k)));
    if (matches.length >= Math.ceil(keywords.length * 0.7)) return 1;
    if (matches.length >= Math.ceil(keywords.length * 0.3)) return 0.5;
    
    return 0;
  };

  const handleSubmit = () => {
    if (!showAnswer) {
      const score = calculateScore(currentInput, current.a);
      setSelfScore(score);
      setShowAnswer(true);
    } else {
      if (selfScore !== null) {
        setUserAnswers((prev) => [...prev, { 
          question: current.q, 
          userAnswer: currentInput, 
          correctAnswer: current.a,
          correct: selfScore >= 0.5
        }]);
        setCurrentInput("");
        setShowAnswer(false);
        setSelfScore(null);
        
        if (currentIndex + 1 >= total) {
          setShowResults(true);
        } else {
          setCurrentIndex((i) => i + 1);
        }
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!showAnswer && currentInput.trim()) {
        handleSubmit();
      }
    }
  };

  if (showResults) {
    const correctCount = userAnswers.filter((a) => a.correct).length;
    const percentage = Math.round((correctCount / total) * 100);
    const ResultIcon = percentage >= 80 ? Trophy : percentage >= 60 ? Award : BookOpen;
    
    return (
      <motion.div className="space-y-6 py-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-center">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-[var(--accent)]/20 flex items-center justify-center mb-4">
            <ResultIcon className="h-8 w-8 text-[var(--accent)]" />
          </div>
          <h3 className="text-2xl font-bold">Quiz Complete!</h3>
          <p className="mt-2 text-[var(--muted)]">
            You got {correctCount} / {total} correct ({percentage}%)
          </p>
        </div>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {userAnswers.map((answer, i) => (
            <div 
              key={i} 
              className={`xenon-panel p-4 rounded-xl border-l-4 ${
                answer.correct ? "border-[var(--success)]" : "border-[var(--danger)]"
              }`}
            >
              <p className="font-medium text-sm">{answer.question}</p>
              <p className="text-xs text-[var(--muted)] mt-1">Your answer: {answer.userAnswer || "(empty)"}</p>
              <p className="text-xs text-[var(--success)] mt-1">Correct: {answer.correctAnswer}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-3">
          <button className="xenon-btn flex items-center gap-2" onClick={() => {
            setCurrentIndex(0);
            setUserAnswers([]);
            setShowResults(false);
            setCurrentInput("");
          }}>
            <RotateCcw className="h-4 w-4" />
            Retry Quiz
          </button>
          <button className="xenon-btn-ghost flex items-center gap-2" onClick={onExit}>
            <ChevronLeft className="h-4 w-4" />
            Back to Notes
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="mb-1 flex justify-between text-xs text-[var(--muted)]">
            <span>Question {currentIndex + 1} of {total}</span>
            <span>{Math.round((currentIndex / total) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
              style={{ width: `${(currentIndex / total) * 100}%` }}
            />
          </div>
        </div>
        <button className="xenon-btn-ghost text-xs flex items-center gap-1" onClick={onExit}>
          <X className="h-3.5 w-3.5" />
          Exit
        </button>
      </div>

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="xenon-panel p-6 rounded-2xl space-y-4"
      >
        <p className="text-lg font-semibold">{current.q}</p>
        
        <textarea
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none resize-none"
          placeholder="Type your answer..."
          rows={3}
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={showAnswer}
        />

        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">Automated Verification</span>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                selfScore === 1 ? "bg-[var(--success)]/10 text-[var(--success)]" : selfScore === 0.5 ? "bg-yellow-500/10 text-[var(--warning)]" : "bg-[var(--danger)]/10 text-[var(--danger)]"
              }`}>
                {selfScore === 1 ? <><Check className="h-3 w-3"/> Correct</> : selfScore === 0.5 ? <><Target className="h-3 w-3"/> Partial</> : <><X className="h-3 w-3"/> Incomplete</>}
              </div>
            </div>

            <div className="p-5 rounded-[1.5rem] bg-[var(--accent-soft)] border border-[var(--accent)]/10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent)] mb-2">Ideal Solution</p>
              <p className="text-sm font-bold leading-relaxed">{current.a}</p>
            </div>
            
            <div className="text-center pt-2">
              <p className="text-xs text-[var(--muted)] mb-3 font-black uppercase tracking-widest">Adjust Marking?</p>
              <div className="flex justify-center gap-3">
                <button
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border-2 ${
                    selfScore === 0 ? "bg-[var(--danger)]/20 border-[var(--danger)] text-[var(--danger)]" : "bg-[var(--panel-soft)] border-transparent text-[var(--muted)] hover:bg-[var(--panel-muted)]"
                  }`}
                  onClick={() => setSelfScore(0)}
                >
                  <X className="h-3.5 w-3.5" />
                  Mark Wrong
                </button>
                <button
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border-2 ${
                    selfScore === 1 ? "bg-[var(--success)]/20 border-[var(--success)] text-[var(--success)]" : "bg-[var(--panel-soft)] border-transparent text-[var(--muted)] hover:bg-[var(--panel-muted)]"
                  }`}
                  onClick={() => setSelfScore(1)}
                >
                  <Check className="h-3.5 w-3.5" />
                  Mark Correct
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <button
          className="xenon-btn w-full h-14 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-[var(--accent-soft)] transition-all active:scale-[0.98]"
          onClick={handleSubmit}
          disabled={!showAnswer ? !currentInput.trim() : selfScore === null}
        >
          {showAnswer ? (
            <>
              <ArrowRight className="h-5 w-5" />
              Next Experiment
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Verify Results
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}

// ─── Study Progress Tracker ────────────────────────────────────────────────────

function StudyProgress({ unit }) {
  const totalNotes = unit.notes.length;
  const totalCards = unit.flashcards.length;
  const estimatedTime = Math.ceil(totalNotes * 2 + totalCards * 0.5);

  return (
    <div className="flex flex-wrap gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center">
          <FileText className="h-4 w-4 text-[var(--accent)]" />
        </div>
        <div>
          <p className="font-medium">{totalNotes} sections</p>
          <p className="text-xs text-[var(--muted)]">Notes</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-purple-400/20 flex items-center justify-center">
          <Layers className="h-4 w-4 text-purple-400" />
        </div>
        <div>
          <p className="font-medium">{totalCards} cards</p>
          <p className="text-xs text-[var(--muted)]">Flashcards</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-[var(--success)]/20 flex items-center justify-center">
          <Clock className="h-4 w-4 text-[var(--success)]" />
        </div>
        <div>
          <p className="font-medium">~{estimatedTime} min</p>
          <p className="text-xs text-[var(--muted)]">Est. time</p>
        </div>
      </div>
    </div>
  );
}

// ─── Key Terms Component ───────────────────────────────────────────────────────

function KeyTerms({ unit }) {
  // Extract key terms from notes (terms that appear in flashcard questions)
  const terms = unit.flashcards.slice(0, 6).map((card) => ({
    term: card.q.replace(/^What (is|does|are) (the |a |an )?/i, "").replace(/\?$/, ""),
    definition: card.a.slice(0, 100) + (card.a.length > 100 ? "..." : "")
  }));

  return (
    <div className="xenon-panel p-6 rounded-2xl">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Bookmark className="h-4 w-4 text-[var(--accent)]" />
        Key Terms
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {terms.map((item, i) => (
          <div key={i} className="p-3 rounded-xl bg-[var(--panel-muted)] text-sm">
            <p className="font-medium text-[var(--accent)]">{item.term}</p>
            <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">{item.definition}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Theory progress helpers ────────────────────────────────────────────────────

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem("xenon-theory-progress") || "{}");
  } catch { return {}; }
}

function saveProgress(progress) {
  try {
    localStorage.setItem("xenon-theory-progress", JSON.stringify(progress));
  } catch { /* ignore */ }
}

function useTheoryProgress(unitId) {
  const [progress, setProgress] = useState(() => loadProgress());

  const updateProgress = useCallback((updates) => {
    setProgress((prev) => {
      const next = { ...prev, ...updates };
      saveProgress(next);
      return next;
    });
  }, []);

  const unitProg = unitId ? progress[unitId] || { completedSections: [], lastSection: null } : { completedSections: [], lastSection: null };

  const toggleSectionComplete = useCallback((sectionHeading) => {
    setProgress((prev) => {
      const unitPrev = prev[unitId] || { completedSections: [], lastSection: null };
      const list = unitPrev.completedSections || [];
      const nextList = list.includes(sectionHeading)
        ? list.filter((s) => s !== sectionHeading)
        : [...list, sectionHeading];
      const next = { ...prev, [unitId]: { ...unitPrev, completedSections: nextList, lastSection: sectionHeading } };
      saveProgress(next);
      return next;
    });
  }, [unitId]);

  const setLastSection = useCallback((heading) => {
    setProgress((prev) => {
      const unitPrev = prev[unitId] || { completedSections: [], lastSection: null };
      const next = { ...prev, [unitId]: { ...unitPrev, lastSection: heading } };
      saveProgress(next);
      return next;
    });
  }, [unitId]);

  return { progress, unitProg, toggleSectionComplete, setLastSection, updateProgress };
}

// ─── Topic detail view ─────────────────────────────────────────────────────────

function TopicDetail({ unit, onBack }) {
  const profilePlan = useAppStore((s) => s.profile?.plan);
  const canViewProNotes = hasFeature(profilePlan, "extendedTheoryNotes");
  const { unitProg, toggleSectionComplete, setLastSection } = useTheoryProgress(unit.id);
  const [tab, setTab] = useState("notes");
  const [inFlashcards, setInFlashcards] = useState(false);
  const [inQuiz, setInQuiz] = useState(false);
  const [shuffleEnabled, setShuffleEnabled] = useState(true);
  const [expandedSections, setExpandedSections] = useState(() => {
    if (unitProg.lastSection) return { [unitProg.lastSection]: true };
    return {};
  });

  const toggleSection = (heading) => {
    setExpandedSections((prev) => ({
      ...prev,
      [heading]: !prev[heading]
    }));
    setLastSection(heading);
  };

  const expandAll = () => {
    const allExpanded = {};
    unit.notes.forEach((section) => {
      allExpanded[section.heading] = true;
    });
    setExpandedSections(allExpanded);
  };

  const collapseAll = () => {
    setExpandedSections({});
  };

  const completedCount = unitProg.completedSections?.length || 0;
  const totalSections = unit.notes.length;

  return (
    <motion.div className="space-y-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="xenon-panel p-6">
        <button
          className="mb-4 flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--text)] transition"
          onClick={onBack}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to all topics
        </button>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="xenon-kicker" style={{ color: unit.accent }}>{unit.unit}</p>
            <h2 className="mt-1 text-2xl font-bold">{unit.title}</h2>
            {totalSections > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="h-1.5 flex-1 max-w-[200px] rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((completedCount / totalSections) * 100)}%`, background: unit.accent }}
                  />
                </div>
                <span className="text-[10px] font-bold text-[var(--muted)]">{completedCount}/{totalSections}</span>
              </div>
            )}
          </div>
          <StudyProgress unit={unit} />
        </div>

        <div className="mt-5 flex gap-1 border-b border-[var(--border)]">
          {["notes", "flashcards", "quiz"].map((t) => (
            <button
              key={t}
              className="xenon-tab capitalize flex items-center gap-2"
              data-active={tab === t}
              onClick={() => { setTab(t); setInFlashcards(false); setInQuiz(false); }}
            >
              {t === "notes" && <BookOpen className="h-4 w-4" />}
              {t === "flashcards" && <Layers className="h-4 w-4" />}
              {t === "quiz" && <PenLine className="h-4 w-4" />}
              {t === "notes" ? "Notes" : t === "flashcards" ? `Flashcards (${unit.flashcards.length})` : "Quiz"}
            </button>
          ))}
        </div>
      </div>

      {tab === "notes" && (
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="flex gap-2">
            <button 
              className="xenon-btn-ghost text-xs"
              onClick={expandAll}
            >
              Expand All
            </button>
            <button 
              className="xenon-btn-ghost text-xs"
              onClick={collapseAll}
            >
              Collapse All
            </button>
          </div>

          {unit.notes.map((section, idx) => (
            <motion.div
              key={section.heading}
              className="xenon-panel rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <button
                className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition"
                onClick={() => toggleSection(section.heading)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${
                      unitProg.completedSections?.includes(section.heading)
                        ? "border-[var(--success)] bg-[var(--success)]/20"
                        : "border-[var(--border)] hover:border-[var(--accent)]"
                    }`}
                    onClick={(e) => { e.stopPropagation(); toggleSectionComplete(section.heading); }}
                  >
                    {unitProg.completedSections?.includes(section.heading) && (
                      <Check className="h-3 w-3 text-[var(--success)]" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold truncate" style={{ color: unitProg.completedSections?.includes(section.heading) ? undefined : unit.accent }}>
                    {section.heading}
                  </h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {unitProg.completedSections?.includes(section.heading) && (
                    <span className="text-[9px] font-black text-[var(--success)] bg-[var(--success)]/10 px-2 py-0.5 rounded-full">DONE</span>
                  )}
                  <ChevronDown className={`h-5 w-5 text-[var(--muted)] transition-transform ${expandedSections[section.heading] ? "rotate-180" : ""}`} />
                </div>
              </button>
              <AnimatePresence>
                {expandedSections[section.heading] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <p className="xenon-code whitespace-pre-wrap text-sm leading-7 text-[var(--text)]">
                        {section.body}
                      </p>
                      {section.proDetail && canViewProNotes && (
                        <div className="mt-5 pt-5 border-t border-[var(--accent)]/20">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)] mb-2">Pro — examiner depth</p>
                          <p className="xenon-code whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">
                            {section.proDetail}
                          </p>
                        </div>
                      )}
                      {section.proDetail && !canViewProNotes && (
                        <p className="mt-4 text-xs text-[var(--muted)]">
                          Upgrade to Pro in Account Settings for extended examiner notes on this topic.
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {/* Key Terms */}
          <KeyTerms unit={unit} />

          {/* CTA */}
          <div className="xenon-panel p-6 text-center">
            <p className="font-semibold">Ready to test yourself?</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Work through {unit.flashcards.length} flashcards or take a quiz for {unit.title}.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <button className="xenon-btn flex items-center gap-2" onClick={() => { setTab("flashcards"); setInFlashcards(true); }}>
                <Layers className="h-4 w-4" />
                Start Flashcards
              </button>
              <button className="xenon-btn-ghost flex items-center gap-2" onClick={() => { setTab("quiz"); setInQuiz(true); }}>
                <PenLine className="h-4 w-4" />
                Take Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "flashcards" && (
        <div className="xenon-panel p-6 sm:p-8">
          {inFlashcards ? (
            <FlashcardSession
              cards={unit.flashcards}
              shuffle={shuffleEnabled}
              onExit={() => { setInFlashcards(false); setTab("notes"); }}
            />
          ) : (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="h-16 w-16 rounded-2xl bg-[var(--accent)]/20 flex items-center justify-center">
                <Layers className="h-8 w-8 text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-xl font-bold">{unit.flashcards.length} flashcards</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Flip each card to reveal the answer, then mark whether you know it or still need practice. Weak cards resurface at the end.
                </p>
              </div>
              
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={shuffleEnabled}
                  onChange={(e) => setShuffleEnabled(e.target.checked)}
                  className="rounded border-[var(--border)] bg-[var(--panel)] text-[var(--accent)]"
                />
                <Shuffle className="h-4 w-4 text-[var(--muted)]" />
                <span className="text-[var(--muted)]">Shuffle cards</span>
              </label>

              <button className="xenon-btn flex items-center gap-2" onClick={() => setInFlashcards(true)}>
                <Sparkles className="h-4 w-4" />
                Start Session
              </button>
            </div>
          )}
        </div>
      )}

      {tab === "quiz" && (
        <div className="xenon-panel p-6 sm:p-8">
          {inQuiz ? (
            <QuizMode
              cards={unit.flashcards}
              onExit={() => { setInQuiz(false); setTab("notes"); }}
            />
          ) : (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="h-16 w-16 rounded-2xl bg-[var(--accent)]/20 flex items-center justify-center">
                <PenLine className="h-8 w-8 text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-xl font-bold">Written Quiz</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Test your knowledge by typing answers to {unit.flashcards.length} questions. Self-mark your answers to track progress.
                </p>
              </div>
              <button className="xenon-btn flex items-center gap-2" onClick={() => setInQuiz(true)}>
                <Sparkles className="h-4 w-4" />
                Start Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ─── Topic card grid ───────────────────────────────────────────────────────────

function TopicCard({ unit, onClick }) {
  return (
    <motion.button
      className="xenon-panel group w-full overflow-hidden rounded-3xl text-left transition-all hover:shadow-2xl hover:shadow-[var(--accent-soft)]/20 border-none bg-gradient-to-br from-[var(--panel)] to-[var(--bg-soft)] p-1"
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.01 }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="rounded-[22px] bg-[var(--panel)] p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-white/5" style={{ color: unit.accent }}>
            {unit.unit}
          </span>
          <div className="h-8 w-8 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
        
        <h3 className="text-xl font-black tracking-tight leading-tight mb-3 group-hover:text-[var(--accent)] transition-colors">{unit.title}</h3>
        
        <p className="text-xs text-[var(--muted)] font-medium line-clamp-2 leading-relaxed flex-1">
          {unit.notes[0]?.body}
        </p>
        
        <div className="mt-6 pt-6 border-t border-[var(--border)] flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--muted)]">
            <FileText className="h-3 w-3" />
            {unit.notes.length} SECTIONS
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--muted)]">
            <Layers className="h-3 w-3" />
            {unit.flashcards.length} CARDS
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Search Component ──────────────────────────────────────────────────────────

function TopicSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const matches = [];

    THEORY_UNITS.forEach((unit) => {
      // Search in unit title
      if (unit.title.toLowerCase().includes(lowerQuery)) {
        matches.push({ type: "unit", unit, text: unit.title });
      }

      // Search in notes
      unit.notes.forEach((note) => {
        if (note.heading.toLowerCase().includes(lowerQuery) || 
            note.body.toLowerCase().includes(lowerQuery)) {
          matches.push({ 
            type: "note", 
            unit, 
            text: note.heading,
            preview: note.body.slice(0, 60) + "..."
          });
        }
      });

      // Search in flashcards
      unit.flashcards.forEach((card) => {
        if (card.q.toLowerCase().includes(lowerQuery) || 
            card.a.toLowerCase().includes(lowerQuery)) {
          matches.push({ 
            type: "flashcard", 
            unit, 
            text: card.q,
            preview: card.a.slice(0, 60) + "..."
          });
        }
      });
    });

    setResults(matches.slice(0, 8));
  }, [query]);

  const getTypeIcon = (type) => {
    switch (type) {
      case "unit": return <BookMarked className="h-3 w-3" />;
      case "note": return <FileText className="h-3 w-3" />;
      case "flashcard": return <Layers className="h-3 w-3" />;
      default: return <BookOpen className="h-3 w-3" />;
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
        <input
          type="text"
          placeholder="Search topics, notes, flashcards..."
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] pl-11 pr-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-[200] rounded-xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
          {results.map((result, i) => (
            <button
              key={i}
              className="w-full p-4 text-left hover:bg-[var(--accent-soft)] transition flex items-start gap-4 border-b border-[var(--border)] last:border-b-0"
              onClick={() => {
                onSelect(result.unit.id);
                setQuery("");
                setResults([]);
              }}
            >
              <span className="flex items-center gap-2 text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-widest bg-white/10" style={{ color: result.unit.accent }}>
                {getTypeIcon(result.type)}
                {result.type}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{result.text}</p>
                {result.preview && (
                  <p className="text-[10px] text-[var(--muted)] font-medium truncate mt-0.5">{result.preview}</p>
                )}
                <p className="text-[10px] font-black uppercase tracking-widest mt-2" style={{ color: result.unit.accent }}>{result.unit.title}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main TheoryPanel ──────────────────────────────────────────────────────────

export default function TheoryPanel() {
  const [selectedId, setSelectedId] = useState(null);
  const [savedProgress, setSavedProgress] = useState(() => loadProgress());

  const selected = THEORY_UNITS.find((u) => u.id === selectedId);

  const continueUnit = useMemo(() => {
    const entries = Object.entries(savedProgress).filter(([, p]) => p.lastSection);
    if (!entries.length) return null;
    const last = entries.sort((a, b) => {
      const idxA = THEORY_UNITS.findIndex((u) => u.id === a[0]);
      const idxB = THEORY_UNITS.findIndex((u) => u.id === b[0]);
      return idxB - idxA;
    })[0];
    return THEORY_UNITS.find((u) => u.id === last[0]) || null;
  }, [savedProgress]);

  if (selected) {
    return <TopicDetail unit={selected} onBack={() => setSelectedId(null)} />;
  }

  const totalCards = THEORY_UNITS.reduce((sum, u) => sum + u.flashcards.length, 0);
  const totalNotes = THEORY_UNITS.reduce((sum, u) => sum + u.notes.length, 0);

  return (
    <motion.div className="space-y-6 pb-20" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="xenon-panel p-8 sm:p-12 relative z-[100]">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <GraduationCap className="h-64 w-64" />
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="xenon-pill bg-[var(--accent-soft)] text-[var(--accent)] border-none px-4 py-1.5 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                OCR · AQA · EDEXCEL
              </span>
              <span className="xenon-pill bg-[var(--accent-soft)] text-[var(--accent)] border-none px-4 py-1.5">GCSE Curriculum 2024</span>
            </div>
            <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl leading-[1.1]">The Theory Hub</h2>
            <p className="mt-4 text-lg text-[var(--muted)] font-medium leading-relaxed">
              Master the core units of GCSE Computer Science with precision-engineered notes and interactive flashcards. Designed for final exam success.
            </p>
            
            <div className="mt-10 flex flex-wrap gap-10">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] border border-[var(--accent)]/20">
                  <BookMarked className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-black">{THEORY_UNITS.length}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">Core Units</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
                  <Layers className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-black">{totalCards}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">Flashcards</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[var(--success)]/10 flex items-center justify-center text-[var(--success)] border border-[var(--success)]/20">
                  <Check className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-black">100%</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">GCSE Covered</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 relative z-10 max-w-2xl">
          <TopicSearch onSelect={setSelectedId} />
        </div>
      </div>

      {continueUnit && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="xenon-panel p-5 relative overflow-hidden cursor-pointer group"
          onClick={() => setSelectedId(continueUnit.id)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-soft)] via-transparent to-transparent pointer-events-none" />
          <div className="relative flex items-center gap-4 flex-wrap">
            <div className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{ background: `${continueUnit.accent}20` }}>
              <Play className="h-5 w-5" style={{ color: continueUnit.accent }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">Continue where you left off</p>
              <p className="font-bold text-sm mt-0.5 group-hover:text-[var(--accent)] transition-colors">{continueUnit.title}</p>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                Last section: {savedProgress[continueUnit.id]?.lastSection}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors shrink-0" />
          </div>
        </motion.div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 relative z-0">
        {THEORY_UNITS.map((unit) => {
          const uProg = savedProgress[unit.id];
          const doneCount = uProg?.completedSections?.length || 0;
          return (
            <div key={unit.id} className="relative">
              {doneCount > 0 && (
                <span className="absolute -top-1 -right-1 z-10 text-[9px] font-black bg-[var(--success)]/20 text-[var(--success)] border border-[var(--success)]/30 px-2 py-0.5 rounded-full">
                  {doneCount}/{unit.notes.length}
                </span>
              )}
              <TopicCard unit={unit} onClick={() => setSelectedId(unit.id)} />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
