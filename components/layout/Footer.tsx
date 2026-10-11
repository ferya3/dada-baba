import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { mainNav, siteConfig } from "@/lib/site";
import { getSubsidiaries } from "@/lib/content";
import { toFaDigits } from "@/lib/utils";
import { Logo } from "./Logo";

export async function Footer() {
  const subsidiaries = await getSubsidiaries();
  const year = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric" }).format(new Date());

  return (
    <footer className="relative mt-24 border-t border-border bg-black/20">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-5">
          <Logo />
          <p className="max-w-xs text-sm leading-7 text-muted-foreground">{siteConfig.description}</p>
        </div>

        <div>
          <h2 className="mb-5 text-sm font-bold">دسترسی سریع</h2>
          <ul className="grid gap-3 text-sm text-muted-foreground">
            {mainNav.slice(1).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-5 text-sm font-bold">زیرمجموعه‌ها</h2>
          <ul className="grid gap-3 text-sm text-muted-foreground">
            {subsidiaries.map((s) => (
              <li key={s.slug}>
                <Link href={`/subsidiaries/${s.slug}`} className="inline-flex items-center gap-2 transition-colors hover:text-foreground">
                  <span className="size-1.5 rounded-full" style={{ background: s.color }} aria-hidden />
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-5 text-sm font-bold">ارتباط با ما</h2>
          <address className="grid gap-3 text-sm not-italic text-muted-foreground">
            <span>{siteConfig.contact.address}</span>
            <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`} className="hover:text-foreground">
              {siteConfig.contact.phoneDisplay}
            </a>
            <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-foreground">
              {siteConfig.contact.email}
            </a>
          </address>
          <ul className="mt-5 flex gap-4 text-sm">
            {siteConfig.social.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary" dir="ltr">
                  {s.label}
                  <ArrowUpLeft className="size-3.5" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row">
          <span>
            © {year} {siteConfig.name}. تمامی حقوق محفوظ است.
          </span>
          <span>تأسیس {toFaDigits(siteConfig.foundedYear)}</span>
        </div>
      </div>
    </footer>
  );
}
