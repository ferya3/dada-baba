"use client";

import { motion } from "framer-motion";

/**
 * Enter transition for every route (rendered from app/template.tsx, which remounts per navigation).
 * Only opacity + translate: a lingering `filter` or `transform` on this wrapper would become the
 * containing block for `position: fixed` and break GSAP pinning, so the transform is cleared at the end.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      transformTemplate={(_, generated) => (generated === "none" || generated === "translateY(0px)" ? "none" : generated)}
    >
      {children}
    </motion.div>
  );
}
