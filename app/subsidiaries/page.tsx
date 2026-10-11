import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSubsidiaries } from "@/lib/content";
import { PageHeader } from "@/components/sections/PageHeader";
import { CallToAction } from "@/components/sections/CallToAction";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { Icon } from "@/components/ui/icon";
import { toFaDigits } from "@/lib/utils";

export const metadata: Metadata = {
  title: "زیرمجموعه‌ها",
  description: "آشنایی با پنج شرکت تخصصی هلدینگ آوند در عمران، انرژی، فناوری، بازرگانی و سرمایه‌گذاری.",
  alternates: { canonical: "/subsidiaries" },
};

export default async function SubsidiariesPage() {
  const subsidiaries = await getSubsidiaries();

  return (
    <>
      <PageHeader
        eyebrow="زیرمجموعه‌ها"
        title="پنج شرکت، پنج تخصص، یک هدف"
        description="هر زیرمجموعه مستقل و متخصص است، اما همه از سرمایه، دانش و شبکه مشترک هلدینگ بهره می‌برند."
        path="/subsidiaries"
      />

      <section className="container-page py-12">
        <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
          {subsidiaries.map((s, i) => (
            <RevealItem key={s.slug} className={i < 2 ? "lg:col-span-3" : "lg:col-span-2"}>
              <TiltCard glow={s.color} max={8}>
                <Link
                  href={`/subsidiaries/${s.slug}`}
                  data-cursor-label="مشاهده"
                  className="flex h-full min-h-80 flex-col gap-5 p-8"
                >
                  <div className="flex items-start justify-between">
                    <span
                      className="grid size-14 place-items-center rounded-2xl ring-1"
                      style={{
                        background: `color-mix(in oklch, ${s.color} 15%, transparent)`,
                        color: s.color,
                        boxShadow: `0 0 40px -10px ${s.color}`,
                      }}
                    >
                      <Icon name={s.icon} className="size-7" />
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      تأسیس {toFaDigits(s.founded)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm" style={{ color: s.color }}>
                      {s.sector}
                    </span>
                    <h2 className="text-2xl font-black">{s.name}</h2>
                    <p className="leading-7 text-muted-foreground">{s.summary}</p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium">
                    مشاهده شرکت
                    <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1.5" />
                  </span>
                </Link>
              </TiltCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <CallToAction />
    </>
  );
}
