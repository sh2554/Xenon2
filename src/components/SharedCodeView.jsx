import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useAppStore } from "../store/useAppStore";
import { getPyodideWorker, sendInputToWorker } from "../lib/pyodide";
import { Terminal, ChevronLeft, Play, Copy, Check, History } from "lucide-react";

export default function SharedCodeView() {
  const { slug } = useParams();
  const loadSharedSnippet = useAppStore((s) => s.loadSharedSnippet);
  const [data, setData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  // Code execution state
  const [consoleLines, setConsoleLines] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const [copied, setCopied] = useState(false);
  const terminalInputRef = useRef(null);
  const terminalEndRef = useRef(null);

  useEffect(() => {
    if (!slug) { setNotFound(true); return; }
    loadSharedSnippet(slug).then((res) => {
      if (res) setData(res);
      else setNotFound(true);
    }).catch(() => setNotFound(true));
  }, [slug, loadSharedSnippet]);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [consoleLines]);

  // Focus input when waiting
  useEffect(() => {
    if (isWaitingForInput) terminalInputRef.current?.focus();
  }, [isWaitingForInput]);

  const appendConsoleLine = (line) => {
    setConsoleLines((prev) => [...prev, line]);
  };

  const runCode = async () => {
    if (isRunning || !data?.code) return;
    setIsRunning(true);
    setConsoleLines([{ type: "sys", text: "Starting Python runtime..." }]);

    try {
      const { worker, workerReadyPromise } = getPyodideWorker();

      const handleMessage = (e) => {
        const { type, text, error } = e.data;
        switch (type) {
          case "stdout":
            appendConsoleLine({ type: "out", text });
            break;
          case "stderr":
            appendConsoleLine({ type: "err", text });
            break;
          case "stdin_request":
            setIsWaitingForInput(true);
            break;
          case "done":
            setIsRunning(false);
            setIsWaitingForInput(false);
            worker.removeEventListener("message", handleMessage);
            break;
          case "error":
            appendConsoleLine({ type: "err", text: error });
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
      worker.postMessage({ type: "run", code: data.code, canUseTime: false });
    } catch (error) {
      setIsRunning(false);
      appendConsoleLine({ type: "err", text: "Worker Error: " + String(error) });
    }
  };

  const handleTerminalKeyDown = (e) => {
    if (e.key === "Enter" && isWaitingForInput) {
      const value = terminalInput;
      appendConsoleLine({ type: "in", text: value });
      sendInputToWorker(value);
      setTerminalInput("");
      setIsWaitingForInput(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  if (notFound) {
    return (
      <div className="xenon-shell flex min-h-screen flex-col items-center justify-center px-4">
        <div className="xenon-panel mx-auto w-full max-w-lg p-10 text-center">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-[var(--danger)]/10 flex items-center justify-center text-[var(--danger)] mb-6">
            <Terminal className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black">Snippet not found</h1>
          <p className="mt-3 text-sm text-[var(--muted)]">
            This shared code link doesn't exist or has been removed.
          </p>
          <Link to="/" className="xenon-btn inline-flex items-center gap-2 mt-8">
            <ChevronLeft className="h-4 w-4" /> Back to Xenon Code
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="xenon-shell flex min-h-screen flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
          <p className="mt-4 text-sm text-[var(--muted)]">Loading shared code...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="xenon-shell min-h-screen flex flex-col">
      <header className="xenon-header flex items-center justify-between px-6 py-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-[var(--accent)] hover:underline">
            <ChevronLeft className="h-4 w-4" /> Xenon Code
          </Link>
          <div className="h-6 w-px bg-[var(--border)]" />
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-[var(--muted)]" />
            <span className="text-sm font-bold">Shared Code</span>
            <span className="xenon-pill text-[9px] px-2 py-0.5">/{slug}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="xenon-btn flex items-center gap-2 text-xs px-4 py-2"
            onClick={runCode}
            disabled={isRunning}
          >
            {isRunning ? <History className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
            {isRunning ? "Running..." : "Run Code"}
          </button>
          <button
            className="xenon-btn-ghost flex items-center gap-2 text-xs px-4 py-2"
            onClick={handleCopyLink}
          >
            {copied ? <Check className="h-4 w-4 text-[var(--success)]" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]" style={{ minHeight: "60vh" }}>
        {/* Code Editor Panel */}
        <div className="xenon-panel overflow-hidden flex flex-col" style={{ minHeight: "50vh" }}>
          <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--border)] bg-[var(--panel-soft)]">
            <div className="h-2.5 w-2.5 rounded-full bg-[var(--danger)]/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-[var(--warning-soft)]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[var(--success)]/80" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)] ml-2">
              snippet.py
            </span>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage={data.language || "python"}
              value={data.code}
              theme="xenon-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                lineHeight: 22,
                fontFamily: "'JetBrains Mono', monospace",
                scrollBeyondLastLine: false,
                wordWrap: "on",
                padding: { top: 12, bottom: 12 },
                automaticLayout: true,
                scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
              }}
              beforeMount={(monaco) => {
                if (!monaco.editor.getTheme?.("xenon-dark")) {
                  monaco.editor.defineTheme("xenon-dark", {
                    base: "vs-dark", inherit: true, rules: [],
                    colors: { "editor.background": "#07101a" },
                  });
                }
              }}
            />
          </div>
        </div>

        {/* Output Terminal Panel */}
        <div className="xenon-panel flex flex-col overflow-hidden" style={{ minHeight: "50vh" }}>
          <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--border)] bg-[var(--panel-soft)]">
            <Terminal className="h-3.5 w-3.5 text-[var(--muted)]" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">
              Output
            </span>
          </div>
          <div
            className="xenon-terminal xenon-scroll flex-1 overflow-auto p-4"
            onClick={() => isWaitingForInput && terminalInputRef.current?.focus()}
          >
            {consoleLines.length ? (
              consoleLines.map((line, index) => (
                <p
                  key={`${line.text}-${index}`}
                  className={`xenon-code whitespace-pre-wrap text-sm leading-5 mb-1 ${
                    line.type === "err"
                      ? "text-[var(--danger)]"
                      : line.type === "sys"
                        ? "text-[var(--accent)]"
                        : line.type === "in"
                          ? "text-[var(--warning)] font-bold"
                          : "text-[var(--success)]"
                  }`}
                >
                  {line.type === "in" ? `> ${line.text}` : line.text}
                </p>
              ))
            ) : (
              <p className="text-sm text-[var(--muted)]">Click "Run Code" to execute and see output here.</p>
            )}

            {isWaitingForInput && (
              <div className="mt-2 flex items-center gap-2 rounded border border-[var(--warning)]/40 bg-[var(--warning-soft)] px-3 py-2">
                <span className="shrink-0 text-sm font-bold text-[var(--warning)]">&gt;</span>
                <input
                  ref={terminalInputRef}
                  className="w-full bg-transparent text-sm font-bold text-[var(--warning)] outline-none placeholder:text-[var(--warning)] caret-amber-200"
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
        </div>
      </main>

      <p className="py-4 text-center text-xs text-[var(--muted)]">
        Shared via Xenon Code &middot; Read-only editor &middot; Runnable
      </p>
    </div>
  );
}
