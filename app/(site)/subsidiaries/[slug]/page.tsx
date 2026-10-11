import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpLeft, Check } from "lucide-react";
import { getNews, getProjects, getSubsidiaries, getSubsidiary } from "@/lib/content";
import { SubsidiaryCanvas } from "@/components/3d";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { StatsGrid } from "@/components/sections/StatsGrid";
import { Timeline } from "@/components/sections/Timeline";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { NewsCard } from "@/components/sections/NewsCard";
import { CallToAction } from "@/components/sections/CallToAction";
import { SitePreview } from "@/components/sections/SitePreview";
import { displayHost } from "@/components/sections/BrowserFrame";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { JsonLd, breadcrumbs, subsidiaryOrganization } from "@/components/seo/JsonLd";
import { Icon } from "@/components/ui/icon";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const subsidiaries = await getSubsidiaries();
  return subsidiaries.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const subsidiary = await getSubsidiary((await params).slug);
  if (!subsidiary) return {};
  const path = `/subsidiaries/${subsidiary.slug}`;
  return {
    title: `${subsidiary.name} — ${subsidiary.sector}`,
    description: subsidiary.summary,
    alternates: { canonical: path },
    openGraph: { title: subsidiary.name, description: subsidiary.summary, url: path },
  };
}

export default async function SubsidiaryPage({ params }: Props) {
  const { slug } = await params;
  const subsidiary = await getSubsidiary(slug);
  if (!subsidiary) notFound();

  const [projects, news, all] = await Promise.all([getProjects(slug), getNews(slug), getSubsidiaries()]);
  const others = all.filter((s) => s.slug !== slug);
  const { color } = subsidiary;

  return (
    <>
      {/* Hero with this subsidiary's own 3D form */}
      <section className="noise relative flex min-h-[90svh] items-end overflow-hidden pb-20">
        <SubsidiaryCanvas shape={subsidiary.shape} color={color} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" aria-hidden />
        <div className="container-page relative flex flex-col gap-6 pt-40">
          <Reveal y={12}>
            <nav aria-label="مسیر صفحه" className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/subsidiaries" className="hover:text-foreground">
                زیرمجموعه‌ها
              </Link>
              <span aria-hidden>/</span>
              <span style={{ color }}>{subsidiary.sector}</span>
            </nav>
          </Reveal>
          <SplitText
            as="h1"
            immediate
            text={subsidiary.name}
            className="text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl"
          />
          <Reveal delay={0.3}>
            <p className="max-w-2xl text-xl leading-9 text-muted-foreground sm:text-2xl">{subsidiary.tagline}</p>
          </Reveal>
        </div>
      </section>

      <section className="container-page py-16">
        <StatsGrid stats={subsidiary.stats} accent={color} />
      </section>

      <section className="container-page grid gap-12 py-16 lg:grid-cols-2">
        <SectionHeading eyebrow="معرفی" title={subsidiary.summary} />
        <div className="flex flex-col gap-6">
          {subsidiary.description.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="text-lg leading-9 text-muted-foreground">{p}</p>
            </Reveal>
          ))}
          <RevealGroup className="mt-4 grid gap-3 sm:grid-cols-2">
            {subsidiary.capabilities.map((cap) => (
              <RevealItem key={cap} className="flex items-center gap-3 rounded-lg border border-border bg-card/40 px-4 py-3">
                <Check className="size-4 shrink-0" style={{ color }} aria-hidden />
                <span className="text-sm">{cap}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="container-page grid items-center gap-12 py-24 lg:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col gap-6">
          <SectionHeading
            eyebrow="وب‌سایت"
            title={`${subsidiary.name} در وب`}
            description="خدمات، پروژه‌ها و راه‌های ارتباط با این شرکت را در وب‌سایت اختصاصی آن ببینید."
          />
          {subsidiary.website && (
            <Reveal delay={0.2}>
              <Button asChild variant="outline">
                <a href={subsidiary.website} target="_blank" rel="noopener noreferrer" dir="ltr">
                  <ArrowUpLeft />
                  {displayHost(subsidiary.website)}
                </a>
              </Button>
            </Reveal>
          )}
        </div>
        <Reveal>
          <SitePreview
            name={subsidiary.name}
            website={subsidiary.website}
            screenshot={subsidiary.screenshot}
            color={color}
          />
        </Reveal>
      </section>

      <section className="container-page grid gap-12 py-24 lg:grid-cols-2">
        <SectionHeading eyebrow="مسیر رشد" title={`داستان ${subsidiary.name}`} className="lg:sticky lg:top-32 lg:self-start" />
        <Timeline entries={subsidiary.timeline} color={color} />
      </section>

      {projects.length > 0 && (
        <section className="container-page py-24">
          <SectionHeading eyebrow="پروژه‌ها" title="پروژه‌های شاخص" />
          <RevealGroup className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <RevealItem key={project.slug}>
                <ProjectCard project={project} subsidiary={subsidiary} />
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      {news.length > 0 && (
        <section className="container-page py-24">
          <SectionHeading eyebrow="اخبار" title={`تازه‌های ${subsidiary.name}`} />
          <RevealGroup className="mt-12 grid gap-6 md:grid-cols-3">
            {news.map((post) => (
              <RevealItem key={post.slug}>
                <NewsCard post={post} />
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      <section className="container-page py-24">
        <SectionHeading eyebrow="سایر زیرمجموعه‌ها" title="بیشتر بشناسید" />
        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((s) => (
            <RevealItem key={s.slug}>
              <Link
                href={`/subsidiaries/${s.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card/40 p-5 transition-colors hover:border-white/20"
              >
                <Icon name={s.icon} className="size-6 shrink-0" style={{ color: s.color }} />
                <span className="flex flex-1 flex-col">
                  <span className="font-bold">{s.name}</span>
                  <span className="text-xs text-muted-foreground">{s.sector}</span>
                </span>
                <ArrowLeft className="size-4 text-muted-foreground transition-transform group-hover:-translate-x-1" aria-hidden />
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <CallToAction title={`همکاری با ${subsidiary.name}`} />

      <JsonLd data={{ "@context": "https://schema.org", ...subsidiaryOrganization(subsidiary) }} />
      <JsonLd
        data={breadcrumbs([
          { name: "خانه", path: "/" },
          { name: "زیرمجموعه‌ها", path: "/subsidiaries" },
          { name: subsidiary.name, path: `/subsidiaries/${subsidiary.slug}` },
        ])}
      />
    </>
  );
}
