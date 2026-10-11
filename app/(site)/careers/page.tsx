import type { Metadata } from "next";
import { getHolding, getJobs, getPages, getSubsidiaries } from "@/lib/content";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { CallToAction } from "@/components/sections/CallToAction";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { Icon } from "@/components/ui/icon";
import { toFaNumber } from "@/lib/utils";
import { JobBoard } from "./JobBoard";

export async function generateMetadata(): Promise<Metadata> {
  const { careers: page } = await getPages();
  return { title: "فرصت‌های شغلی", description: page.description, alternates: { canonical: "/careers" } };
}

export default async function CareersPage() {
  const { careers: page } = await getPages();
  const [jobs, holding, subsidiaries] = await Promise.all([getJobs(), getHolding(), getSubsidiaries()]);
  const bySlug = new Map(subsidiaries.map((s) => [s.slug, s]));

  return (
    <>
      <PageHeader
        eyebrow="فرصت‌های شغلی"
        title={page.title}
        description={page.description}
        path="/careers"
      />

      <section className="container-page py-12">
        <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {holding.benefits.map((b) => (
            <RevealItem key={b.title}>
              <TiltCard>
                <div className="flex flex-col gap-4 p-7">
                  <Icon name={b.icon} className="size-7 text-primary" />
                  <h2 className="text-lg font-bold">{b.title}</h2>
                  <p className="text-sm leading-7 text-muted-foreground">{b.description}</p>
                </div>
              </TiltCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="container-page py-24" aria-labelledby="openings">
        <div id="openings">
          <SectionHeading eyebrow={`${toFaNumber(jobs.length)} موقعیت باز`} title="موقعیت‌های شغلی فعال" />
        </div>
        <JobBoard
          jobs={jobs.map((job) => {
            const s = bySlug.get(job.subsidiary);
            return {
              id: job.id,
              title: job.title,
              department: job.department,
              location: job.location,
              type: job.type,
              subsidiary: s ? { name: s.name, color: s.color } : undefined,
            };
          })}
        />
      </section>

      <CallToAction title="سؤالی درباره همکاری دارید؟" description="تیم منابع انسانی ما پاسخ‌گوی شماست." />
    </>
  );
}
