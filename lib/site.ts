/**
 * Global site configuration. The brand name, contact details and URLs here are
 * placeholders — replace them with the holding's real information.
 */
export const siteConfig = {
  name: "هلدینگ آوند",
  nameEn: "Avand Holding",
  shortName: "آوند",
  description:
    "هلدینگ آوند؛ گروهی از پنج شرکت تخصصی در عمران، انرژی، فناوری، بازرگانی و سرمایه‌گذاری که با یک چشم‌انداز مشترک، آینده را می‌سازند.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "fa_IR",
  foundedYear: 1385,
  contact: {
    email: "info@example.com",
    phone: "+98 21 0000 0000",
    phoneDisplay: "۰۲۱-۰۰۰۰۰۰۰۰",
    address: "تهران، خیابان ولیعصر، برج آوند، طبقه ۱۲",
  },
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Instagram", href: "https://www.instagram.com/" },
  ],
} as const;

export type NavItem = { href: string; label: string };

export const mainNav: NavItem[] = [
  { href: "/", label: "خانه" },
  { href: "/about", label: "درباره هلدینگ" },
  { href: "/subsidiaries", label: "زیرمجموعه‌ها" },
  { href: "/services", label: "خدمات" },
  { href: "/projects", label: "پروژه‌ها" },
  { href: "/news", label: "اخبار و دیدگاه‌ها" },
  { href: "/careers", label: "فرصت‌های شغلی" },
  { href: "/contact", label: "تماس" },
];
