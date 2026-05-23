import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import { getPyodideWorker, sendInputToWorker } from "../lib/pyodide";
import { translatePythonError } from "../lib/errorTranslator";
import { useAppStore } from "../store/useAppStore";
import PlanBadge from "./PlanBadge";
import { isProOrMax, isMax, hasFeature, normalizePlan } from "../lib/planFeatures";
import { Play, Save, FilePlus, Sparkles, Database, X, BookOpen, AlertCircle, Terminal, History, ArrowRight, FileText, Layers, Share2, Link } from "lucide-react";
import { GCSE_QUESTIONS } from "../lib/gcseQuestions";

const buildMonacoTheme = (monaco) => {
  monaco.editor.defineTheme("xenon-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#07101a",
      "editorCursor.foreground": "#4fb8ff",
      "editorLineNumber.foreground": "#61738b",
      "editorLineNumber.activeForeground": "#eef4ff",
      "editor.selectionBackground": "#173047",
    },
  });
  monaco.editor.defineTheme("xenon-light", {
    base: "vs",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#f7f9fc",
      "editorCursor.foreground": "#1e3a6e",
      "editor.selectionBackground": "#dce7ff",
    },
  });
  monaco.editor.defineTheme("cyberpunk", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "e879f9", fontStyle: "bold" },
      { token: "string", foreground: "2dd4bf" },
      { token: "number", foreground: "fb923c" }
    ],
    colors: {
      "editor.background": "#1e0b36",
      "editorCursor.foreground": "#e879f9",
      "editorLineNumber.foreground": "#8b5cf6",
      "editorLineNumber.activeForeground": "#f472b6",
      "editor.selectionBackground": "#3b0764",
    },
  });
  monaco.editor.defineTheme("oled", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#000000",
      "editorCursor.foreground": "#ffffff",
      "editorLineNumber.foreground": "#3f3f46",
      "editorLineNumber.activeForeground": "#ffffff",
      "editor.selectionBackground": "#27272a",
    },
  });
  monaco.editor.defineTheme("pink-glass", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#1f0f1c",
      "editorCursor.foreground": "#ec4899",
      "editorLineNumber.foreground": "#db2777",
      "editorLineNumber.activeForeground": "#f472b6",
      "editor.selectionBackground": "#4c0519",
    },
  });
};

function ErrorTranslatorButton({ rawError, sourceCode = "" }) {
  const [expanded, setExpanded] = useState(false);
  const [translation, setTranslation] = useState("");
  const plan = useAppStore((s) => normalizePlan(s.profile?.plan));
  const setShowUpgradePrompt = useAppStore((s) => s.setShowUpgradePrompt);
  const canExplain = hasFeature(plan, "aiErrorExplain");

  const handleTranslate = () => {
    if (!canExplain) {
      setShowUpgradePrompt(true);
      return;
    }
    setTranslation(translatePythonError(rawError, sourceCode));
    setExpanded((prev) => !prev);
  };

  return (
    <div className="w-full mt-1">
      <button
        type="button"
        onClick={handleTranslate}
        className="text-[10px] font-black uppercase tracking-wider bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/25 px-2 py-1 rounded-lg flex items-center gap-1.5 transition-all"
      >
        <Sparkles className="h-3 w-3" /> Explain with Xenon AI
        {!canExplain && (
          <span className="text-[8px] bg-amber-500/20 text-amber-200 border border-amber-500/30 px-1.5 py-0.5 rounded ml-1">
            PRO
          </span>
        )}
      </button>
      {expanded && translation && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-4 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] text-xs text-[var(--text)] leading-relaxed font-sans whitespace-pre-wrap"
        >
          <p className="font-black text-[10px] text-[var(--accent)] uppercase tracking-wider mb-2">Xenon GCSE AI — line-by-line</p>
          {translation}
        </motion.div>
      )}
    </div>
  );
}

export default function XenonIDE() {
  const editorRef = useRef(null);
  const projectIdRef = useRef(null);
  const [saveStatus, setSaveStatus] = useState("");
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("algo");
  const [variables, setVariables] = useState([]);
  const [showVariables, setShowVariables] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");

  const terminalInputRef = useRef(null);
  const terminalEndRef = useRef(null);

  const activeProject = useAppStore((s) => s.activeProject);
  const activeProjectId = activeProject?.id || "";
  const activeProjectTitle = activeProject?.title || "";
  
  const enrolledClass = useAppStore((s) => s.enrolledClass);
  const profile = useAppStore((s) => s.profile);
  const theme = useAppStore((s) => s.theme);
  const consoleLines = useAppStore((s) => s.consoleLines);
  
  // Actions
  const setActiveProjectCode = useAppStore((s) => s.setActiveProjectCode);
  const setConsoleLines = useAppStore((s) => s.setConsoleLines);
  const appendConsoleLine = useAppStore((s) => s.appendConsoleLine);
  const newProject = useAppStore((s) => s.newProject);
  const saveProject = useAppStore((s) => s.saveProject);
  const setActiveProjectTitle = useAppStore((s) => s.setActiveProjectTitle);
  const queuePracticeTime = useAppStore((s) => s.queuePracticeTime);
  const flushPracticeTime = useAppStore((s) => s.flushPracticeTime);

  const shareSnippet = useAppStore((s) => s.shareSnippet);
  const [shareStatus, setShareStatus] = useState("");
  const [showProSkins, setShowProSkins] = useState(false);
  const setProfileTheme = useAppStore((s) => s.setProfileTheme);
  const proTheme = profile?.profile_theme || "default";
  const [proFont, setProFont] = useState(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("xenon-pro-font") || "default";
    }
    return "default";
  });

  const handleSetProFont = (fontId) => {
    setProFont(fontId);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("xenon-pro-font", fontId);
    }
  };

  const monacoTheme = useMemo(() => {
    if (proTheme !== "default") return proTheme;
    const lightThemes = ["classic-light", "solarized", "pink", "blue"];
    return lightThemes.includes(theme) ? "xenon-light" : "xenon-dark";
  }, [theme, proTheme]);

  const activeFontFamily = useMemo(() => {
    if (proFont === "fira") return "'Fira Code', monospace";
    if (proFont === "comic") return "'Space Mono', monospace";
    return "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace";
  }, [proFont]);

  const editorOptions = useMemo(() => ({
    automaticLayout: true,
    minimap: { enabled: false },
    fontFamily: activeFontFamily,
    fontSize: 14,
    lineHeight: 22,
    fontLigatures: true,
    cursorBlinking: "smooth",
    cursorSmoothCaretAnimation: "on",
    smoothScrolling: true,
    scrollBeyondLastLine: false,
    wordWrap: "on",
    wrappingStrategy: "advanced",
    fixedOverflowWidgets: true,
    padding: { top: 12, bottom: 12 },
    scrollbar: {
      vertical: "auto",
      horizontal: "auto",
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10,
    },
  }), [activeFontFamily]);

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
    projectIdRef.current = activeProjectId;
  };



  useEffect(() => {
    if (isWaitingForInput) terminalInputRef.current?.focus();
  }, [isWaitingForInput]);

  useEffect(() => {
    if (!editorRef.current) return;
    if (activeProjectId === projectIdRef.current) return;
    
    projectIdRef.current = activeProjectId;
    const current = editorRef.current.getValue();
    const codeFromStore = useAppStore.getState().activeProject.code;
    if (current !== codeFromStore) {
      editorRef.current.setValue(codeFromStore);
    }
  }, [activeProjectId]);

  const handleTerminalKeyDown = (e) => {
    if (e.key === "Enter" && isWaitingForInput) {
      const value = terminalInput;
      appendConsoleLine({ type: "in", text: value });
      sendInputToWorker(value);
      setTerminalInput("");
    }
  };

  const runCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setConsoleLines([{ type: "sys", text: "Starting Python runtime..." }]);

    try {
      const { worker, workerReadyPromise } = getPyodideWorker();

      const handleMessage = (e) => {
        const { type, text, variables: newVars, error } = e.data;
        switch (type) {
          case "stdout":
            appendConsoleLine({ type: "out", text });
            break;
          case "stderr":
            appendConsoleLine({
              type: "err",
              text: text,
              raw: text,
            });
            break;
          case "stdin_request":
            setIsWaitingForInput(true);
            break;
          case "done":
            setVariables(newVars || []);
            setIsRunning(false);
            setIsWaitingForInput(false);
            worker.removeEventListener("message", handleMessage);
            break;
          case "error":
            appendConsoleLine({
              type: "err",
              text: error,
              raw: error,
            });
            setIsRunning(false);
            setIsWaitingForInput(false);
            worker.removeEventListener("message", handleMessage);
            break;
          default:
            break;
        }
      };

      worker.addEventListener("message", handleMessage);
      await workerReadyPromise;
      setConsoleLines([{ type: "sys", text: "Running..." }]);
      worker.postMessage({ type: "run", code: useAppStore.getState().activeProject.code, canUseTime });
    } catch (error) {
      setIsRunning(false);
      appendConsoleLine({ type: "err", text: "Worker Error: " + String(error) });
    }
  };

  const onSave = async () => {
    setSaveStatus("");
    try {
      await saveProject();
      setSaveStatus("Saved.");
    } catch (error) {
      setSaveStatus(error?.message || "Save failed.");
    }
  };

  const useChallenge = () => {
    const comment = `# Challenge\n# ${GCSE_QUESTIONS[challengeIndex]}`;
    const currentCode = useAppStore.getState().activeProject?.code || "";
    let newCode = "";
    if (currentCode.trim()) {
      if (currentCode.endsWith("\n\n")) {
        newCode = `${currentCode}${comment}`;
      } else if (currentCode.endsWith("\n")) {
        newCode = `${currentCode}\n${comment}`;
      } else {
        newCode = `${currentCode}\n\n${comment}`;
      }
    } else {
      newCode = comment;
    }
    setActiveProjectCode(newCode);
    if (editorRef.current) {
      editorRef.current.setValue(newCode);
    }
    setShowChallenge(false);
  };

  useEffect(() => {
    if (profile?.role !== "student" || !enrolledClass?.id) return undefined;
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") queuePracticeTime(15);
    }, 15000);
    const flushIfHidden = () => {
      if (document.visibilityState === "hidden") flushPracticeTime();
    };
    document.addEventListener("visibilitychange", flushIfHidden);
    window.addEventListener("beforeunload", flushPracticeTime);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", flushIfHidden);
      window.removeEventListener("beforeunload", flushPracticeTime);
      flushPracticeTime();
    };
  }, [profile?.role, enrolledClass?.id, queuePracticeTime, flushPracticeTime]);

  const setShowUpgradePrompt = useAppStore((s) => s.setShowUpgradePrompt);
  const userIsPro = isProOrMax(profile?.plan);
  const userIsMax = isMax(profile?.plan);
  const canUseProSkins = hasFeature(profile?.plan, "premiumIdeSkins");
  const canUseTime = hasFeature(profile?.plan, "timeModule");

  const openProSkins = () => {
    if (!canUseProSkins) {
      setShowUpgradePrompt(true);
      return;
    }
    setShowProSkins(true);
  };

  return (
    <div className="space-y-4">
      {userIsPro && (
        <div className={`xenon-panel px-5 py-3 flex flex-wrap items-center justify-between gap-3 border ${userIsMax ? "border-violet-400/30 bg-gradient-to-r from-violet-500/10 to-amber-500/5" : "border-amber-400/30 bg-gradient-to-r from-amber-500/10 to-transparent"}`}>
          <div className="flex items-center gap-3">
            <PlanBadge plan={profile?.plan} size="md" showGlow />
            <p className="text-sm font-bold text-amber-200/90">
              {userIsMax
                ? "Max plan — includes all Pro features plus teacher class tools."
                : "Pro plan active — unlimited projects, full past papers, extended theory & IDE skins."}
            </p>
          </div>
        </div>
      )}
      <motion.section className="xenon-panel p-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 flex-wrap">
              Python IDE
              {userIsPro && <PlanBadge plan={profile?.plan} size="sm" />}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Write code on the left and see the result on the right.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="xenon-btn flex items-center gap-2 px-5" onClick={runCode} disabled={isRunning}>
              {isRunning ? <History className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
              {isRunning ? "Running..." : "Run Code"}
            </button>
            <button className="xenon-btn-ghost flex items-center gap-2" onClick={() => setShowVariables((v) => !v)}>
              <Database className="h-4 w-4" />
              Variables
            </button>
            <button className="xenon-btn-ghost flex items-center gap-2" onClick={onSave}>
              <Save className="h-4 w-4" />
              Save
            </button>
            <button
              className="xenon-btn-ghost flex items-center gap-2"
              onClick={async () => {
                const code = useAppStore.getState().activeProject?.code || "";
                if (!code.trim()) { setShareStatus("No code to share"); return; }
                setShareStatus("Sharing...");
                try {
                  const slug = await shareSnippet(code);
                  const url = `${window.location.origin}/share/${slug}`;
                  try {
                    await navigator.clipboard.writeText(url);
                    setShareStatus("Link copied!");
                  } catch {
                    setShareStatus(`Share link: ${url}`);
                  }
                } catch {
                  setShareStatus("Failed to share");
                }
                setTimeout(() => setShareStatus(""), 6000);
              }}
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button className="xenon-btn-subtle flex items-center gap-2" onClick={openProSkins}>
              <Layers className="h-4 w-4" /> Pro IDE Skins {!canUseProSkins && "(Pro)"}
            </button>
            <button className="xenon-btn-subtle flex items-center gap-2" onClick={() => setShowChallenge((v) => !v)}>
              <Sparkles className="h-4 w-4" />
              Challenges
            </button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            className="xenon-input max-w-lg"
            value={activeProjectTitle}
            onChange={(e) => setActiveProjectTitle(e.target.value)}
            placeholder="Untitled.py"
          />
          <span className="xenon-badge">Standard Python imports like `random` are available here{canUseTime ? ' · `time` module ✓' : ''}</span>
          {!canUseTime && (
            <span className="xenon-badge text-[var(--accent)] bg-[var(--accent-soft)]">`time` module on Pro+</span>
          )}
          {profile?.role === "student" && enrolledClass?.id && (
            <span className="xenon-badge">Practice time is tracked while this page is active</span>
          )}
          {saveStatus && <span className="text-sm text-[var(--muted)]">{saveStatus}</span>}
          {shareStatus && (
            <span
              className={`text-sm flex items-center gap-1 ${shareStatus.startsWith("Share link:") ? "cursor-pointer select-all" : ""} text-[var(--accent)]`}
              title={shareStatus.startsWith("Share link:") ? "Click to select, then copy" : undefined}
            >
              <Link className={`h-3 w-3 ${shareStatus.startsWith("Share link:") ? "text-green-400" : ""} shrink-0`} />
              {shareStatus.startsWith("Share link:") ? (
                <span className="break-all">{shareStatus}</span>
              ) : (
                shareStatus
              )}
            </span>
          )}
        </div>
      </motion.section>

      {showChallenge && (
        <motion.section className="xenon-panel p-6 space-y-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" /> GCSE Challenge Arena
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1">Select structured exam-spec challenges and solve them in the workspace.</p>
            </div>
            <div className="flex gap-2 bg-[var(--panel-soft)] p-1 rounded-xl border border-[var(--border)]">
              {[
                { id: "algo", label: "Algorithm Design" },
                { id: "debug", label: "Exam Debugging" },
                { id: "python", label: "Python Spec" }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    // Automatically pick first question of new category
                    const offset = cat.id === "algo" ? 0 : cat.id === "debug" ? 12 : 18;
                    setChallengeIndex(offset);
                  }}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
                    activeCategory === cat.id 
                      ? "bg-[var(--accent-soft)] text-[var(--accent)]" 
                      : "text-[var(--muted)] hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.45fr_0.55fr]">
            {/* Active Challenge Brief (Left Pane) */}
            <div className="xenon-panel-muted p-5 flex flex-col justify-between gap-5 border-l-4 border-amber-500">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase bg-amber-500/10 text-amber-400 border border-amber-400/25 px-2 py-0.5 rounded-full">
                    {activeCategory === "algo" ? "Spec Point 2.1" : activeCategory === "debug" ? "Spec Point 2.2" : "Spec Point 2.3"}
                  </span>
                  <span className="text-[9px] font-black uppercase bg-sky-500/10 text-sky-400 border border-sky-400/25 px-2 py-0.5 rounded-full">
                    AQA / OCR Focus
                  </span>
                </div>
                
                <h4 className="text-base font-black text-white leading-snug">
                  {GCSE_QUESTIONS[challengeIndex]}
                </h4>

                <div className="space-y-2 pt-2">
                  <p className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">Suggested GCSE Steps:</p>
                  <ul className="text-xs text-slate-300 space-y-2 leading-relaxed font-sans">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">1.</span>
                      <span>Map out variable inputs (e.g., input values or static parameters).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">2.</span>
                      <span>Structure the core condition / loop logic using correct indentation.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">3.</span>
                      <span>Print user-friendly output text to the console line to confirm correctness.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex flex-wrap items-center gap-3">
                <button className="xenon-btn flex-grow py-2.5 flex items-center justify-center gap-2 text-xs" onClick={useChallenge}>
                  <Sparkles className="h-4 w-4 fill-current" /> Load into Workspace
                </button>
              </div>
            </div>

            {/* Scrollable Challenge Picker (Right Pane) */}
            <div className="xenon-scroll max-h-[320px] overflow-y-auto space-y-2 pr-2">
              {(activeCategory === "algo" 
                ? GCSE_QUESTIONS.slice(0, 11) 
                : activeCategory === "debug" 
                  ? GCSE_QUESTIONS.slice(12, 18) 
                  : GCSE_QUESTIONS.slice(18, 30)
              ).map((question, index) => {
                const questionIndex = activeCategory === "algo" ? index : activeCategory === "debug" ? index + 12 : index + 18;
                const isSelected = challengeIndex === questionIndex;
                
                return (
                  <button
                    key={questionIndex}
                    onClick={() => setChallengeIndex(questionIndex)}
                    className={`w-full p-4 text-left rounded-xl border transition-all flex items-center gap-3 ${
                      isSelected 
                        ? "border-[var(--accent)] bg-[var(--accent-soft)] text-white shadow-md shadow-[var(--accent)]/10" 
                        : "border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-white/5 text-[var(--muted)] hover:text-white"
                    }`}
                  >
                    <span className={`h-6 w-6 rounded-lg flex items-center justify-center text-xs font-black ${
                      isSelected ? "bg-[var(--accent)] text-white" : "bg-[var(--panel-soft)] text-[var(--muted)]"
                    }`}>
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold leading-relaxed flex-1">{question}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.section>
      )}

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="xenon-panel h-[40vh] md:h-[60vh] xl:h-[70vh] overflow-hidden">
          <Editor
            key={`${activeProjectId}-${monacoTheme}-${proFont}`}
            beforeMount={buildMonacoTheme}
            onMount={handleEditorMount}
            height="100%"
            defaultLanguage="python"
            defaultValue={useAppStore.getState().activeProject?.code || ""}
            onChange={(value) => setActiveProjectCode(value || "")}
            theme={monacoTheme}
            options={editorOptions}
          />
        </section>

        <section className="xenon-panel flex h-[40vh] md:h-[60vh] xl:h-[70vh] flex-col p-5">
          <h3 className="text-lg font-semibold">Output</h3>
          <div
            className="xenon-terminal xenon-scroll mt-4 flex-1 overflow-auto p-4"
            onClick={() => isWaitingForInput && terminalInputRef.current?.focus()}
          >
            {consoleLines.length ? (
              consoleLines.map((line, index) => {
                const isErr = line.type === "err";
                return (
                  <div key={`${line.text}-${index}`} className="mb-2">
                    <p
                      className={`xenon-code whitespace-pre-wrap text-sm leading-5 ${
                        isErr
                          ? "text-red-300"
                          : line.type === "sys"
                            ? "text-sky-300"
                            : line.type === "in"
                              ? "text-amber-200 font-bold"
                              : "text-green-300"
                      }`}
                    >
                      {line.type === "in" ? `> ${line.text}` : line.text}
                    </p>
                    {isErr && line.raw && (
                      <ErrorTranslatorButton
                        rawError={line.raw}
                        sourceCode={useAppStore.getState().activeProject?.code || ""}
                      />
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-[var(--muted)]">Run your code to see output here.</p>
            )}

            {isWaitingForInput && (
              <div className="mt-2 flex items-center gap-2 rounded border border-amber-200/40 bg-amber-200/5 px-3 py-2">
                <span className="shrink-0 text-sm font-bold text-amber-200">&gt;</span>
                <input
                  ref={terminalInputRef}
                  className="w-full bg-transparent text-sm font-bold text-amber-200 outline-none placeholder:text-amber-200/40 caret-amber-200"
                  placeholder="Type your answer and press Enter…"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyDown={handleTerminalKeyDown}
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                />
              </div>
            )}
            <div ref={terminalEndRef} />
          </div>
        </section>
      </div>

      <AnimatePresence>
        {showVariables && (
          <motion.div 
            initial={{ x: 400 }} 
            animate={{ x: 0 }} 
            exit={{ x: 400 }}
            className="fixed top-0 right-0 bottom-0 w-80 z-[100] bg-[var(--panel)] border-l border-[var(--border)] shadow-2xl backdrop-blur-xl flex flex-col"
          >
            <div className="p-6 border-b border-[var(--border)] flex items-center justify-between bg-gradient-to-r from-[var(--accent-soft)] to-transparent">
              <div>
                <h3 className="text-lg font-bold tracking-tight">Variables</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">Active Runtime</p>
              </div>
              <button 
                className="h-8 w-8 rounded-full hover:bg-[var(--panel-soft)] flex items-center justify-center transition-colors" 
                onClick={() => setShowVariables(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto xenon-scroll">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--panel-muted)] sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 font-bold text-[var(--muted)] uppercase tracking-tighter">Name</th>
                    <th className="px-4 py-3 font-bold text-[var(--muted)] uppercase tracking-tighter">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {variables.length > 0 ? (
                    variables.map((v) => (
                      <tr key={v.name} className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3 font-mono text-sky-400 font-bold">{v.name}</td>
                        <td className="px-4 py-3 font-mono text-[var(--muted)] truncate max-w-[140px]" title={v.value}>{v.value}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-4 py-12 text-center text-[var(--muted)] italic">Run code to see variables</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-6 bg-[var(--panel-soft)]">
              <p className="text-[10px] leading-relaxed text-[var(--muted)] font-medium">
                The Variable Explorer shows all global variables and their current values after your code finishes executing.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProSkins && (
          <motion.div 
            initial={{ x: 400 }} 
            animate={{ x: 0 }} 
            exit={{ x: 400 }}
            className="fixed top-0 right-0 bottom-0 w-80 z-[100] bg-[var(--panel)] border-l border-[var(--border)] shadow-2xl backdrop-blur-xl flex flex-col"
          >
            <div className="p-6 border-b border-[var(--border)] flex items-center justify-between bg-gradient-to-r from-[var(--accent-soft)] to-transparent">
              <div>
                <h3 className="text-lg font-bold tracking-tight">Pro IDE Skins</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">Premium Customization</p>
              </div>
              <button 
                className="h-8 w-8 rounded-full hover:bg-[var(--panel-soft)] flex items-center justify-center transition-colors" 
                onClick={() => setShowProSkins(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
                        <div className="flex-1 overflow-auto p-6 space-y-6 xenon-scroll">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">Select Editor Skin</label>
                <div className="grid gap-2">
                  {[
                    { id: "default", label: "Default Theme", bg: "linear-gradient(135deg, #07101a, #0d1726)" },
                    { id: "cyberpunk", label: "Cyberpunk Glow", bg: "linear-gradient(135deg, #1e0b36, #3b0764)" },
                    { id: "oled", label: "OLED Deep Black", bg: "linear-gradient(135deg, #000000, #18181b)" },
                    { id: "pink-glass", label: "Pink Glassmorphic", bg: "linear-gradient(135deg, #1f0f1c, #4c0519)" }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setProfileTheme(t.id)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        proTheme === t.id 
                          ? "border-[var(--accent)] bg-[var(--accent-soft)] text-white" 
                          : "border-[var(--border)] hover:bg-white/5"
                      }`}
                    >
                      <span className="text-xs font-bold">{t.label}</span>
                      <div className="h-4 w-12 rounded-full border border-white/10" style={{ background: t.bg }} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 border-t border-[var(--border)] pt-4">
                <label className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">Select Editor Font</label>
                <div className="grid gap-2">
                  {[
                    { id: "default", label: "JetBrains Mono (GCSE Standard)" },
                    { id: "fira", label: "Fira Code (Modern Ligatures)" },
                    { id: "comic", label: "Space Mono (Accessible Dyslexia Font)" }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => handleSetProFont(f.id)}
                      className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                        proFont === f.id 
                          ? "border-[var(--accent)] bg-[var(--accent-soft)] text-white" 
                          : "border-[var(--border)] hover:bg-white/5"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-[var(--panel-soft)] border-t border-[var(--border)]">
              {canUseProSkins ? (
              <span className="text-[9px] font-black uppercase bg-amber-500/10 text-amber-300 border border-amber-400/25 px-1.5 py-0.5 rounded leading-none">
                Pro feature — unlocked
              </span>
              ) : (
              <span className="text-[9px] font-black uppercase bg-amber-500/10 text-amber-300 border border-amber-400/25 px-1.5 py-0.5 rounded leading-none">
                Upgrade to Pro in Settings to unlock
              </span>
              )}
              <p className="text-[10px] leading-relaxed text-[var(--muted)] font-medium mt-2">
                Pro-exclusive IDE themes and fonts. Not included on the free plan.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
