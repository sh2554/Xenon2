importScripts("https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js");

let pyodide = null;
let stdinResolver = null;

async function initPyodide() {
  pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/",
  });

  globalThis.__xenon_stdin__ = (prompt) => {
    if (prompt) {
      self.postMessage({ type: "stdout", text: String(prompt) });
    }
    self.postMessage({ type: "stdin_request" });
    return new Promise((resolve) => {
      stdinResolver = (value) => {
        stdinResolver = null;
        resolve(value ?? "");
      };
    });
  };

  await pyodide.runPythonAsync(`
import builtins
import js

async def _xenon_input(prompt=''):
    line = await js.__xenon_stdin__(str(prompt) if prompt else '')
    if line is None:
        return ''
    return str(line).rstrip('\\n')

builtins.input = _xenon_input
`);

  self.postMessage({ type: "ready" });
}

function extractVariables() {
  const globals = pyodide.globals.toJs();
  const vars = [];
  for (const [key, value] of globals.entries()) {
    if (
      key.startsWith("__") ||
      typeof value === "function" ||
      (value && value._type === "module") ||
      key === "random" ||
      key.startsWith("_xenon")
    ) continue;

    let displayValue = "";
    let displayType = "";
    try {
      if (value === null) {
        displayValue = "None";
        displayType = "NoneType";
      } else if (typeof value === "object" && value.toJs) {
        displayValue = JSON.stringify(value.toJs());
        displayType = value.type || "object";
      } else {
        displayValue = String(value);
        displayType = typeof value;
      }
    } catch {
      displayValue = "[Complex Object]";
      displayType = "object";
    }
    vars.push({ name: key, value: displayValue, type: displayType });
  }
  return vars;
}

const TRANSFORM_SCRIPT = `
import ast as _ast

class _XenonInputTransformer(_ast.NodeTransformer):
    def visit_Call(self, node):
        self.generic_visit(node)
        func = node.func
        if isinstance(func, _ast.Name) and func.id == 'input':
            return _ast.copy_location(_ast.Await(value=node), node)
        return node

class _XenonTimeTransformer(_ast.NodeTransformer):
    def visit_Call(self, node):
        self.generic_visit(node)
        func = node.func
        if isinstance(func, _ast.Attribute) and isinstance(func.value, _ast.Name):
            if func.value.id == 'time' and func.attr == 'sleep':
                new_call = _ast.Call(
                    func=_ast.Name(id='_xenon_time_sleep__', ctx=_ast.Load()),
                    args=node.args,
                    keywords=node.keywords
                )
                return _ast.copy_location(_ast.Await(value=new_call), node)
        return node

import js as _js
_raw = _js.__xenon_user_code__
_tree = _ast.parse(_raw, mode='exec')
_tree = _XenonInputTransformer().visit(_tree)
_can_use_time = _js.__xenon_can_use_time__
if _can_use_time:
    _tree = _XenonTimeTransformer().visit(_tree)
_ast.fix_missing_locations(_tree)
_lines = _ast.unparse(_tree).splitlines()
_indented = '\\n'.join(('    ' + ln if ln.strip() else ln) for ln in _lines)
_xenon_transformed = 'async def __xenon_main__():\\n' + _indented + '\\nawait __xenon_main__()'
del _XenonInputTransformer, _raw, _tree, _lines, _indented, _can_use_time
if '_XenonTimeTransformer' in dir():
    del _XenonTimeTransformer
`;

self.onmessage = async (e) => {
  const { type, code, canUseTime } = e.data;

  if (type === "init") {
    try {
      await initPyodide();
    } catch (err) {
      self.postMessage({ type: "error", error: "Failed to load Pyodide: " + err.message });
    }
    return;
  }

  if (type === "stdin_response") {
    if (stdinResolver) {
      const resolve = stdinResolver;
      stdinResolver = null;
      resolve(e.data.value ?? "");
    }
    return;
  }

  if (type === "run") {
    if (!pyodide) {
      self.postMessage({ type: "error", error: "Pyodide not initialised yet." });
      return;
    }

    stdinResolver = null;
    pyodide.setStdout({ batched: (text) => self.postMessage({ type: "stdout", text }) });
    pyodide.setStderr({ batched: (text) => self.postMessage({ type: "stderr", text }) });

    try {
      await pyodide.runPythonAsync("import random");
      if (canUseTime) {
        await pyodide.runPythonAsync("import time");
        globalThis.__xenon_sleep__ = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));
        await pyodide.runPythonAsync(
'import js\nasync def _xenon_time_sleep__(seconds):\n    await js.__xenon_sleep__(seconds)\n');
      }
      globalThis.__xenon_user_code__ = code;
      globalThis.__xenon_can_use_time__ = !!canUseTime;
      await pyodide.runPythonAsync(TRANSFORM_SCRIPT);
      const transformed = pyodide.globals.get("_xenon_transformed");
      await pyodide.runPythonAsync(transformed);
      self.postMessage({ type: "done", variables: extractVariables() });
    } catch (error) {
      self.postMessage({ type: "error", error: String(error) });
    }
  }
};
