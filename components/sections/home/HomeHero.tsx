"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { HeroCanvas } from "@/components/3d";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SplitText } from "@/components/motion/SplitText";

type Hero = { badge: string; title: string; description: string };

export function HomeHero({ hero, colors }: { hero: Hero; colors: string[] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={ref} className="noise relative flex min-h-svh items-center overflow-hidden">
      <motion.div style={{ scale: sceneScale }} className="absolute inset-0">
        <HeroCanvas colors={colors} />
      </motion.div>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10 md:via-background/40"
        aria-hidden
      />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="container-page relative pt-24">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.04] px-4 py-1.5 text-sm text-muted-foreground backdrop-blur"
        >
          <span className="size-1.5 animate-pulse rounded-full bg-primary" aria-hidden />
          {hero.badge}
        </motion.span>

        <SplitText
          as="h1"
          immediate
          delay={0.3}
          text={hero.title}
          className="mt-6 max-w-4xl text-5xl leading-[1.1] font-black tracking-tight sm:text-7xl lg:text-8xl"
          wordClassName="text-gradient"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.9 }}
          className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl"
        >
          {hero.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.9 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <MagneticButton>
            <Button asChild size="lg">
              <Link href="/subsidiaries">
                آشنایی با زیرمجموعه‌ها
                <ArrowLeft />
              </Link>
            </Button>
          </MagneticButton>
          <MagneticButton>
            <Button asChild size="lg" variant="outline">
              <Link href="/about">درباره هلدینگ</Link>
            </Button>
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.a
        href="#intro"
        aria-label="اسکرول به بخش بعد"
        style={{ opacity: contentOpacity }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs text-muted-foreground"
      >
        <span>اسکرول کنید</span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <ChevronDown className="size-4" />
        </motion.span>
      </motion.a>
    </section>
  );
}
