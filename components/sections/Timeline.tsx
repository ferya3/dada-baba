"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import type { TimelineEntry } from "@/lib/content/types";
import { toFaDigits } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";

/** Vertical timeline whose spine draws itself as the reader scrolls through it. */
export function Timeline({ entries, color = "var(--primary)" }: { entries: TimelineEntry[]; color?: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });

  return (
    <ol ref={ref} className="relative flex flex-col gap-12 ps-10">
      <span className="absolute inset-y-0 start-[11px] w-px bg-border" aria-hidden />
      <motion.span
        className="absolute inset-y-0 start-[11px] w-px origin-top"
        style={{ scaleY, background: color }}
        aria-hidden
      />
      {entries.map((entry, i) => (
        <li key={entry.year} className="relative">
          <span
            className="absolute -start-10 top-1 grid size-6 place-items-center rounded-full border bg-background"
            style={{ borderColor: color }}
            aria-hidden
          >
            <span className="size-2 rounded-full" style={{ background: color }} />
          </span>
          <Reveal delay={i * 0.05}>
            <span className="text-sm font-bold tabular-nums" style={{ color }}>
              {toFaDigits(entry.year)}
            </span>
            <h3 className="mt-1 text-xl font-bold">{entry.title}</h3>
            <p className="mt-2 max-w-lg leading-7 text-muted-foreground">{entry.description}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
