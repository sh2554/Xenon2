/** OCR J277 spec strands used for mock-test heatmaps. */

export const OCR_SPEC_TOPICS = [
  { id: "1.1", label: "1.1 CPU Architecture" },
  { id: "1.2", label: "1.2 Memory & Storage" },
  { id: "1.3", label: "1.3 Networks & Protocols" },
  { id: "1.4", label: "1.4 Security & Ethics" },
  { id: "2.1", label: "2.1 Algorithms" },
  { id: "2.2", label: "2.2 Programming Fundamentals" },
  { id: "2.3", label: "2.3 Boolean Logic" },
  { id: "2.4", label: "2.4 Data Representation" },
];

export function topicLabel(id) {
  return OCR_SPEC_TOPICS.find((t) => t.id === id)?.label || id;
}
