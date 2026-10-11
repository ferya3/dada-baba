"use client";

import Link from "next/link";
import { useRef } from "react";
import { useScroll } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { OrbitCanvas, type OrbitItem } from "@/components/3d";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { useUIStore } from "@/store/ui";
import { cn, toFaDigits } from "@/lib/utils";

type Item = OrbitItem & { sector: string; summary: string };

/**
 * Sticky section: as the reader scrolls through it, the 3D orbit turns. The
 * list beside it is the accessible, crawlable version of the same links.
 */
export function SubsidiaryOrbitSection({ items }: { items: Item[] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const active = useUIStore((s) => s.activeSubsidiary);
  const setActive = useUIStore((s) => s.setActiveSubsidiary);

  return (
    <section ref={ref} className="relative lg:h-[220vh]" aria-labelledby="subsidiaries-heading">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center">
        <div className="container-page grid items-center gap-10 py-24 lg:grid-cols-2 lg:py-0">
          <div className="flex flex-col gap-10">
            <div id="subsidiaries-heading">
              <SectionHeading
                eyebrow="زیرمجموعه‌ها"
                title="پنج شرکت، یک مدار"
                description="هر زیرمجموعه در صنعت خود پیشرو است و در کنار هم، توانی فراتر از مجموع اجزا می‌سازند."
              />
            </div>
            <ul className="flex flex-col">
              {items.map((item, i) => (
                <li key={item.slug} className="border-b border-border first:border-t">
                  <Link
                    href={`/subsidiaries/${item.slug}`}
                    onPointerEnter={() => setActive(item.slug)}
                    onPointerLeave={() => setActive(null)}
                    onFocus={() => setActive(item.slug)}
                    onBlur={() => setActive(null)}
                    data-cursor-label="مشاهده"
                    className="group flex items-center gap-4 py-5"
                  >
                    <span className="text-xs text-muted-foreground tabular-nums">{toFaDigits(`0${i + 1}`)}</span>
                    <span
                      className={cn(
                        "size-2.5 rounded-full transition-transform duration-300",
                        active === item.slug && "scale-150",
                      )}
                      style={{ background: item.color, boxShadow: `0 0 18px ${item.color}` }}
                      aria-hidden
                    />
                    <span className="flex flex-1 flex-col">
                      <span
                        className={cn(
                          "text-xl font-bold transition-colors sm:text-2xl",
                          active && active !== item.slug && "text-muted-foreground",
                        )}
                      >
                        {item.name}
                      </span>
                      <span className="text-sm text-muted-foreground">{item.sector}</span>
                    </span>
                    <ArrowLeft className="size-5 text-muted-foreground transition-transform duration-300 group-hover:-translate-x-2 group-hover:text-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-square w-full max-lg:max-h-[70vh]">
            <OrbitCanvas items={items} progress={scrollYProgress} />
          </div>
        </div>
      </div>
    </section>
  );
}
