import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getHolding, getNews, getProjects, getServices, getSubsidiaries } from "@/lib/content";
import { HomeHero } from "@/components/sections/home/HomeHero";
import { SubsidiaryOrbitSection } from "@/components/sections/home/SubsidiaryOrbitSection";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { StatsGrid } from "@/components/sections/StatsGrid";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { NewsCard } from "@/components/sections/NewsCard";
import { CallToAction } from "@/components/sections/CallToAction";
import { HorizontalScroll } from "@/components/motion/HorizontalScroll";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export default async function HomePage() {
  const [holding, subsidiaries, services, projects, news] = await Promise.all([
    getHolding(),
    getSubsidiaries(),
    getServices(),
    getProjects(),
    getNews(),
  ]);
  const bySlug = new Map(subsidiaries.map((s) => [s.slug, s]));

  return (
    <>
      <HomeHero colors={subsidiaries.map((s) => s.color)} />

      {/* Intro + key figures */}
      <section id="intro" className="container-page scroll-mt-24 py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <SectionHeading
            eyebrow="درباره ما"
            title="دو دهه ساختن، سرمایه‌گذاری و نوآوری"
            description={holding.mission}
          />
          <Parallax offset={40}>
            <Reveal className="flex flex-col gap-6">
              <p className="leading-8 text-muted-foreground">{holding.story[1]}</p>
              <Button asChild variant="outline" className="self-start">
                <Link href="/about">
                  داستان ما
                  <ArrowLeft />
                </Link>
              </Button>
            </Reveal>
          </Parallax>
        </div>
        <StatsGrid stats={holding.stats} className="mt-16" />
      </section>

      <SubsidiaryOrbitSection
        items={subsidiaries.map(({ slug, name, color, shape, sector, summary }) => ({
          slug,
          name,
          color,
          shape,
          sector,
          summary,
        }))}
      />

      {/* Featured projects — pinned horizontal scroll */}
      <section className="py-24 sm:py-32" aria-labelledby="projects-heading">
        <div className="container-page mb-12 flex flex-wrap items-end justify-between gap-6">
          <div id="projects-heading">
            <SectionHeading eyebrow="پروژه‌های شاخص" title="کارهایی که به آن‌ها افتخار می‌کنیم" />
          </div>
          <Button asChild variant="outline">
            <Link href="/projects">
              همه پروژه‌ها
              <ArrowLeft />
            </Link>
          </Button>
        </div>
        <HorizontalScroll className="md:flex md:h-svh md:items-center" trackClassName="px-4 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          {projects.slice(0, 6).map((project) => (
            <div key={project.slug} className="w-[85vw] shrink-0 snap-center sm:w-[26rem]">
              <ProjectCard project={project} subsidiary={bySlug.get(project.subsidiary)} />
            </div>
          ))}
        </HorizontalScroll>
      </section>

      {/* Services */}
      <section className="container-page py-24 sm:py-32">
        <SectionHeading
          eyebrow="خدمات و تخصص‌ها"
          title="از مطالعه تا بهره‌برداری، زیر یک سقف"
          description="ترکیب توان مهندسی، مالی و فناوری گروه، راهکاری یکپارچه برای پروژه‌های پیچیده فراهم می‌کند."
        />
        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <RevealItem key={service.id}>
              <TiltCard>
                <div className="flex h-full flex-col gap-4 p-7">
                  <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <Icon name={service.icon} className="size-6" />
                  </span>
                  <h3 className="text-lg font-bold">{service.title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{service.description}</p>
                </div>
              </TiltCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* News */}
      <section className="container-page py-24 sm:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="اخبار و دیدگاه‌ها" title="تازه‌ترین‌ها از گروه" />
          <Button asChild variant="outline">
            <Link href="/news">
              همه مطالب
              <ArrowLeft />
            </Link>
          </Button>
        </div>
        <RevealGroup className="mt-14 grid gap-6 md:grid-cols-3">
          {news.slice(0, 3).map((post) => (
            <RevealItem key={post.slug}>
              <NewsCard post={post} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <CallToAction />
    </>
  );
}
