import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, FileText, CheckCircle, Award, Code, HelpCircle, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAppStore } from "../store/useAppStore";

const PAST_PAPERS = [
  {
    id: "ocr-j277-01-2022",
    board: "OCR GCSE (J277)",
    paper: "Paper 1: Computer Systems (2022)",
    type: "theory",
    questions: [
      {
        id: "q1",
        num: "1(a)",
        text: "State the purpose of the CPU (Central Processing Unit) in a computer system.",
        answer: "To fetch, decode and execute instructions stored in memory.",
        options: [
          "To permanently store all files and operating system files.",
          "To fetch, decode and execute instructions stored in memory.",
          "To connect external peripheral devices like keyboards and printers.",
          "To render high-quality graphical outputs to the computer monitor."
        ],
        points: 1
      },
      {
        id: "q2",
        num: "1(b)",
        text: "Explain how cache memory is used by the CPU.",
        answer: "Cache memory is extremely fast RAM situated close to or on the CPU chip. It stores frequently used instructions so the CPU does not have to retrieve them from slower RAM.",
        points: 2
      },
      {
        id: "q3",
        num: "2(a)",
        text: "Which of the following is a key characteristic of secondary storage?",
        answer: "It is non-volatile (retains data when power is lost).",
        options: [
          "It has direct high-speed access to the CPU registers.",
          "It is volatile (loses data when power is lost).",
          "It is non-volatile (retains data when power is lost).",
          "It is situated inside the CPU ALU."
        ],
        points: 1
      }
    ]
  },
  {
    id: "ocr-j277-02-2022",
    board: "OCR GCSE (J277)",
    paper: "Paper 2: Computational Thinking, Algorithms & Programming (2022)",
    type: "programming",
    questions: [
      {
        id: "pq1",
        num: "1",
        text: "A teacher wants a Python script to check if a student has passed their exam. The pass mark is 50. Write a program that asks the user for their mark, and outputs 'Pass' if the mark is 50 or above, or 'Fail' if it is under 50.",
        codeTemplate: `# OCR GCSE Paper 2 Programming Task\n# Write a script to request a student mark and output 'Pass' or 'Fail'\n\nmark = int(input("Enter your exam mark: "))\n\nif mark >= 50:\n    print("Pass")\nelse:\n    print("Fail")\n`,
        points: 3
      },
      {
        id: "pq2",
        num: "2",
        text: "Write a program that uses a loop to print all even numbers from 2 to 20 inclusive.",
        codeTemplate: `# OCR GCSE Paper 2 Loop Task\n# Print even numbers from 2 to 20 inclusive\n\nfor i in range(2, 21, 2):\n    print(i)\n`,
        points: 4
      }
    ]
  }
];

export default function PastPapersPanel({ onNavigateToIde }) {
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [selectedTab, setSelectedTab] = useState("theory"); // theory | programming
  const [answers, setAnswers] = useState({});
  const [showSchemes, setShowSchemes] = useState({});
  const [graded, setGraded] = useState(false);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const setActiveProjectCode = useAppStore((s) => s.setActiveProjectCode);

  const handleSelectPaper = (paper) => {
    setSelectedPaper(paper);
    setAnswers({});
    setShowSchemes({});
    setGraded(false);
    setScore(0);
  };

  const handleOptionSelect = (qId, option) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleTextAnswerChange = (qId, text) => {
    setAnswers((prev) => ({ ...prev, [qId]: text }));
  };

  const toggleScheme = (qId) => {
    setShowSchemes((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const submitTheory = () => {
    let earned = 0;
    let total = 0;
    selectedPaper.questions.forEach((q) => {
      total += q.points;
      if (q.options) {
        if (answers[q.id] === q.answer) {
          earned += q.points;
        }
      } else {
        // Text answers require manual self-marking comparison
        if (answers[q.id]?.trim()) {
          earned += q.points; // Give full mark if they wrote anything for mock grading
        }
      }
    });
    setScore(earned);
    setTotalPoints(total);
    setGraded(true);
  };

  const loadIntoIde = (q) => {
    setActiveProjectCode(q.codeTemplate);
    if (onNavigateToIde) {
      onNavigateToIde("code");
    }
  };

  // FUTURE PREMIUM: Lockeable past papers schema mapping
  // const isProUser = profile?.plan === 'premium'; // FUTURE PREMIUM FLAG

  return (
    <div className="space-y-6 pb-12">
      <motion.section 
        className="xenon-panel p-8 sm:p-10 relative overflow-hidden bg-gradient-to-br from-[#0d1726] to-transparent border-none"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <BookOpen className="h-48 w-48" />
        </div>
        <div className="relative z-10">
          <span className="xenon-pill bg-[var(--accent-soft)] text-[var(--accent)] border-none">GCSE Revision Hub</span>
          <h2 className="text-3xl font-black mt-4 tracking-tight sm:text-5xl">Exam Practice & Past Papers</h2>
          <p className="xenon-subtitle mt-2 text-sm text-[var(--muted)] max-w-xl">
            Practice actual GCSE Computer Science past papers inside Xenon Code. Run programming questions directly inside the Python IDE!
          </p>
        </div>
      </motion.section>

      {!selectedPaper ? (
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-[var(--border)] pb-2">
            <button
              onClick={() => setSelectedTab("theory")}
              className={`px-4 py-2 text-sm font-black transition-all ${
                selectedTab === "theory"
                  ? "text-[var(--accent)] border-b-2 border-[var(--accent)]"
                  : "text-[var(--muted)] hover:text-[var(--fg)]"
              }`}
            >
              Theory Papers
            </button>
            <button
              onClick={() => setSelectedTab("programming")}
              className={`px-4 py-2 text-sm font-black transition-all ${
                selectedTab === "programming"
                  ? "text-[var(--accent)] border-b-2 border-[var(--accent)]"
                  : "text-[var(--muted)] hover:text-[var(--fg)]"
              }`}
            >
              Programming Practical Papers
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {PAST_PAPERS.filter((p) => p.type === selectedTab).map((paper) => (
              <motion.div
                key={paper.id}
                className="xenon-panel p-6 hover:border-[var(--accent)] transition-all cursor-pointer flex flex-col justify-between"
                onClick={() => handleSelectPaper(paper)}
                whileHover={{ y: -3 }}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="xenon-pill text-[10px] uppercase font-black tracking-widest">{paper.board}</span>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Free Access
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mt-4 leading-tight">{paper.paper}</h3>
                  <p className="text-xs text-[var(--muted)] mt-2">
                    {paper.type === "theory" 
                      ? "Multiple-choice & short answer theory questions with immediate self-marking schemes." 
                      : "GCSE Python algorithms that you can immediately import and solve inside the Live IDE."}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4">
                  <span className="text-xs text-[var(--muted)] font-mono">{paper.questions.length} Questions</span>
                  <span className="text-xs font-bold text-[var(--accent)] flex items-center gap-1 group">
                    Start Revision <Award className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="xenon-panel p-6 bg-gradient-to-br from-[var(--panel-soft)] to-transparent flex items-center gap-4">
            <AlertCircle className="h-8 w-8 text-[var(--accent)] shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Note on Premium Upgrades</p>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                {/* FUTURE PREMIUM NOTE: In the commercial version, the top 20 past papers and specimen papers from AQA/Edexcel/OCR are locked behind the School Max & Pro Student subscriptions. */}
                Additional papers J277/01 & J277/02 from AQA/Edexcel/OCR are being loaded. Stay tuned for upcoming exam spec updates!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedPaper(null)}
              className="text-xs font-black uppercase tracking-widest text-[var(--muted)] hover:text-[var(--accent)] transition"
            >
              ← Back to Hub
            </button>
            <span className="xenon-badge">{selectedPaper.paper}</span>
          </div>

          {/* Theory Paper Revision */}
          {selectedPaper.type === "theory" && (
            <div className="space-y-6">
              {selectedPaper.questions.map((q) => (
                <div key={q.id} className="xenon-panel p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="xenon-pill bg-[var(--accent-soft)] text-[var(--accent)] font-bold text-xs">
                      Question {q.num}
                    </span>
                    <span className="text-xs text-[var(--muted)] font-semibold">{q.points} Mark{q.points > 1 ? "s" : ""}</span>
                  </div>

                  <p className="text-base font-semibold leading-relaxed">{q.text}</p>

                  {/* Multiple Choice Options */}
                  {q.options ? (
                    <div className="grid gap-3 mt-3">
                      {q.options.map((opt) => {
                        const isSelected = answers[q.id] === opt;
                        const isCorrect = opt === q.answer;
                        return (
                          <button
                            key={opt}
                            onClick={() => !graded && handleOptionSelect(q.id, opt)}
                            className={`p-3 rounded-xl border text-left text-sm font-medium transition-all ${
                              graded 
                                ? isCorrect 
                                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                                  : isSelected
                                    ? "border-red-500 bg-red-500/10 text-red-300"
                                    : "border-[var(--border)] opacity-60"
                                : isSelected
                                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-white"
                                  : "border-[var(--border)] hover:bg-white/5"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    /* Free Text Answer */
                    <div className="space-y-3">
                      <textarea
                        className="xenon-input w-full"
                        rows={3}
                        disabled={graded}
                        placeholder="Write your explanation here..."
                        value={answers[q.id] || ""}
                        onChange={(e) => handleTextAnswerChange(q.id, e.target.value)}
                      />
                    </div>
                  )}

                  {/* Reveal Mark Scheme button */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => toggleScheme(q.id)}
                      className="text-xs font-black uppercase tracking-wider text-[var(--muted)] hover:text-[var(--fg)] flex items-center gap-1.5"
                    >
                      {showSchemes[q.id] ? (
                        <>
                          <EyeOff className="h-4 w-4" /> Hide Mark Scheme
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" /> Show Mark Scheme
                        </>
                      )}
                    </button>
                  </div>

                  <AnimatePresence>
                    {showSchemes[q.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-400 font-mono leading-relaxed"
                      >
                        <p className="font-bold text-[10px] uppercase tracking-wider mb-1">OCR Official Mark Scheme Guidance:</p>
                        {q.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {!graded ? (
                <button className="xenon-btn w-full h-14" onClick={submitTheory}>
                  Submit & Self-Grade Exam Paper
                </button>
              ) : (
                <motion.div 
                  className="xenon-panel p-8 text-center bg-gradient-to-br from-[#0d1726] to-transparent space-y-4"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                >
                  <Trophy className="h-12 w-12 text-amber-400 mx-auto" />
                  <div>
                    <h3 className="text-2xl font-black">Self-Grading Complete!</h3>
                    <p className="text-4xl font-black mt-2 text-[var(--accent)]">{score} / {totalPoints}</p>
                    <p className="text-xs text-[var(--muted)] mt-1">
                      Excellent effort! Go back and compare any short-answers with the official OCR Mark Scheme to fine-tune your final score.
                    </p>
                  </div>
                  <button 
                    className="xenon-btn-subtle px-8 h-12"
                    onClick={() => {
                      setGraded(false);
                      setAnswers({});
                    }}
                  >
                    Reset and Try Again
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {/* Programming Paper Revision */}
          {selectedPaper.type === "programming" && (
            <div className="space-y-6">
              {selectedPaper.questions.map((q) => (
                <div key={q.id} className="xenon-panel p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="xenon-pill bg-[var(--accent-soft)] text-[var(--accent)] font-bold text-xs">
                      Question {q.num}
                    </span>
                    <span className="text-xs text-[var(--muted)] font-semibold">{q.points} Marks</span>
                  </div>

                  <p className="text-base font-semibold leading-relaxed">{q.text}</p>

                  <div className="rounded-xl border border-[var(--border)] bg-[#07101a] p-4 font-mono text-xs text-sky-300 leading-relaxed overflow-x-auto">
                    <pre>{q.codeTemplate}</pre>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      className="xenon-btn flex items-center gap-2"
                      onClick={() => loadIntoIde(q)}
                    >
                      <Code className="h-4 w-4" /> Import and Solve in Live IDE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
