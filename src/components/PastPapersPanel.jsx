import { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { hasFeature } from "../lib/planFeatures";
import { Lock, BookOpen, FileText, CheckCircle, Award, Code, HelpCircle, Eye, EyeOff, AlertCircle, Trophy, Download, ExternalLink } from "lucide-react";
import { PAST_PAPER_DOWNLOADS, PMT_BASE } from "../lib/pastPaperDownloads";
import { motion, AnimatePresence } from "framer-motion";

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
        points: 2
      },
      {
        id: "pq3",
        num: "3",
        text: "Write a program that stores a list of three subject names and prints each one on a new line.",
        codeTemplate: `# OCR GCSE Paper 2 List Task\nsubjects = ["Computer Science", "Maths", "English"]\nfor subject in subjects:\n    print(subject)\n`,
        points: 2
      }
    ]
  },
  {
    id: "ocr-j277-01-2023",
    board: "OCR GCSE (J277)",
    paper: "Paper 1: Computer Systems (2023) — Pro",
    type: "theory",
    proOnly: true,
    questions: [
      {
        id: "q1",
        num: "1(a)",
        text: "State two differences between RAM and ROM.",
        answer: "RAM is volatile and used for running programs; ROM is non-volatile and stores bootstrap/BIOS.",
        points: 2
      },
      {
        id: "q2",
        num: "2(a)",
        text: "Which topology connects every device to a central switch?",
        answer: "Star topology.",
        options: ["Mesh", "Star", "Bus", "Ring"],
        points: 1
      },
      {
        id: "q3",
        num: "3(a)",
        text: "Explain one way a firewall protects a network.",
        answer: "It monitors traffic and blocks unauthorised or suspicious packets from entering the network.",
        points: 2
      },
      {
        id: "q4",
        num: "4(a)",
        text: "State what is meant by embedded systems.",
        answer: "A computer system built into another device to perform a dedicated function.",
        points: 2
      },
      {
        id: "q5",
        num: "5(a)",
        text: "Which layer of the TCP/IP model handles routing?",
        answer: "Network layer",
        options: ["Application", "Transport", "Network layer", "Link"],
        points: 1
      },
      {
        id: "q6",
        num: "6(a)",
        text: "Give one ethical issue related to AI.",
        answer: "Bias in training data leading to unfair decisions.",
        points: 2
      }
    ]
  },
  {
    id: "ocr-j277-02-2023",
    board: "OCR GCSE (J277)",
    paper: "Paper 2: Programming (2023) — Pro",
    type: "programming",
    proOnly: true,
    questions: [
      {
        id: "pq1",
        num: "1",
        text: "Write a program that asks for a username and prints 'Welcome' followed by the name.",
        codeTemplate: `name = input("Enter username: ")\nprint("Welcome", name)\n`,
        points: 3
      },
      {
        id: "pq2",
        num: "2",
        text: "Write a program that counts from 1 to 10 using a while loop.",
        codeTemplate: `n = 1\nwhile n <= 10:\n    print(n)\n    n = n + 1\n`,
        points: 3
      },
      {
        id: "pq3",
        num: "3",
        text: "Write a program that stores a list of scores [12, 45, 30] and prints the average.",
        codeTemplate: `scores = [12, 45, 30]\nprint(sum(scores) / len(scores))\n`,
        points: 3
      },
      {
        id: "pq4",
        num: "4",
        text: "Write a program that keeps asking for a password until the user enters 'gcse'.",
        codeTemplate: `pwd = ""\nwhile pwd != "gcse":\n    pwd = input("Password: ")\nprint("Access granted")\n`,
        points: 4
      }
    ]
  },
  {
    id: "aqa-8525-01-2022",
    board: "AQA GCSE (8525)",
    paper: "Paper 1: Specimen Theory — Pro",
    type: "theory",
    proOnly: true,
    questions: [
      {
        id: "q1",
        num: "1",
        text: "What is the purpose of the ALU?",
        answer: "To perform arithmetic and logical operations.",
        options: [
          "To store the operating system permanently.",
          "To perform arithmetic and logical operations.",
          "To display output on the monitor.",
          "To connect the computer to the internet."
        ],
        points: 1
      },
      {
        id: "q2",
        num: "2",
        text: "Define the term 'algorithm'.",
        answer: "A step-by-step method to solve a problem.",
        points: 2
      },
      {
        id: "q3",
        num: "3",
        text: "State one advantage of using a high-level language.",
        answer: "Easier for humans to read, write and maintain; portable across different systems.",
        points: 1
      },
      {
        id: "q4",
        num: "4",
        text: "What is decomposition in computational thinking?",
        answer: "Breaking a complex problem into smaller sub-problems.",
        points: 2
      },
      {
        id: "q5",
        num: "5",
        text: "Which protocol is used to send email?",
        answer: "SMTP",
        options: ["HTTP", "FTP", "SMTP", "DNS"],
        points: 1
      },
      {
        id: "q6",
        num: "6",
        text: "State one difference between open source and proprietary software.",
        answer: "Open source code is freely available; proprietary is licensed and restricted.",
        points: 2
      }
    ]
  },
  {
    id: "edexcel-1cp2-01-2022",
    board: "Edexcel GCSE (1CP2)",
    paper: "Paper 1: Principles of Computer Science (2022) — Pro",
    type: "theory",
    proOnly: true,
    questions: [
      {
        id: "q1",
        num: "1(a)",
        text: "Which component performs calculations and logical operations?",
        answer: "ALU (Arithmetic Logic Unit).",
        options: ["Control Unit", "ALU (Arithmetic Logic Unit).", "Cache", "Hard drive"],
        points: 1
      },
      {
        id: "q2",
        num: "1(b)",
        text: "What is meant by volatile memory?",
        answer: "Memory that loses its contents when power is turned off.",
        points: 2
      },
      {
        id: "q3",
        num: "2(a)",
        text: "Give one example of social engineering.",
        answer: "Phishing (fake emails/websites to steal credentials).",
        points: 1
      }
    ]
  },
  {
    id: "edexcel-1cp2-02-2022",
    board: "Edexcel GCSE (1CP2)",
    paper: "Paper 2: Application of Computational Thinking (2022) — Pro",
    type: "programming",
    proOnly: true,
    questions: [
      {
        id: "pq1",
        num: "1",
        text: "Write a program that asks for two numbers and prints their sum.",
        codeTemplate: `a = int(input("First number: "))\nb = int(input("Second number: "))\nprint(a + b)\n`,
        points: 3
      },
      {
        id: "pq2",
        num: "2",
        text: "Write a program that prints numbers 1 to 5 using a for loop.",
        codeTemplate: `for n in range(1, 6):\n    print(n)\n`,
        points: 2
      },
      {
        id: "pq3",
        num: "3",
        text: "Write a program that checks if a number is odd or even.",
        codeTemplate: `n = int(input("Enter a number: "))\nif n % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")\n`,
        points: 3
      }
    ]
  },
  {
    id: "ocr-j277-01-2021",
    board: "OCR GCSE (J277)",
    paper: "Paper 1: Computer Systems (2021) — Pro",
    type: "theory",
    proOnly: true,
    questions: [
      {
        id: "q1",
        num: "1",
        text: "What is the purpose of the Control Unit?",
        answer: "To decode instructions and send control signals to coordinate components.",
        points: 2
      },
      {
        id: "q2",
        num: "2",
        text: "Which storage type is non-volatile?",
        answer: "Secondary storage (e.g. SSD/HDD).",
        options: ["RAM", "Cache", "Secondary storage (e.g. SSD/HDD).", "Registers"],
        points: 1
      },
      {
        id: "q3",
        num: "3",
        text: "Define bandwidth in a network context.",
        answer: "The amount of data that can be transmitted in a given time.",
        points: 2
      }
    ]
  },
  {
    id: "aqa-8525-02-2022",
    board: "AQA GCSE (8525)",
    paper: "Paper 2: Programming Skills (Specimen) — Pro",
    type: "programming",
    proOnly: true,
    questions: [
      {
        id: "pq1",
        num: "1",
        text: "Write a program that converts a temperature from Celsius to Fahrenheit (F = C × 1.8 + 32).",
        codeTemplate: `c = float(input("Celsius: "))\nf = c * 1.8 + 32\nprint(f)\n`,
        points: 3
      },
      {
        id: "pq2",
        num: "2",
        text: "Write a program that asks for a password and prints 'Access granted' if it equals 'gcse'.",
        codeTemplate: `pwd = input("Password: ")\nif pwd == "gcse":\n    print("Access granted")\nelse:\n    print("Denied")\n`,
        points: 3
      },
      {
        id: "pq3",
        num: "3",
        text: "Write a program that finds the largest number in a list [4, 9, 2, 7].",
        codeTemplate: `nums = [4, 9, 2, 7]\nlargest = nums[0]\nfor n in nums:\n    if n > largest:\n        largest = n\nprint(largest)\n`,
        points: 4
      }
    ]
  }
];

const FREE_PAPER_IDS = ["ocr-j277-01-2022", "ocr-j277-02-2022"];

function isPaperLocked(paper, plan) {
  if (hasFeature(plan, "allPastPapers")) return false;
  if (paper.proOnly) return true;
  return !FREE_PAPER_IDS.includes(paper.id);
}

export default function PastPapersPanel({ onNavigateToIde }) {
  const profilePlan = useAppStore((s) => s.profile?.plan);
  const setShowUpgradePrompt = useAppStore((s) => s.setShowUpgradePrompt);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [selectedTab, setSelectedTab] = useState("theory"); // theory | programming | downloads
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
    if (!selectedPaper?.questions?.length) return;
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
    requestAnimationFrame(() => {
      document.getElementById("theory-grade-results")?.scrollIntoView({ behaviour: "smooth", block: "nearest" });
    });
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
              Programming Papers
            </button>
            <button
              onClick={() => setSelectedTab("downloads")}
              className={`px-4 py-2 text-sm font-black transition-all flex items-center gap-1.5 ${
                selectedTab === "downloads"
                  ? "text-[var(--accent)] border-b-2 border-[var(--accent)]"
                  : "text-[var(--muted)] hover:text-[var(--fg)]"
              }`}
            >
              <Download className="h-4 w-4" /> Download past papers
            </button>
          </div>

          {selectedTab === "downloads" ? (
            <div className="space-y-6">
              <p className="text-sm text-[var(--muted)]">
                Official PDFs and mark schemes from{" "}
                <a href={PMT_BASE} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] font-bold hover:underline">
                  Physics &amp; Maths Tutor — GCSE Computer Science
                </a>
                . Open a board, then choose the year and paper you need.
              </p>
              {PAST_PAPER_DOWNLOADS.map((group) => (
                <div key={group.board} className="xenon-panel p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h3 className="text-lg font-black">{group.board}</h3>
                    <a
                      href={group.hubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="xenon-btn-subtle text-xs h-9 flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" /> Board hub
                    </a>
                  </div>
                  <ul className="space-y-2">
                    {group.papers.map((p) => (
                      <li key={p.url}>
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-[var(--accent)] hover:underline flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4 shrink-0" />
                          {p.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {PAST_PAPERS.filter((p) => p.type === selectedTab).map((paper) => {
            const isLocked = isPaperLocked(paper, profilePlan);
            return (
              <motion.div
                key={paper.id}
                className={`xenon-panel p-6 hover:border-[var(--accent)] transition-all flex flex-col justify-between ${isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={() => {
                  if (isLocked) {
                    setShowUpgradePrompt(true);
                  } else {
                    handleSelectPaper(paper);
                  }
                }}
                whileHover={isLocked ? {} : { y: -3 }}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="xenon-pill text-[10px] uppercase font-black tracking-widest">{paper.board}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isLocked ? "text-[var(--warning)] bg-[var(--warning-soft)]" : paper.proOnly ? "text-purple-400 bg-purple-500/10" : "text-[var(--success)] bg-[var(--success)]/10"
                    }`}>
                      {isLocked ? "Pro required" : paper.proOnly ? "Pro" : "Free"}
                    </span>
                    {isLocked && (
                      <Lock className="h-5 w-5 text-[var(--warning)]" />
                    )}
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
            );
            })}
          </div>
          )}

          <div className="xenon-panel p-6 bg-gradient-to-br from-[var(--panel-soft)] to-transparent flex items-center gap-4">
            <AlertCircle className="h-8 w-8 text-[var(--accent)] shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Note on Premium Upgrades</p>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                Free includes one OCR theory paper. Upgrade to Pro in Account Settings to unlock 2023 OCR papers, AQA specimen papers, and all programming papers.
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
                                  ? "border-[var(--success)] bg-[var(--success)]/10 text-[var(--success)]"
                                  : isSelected
                                    ? "border-[var(--danger)] bg-[var(--danger)]/10 text-[var(--danger)]"
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
                        className="p-4 rounded-xl border border-[var(--success)]/20 bg-[var(--success)]/5 text-xs text-[var(--success)] font-mono leading-relaxed"
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
                <div
                  id="theory-grade-results"
                  className="xenon-panel p-8 text-center bg-gradient-to-br from-[#0d1726] to-[var(--panel)] border border-[var(--accent)]/30 space-y-4"
                >
                  <Trophy className="h-12 w-12 text-[var(--warning)] mx-auto" aria-hidden />
                  <h3 className="text-2xl font-black text-[var(--fg)]">Self-Grading Complete!</h3>
                  <p className="text-4xl font-black text-[var(--accent)]">
                    {score} / {totalPoints}
                  </p>
                  <p className="text-sm text-[var(--muted)] max-w-md mx-auto">
                    Excellent effort! Compare short-answers with the mark schemes above to refine your score.
                  </p>
                  <button
                    type="button"
                    className="xenon-btn-subtle px-8 h-12"
                    onClick={() => {
                      setGraded(false);
                      setAnswers({});
                      setShowSchemes({});
                    }}
                  >
                    Reset and Try Again
                  </button>
                </div>
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

                  <div className="rounded-xl border border-[var(--border)] bg-[#07101a] p-4 font-mono text-xs text-[var(--accent)] leading-relaxed overflow-x-auto">
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
