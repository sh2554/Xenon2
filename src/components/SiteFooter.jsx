import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FOOTER_PAGES = {
  story: {
    title: "Our Story",
    content: [
      "One day I saw that Trinket was shutting down its server, so I decided to make Xenon Code.",
      "The goal was simple: keep Python learning easy in the browser for students and useful for teachers in class.",
      "Xenon Code was built to give people a clean coding space, saved projects, class tracking, and practise tools without a complicated setup.",
    ],
  },
  help: {
    title: "Help And FAQ",
    content: [
      "To join a class, go to Settings, choose the Student role, and enter the class code from your teacher.",
      "Leaderboard ranking is based on practise questions correct first, then projects created, then time spent practising.",
      "If your code does not run, check the output panel for hints about colons, brackets, indentation, imports, and variable names.",
      "Use the Practise Python Skills page to solve line-order questions and submit them for leaderboard progress.",
    ],
  },
  terms: {
    title: "Terms Of Service",
    content: [
      "Use Xenon Code for learning, teaching, and school-related coding in a respectful and lawful way.",
      "Do not upload harmful, abusive, or disruptive content or attempt to interfere with the platform.",
      "Users are responsible for the projects and class activity connected to their accounts.",
      "Features may change over time as Xenon Code improves for students and teachers.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    content: [
      "Xenon Code stores account details, saved projects, class membership, and progress data so the app can work properly.",
      "Practice time, project totals, and practise-question scores may be used to power class leaderboards and teacher views.",
      "The information in Xenon Code is used to support learning and classroom organisation, not advertising.",
      "This policy may be updated if the app changes or school requirements need it.",
    ],
  },
};

const FOOTER_LINKS = [
  { key: "help", label: "Help & FAQ" },
  { key: "terms", label: "Terms of Service" },
  { key: "privacy", label: "Privacy Policy" },
];

export default function SiteFooter({ onLogin, onSignup }) {
  const [activePage, setActivePage] = useState(null);
  const page = useMemo(() => (activePage ? FOOTER_PAGES[activePage] : null), [activePage]);

  return (
    <>
      <footer className="relative overflow-hidden border-t border-[var(--border)] bg-[var(--bg)] px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mx-auto max-w-7xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-6 border-b border-[var(--border)] pb-8">
            <div>
              <p className="text-xs font-normal uppercase tracking-widest text-[var(--text)]">
                XENON CODE PLATFORM
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Computer Science learning & python environment for schools.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {FOOTER_LINKS.map((link, idx) => (
                <motion.button
                  key={link.key}
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06, duration: 0.3 }}
                  type="button"
                  className="xenon-btn-ghost text-xs tracking-wider transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_0_12px_var(--accent-glow)]"
                  onClick={() => setActivePage(link.key)}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-[var(--muted)]">
            <p className="tracking-wider">MADE BY SHAHZAIN JEHANGIRI</p>
            <p>
              CONTACT:{" "}
              <a
                href="mailto:suggestions@xenoncode.xyz"
                className="font-semibold text-[var(--accent)] transition-colors duration-200 hover:underline hover:brightness-125"
              >
                SUGGESTIONS@XENONCODE.XYZ
              </a>
            </p>
          </div>
        </motion.div>
      </footer>

      <AnimatePresence>
        {page && (
          <motion.div
            key="footer-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onClick={() => setActivePage(null)}
          >
            <motion.div
              key="footer-modal-panel"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card relative w-full max-w-3xl overflow-hidden border border-[var(--border)] p-6 shadow-2xl sm:p-8 md:p-10"
            >
              {/* Subtle background glow effect */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-[var(--accent)]/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-[var(--accent)]/10 blur-3xl" />

              <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
                <div>
                  <p className="xenon-kicker text-xs font-semibold uppercase tracking-wider !text-[var(--accent)]">
                    DOCUMENTATION
                  </p>
                  <h2 className="text-gradient-purple mt-1 text-2xl font-bold tracking-tight">
                    {page.title}
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  className="xenon-btn-ghost text-xs tracking-wider"
                  onClick={() => setActivePage(null)}
                >
                  Close
                </motion.button>
              </div>

              <div className="relative z-10 mt-6 space-y-4 text-sm font-normal leading-relaxed text-[var(--muted)]">
                {page.content.map((paragraph, idx) => (
                  <motion.p
                    key={paragraph}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * idx, duration: 0.25 }}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
