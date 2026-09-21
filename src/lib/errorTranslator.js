const GCSE_ERROR_MAP = {
  SyntaxError: {
    hint: "Check colons at the end of if/for/while/def lines, matching brackets (), and quote pairs.",
    tip: "Look at the line Python points to — often a missing colon or bracket.",
  },
  IndentationError: {
    hint: "Python uses indentation to show blocks. Keep consistent spaces (usually 4) inside if/for/while.",
    tip: "Every line after a colon must be indented one level deeper.",
  },
  NameError: {
    hint: "A variable is used before it is created, or you misspelled its name.",
    tip: "Check spelling and that you assigned the variable before using it.",
  },
  TypeError: {
    hint: "Two values cannot be combined this way (e.g. adding text to a number).",
    tip: "Use int() or str() to convert types when needed.",
  },
  ValueError: {
    hint: "The value is the right type but not valid (e.g. int('hello')).",
    tip: "Check what the user typed into input() before converting.",
  },
  IndexError: {
    hint: "List index is out of range — the position does not exist.",
    tip: "Remember list indices start at 0; len(list) is one past the last valid index.",
  },
  ZeroDivisionError: {
    hint: "Division by zero is not allowed.",
    tip: "Check the denominator before dividing.",
  },
  ModuleNotFoundError: {
    hint: "Python cannot find that module. Only standard library modules work in the browser IDE.",
    tip: "Avoid external packages unless they are built into Pyodide.",
  },
  ImportError: {
    hint: "Import failed — check the module and item names.",
    tip: "Use correct spelling: e.g. import random not randon.",
  },
  AttributeError: {
    hint: "That object does not have the method or property you called.",
    tip: "Check the variable type and available methods.",
  },
  KeyError: {
    hint: "That dictionary key does not exist.",
    tip: "Use .get(key) or check the key exists before accessing.",
  },
};

const MIGRATION_FILE = "supabase_migrations.sql";

export function isMissingSupabaseTableError(error, tableName) {
  const message = String(error?.message || "").toLowerCase();
  if (!message) return false;
  if (!message.includes("schema cache")) return false;
  if (!message.includes("could not find the table")) return false;
  if (!tableName) return true;
  return message.includes(`public.${String(tableName).toLowerCase()}`);
}

export function translateSupabaseError(error, fallback = "Something went wrong.") {
  if (!error) return fallback;
  const message = String(error?.message || "").trim();
  if (!message) return fallback;

  if (isMissingSupabaseTableError(error)) {
    return `This feature is not set up in Supabase yet. Run the SQL in ${MIGRATION_FILE} and refresh the app.`;
  }

  if (message.toLowerCase().includes("could not find the") && message.toLowerCase().includes("column")) {
    return `This feature needs the latest Supabase SQL update. Run ${MIGRATION_FILE} and refresh the app.`;
  }

  return message;
}

/** Parse Pyodide / Python traceback for line number and error type. */
export function parsePythonError(rawError, sourceCode = "") {
  const cleaned = String(rawError || "").replace(/^PythonError:\s*/i, "").trim();
  const lines = cleaned.split("\n");

  let lineNumber = null;
  const lineMatch =
    cleaned.match(/line\s+(\d+)/i) ||
    cleaned.match(/File\s+"<exec>",\s*line\s+(\d+)/i);
  if (lineMatch) lineNumber = parseInt(lineMatch[1], 10);

  const errorType = Object.keys(GCSE_ERROR_MAP).find((type) => cleaned.includes(type)) || null;
  const sourceLines = sourceCode ? sourceCode.split("\n") : [];
  const codeLine =
    lineNumber != null && lineNumber >= 1 && lineNumber <= sourceLines.length
      ? sourceLines[lineNumber - 1]?.trim()
      : null;

  const shortMessage = lines.find((l) => errorType && l.includes(errorType)) || lines[lines.length - 1] || cleaned;

  return {
    raw: cleaned,
    errorType,
    lineNumber,
    codeLine,
    shortMessage: shortMessage.slice(0, 200),
  };
}

export function translatePythonError(rawError, sourceCode = "") {
  const parsed = parsePythonError(rawError, sourceCode);
  const map = parsed.errorType ? GCSE_ERROR_MAP[parsed.errorType] : null;

  const parts = [];

  if (parsed.lineNumber != null) {
    parts.push(`Error on line ${parsed.lineNumber}${parsed.codeLine ? `: \`${parsed.codeLine}\`` : ""}`);
  } else {
    parts.push("Error location could not be detected — check the last line you edited.");
  }

  if (parsed.errorType) {
    parts.push(`${parsed.errorType}: ${map?.hint || "Review the logic on that line."}`);
  } else {
    parts.push("Check spelling, brackets (), indentation, and that variables are defined before use.");
  }

  if (map?.tip) parts.push(`Tip: ${map.tip}`);

  if (parsed.shortMessage && !parts.some((p) => p.includes(parsed.shortMessage))) {
    parts.push(`Details: ${parsed.shortMessage}`);
  }

  return parts.join("\n\n");
}
