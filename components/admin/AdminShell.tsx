"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Briefcase,
  Building2,
  ExternalLink,
  FileText,
  FolderKanban,
  Home,
  Inbox,
  Info,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  PanelTop,
  Settings,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { cn, toFaNumber } from "@/lib/utils";
import { logout } from "@/app/admin/actions";

const icons = {
  dashboard: LayoutDashboard,
  settings: Settings,
  home: Home,
  pages: PanelTop,
  about: Info,
  subsidiaries: Building2,
  services: Wrench,
  projects: FolderKanban,
  news: Newspaper,
  jobs: Briefcase,
  messages: Mail,
  applications: FileText,
  users: Users,
  inbox: Inbox,
};

export type NavGroup = {
  title?: string;
  items: { href: string; label: string; icon: keyof typeof icons; badge?: number }[];
};

export function AdminShell({
  groups,
  username,
  children,
}: {
  groups: NavGroup[];
  username: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const nav = (
    <nav aria-label="منوی پنل" className="flex flex-col gap-6">
      {groups.map((group, i) => (
        <div key={i} className="flex flex-col gap-1">
          {group.title && <span className="px-3 pb-1 text-xs font-medium text-muted-foreground">{group.title}</span>}
          {group.items.map((item) => {
            const Icon = icons[item.icon];
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active ? "bg-primary/15 font-medium text-primary" : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                <span className="flex-1">{item.label}</span>
                {!!item.badge && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">
                    {toFaNumber(item.badge)}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );

  const footer = (
    <div className="flex flex-col gap-1 border-t border-border pt-4">
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
      >
        <ExternalLink className="size-4" aria-hidden />
        مشاهده سایت
      </a>
      <form action={logout}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
        >
          <LogOut className="size-4" aria-hidden />
          خروج <span className="text-xs" dir="ltr">({username})</span>
        </button>
      </form>
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[16rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col gap-6 overflow-y-auto border-e border-border bg-card/40 p-4 lg:flex">
        <Brand />
        <div className="flex-1">{nav}</div>
        {footer}
      </aside>

      {/* Mobile top bar + drawer */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur lg:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "بستن منو" : "باز کردن منو"}
          className="grid size-10 place-items-center rounded-lg border border-border"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>
      {open && (
        <div className="fixed inset-0 top-14 z-20 flex flex-col gap-6 overflow-y-auto bg-background p-4 lg:hidden">
          {nav}
          {footer}
        </div>
      )}

      <main className="min-w-0 px-4 py-8 sm:px-8 lg:py-10">{children}</main>
    </div>
  );
}

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-3 px-1">
      <span className="grid size-9 place-items-center rounded-lg bg-primary/10 ring-1 ring-primary/30">
        <svg viewBox="0 0 24 24" className="size-4 text-primary" aria-hidden>
          <polygon points="12,3 20,7.5 20,16.5 12,21 4,16.5 4,7.5" fill="currentColor" />
        </svg>
      </span>
      <span className="font-black">پنل مدیریت</span>
    </Link>
  );
}
