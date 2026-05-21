import { OCR_SPEC_TOPICS } from "./ocrTopics";

export const MOCK_THEORY_QUESTIONS = [
  {
    id: "t1",
    topicId: "1.1",
    text: "What is the purpose of the CPU?",
    answer: "To fetch, decode and execute instructions",
    options: [
      "To store files permanently",
      "To fetch, decode and execute instructions",
      "To display graphics only",
      "To provide network security",
    ],
  },
  {
    id: "t2",
    topicId: "1.2",
    text: "Which type of memory is volatile?",
    answer: "RAM",
    options: ["ROM", "RAM", "SSD", "DVD"],
  },
  {
    id: "t3",
    topicId: "1.3",
    text: "Which topology uses a central switch?",
    answer: "Star",
    options: ["Bus", "Star", "Ring", "Mesh"],
  },
  {
    id: "t4",
    topicId: "1.4",
    text: "What is phishing?",
    answer: "Tricking users into revealing sensitive information",
    options: [
      "Encrypting data on a disk",
      "Tricking users into revealing sensitive information",
      "Scanning ports on a server",
      "Compressing files for backup",
    ],
  },
  {
    id: "t5",
    topicId: "2.1",
    text: "Which search is faster on a sorted list?",
    answer: "Binary search",
    options: ["Linear search", "Binary search", "Random search", "Brute force"],
  },
  {
    id: "t6",
    topicId: "2.2",
    text: "Which data type stores True or False?",
    answer: "Boolean",
    options: ["String", "Integer", "Boolean", "Float"],
  },
  {
    id: "t7",
    topicId: "2.3",
    text: "What is the output of NOT 0?",
    answer: "1",
    options: ["0", "1", "2", "Undefined"],
  },
  {
    id: "t8",
    topicId: "2.4",
    text: "How many bits are in one byte?",
    answer: "8",
    options: ["4", "8", "16", "32"],
  },
  {
    id: "t9",
    topicId: "1.1",
    text: "Which register holds the address of the next instruction?",
    answer: "Program Counter (PC)",
    options: ["ALU", "Program Counter (PC)", "MAR", "Cache"],
  },
  {
    id: "t10",
    topicId: "2.2",
    text: "Which keyword is used for a decision in Python?",
    answer: "if",
    options: ["loop", "if", "print", "def"],
  },
];

export const MOCK_PROGRAMMING_QUESTIONS = [
  {
    id: "p1",
    topicId: "2.2",
    text: "Write a program that prints the numbers 1 to 5 using a for loop.",
    starterCode: "# Print 1 to 5\nfor i in range(1, 6):\n    print(i)\n",
  },
  {
    id: "p2",
    topicId: "2.2",
    text: "Write a program that asks for a name and prints Hello followed by the name.",
    starterCode: 'name = input("Your name: ")\nprint("Hello", name)\n',
  },
  {
    id: "p3",
    topicId: "2.1",
    text: "Write a program that stores [3, 7, 2] and prints the largest value.",
    starterCode: "nums = [3, 7, 2]\nprint(max(nums))\n",
  },
  {
    id: "p4",
    topicId: "2.2",
    text: "Write a program that checks if a number is even or odd.",
    starterCode: 'n = int(input("Number: "))\nif n % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")\n',
  },
  {
    id: "p5",
    topicId: "2.2",
    text: "Write a program that prints the sum of two integers entered by the user.",
    starterCode: 'a = int(input("First: "))\nb = int(input("Second: "))\nprint(a + b)\n',
  },
];

function storageKey(userId) {
  return `xenon-mock-results-${userId}`;
}

export function loadMockResults(userId) {
  if (!userId || typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(storageKey(userId)) || "[]");
  } catch {
    return [];
  }
}

export function getCompletionByTestId(results = []) {
  const map = {};
  results.forEach((r) => {
    if (!r.testId) return;
    const key = r.testId;
    const prev = map[key];
    if (!prev || new Date(r.completedAt || 0) > new Date(prev.completedAt || 0)) {
      map[key] = r;
    }
  });
  return map;
}

export function saveMockResult(userId, result) {
  let list = loadMockResults(userId);
  if (result.testId) {
    list = list.filter((r) => r.testId !== result.testId);
  }
  list.push({ ...result, id: `mock_${Date.now()}`, completedAt: new Date().toISOString() });
  localStorage.setItem(storageKey(userId), JSON.stringify(list.slice(-40)));
  return list;
}

export function gradeTheoryMock(questions, answers = {}) {
  const byTopic = {};
  let correct = 0;
  questions.forEach((q) => {
    if (!byTopic[q.topicId]) byTopic[q.topicId] = { correct: 0, total: 0 };
    byTopic[q.topicId].total += 1;
    const ok = answers[q.id] === q.answer;
    if (ok) {
      correct += 1;
      byTopic[q.topicId].correct += 1;
    }
  });
  return {
    type: "theory",
    totalCorrect: correct,
    totalQuestions: questions.length,
    topicScores: byTopic,
  };
}

/** Programming mock: student submits code; award topic credit if non-empty (teacher-style self check). */
export function gradeProgrammingMock(questions, submissions = {}) {
  const byTopic = {};
  let answered = 0;
  questions.forEach((q) => {
    if (!byTopic[q.topicId]) byTopic[q.topicId] = { correct: 0, total: 0 };
    byTopic[q.topicId].total += 1;
    const code = (submissions[q.id] || "").trim();
    if (code.length > 20) {
      answered += 1;
      byTopic[q.topicId].correct += 1;
    }
  });
  return {
    type: "programming",
    totalCorrect: answered,
    totalQuestions: questions.length,
    topicScores: byTopic,
  };
}

/** Merge all mock results into heatmap rows (only from tests). */
export function buildHeatmapFromMockResults(results = []) {
  if (!results.length) {
    return OCR_SPEC_TOPICS.map((t) => ({
      topic: t.label,
      topicId: t.id,
      mastery: "n/a",
      label: "No mock test yet",
    }));
  }

  const agg = {};
  OCR_SPEC_TOPICS.forEach((t) => {
    agg[t.id] = { correct: 0, total: 0 };
  });

  results.forEach((r) => {
    const scores = r.topicScores || {};
    Object.entries(scores).forEach(([topicId, { correct = 0, total = 0 }]) => {
      if (!agg[topicId]) agg[topicId] = { correct: 0, total: 0 };
      agg[topicId].correct += correct;
      agg[topicId].total += total;
    });
  });

  return OCR_SPEC_TOPICS.map((t) => {
    const { correct, total } = agg[t.id];
    if (total === 0) {
      return { topic: t.label, topicId: t.id, mastery: "n/a", label: "Not tested" };
    }
    const pct = Math.round((correct / total) * 100);
    return {
      topic: t.label,
      topicId: t.id,
      mastery: `${pct}%`,
      label:
        pct >= 80 ? "Highly proficient" : pct >= 60 ? "Proficient" : pct >= 40 ? "Developing" : "Needs support",
      pct,
    };
  });
}

export function studentHasMockTestData(results = []) {
  return results.some((r) => r.totalQuestions > 0);
}
