"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin reading-progress bar pinned to the top of the viewport (grows right-to-left for RTL). */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-right bg-gradient-to-l from-primary via-primary/80 to-transparent"
    />
  );
}
