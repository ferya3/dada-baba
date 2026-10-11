import type { Metadata } from "next";
import { getHolding } from "@/lib/content";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { StatsGrid } from "@/components/sections/StatsGrid";
import { Timeline } from "@/components/sections/Timeline";
import { CallToAction } from "@/components/sections/CallToAction";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "درباره هلدینگ",
  description: "داستان، مأموریت، ارزش‌ها و مدیران هلدینگ آوند.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const holding = await getHolding();

  return (
    <>
      <PageHeader eyebrow="درباره هلدینگ" title="ما زنجیره کامل ارزش را می‌سازیم" description={holding.vision} path="/about" />

      <section className="container-page grid gap-12 py-16 lg:grid-cols-2">
        <Reveal className="flex flex-col gap-4 rounded-xl border border-border bg-card/40 p-8">
          <h2 className="text-sm font-bold text-primary">مأموریت</h2>
          <p className="text-xl leading-9">{holding.mission}</p>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col gap-4 rounded-xl border border-border bg-card/40 p-8">
          <h2 className="text-sm font-bold text-primary">چشم‌انداز</h2>
          <p className="text-xl leading-9">{holding.vision}</p>
        </Reveal>
      </section>

      <section className="container-page grid gap-12 py-16 lg:grid-cols-[1fr_1.2fr]">
        <SectionHeading eyebrow="داستان ما" title="از یک کارگاه کوچک تا پنج شرکت پیشرو" />
        <div className="flex flex-col gap-6 text-lg leading-9 text-muted-foreground">
          {holding.story.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p>{p}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <StatsGrid stats={holding.stats} />
      </section>

      <section className="container-page py-24">
        <SectionHeading eyebrow="ارزش‌ها" title="آنچه ما را کنار هم نگه می‌دارد" />
        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {holding.values.map((v) => (
            <RevealItem key={v.title}>
              <TiltCard>
                <div className="flex flex-col gap-4 p-7">
                  <Icon name={v.icon} className="size-7 text-primary" />
                  <h3 className="text-lg font-bold">{v.title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{v.description}</p>
                </div>
              </TiltCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="container-page grid gap-12 py-24 lg:grid-cols-2">
        <SectionHeading eyebrow="مسیر رشد" title="نقاط عطف هلدینگ" className="lg:sticky lg:top-32 lg:self-start" />
        <Timeline entries={holding.timeline} />
      </section>

      <section className="container-page py-24">
        <SectionHeading eyebrow="مدیران" title="رهبری گروه" />
        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {holding.leadership.map((leader) => (
            <RevealItem key={leader.name} className="flex flex-col gap-4">
              <div
                className="grid aspect-[4/5] place-items-center rounded-xl border border-border bg-gradient-to-b from-card to-background text-5xl font-black text-primary/40"
                aria-hidden
              >
                {leader.name.split(" ").at(-1)?.[0]}
              </div>
              <div>
                <h3 className="font-bold">{leader.name}</h3>
                <p className="text-sm text-muted-foreground">{leader.role}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <CallToAction />
    </>
  );
}
