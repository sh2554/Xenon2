export function scorePercent(correct, total) {
  if (!total) return 0;
  return Math.round((Math.max(0, correct) / total) * 100);
}

export function percentToGrade(pct) {
  if (pct >= 90) return { grade: "9", label: "Outstanding", tone: "emerald" };
  if (pct >= 80) return { grade: "8", label: "Excellent", tone: "emerald" };
  if (pct >= 70) return { grade: "7", label: "Very Good", tone: "sky" };
  if (pct >= 62) return { grade: "6", label: "Good", tone: "sky" };
  if (pct >= 55) return { grade: "5", label: "Strong Pass", tone: "amber" };
  if (pct >= 45) return { grade: "4", label: "Pass", tone: "amber" };
  if (pct >= 35) return { grade: "3", label: "Developing", tone: "orange" };
  if (pct >= 25) return { grade: "2", label: "Needs Improvement", tone: "orange" };
  if (pct >= 15) return { grade: "1", label: "Foundation", tone: "red" };
  return { grade: "U", label: "Ungraded", tone: "red" };
}

export function enrichMockResult(result, meta = {}) {
  const percent = scorePercent(result.totalCorrect, result.totalQuestions);
  const gradeInfo = percentToGrade(percent);
  return {
    ...result,
    ...meta,
    percent,
    grade: gradeInfo.grade,
    gradeLabel: gradeInfo.label,
    gradeTone: gradeInfo.tone,
  };
}
