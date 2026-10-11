"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type HorizontalScrollProps = {
  children: React.ReactNode;
  className?: string;
  trackClassName?: string;
};

/**
 * Pins the section and converts vertical scroll into horizontal travel of the
 * track (GSAP ScrollTrigger). RTL-aware: content overflows to the left, so the
 * track moves right. On small screens or with reduced motion it degrades to a
 * native, snap-scrolling horizontal list.
 */
export function HorizontalScroll({ children, className, trackClassName }: HorizontalScrollProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const section = sectionRef.current!;
        const track = trackRef.current!;
        const rtl = getComputedStyle(section).direction === "rtl";
        const distance = () => Math.max(0, track.scrollWidth - section.clientWidth);

        gsap.to(track, {
          x: () => (rtl ? distance() : -distance()),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <div ref={sectionRef} className={cn("overflow-hidden", className)}>
      <div
        ref={trackRef}
        className={cn(
          "flex w-max gap-6 will-change-transform max-md:w-auto max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto max-md:pb-4 motion-reduce:w-auto motion-reduce:overflow-x-auto",
          trackClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
