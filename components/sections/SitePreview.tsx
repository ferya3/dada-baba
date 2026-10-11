"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import type { Screenshot } from "@/lib/content/types";
import { cn } from "@/lib/utils";
import { BrowserFrame, displayHost } from "./BrowserFrame";

type ScrollingShotProps = {
  screenshot: Screenshot;
  alt: string;
  /** 0 → top of the page is shown, 1 → bottom of the page is shown. */
  progress: MotionValue<number>;
  priority?: boolean;
  sizes?: string;
};

/**
 * A full-page screenshot inside a fixed-ratio viewport that scrolls through
 * the page as `progress` goes from 0 to 1. Works with any screenshot height.
 */
export function ScrollingShot({ screenshot, alt, progress, priority, sizes }: ScrollingShotProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLDivElement>(null);
  const overflow = useRef(0);

  useEffect(() => {
    const measure = () => {
      if (viewport.current && image.current) {
        overflow.current = Math.max(0, image.current.offsetHeight - viewport.current.offsetHeight);
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (viewport.current) observer.observe(viewport.current);
    if (image.current) observer.observe(image.current);
    return () => observer.disconnect();
  }, []);

  const y = useTransform(progress, (p) => -Math.min(1, Math.max(0, p)) * overflow.current);

  return (
    <div ref={viewport} className="absolute inset-0 overflow-hidden">
      <motion.div ref={image} style={{ y }} className="will-change-transform">
        <Image
          src={screenshot.src}
          width={screenshot.width}
          height={screenshot.height}
          alt={alt}
          priority={priority}
          sizes={sizes ?? "(min-width: 1024px) 50vw, 100vw"}
          className="block h-auto w-full select-none"
          draggable={false}
        />
      </motion.div>
    </div>
  );
}

type SitePreviewProps = {
  name: string;
  website?: string;
  screenshot: Screenshot;
  color: string;
  className?: string;
};

/** Browser-framed screenshot that scrolls through the site as the card passes through the viewport. */
export function SitePreview({ name, website, screenshot, color, className }: SitePreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useTransform(scrollYProgress, [0.15, 0.85], [0, 1]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div
        className="absolute -inset-8 -z-10 rounded-[3rem] opacity-40 blur-3xl"
        style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }}
        aria-hidden
      />
      <BrowserFrame address={displayHost(website)}>
        <div className="relative aspect-[16/10]">
          <ScrollingShot screenshot={screenshot} alt={`نمای وب‌سایت ${name}`} progress={progress} />
        </div>
      </BrowserFrame>
    </div>
  );
}
