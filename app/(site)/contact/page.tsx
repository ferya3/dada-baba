import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { getPages, getSettings, getSubsidiaries } from "@/lib/content";
import { PageHeader } from "@/components/sections/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "./ContactForm";
import { telHref } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { contact: page } = await getPages();
  return { title: "تماس با ما", description: page.description, alternates: { canonical: "/contact" } };
}

export default async function ContactPage() {
  const { contact: page } = await getPages();
  const [subsidiaries, contact] = await Promise.all([getSubsidiaries(), getSettings()]);
  const channels = [
    { icon: MapPin, label: "نشانی", value: contact.address },
    { icon: Phone, label: "تلفن", value: contact.phone, href: telHref(contact.phone) },
    { icon: Mail, label: "ایمیل", value: contact.email, href: `mailto:${contact.email}` },
  ];

  return (
    <>
      <PageHeader
        eyebrow="تماس"
        title={page.title}
        description={page.description}
        path="/contact"
      />
      <section className="container-page grid gap-12 py-12 lg:grid-cols-[1fr_1.6fr]">
        <Reveal className="flex flex-col gap-4">
          {channels.map(({ icon: IconComponent, label, value, href }) => (
            <div key={label} className="flex items-start gap-4 rounded-xl border border-border bg-card/40 p-6">
              <IconComponent className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">{label}</span>
                {href ? (
                  <a href={href} className="font-medium hover:text-primary" dir={label === "نشانی" ? undefined : "ltr"}>
                    {value}
                  </a>
                ) : (
                  <span className="font-medium">{value}</span>
                )}
              </div>
            </div>
          ))}
        </Reveal>
        <Reveal delay={0.1} className="relative rounded-xl border border-border bg-card/30 p-6 sm:p-10">
          <ContactForm subsidiaries={subsidiaries.map(({ slug, name }) => ({ slug, name }))} />
        </Reveal>
      </section>
    </>
  );
}
