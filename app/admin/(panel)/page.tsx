import Link from "next/link";
import { ArrowLeft, FileText, Mail } from "lucide-react";
import { sections } from "@/lib/admin/sections";
import { countDocuments, inboxCounts, listApplications, listMessages } from "@/lib/server/store";
import { PageTitle } from "@/components/admin/PageTitle";
import { formatFaDate, toFaNumber } from "@/lib/utils";

export const metadata = { title: "داشبورد" };

export default function DashboardPage() {
  const counts = inboxCounts();
  const collections = sections.filter((s) => s.kind === "collection");
  const messages = listMessages().slice(0, 5);
  const applications = listApplications().slice(0, 5);

  return (
    <>
      <PageTitle title="داشبورد" description="خلاصه محتوای سایت و آخرین پیام‌ها و رزومه‌های دریافتی." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InboxCard
          href="/admin/messages"
          icon={<Mail className="size-5" />}
          label="پیام‌های تماس"
          total={counts.messages}
          unread={counts.unreadMessages}
        />
        <InboxCard
          href="/admin/applications"
          icon={<FileText className="size-5" />}
          label="رزومه‌ها"
          total={counts.applications}
          unread={counts.unreadApplications}
        />
      </div>

      <h2 className="mt-10 mb-4 font-bold">محتوا</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {collections.map((s) => (
          <Link
            key={s.key}
            href={`/admin/${s.key}`}
            className="group flex flex-col gap-2 rounded-xl border border-border bg-card/40 p-5 transition-colors hover:border-white/20"
          >
            <span className="text-3xl font-black tabular-nums">{toFaNumber(countDocuments(s.key))}</span>
            <span className="flex items-center justify-between text-sm text-muted-foreground">
              {s.title}
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-2">
        <RecentList
          title="آخرین پیام‌ها"
          href="/admin/messages"
          empty="هنوز پیامی نرسیده است."
          items={messages.map((m) => ({ id: m.id, title: m.name, sub: m.message, date: m.createdAt, unread: !m.read }))}
        />
        <RecentList
          title="آخرین رزومه‌ها"
          href="/admin/applications"
          empty="هنوز رزومه‌ای نرسیده است."
          items={applications.map((a) => ({ id: a.id, title: a.name, sub: a.jobTitle, date: a.createdAt, unread: !a.read }))}
        />
      </div>
    </>
  );
}

function InboxCard(props: { href: string; icon: React.ReactNode; label: string; total: number; unread: number }) {
  return (
    <Link
      href={props.href}
      className="flex items-center gap-4 rounded-xl border border-border bg-card/40 p-5 transition-colors hover:border-white/20"
    >
      <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">{props.icon}</span>
      <span className="flex flex-1 flex-col">
        <span className="text-sm text-muted-foreground">{props.label}</span>
        <span className="text-xl font-black">{toFaNumber(props.total)}</span>
      </span>
      {props.unread > 0 && (
        <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
          {toFaNumber(props.unread)} جدید
        </span>
      )}
    </Link>
  );
}

function RecentList(props: {
  title: string;
  href: string;
  empty: string;
  items: { id: number; title: string; sub: string; date: string; unread: boolean }[];
}) {
  return (
    <section className="rounded-xl border border-border bg-card/40">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="font-bold">{props.title}</h2>
        <Link href={props.href} className="text-sm text-primary hover:underline">
          همه
        </Link>
      </div>
      {props.items.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted-foreground">{props.empty}</p>
      ) : (
        <ul>
          {props.items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 border-b border-border px-5 py-3 last:border-0">
              <span className={item.unread ? "size-2 rounded-full bg-primary" : "size-2"} aria-label={item.unread ? "خوانده‌نشده" : undefined} />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-medium">{item.title}</span>
                <span className="truncate text-sm text-muted-foreground">{item.sub}</span>
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">{formatFaDate(item.date)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
