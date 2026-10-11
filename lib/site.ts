/**
 * Fixed site configuration. Everything editable (name, contact details,
 * copy) lives in the database and is managed from the admin panel.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const siteLocale = "fa_IR";

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
