export function scorePercent(correct, total) {
  if (!total) return 0;
  return Math.round((Math.max(0, correct) / total) * 100);
}

export function percentToGrade(pct) {
  if (pct >= 90) return { grade: "A*", label: "Outstanding", tone: "emerald" };
  if (pct >= 80) return { grade: "A", label: "Excellent", tone: "emerald" };
  if (pct >= 70) return { grade: "B", label: "Good", tone: "sky" };
  if (pct >= 60) return { grade: "C", label: "Pass", tone: "amber" };
  if (pct >= 50) return { grade: "D", label: "Borderline", tone: "orange" };
  return { grade: "U", label: "Needs work", tone: "red" };
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
