import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { getSubsidiaries } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { PageHeader } from "@/components/sections/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "تماس با ما",
  description: "راه‌های ارتباط با هلدینگ آوند و زیرمجموعه‌ها.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const subsidiaries = await getSubsidiaries();
  const { contact } = siteConfig;
  const channels = [
    { icon: MapPin, label: "نشانی", value: contact.address },
    { icon: Phone, label: "تلفن", value: contact.phoneDisplay, href: `tel:${contact.phone.replace(/\s/g, "")}` },
    { icon: Mail, label: "ایمیل", value: contact.email, href: `mailto:${contact.email}` },
  ];

  return (
    <>
      <PageHeader
        eyebrow="تماس"
        title="با ما در ارتباط باشید"
        description="برای همکاری، سرمایه‌گذاری یا هر پرسشی، پیام خود را بفرستید. پاسخ ما ظرف دو روز کاری."
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
