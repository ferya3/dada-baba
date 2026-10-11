"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type HTMLMotionProps } from "framer-motion";

type ParallaxProps = HTMLMotionProps<"div"> & {
  /** Positive moves slower than the page, negative faster. Pixels of travel across the viewport. */
  offset?: number;
};

export function Parallax({ offset = 80, style, children, ...props }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div ref={ref} style={{ ...style, y }} {...props}>
      {children}
    </motion.div>
  );
}
