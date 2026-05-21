const formatPracticeTime = (seconds = 0) => {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${totalSeconds}s`;
};

import {
  buildHeatmapFromMockResults,
  studentHasMockTestData,
  loadMockResults,
} from "./mockTests";

function studentHasActivity(member) {
  return (
    (member.practice_questions_correct || 0) > 0 ||
    (member.total_projects || 0) > 0 ||
    (member.total_time_seconds || 0) > 0
  );
}

function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Build per-student heatmap from mock test results only. */
export function buildStudentHeatmapRows(members = [], mockResultsByStudent = {}) {
  return members
    .map((member) => {
      const studentId = member.student_id;
      const name = member.profiles?.first_name || member.profiles?.username || "Student";
      const results =
        mockResultsByStudent[studentId] ||
        (typeof window !== "undefined" ? loadMockResults(studentId) : []);
      const hasTestData = studentHasMockTestData(results);
      return {
        studentId,
        name,
        username: member.profiles?.username,
        hasTestData,
        topics: buildHeatmapFromMockResults(results),
        mockTestCount: new Set(results.map((r) => r.testId).filter(Boolean)).size || results.length,
      };
    })
    .filter((row) => row.hasTestData);
}

function buildReportHtml(cls) {
  const members = cls?.class_members || [];
  const className = escapeHtml(cls?.name || "Class");
  const date = escapeHtml(new Date().toLocaleString());
  const rows = members.map((m) => ({
    name: escapeHtml(m.profiles?.first_name || m.profiles?.username || "Student"),
    username: escapeHtml(m.profiles?.username || "—"),
    questions: escapeHtml(m.practice_questions_correct ?? "n/a"),
    projects: escapeHtml(m.total_projects ?? "n/a"),
    time: escapeHtml(studentHasActivity(m) ? formatPracticeTime(m.total_time_seconds) : "n/a"),
  }));

  const heatmapRows = buildStudentHeatmapRows(members).map((s) => ({
    name: escapeHtml(s.name),
    username: escapeHtml(s.username || "—"),
    topics: s.topics.map((t) => ({
      topic: escapeHtml(t.topic),
      mastery: escapeHtml(t.mastery),
      label: escapeHtml(t.label),
    })),
  }));

  const rosterRows = rows.length
    ? rows
        .map(
          (r) =>
            `<tr><td>${r.name}</td><td>@${r.username}</td><td>${r.questions}</td><td>${r.projects}</td><td>${r.time}</td></tr>`
        )
        .join("")
    : `<tr><td colspan="5">No students enrolled.</td></tr>`;

  const heatmapHtml = heatmapRows.length
    ? heatmapRows
        .map(
          (s) => `
    <div class="student-block">
      <h3>${s.name} (@${s.username})</h3>
      <div class="topic-grid">
        ${s.topics
          .map(
            (t) =>
              `<div class="topic"><strong>${t.topic}</strong><span>${t.mastery} · ${t.label}</span></div>`
          )
          .join("")}
      </div>
    </div>`
        )
        .join("")
    : "<p>No students enrolled.</p>";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>${className} — GCSE Progress</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, Segoe UI, sans-serif; padding: 24px; color: #111; margin: 0; }
    h1 { font-size: 1.5rem; margin: 0 0 0.25rem; }
    h2 { font-size: 1.1rem; margin: 1.5rem 0 0.75rem; }
    .meta { color: #555; font-size: 0.85rem; margin-bottom: 1rem; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; font-size: 0.85rem; }
    th, td { border: 1px solid #ccc; padding: 8px 10px; text-align: left; }
    th { background: #f0f4f8; }
    .student-block { page-break-inside: avoid; margin-bottom: 1.25rem; }
    .student-block h3 { font-size: 1rem; margin: 0 0 0.5rem; }
    .topic-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .topic { border: 1px solid #ddd; padding: 8px; border-radius: 6px; font-size: 0.75rem; }
    .topic strong { display: block; margin-bottom: 4px; }
    .topic span { color: #444; }
    .print-hint { margin-top: 2rem; font-size: 0.8rem; color: #666; }
    @media print {
      body { padding: 12px; }
      .print-hint { display: none; }
    }
  </style>
</head>
<body>
  <h1>${className} — GCSE Roster Progress</h1>
  <p class="meta">Generated ${date} · Xenon Code</p>
  <h2>Roster summary</h2>
  <table>
    <thead>
      <tr><th>Student</th><th>Username</th><th>Questions correct</th><th>Projects</th><th>Practice time</th></tr>
    </thead>
    <tbody>${rosterRows}</tbody>
  </table>
  <h2>Curriculum spec heatmap (per student)</h2>
  ${heatmapHtml}
  <p class="print-hint">Use your browser&apos;s Print dialog and choose &quot;Save as PDF&quot; to download this report.</p>
  <script>
    window.addEventListener("load", function () {
      setTimeout(function () { window.print(); }, 300);
    });
  </script>
</body>
</html>`;
}

/** Print via hidden iframe when pop-ups are blocked. */
function printHtmlViaIframe(html) {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("title", "Roster progress report");
  iframe.style.cssText =
    "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    throw new Error("Could not create print frame.");
  }

  doc.open();
  doc.write(html);
  doc.close();

  const printFrame = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } finally {
      setTimeout(() => iframe.remove(), 2000);
    }
  };

  if (iframe.contentWindow?.document?.readyState === "complete") {
    setTimeout(printFrame, 300);
  } else {
    iframe.onload = () => setTimeout(printFrame, 300);
  }
}

export function exportRosterProgressReport(cls) {
  const html = buildReportHtml(cls);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  // Do not use noopener — it prevents writing to the new window and causes a blank tab
  const win = window.open(url, "_blank");

  if (!win) {
    URL.revokeObjectURL(url);
    printHtmlViaIframe(html);
    return;
  }

  const revoke = () => URL.revokeObjectURL(url);
  win.addEventListener("load", revoke, { once: true });
  setTimeout(revoke, 60_000);
}

export function exportRosterCsv(cls) {
  const members = cls?.class_members || [];
  const header = ["Name", "Username", "Questions Correct", "Projects", "Practice Time"];
  const lines = [header.join(",")];
  members.forEach((m) => {
    const name = (m.profiles?.first_name || m.profiles?.username || "Student").replace(/"/g, '""');
    const user = (m.profiles?.username || "").replace(/"/g, '""');
    const q = studentHasActivity(m) ? String(m.practice_questions_correct || 0) : "n/a";
    const p = studentHasActivity(m) ? String(m.total_projects || 0) : "n/a";
    const t = studentHasActivity(m) ? formatPracticeTime(m.total_time_seconds) : "n/a";
    lines.push(`"${name}","${user}",${q},${p},"${t}"`);
  });
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(cls?.name || "class").replace(/\s+/g, "-")}-roster.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
