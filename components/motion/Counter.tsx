"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { toFaNumber } from "@/lib/utils";

type CounterProps = { value: number; suffix?: string; duration?: number; className?: string };

/** Counts up from zero (in Persian digits) the first time it scrolls into view. */
export function Counter({ value, suffix = "", duration = 2, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reducedMotion = useReducedMotion();

  // Once hydrated, start from zero so the count-up has somewhere to come from.
  useEffect(() => {
    if (ref.current && !reducedMotion) ref.current.textContent = toFaNumber(0) + suffix;
  }, [reducedMotion, suffix]);

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;
    if (reducedMotion) {
      node.textContent = toFaNumber(value) + suffix;
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = toFaNumber(Math.round(v)) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, duration, reducedMotion]);

  // Server-rendered with the final value so crawlers and no-JS users see real numbers.
  return (
    <span ref={ref} className={className}>
      {toFaNumber(value) + suffix}
    </span>
  );
}
