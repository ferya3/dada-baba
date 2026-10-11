import type { Metadata } from "next";
import Link from "next/link";
import { getPages, getServices, getSubsidiaries } from "@/lib/content";
import { PageHeader } from "@/components/sections/PageHeader";
import { CallToAction } from "@/components/sections/CallToAction";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/icon";
import { toFaDigits } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { services: page } = await getPages();
  return { title: "خدمات و تخصص‌ها", description: page.description, alternates: { canonical: "/services" } };
}

export default async function ServicesPage() {
  const { services: page } = await getPages();
  const [services, subsidiaries] = await Promise.all([getServices(), getSubsidiaries()]);
  const bySlug = new Map(subsidiaries.map((s) => [s.slug, s]));

  return (
    <>
      <PageHeader
        eyebrow="خدمات و تخصص‌ها"
        title={page.title}
        description={page.description}
        path="/services"
      />

      <section className="container-page py-12">
        <ol className="flex flex-col">
          {services.map((service, i) => (
            <li key={service.id} className="border-t border-border last:border-b">
              <Reveal className="group grid gap-6 py-10 md:grid-cols-[auto_1fr_1fr] md:items-start md:gap-12">
                <span className="text-sm text-muted-foreground tabular-nums">{toFaDigits(`0${i + 1}`)}</span>
                <div className="flex items-start gap-5">
                  <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform duration-500 group-hover:rotate-6">
                    <Icon name={service.icon} className="size-7" />
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold">{service.title}</h2>
                    <p className="mt-3 leading-8 text-muted-foreground">{service.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  {service.subsidiaries.map((slug) => {
                    const s = bySlug.get(slug);
                    return s ? (
                      <Link
                        key={slug}
                        href={`/subsidiaries/${slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-white/30"
                      >
                        <span className="size-2 rounded-full" style={{ background: s.color }} aria-hidden />
                        {s.name}
                      </Link>
                    ) : null;
                  })}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <CallToAction />
    </>
  );
}
