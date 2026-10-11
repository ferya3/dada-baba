import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Briefcase, MapPin } from "lucide-react";
import { getHolding, getJobs, getSubsidiaries } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { CallToAction } from "@/components/sections/CallToAction";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { toFaNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "فرصت‌های شغلی",
  description: "به تیم هلدینگ آوند بپیوندید؛ موقعیت‌های شغلی باز در پنج شرکت گروه.",
  alternates: { canonical: "/careers" },
};

export default async function CareersPage() {
  const [jobs, holding, subsidiaries] = await Promise.all([getJobs(), getHolding(), getSubsidiaries()]);
  const bySlug = new Map(subsidiaries.map((s) => [s.slug, s]));

  return (
    <>
      <PageHeader
        eyebrow="فرصت‌های شغلی"
        title="آینده را با ما بسازید"
        description="در پنج شرکت گروه، فرصت رشد، یادگیری و کار روی پروژه‌هایی را دارید که اثرشان سال‌ها باقی می‌ماند."
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
        <ul className="mt-12 flex flex-col">
          {jobs.map((job) => {
            const s = bySlug.get(job.subsidiary);
            return (
              <li key={job.id} className="border-t border-border last:border-b">
                <Reveal className="group flex flex-col gap-4 py-6 sm:flex-row sm:items-center">
                  <div className="flex flex-1 flex-col gap-2">
                    <h3 className="text-xl font-bold">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {s && (
                        <span className="inline-flex items-center gap-2">
                          <span className="size-2 rounded-full" style={{ background: s.color }} aria-hidden />
                          {s.name}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5">
                        <Briefcase className="size-4" aria-hidden />
                        {job.department}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-4" aria-hidden />
                        {job.location}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline">{job.type}</Badge>
                  <a
                    href={`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(`درخواست همکاری: ${job.title}`)}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary"
                  >
                    ارسال رزومه
                    <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden />
                  </a>
                </Reveal>
              </li>
            );
          })}
        </ul>
        <p className="mt-8 text-sm text-muted-foreground">
          موقعیت مناسب خود را پیدا نکردید؟{" "}
          <Link href="/contact" className="text-primary hover:underline">
            رزومه خود را برای ما بفرستید
          </Link>
          .
        </p>
      </section>

      <CallToAction title="سؤالی درباره همکاری دارید؟" description="تیم منابع انسانی ما پاسخ‌گوی شماست." />
    </>
  );
}
