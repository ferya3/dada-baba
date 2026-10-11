"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SplitTextProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean;
};

/**
 * Masked word-by-word reveal. Persian letters join, so text is split by word
 * (never by character) to keep the script's ligatures intact. Screen readers
 * get the whole sentence via aria-label.
 */
export function SplitText({
  text,
  as: Tag = "h2",
  className,
  wordClassName,
  delay = 0,
  stagger = 0.06,
  immediate = false,
}: SplitTextProps) {
  const words = text.split(" ");
  const MotionTag = motion[Tag];
  const trigger = immediate
    ? { initial: "hidden", animate: "show" }
    : { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } };

  return (
    <MotionTag
      aria-label={text}
      className={className}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      {...trigger}
    >
      {words.map((word, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className={cn("inline-block", wordClassName)}
            variants={{
              hidden: { y: "110%", opacity: 0 },
              show: { y: "0%", opacity: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </MotionTag>
  );
}
