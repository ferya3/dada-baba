"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

let lenisInstance: Lenis | null = null;

/** The active Lenis instance (null when smooth scrolling is disabled). */
export function getLenis() {
  return lenisInstance;
}

/**
 * Lenis smooth scrolling driven by GSAP's ticker, so ScrollTrigger and Lenis
 * share one animation frame. Disabled entirely for reduced-motion users.
 */
export function SmoothScroll() {
  const reducedMotion = usePrefersReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: true });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, [reducedMotion]);

  // New page: jump to top and let ScrollTrigger re-measure the new layout.
  useEffect(() => {
    lenisInstance?.scrollTo(0, { immediate: true, force: true });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
