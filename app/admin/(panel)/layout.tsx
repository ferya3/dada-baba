import { requireAdmin } from "@/lib/server/auth";
import { inboxCounts } from "@/lib/server/store";
import { AdminShell, type NavGroup } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const counts = inboxCounts();

  const groups: NavGroup[] = [
    { items: [{ href: "/admin", label: "داشبورد", icon: "dashboard" }] },
    {
      title: "محتوای سایت",
      items: [
        { href: "/admin/settings", label: "تنظیمات عمومی", icon: "settings" },
        { href: "/admin/home", label: "صفحه اصلی", icon: "home" },
        { href: "/admin/pages", label: "سربرگ صفحات", icon: "pages" },
        { href: "/admin/about", label: "درباره هلدینگ", icon: "about" },
        { href: "/admin/subsidiaries", label: "زیرمجموعه‌ها", icon: "subsidiaries" },
        { href: "/admin/services", label: "خدمات", icon: "services" },
        { href: "/admin/projects", label: "پروژه‌ها", icon: "projects" },
        { href: "/admin/news", label: "اخبار و دیدگاه‌ها", icon: "news" },
        { href: "/admin/jobs", label: "فرصت‌های شغلی", icon: "jobs" },
      ],
    },
    {
      title: "صندوق دریافت",
      items: [
        { href: "/admin/messages", label: "پیام‌های تماس", icon: "messages", badge: counts.unreadMessages },
        { href: "/admin/applications", label: "رزومه‌ها", icon: "applications", badge: counts.unreadApplications },
      ],
    },
    { title: "دسترسی", items: [{ href: "/admin/users", label: "مدیران", icon: "users" }] },
  ];

  return (
    <AdminShell groups={groups} username={user.username}>
      {children}
    </AdminShell>
  );
}
