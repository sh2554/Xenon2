import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import { getPyodideWorker, sendInputToWorker } from "../lib/pyodide";
import { translatePythonError } from "../lib/errorTranslator";
import { useAppStore } from "../store/useAppStore";
import { Play, Save, FilePlus, Sparkles, Database, X, BookOpen, AlertCircle, Terminal, History, ArrowRight, FileText, Layers } from "lucide-react";
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
};

export default function XenonIDE() {
  const editorRef = useRef(null);
  const projectIdRef = useRef(null);
  const [saveStatus, setSaveStatus] = useState("");
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [variables, setVariables] = useState([]);
  const [showVariables, setShowVariables] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");

  const terminalInputRef = useRef(null);
  const terminalEndRef = useRef(null);

  const activeProjectId = useAppStore((s) => s.activeProject.id);
  const activeProjectTitle = useAppStore((s) => s.activeProject.title);
  
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

  const monacoTheme = useMemo(() => {
    const lightThemes = ["classic-light", "solarized", "pink", "blue"];
    return lightThemes.includes(theme) ? "xenon-light" : "xenon-dark";
  }, [theme]);

  const editorOptions = useMemo(() => ({
    automaticLayout: true,
    minimap: { enabled: false },
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Source Code Pro', Menlo, Monaco, 'Courier New', monospace",
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
  }), []);

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
      setIsWaitingForInput(false);
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
              text: profile?.role === "student" ? translatePythonError(text) : text,
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
              text: profile?.role === "student" ? translatePythonError(error) : error,
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
      worker.postMessage({ type: "run", code: useAppStore.getState().activeProject.code });
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
    const text = `# Challenge\n# ${GCSE_QUESTIONS[challengeIndex]}\n\n`;
    const currentCode = useAppStore.getState().activeProject.code;
    setActiveProjectCode(`${text}${currentCode}`);
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

  return (
    <div className="space-y-4">
      <motion.section className="xenon-panel p-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Python IDE</h2>
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
            <button className="xenon-btn-ghost flex items-center gap-2" onClick={newProject}>
              <FilePlus className="h-4 w-4" />
              New Project
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
          <span className="xenon-badge">Standard Python imports like `random` are available here</span>
          {profile?.role === "student" && enrolledClass?.id && (
            <span className="xenon-badge">Practice time is tracked while this page is active</span>
          )}
          {saveStatus && <span className="text-sm text-[var(--muted)]">{saveStatus}</span>}
        </div>
      </motion.section>

      {showChallenge && (
        <motion.section className="xenon-panel p-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">Challenge Mode</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">Pick a task and add it into your code area.</p>
            </div>
            <button className="xenon-btn" onClick={useChallenge}>Use This Challenge</button>
          </div>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {GCSE_QUESTIONS.slice(0, 12).map((question, index) => (
              <button
                key={`${index}-${question}`}
                className="xenon-panel-muted p-4 text-left"
                style={challengeIndex === index ? { borderColor: "var(--border-strong)", background: "var(--accent-soft)" } : undefined}
                onClick={() => setChallengeIndex(index)}
              >
                <p className="text-sm">{question}</p>
              </button>
            ))}
          </div>
        </motion.section>
      )}

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="xenon-panel h-[40vh] md:h-[60vh] xl:h-[70vh] overflow-hidden">
          <Editor
            key={activeProjectId}
            beforeMount={buildMonacoTheme}
            onMount={handleEditorMount}
            height="100%"
            defaultLanguage="python"
            defaultValue={useAppStore.getState().activeProject.code}
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
              consoleLines.map((line, index) => (
                <p
                  key={`${line.text}-${index}`}
                  className={`xenon-code mb-1 whitespace-pre-wrap text-sm leading-5 ${
                    line.type === "err"
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
              ))
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
    </div>
  );
}
