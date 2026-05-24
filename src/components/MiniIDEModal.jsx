import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import { getPyodideWorker, sendInputToWorker } from "../lib/pyodide";
import { useAppStore } from "../store/useAppStore";
import { hasFeature } from "../lib/planFeatures";
import { X, Play, Send, History, Terminal, CheckCircle, AlertCircle } from "lucide-react";

const GRADE_RING = {
  emerald: "border-[var(--success)]/40 bg-[var(--success)]/10 text-[var(--success)]",
  sky: "border-[var(--accent)]/40 bg-[var(--accent-soft)] text-[var(--accent)]",
  amber: "border-[var(--warning)]/40 bg-[var(--warning-soft)] text-[var(--warning)]",
  orange: "border-[var(--warning)]/40 bg-[var(--warning-soft)] text-[var(--warning)]",
  red: "border-[var(--danger)]/40 bg-[var(--danger)]/10 text-[var(--danger)]",
};

/** Mini in-browser Python IDE shown inside a modal for programming mock questions. */
export default function MiniIDEModal({
  question,       // { id, text, starterCode }
  onClose,        // () => void
  onSubmit,       // (code) => void
  onSubmitLabel,  // optional string label for submit button
  gradeInfo,      // optional { grade, tone, label }
}) {
  const profile = useAppStore((s) => s.profile);
  const canUseTime = hasFeature(profile?.plan, "timeModule");

  const editorRef = useRef(null);
  const terminalInputRef = useRef(null);
  const terminalEndRef = useRef(null);

  const [code, setCode] = useState(question?.starterCode ?? "");
  const [consoleLines, setConsoleLines] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [termInput, setTermInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [consoleLines]);

  useEffect(() => {
    if (isWaiting) terminalInputRef.current?.focus();
  }, [isWaiting]);

  // Reset when question changes
  useEffect(() => {
    setCode(question?.starterCode ?? "");
    setConsoleLines([]);
    setSubmitted(false);
  }, [question?.id]);

  // Prevent body scroll while modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const appendLine = (line) => setConsoleLines((prev) => [...prev, line]);

  const runCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setConsoleLines([{ type: "sys", text: "Starting Python runtime..." }]);

    try {
      const { worker, workerReadyPromise } = getPyodideWorker();

      const handleMessage = (e) => {
        const { type, text, error } = e.data;
        switch (type) {
          case "stdout":
            appendLine({ type: "out", text });
            break;
          case "stderr":
            appendLine({ type: "err", text });
            break;
          case "stdin_request":
            setIsWaiting(true);
            break;
          case "done":
            setIsRunning(false);
            setIsWaiting(false);
            worker.removeEventListener("message", handleMessage);
            break;
          case "error":
            appendLine({ type: "err", text: error });
            setIsRunning(false);
            setIsWaiting(false);
            worker.removeEventListener("message", handleMessage);
            break;
        }
      };

      worker.addEventListener("message", handleMessage);
      await workerReadyPromise;
      setConsoleLines([{ type: "sys", text: "Running..." }]);
      worker.postMessage({ type: "run", code, canUseTime });
    } catch (err) {
      setIsRunning(false);
      appendLine({ type: "err", text: "Worker Error: " + String(err) });
    }
  };

  const handleTerminalKey = (e) => {
    if (e.key === "Enter" && isWaiting) {
      appendLine({ type: "in", text: termInput });
      sendInputToWorker(termInput);
      setTermInput("");
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit?.(code);
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="mini-ide-backdrop"
        className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        {/* Modal */}
        <motion.div
          key="mini-ide-modal"
          className="relative w-full max-w-5xl rounded-3xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl flex flex-col overflow-hidden"
          style={{ maxHeight: "92vh" }}
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] bg-gradient-to-r from-[var(--accent-soft)] to-transparent px-6 py-5 shrink-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-violet-400 bg-violet-500/15 border border-violet-400/30 px-2 py-0.5 rounded-full">
                  Programming Question
                </span>
                {gradeInfo && (
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border ${GRADE_RING[gradeInfo.tone || "sky"]}`}>
                    Grade {gradeInfo.grade}
                  </span>
                )}
              </div>
              <p className="text-sm font-bold leading-relaxed text-[var(--text)]">{question?.text}</p>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 h-9 w-9 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-[var(--muted)] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* IDE + Terminal */}
          <div className="flex-1 min-h-0 grid grid-rows-[1fr_auto]">
            <div className="grid md:grid-cols-2 min-h-0">
              {/* Code Editor */}
              <div className="border-r border-[var(--border)] min-h-[280px]">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--border)] bg-[var(--panel-soft)]">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)] ml-2">
                    solution.py
                  </span>
                  {canUseTime && (
                    <span className="ml-auto text-[9px] font-bold text-[var(--accent)] bg-[var(--accent-soft)] px-2 py-0.5 rounded-full">
                      time ✓
                    </span>
                  )}
                </div>
                <Editor
                  height="320px"
                  defaultLanguage="python"
                  value={code}
                  onChange={(v) => setCode(v ?? "")}
                  theme="xenon-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineHeight: 20,
                    fontFamily: "'JetBrains Mono', monospace",
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    padding: { top: 10, bottom: 10 },
                    scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
                    automaticLayout: true,
                  }}
                  beforeMount={(monaco) => {
                    if (!monaco.editor.getTheme?.("xenon-dark")) {
                      monaco.editor.defineTheme("xenon-dark", {
                        base: "vs-dark",
                        inherit: true,
                        rules: [],
                        colors: { "editor.background": "#07101a" },
                      });
                    }
                  }}
                />
              </div>

              {/* Terminal */}
              <div className="flex flex-col min-h-[280px]">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--border)] bg-[var(--panel-soft)]">
                  <Terminal className="h-3.5 w-3.5 text-[var(--muted)]" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">Output</span>
                </div>
                <div
                  className="flex-1 overflow-y-auto p-4 bg-[var(--code-bg)] xenon-scroll font-mono text-sm"
                  style={{ minHeight: "280px", maxHeight: "320px" }}
                  onClick={() => isWaiting && terminalInputRef.current?.focus()}
                >
                  {consoleLines.length === 0 ? (
                    <p className="text-[var(--muted)] text-xs">Run your code to see output here.</p>
                  ) : (
                    consoleLines.map((line, i) => (
                      <p
                        key={i}
                        className={`whitespace-pre-wrap leading-5 mb-1 ${
                          line.type === "err" ? "text-[var(--danger)]" :
                          line.type === "sys" ? "text-[var(--accent)]" :
                          line.type === "in" ? "text-[var(--warning)] font-bold" :
                          "text-[var(--success)]"
                        }`}
                      >
                        {line.type === "in" ? `> ${line.text}` : line.text}
                      </p>
                    ))
                  )}
                  {isWaiting && (
                    <div className="mt-2 flex items-center gap-2 rounded border border-[var(--warning)]/40 bg-[var(--warning-soft)] px-3 py-2">
                      <span className="text-sm font-bold text-[var(--warning)]">&gt;</span>
                      <input
                        ref={terminalInputRef}
                        className="w-full bg-transparent text-sm font-bold text-[var(--warning)] outline-none placeholder:text-[var(--warning)] caret-amber-200"
                        placeholder="Type your answer and press Enter…"
                        value={termInput}
                        onChange={(e) => setTermInput(e.target.value)}
                        onKeyDown={handleTerminalKey}
                        spellCheck={false}
                        autoComplete="off"
                      />
                    </div>
                  )}
                  <div ref={terminalEndRef} />
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] bg-[var(--panel-soft)] px-6 py-4 shrink-0">
              <button
                type="button"
                className="xenon-btn flex items-center gap-2 px-5"
                onClick={runCode}
                disabled={isRunning}
              >
                {isRunning
                  ? <><History className="h-4 w-4 animate-spin" /> Running...</>
                  : <><Play className="h-4 w-4 fill-current" /> Run Code</>
                }
              </button>

              <div className="flex items-center gap-3">
                {submitted ? (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 text-[var(--success)] font-bold text-sm"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Answer submitted!
                  </motion.span>
                ) : (
                  <button
                    type="button"
                    className="xenon-btn flex items-center gap-2 px-5"
                    style={{ background: "linear-gradient(135deg, #059669, #0d9488)" }}
                    onClick={handleSubmit}
                  >
                    <Send className="h-4 w-4" />
                    {onSubmitLabel || "Submit Answer"}
                  </button>
                )}
                <button
                  type="button"
                  className="xenon-btn-ghost flex items-center gap-2"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                  Close
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
