"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Glow colour that follows the pointer. */
  glow?: string;
  /** Maximum tilt in degrees. */
  max?: number;
};

/** Card that tilts in 3D toward the pointer with a glow spot following it. */
export function TiltCard({ children, className, glow = "var(--primary)", max = 10 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 200, damping: 20, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const glowX = useTransform(px, (v) => `${v * 100}%`);
  const glowY = useTransform(py, (v) => `${v * 100}%`);
  const background = useMotionTemplate`radial-gradient(420px circle at ${glowX} ${glowY}, color-mix(in oklch, ${glow} 28%, transparent), transparent 60%)`;

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function reset() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <div className="[perspective:1000px]">
      <motion.div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={reset}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn(
          "group relative h-full overflow-hidden rounded-xl border border-border bg-card/60 backdrop-blur transition-[border-color,box-shadow] duration-500 hover:border-white/20",
          className,
        )}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background }}
        />
        <div className="relative h-full [transform:translateZ(30px)]">{children}</div>
      </motion.div>
    </div>
  );
}
