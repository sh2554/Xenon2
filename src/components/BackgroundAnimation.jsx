import { memo, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * High-performance, mouse-reactive ambient background animation.
 * Features organic ambient drift, interactive mouse spotlight follow,
 * and subtle 3D parallax shifts with zero emojis and 60fps GPU acceleration.
 */
function BackgroundAnimation() {
  const [isHovered, setIsHovered] = useState(false);

  // Mouse motion values for GPU compositing
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Smooth springs for fluid, natural cursor following
  const springConfig = { stiffness: 180, damping: 26, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Window bounds for parallax calculations
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Parallax transforms for the floating ambient orbs based on mouse location
  const orb1ParallaxX = useTransform(smoothX, [0, windowSize.width], [-30, 30]);
  const orb1ParallaxY = useTransform(smoothY, [0, windowSize.height], [-25, 25]);

  const orb2ParallaxX = useTransform(smoothX, [0, windowSize.width], [35, -35]);
  const orb2ParallaxY = useTransform(smoothY, [0, windowSize.height], [30, -30]);

  useEffect(() => {
    const handlePointerMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isHovered) setIsHovered(true);
    };

    const handlePointerLeave = () => {
      setIsHovered(false);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, [mouseX, mouseY, isHovered]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Subtle background geometric grid */}
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

      {/* Floating Ambient Orb 1 - Primary Accent Glow (Top Left + Parallax) */}
      <motion.div
        className="absolute -top-[120px] -left-[120px] w-[560px] h-[560px] rounded-full blur-[140px]"
        style={{
          background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          opacity: 0.08,
          x: orb1ParallaxX,
          y: orb1ParallaxY,
          willChange: "transform",
        }}
        animate={{
          scale: [1, 1.14, 0.96, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Ambient Orb 2 - Secondary Dark Pink Glow (Bottom Right + Inverse Parallax) */}
      <motion.div
        className="absolute -bottom-[160px] -right-[140px] w-[620px] h-[620px] rounded-full blur-[160px]"
        style={{
          background: "radial-gradient(circle, var(--accent) 0%, transparent 75%)",
          opacity: 0.06,
          x: orb2ParallaxX,
          y: orb2ParallaxY,
          willChange: "transform",
        }}
        animate={{
          scale: [1, 0.94, 1.15, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Ambient Orb 3 - Center Ambient Shimmer */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] rounded-full blur-[180px]"
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

      {/* Mouse Reactive Spotlight 1 - Wide Outer Glow */}
      <motion.div
        className="absolute rounded-full blur-[90px]"
        style={{
          x: smoothX,
          y: smoothY,
          width: 520,
          height: 520,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, var(--accent) 0%, rgba(190, 24, 93, 0.18) 40%, transparent 70%)",
          opacity: isHovered ? 0.10 : 0,
          willChange: "transform, opacity",
        }}
        transition={{ opacity: { duration: 0.3 } }}
      />

      {/* Mouse Reactive Spotlight 2 - Focused Inner Ambient Core */}
      <motion.div
        className="absolute rounded-full blur-[45px]"
        style={{
          x: smoothX,
          y: smoothY,
          width: 240,
          height: 240,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, var(--accent) 0%, transparent 75%)",
          opacity: isHovered ? 0.07 : 0,
          willChange: "transform, opacity",
        }}
        transition={{ opacity: { duration: 0.25 } }}
      />

      {/* Subtle top edge illumination accent line */}
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
