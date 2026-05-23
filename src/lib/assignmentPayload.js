/** Encode/decode assignment metadata in description + optional DB columns. */

export const META_SPLIT = "---XENON_META---";
export const ANSWERS_SPLIT = "---XENON_ANSWERS---";
export const CODE_SPLIT = "---XENON_CODE---";

export function createQuestionId() {
  return `q_${Math.random().toString(36).slice(2, 9)}`;
}

export function parseAssignment(row = {}) {
  const desc = row.description || "";
  if (desc.includes(META_SPLIT)) {
    const [summary, jsonPart] = desc.split(META_SPLIT);
    try {
      const meta = JSON.parse(jsonPart.trim());
      return { ...meta, summary: summary.trim(), id: row.id, title: row.title, due_date: row.due_date, created_at: row.created_at };
    } catch {
      return { type: "legacy", summary: desc.trim(), id: row.id, title: row.title, due_date: row.due_date };
    }
  }
  if (row.assignment_type && row.content_json) {
    return {
      ...(typeof row.content_json === "object" ? row.content_json : {}),
      type: row.assignment_type,
      summary: desc.trim(),
      id: row.id,
      title: row.title,
      due_date: row.due_date,
      created_at: row.created_at,
    };
  }
  return { type: "legacy", summary: desc.trim(), id: row.id, title: row.title, due_date: row.due_date, created_at: row.created_at };
}

export function buildDescription(summary, meta) {
  return `${summary.trim()}\n${META_SPLIT}\n${JSON.stringify(meta)}`;
}

export function buildTheoryMeta({ questions }) {
  return {
    type: "theory",
    questions: (questions || []).slice(0, 10).map((q, i) => ({
      id: q.id || createQuestionId(),
      num: i + 1,
      text: q.text?.trim() || `Question ${i + 1}`,
      answer: q.answer?.trim() || "",
      options: q.options?.filter(Boolean)?.length >= 2 ? q.options.filter(Boolean) : null,
      points: Number(q.points) > 0 ? Number(q.points) : 1,
    })),
  };
}

export function buildProgrammingMeta({ prompt, starterCode }) {
  return {
    type: "programming",
    prompt: prompt?.trim() || "Write a Python program for this task.",
    starterCode: starterCode?.trim() || "# Write your solution below\n",
  };
}

export function parseSubmissionPayload(submission = {}) {
  const notes = submission.notes || "";
  let answers = submission.answers_json;
  let code = submission.submitted_code || "";

  if (notes.includes(ANSWERS_SPLIT)) {
    const [, jsonPart] = notes.split(ANSWERS_SPLIT);
    try {
      answers = JSON.parse(jsonPart.trim());
    } catch {
      answers = null;
    }
  }
  if (notes.includes(CODE_SPLIT)) {
    const [, codePart] = notes.split(CODE_SPLIT);
    code = codePart.trim();
  }
  if (typeof answers === "string") {
    try {
      answers = JSON.parse(answers);
    } catch {
      answers = null;
    }
  }
  return {
    answers,
    code: code || "",
    note: notes.split(ANSWERS_SPLIT)[0].split(CODE_SPLIT)[0].trim(),
  };
}

export function packSubmission({ note, answers, code }) {
  const parts = [];
  if (note?.trim()) parts.push(note.trim());
  if (answers != null) parts.push(`${ANSWERS_SPLIT}\n${JSON.stringify(answers)}`);
  if (code?.trim()) parts.push(`${CODE_SPLIT}\n${code.trim()}`);
  return {
    notes: parts.join("\n\n"),
    answers_json: answers ?? null,
    submitted_code: code?.trim() || "",
  };
}

export function gradeTheorySubmission(questions, answers = {}) {
  let earned = 0;
  let total = 0;
  const breakdown = questions.map((q) => {
    total += q.points || 1;
    const student = answers[q.id];
    let correct = false;
    if (q.options?.length) {
      correct = student === q.answer;
    } else {
      correct = Boolean(String(student || "").trim());
    }
    if (correct) earned += q.points || 1;
    return { id: q.id, correct, student, expected: q.answer };
  });
  return { earned, total, breakdown };
}
