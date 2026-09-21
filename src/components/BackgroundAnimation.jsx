import { memo } from "react";
import { motion } from "framer-motion";

/**
 * High-performance, subtle ambient background animation.
 * Hardware-accelerated with zero emojis and responsive to the active theme palette.
 */
function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Subtle background grid */}
      <div 
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--text) 1px, transparent 1px),
            linear-gradient(to bottom, var(--text) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Floating Ambient Orb 1 - Primary Accent Glow (Top Left) */}
      <motion.div
        className="absolute -top-[120px] -left-[120px] w-[540px] h-[540px] rounded-full blur-[140px]"
        style={{
          background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          opacity: 0.07,
          willChange: "transform",
        }}
        animate={{
          x: [0, 45, -25, 0],
          y: [0, 35, -20, 0],
          scale: [1, 1.12, 0.94, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Ambient Orb 2 - Secondary Dark Pink Glow (Bottom Right) */}
      <motion.div
        className="absolute -bottom-[160px] -right-[140px] w-[620px] h-[620px] rounded-full blur-[160px]"
        style={{
          background: "radial-gradient(circle, var(--accent) 0%, transparent 75%)",
          opacity: 0.05,
          willChange: "transform",
        }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, -40, 25, 0],
          scale: [1, 0.92, 1.15, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Ambient Orb 3 - Center Subtle Shimmer */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[180px]"
        style={{
          background: "radial-gradient(circle, var(--accent) 0%, transparent 65%)",
          opacity: 0.03,
          willChange: "transform",
        }}
        animate={{
          scale: [0.95, 1.08, 0.95],
          opacity: [0.02, 0.045, 0.02],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle top edge ambient illumination line */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, var(--accent-glow), transparent)",
          opacity: 0.4,
        }}
      />
    </div>
  );
}

export default memo(BackgroundAnimation);
