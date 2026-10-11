"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowLeft, ArrowUpLeft } from "lucide-react";
import type { Screenshot, Stat } from "@/lib/content/types";
import { cn, toFaDigits, toFaNumber } from "@/lib/utils";
import { getLenis } from "@/components/motion/SmoothScroll";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { BrowserFrame, displayHost } from "@/components/sections/BrowserFrame";
import { ScrollingShot, SitePreview } from "@/components/sections/SitePreview";
import { Button } from "@/components/ui/button";

export type ShowcaseItem = {
  slug: string;
  name: string;
  sector: string;
  summary: string;
  color: string;
  website?: string;
  screenshot: Screenshot;
  stats: Stat[];
};

const EASE = [0.76, 0, 0.24, 1] as const;
/** Share of each step spent on the swap before the screenshot starts scrolling. */
const SWAP = 0.15;

const pad = (n: number) => toFaDigits(String(n).padStart(2, "0"));

/**
 * "Five companies" section. On desktop the section is pinned while the reader
 * scrolls through one step per subsidiary: its site screenshot wipes in over
 * the previous one inside a browser frame and then scrolls through the page.
 * On smaller screens it becomes a simple list of framed previews.
 */
type HeadingCopy = { title: string; description: string };

export function SubsidiaryShowcase({ items, heading }: { items: ShowcaseItem[]; heading: HeadingCopy }) {
  return (
    <section aria-labelledby="subsidiaries-heading">
      <DesktopShowcase items={items} heading={heading} />
      <MobileShowcase items={items} heading={heading} />
    </section>
  );
}

function Heading({ title, description }: HeadingCopy) {
  return (
    <div id="subsidiaries-heading">
      <SectionHeading
        eyebrow="زیرمجموعه‌ها"
        title={title}
        description={description}
      />
    </div>
  );
}

function DesktopShowcase({ items, heading }: { items: ShowcaseItem[]; heading: HeadingCopy }) {
  const ref = useRef<HTMLDivElement>(null);
  const count = items.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(Math.min(count - 1, Math.max(0, Math.floor(p * count))));
  });

  function goTo(index: number) {
    const section = ref.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const travel = section.offsetHeight - window.innerHeight;
    const target = top + ((index + SWAP + 0.01) / count) * travel;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { duration: 1.2 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  }

  const current = items[active];
  if (!current) return null;

  return (
    <div ref={ref} className="relative hidden lg:block" style={{ height: `${count * 90 + 10}vh` }}>
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        {/* Ambient colour of the active subsidiary */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-[22%] size-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[120px]"
          animate={{ backgroundColor: current.color }}
          transition={{ duration: 1 }}
        />

        <div className="container-page relative grid grid-cols-[1fr_1.25fr] items-center gap-16">
          <div className="flex flex-col gap-8">
            <Heading {...heading} />
            <ol className="flex flex-col">
              {items.map((item, i) => (
                <StepItem
                  key={item.slug}
                  item={item}
                  index={i}
                  count={count}
                  active={i === active}
                  done={i < active}
                  progress={scrollYProgress}
                  onSelect={() => goTo(i)}
                />
              ))}
            </ol>
          </div>

          <div className="relative">
            <div className="mb-5 flex items-end justify-between" dir="ltr">
              <span className="flex items-baseline gap-2 font-black tabular-nums">
                <span className="relative inline-block h-[1.1em] overflow-hidden text-5xl leading-none">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={active}
                      className="block"
                      style={{ color: current.color }}
                      initial={{ y: "100%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "-100%" }}
                      transition={{ duration: 0.6, ease: EASE }}
                    >
                      {toFaDigits(active + 1)}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="text-lg text-muted-foreground">/ {toFaDigits(count)}</span>
              </span>
              <span className="flex gap-1.5" aria-hidden>
                {items.map((item, i) => (
                  <motion.span
                    key={item.slug}
                    className="h-1 rounded-full"
                    animate={{ width: i === active ? 32 : 8, backgroundColor: i === active ? item.color : "#ffffff33" }}
                    transition={{ duration: 0.5 }}
                  />
                ))}
              </span>
            </div>

            <Link
              href={`/subsidiaries/${current.slug}`}
              data-cursor-label="مشاهده"
              aria-label={`صفحه ${current.name}`}
              className="block"
            >
              <BrowserFrame
                address={
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={active}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                    >
                      {displayHost(current.website) ?? current.name}
                    </motion.span>
                  </AnimatePresence>
                }
              >
                <div className="relative aspect-[16/10] bg-background">
                  {items.map((item, i) => (
                    <Slide
                      key={item.slug}
                      item={item}
                      index={i}
                      count={count}
                      state={i === active ? "active" : i < active ? "past" : "next"}
                      progress={scrollYProgress}
                    />
                  ))}
                </div>
              </BrowserFrame>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Maps overall section progress to this step's own 0–1 progress. */
function useStepProgress(progress: MotionValue<number>, index: number, count: number, from = 0) {
  return useTransform(progress, (p) => {
    const local = p * count - index;
    return Math.min(1, Math.max(0, (local - from) / (1 - from)));
  });
}

function Slide({
  item,
  index,
  count,
  state,
  progress,
}: {
  item: ShowcaseItem;
  index: number;
  count: number;
  state: "past" | "active" | "next";
  progress: MotionValue<number>;
}) {
  // Hold the top of the page while it wipes in, then scroll through it.
  const pageProgress = useStepProgress(progress, index, count, SWAP);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      style={{ zIndex: index }}
      initial={false}
      animate={{
        clipPath: state === "next" ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 0% 0%)",
        scale: state === "past" ? 0.92 : 1,
      }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <ScrollingShot
        screenshot={item.screenshot}
        alt={`نمای وب‌سایت ${item.name}`}
        progress={pageProgress}
        sizes="(min-width: 1280px) 720px, 55vw"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black"
        initial={false}
        animate={{ opacity: state === "past" ? 0.6 : 0 }}
        transition={{ duration: 0.9, ease: EASE }}
      />
    </motion.div>
  );
}

function StepItem({
  item,
  index,
  count,
  active,
  done,
  progress,
  onSelect,
}: {
  item: ShowcaseItem;
  index: number;
  count: number;
  active: boolean;
  done: boolean;
  progress: MotionValue<number>;
  onSelect: () => void;
}) {
  const fill = useStepProgress(progress, index, count);

  return (
    <li className="relative ps-6">
      {/* Progress rail: fills while this step is on screen */}
      <span className="absolute inset-y-0 start-0 w-px bg-border" aria-hidden />
      <motion.span
        className="absolute inset-y-0 start-0 w-px origin-top"
        style={{ scaleY: fill, backgroundColor: item.color }}
        aria-hidden
      />

      <button
        type="button"
        onClick={onSelect}
        aria-current={active ? "step" : undefined}
        className="group flex w-full items-center gap-4 py-3 text-start"
      >
        <span className="text-xs text-muted-foreground tabular-nums">{pad(index + 1)}</span>
        <span
          className={cn("size-2.5 rounded-full transition-transform duration-500", active && "scale-150")}
          style={{ background: item.color, boxShadow: active ? `0 0 18px ${item.color}` : undefined }}
          aria-hidden
        />
        <span
          className={cn(
            "text-xl font-bold transition-colors duration-500",
            active ? "text-foreground" : done ? "text-muted-foreground" : "text-muted-foreground/70 group-hover:text-foreground",
          )}
        >
          {item.name}
        </span>
        <span className="ms-auto text-sm text-muted-foreground">{item.sector}</span>
      </button>

      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-5 pt-1 pb-5">
              <p className="max-w-md leading-8 text-muted-foreground">{item.summary}</p>
              <dl className="flex gap-8">
                {item.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-1">
                    <dt className="order-2 text-xs text-muted-foreground">{stat.label}</dt>
                    <dd className="order-1 text-2xl font-black tabular-nums" style={{ color: item.color }}>
                      {toFaNumber(stat.value)}
                      {stat.suffix}
                    </dd>
                  </div>
                ))}
              </dl>
              <ItemLinks item={item} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function ItemLinks({ item }: { item: ShowcaseItem }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button asChild size="sm">
        <Link href={`/subsidiaries/${item.slug}`}>
          معرفی شرکت
          <ArrowLeft />
        </Link>
      </Button>
      {item.website && (
        <Button asChild size="sm" variant="outline">
          <a href={item.website} target="_blank" rel="noopener noreferrer">
            وب‌سایت
            <ArrowUpLeft />
          </a>
        </Button>
      )}
    </div>
  );
}

function MobileShowcase({ items, heading }: { items: ShowcaseItem[]; heading: HeadingCopy }) {
  return (
    <div className="container-page flex flex-col gap-16 py-24 lg:hidden">
      <Heading {...heading} />
      {items.map((item, i) => (
        <article key={item.slug} className="flex flex-col gap-6">
          <SitePreview name={item.name} website={item.website} screenshot={item.screenshot} color={item.color} />
          <div className="flex flex-col gap-3">
            <span className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="tabular-nums">{pad(i + 1)}</span>
              <span className="size-2 rounded-full" style={{ background: item.color }} aria-hidden />
              {item.sector}
            </span>
            <h3 className="text-2xl font-black">{item.name}</h3>
            <p className="leading-8 text-muted-foreground">{item.summary}</p>
            <ItemLinks item={item} />
          </div>
        </article>
      ))}
    </div>
  );
}
