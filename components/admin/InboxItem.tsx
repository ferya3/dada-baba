import { Mail, MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "./DeleteButton";
import { cn, formatFaDate } from "@/lib/utils";

const time = new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit" });

/** One message / application card with read toggle, reply and delete. */
export function InboxItem({
  title,
  subtitle,
  meta,
  body,
  date,
  read,
  email,
  replySubject,
  onToggleRead,
  onDelete,
  extra,
}: {
  title: string;
  subtitle?: string;
  meta: { label: string; value: React.ReactNode }[];
  body?: string;
  date: string;
  read: boolean;
  email: string;
  replySubject: string;
  onToggleRead: () => Promise<void>;
  onDelete: () => Promise<void>;
  extra?: React.ReactNode;
}) {
  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-xl border p-5 sm:p-6",
        read ? "border-border bg-card/30" : "border-primary/40 bg-primary/[0.04]",
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="flex items-center gap-2 font-bold">
            {!read && <span className="size-2 rounded-full bg-primary" aria-label="خوانده‌نشده" />}
            {title}
          </h2>
          {subtitle && <span className="text-sm text-primary">{subtitle}</span>}
        </div>
        <time dateTime={date} className="text-xs text-muted-foreground">
          {formatFaDate(date)} · {time.format(new Date(date))}
        </time>
      </header>

      <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
        {meta.map((m) => (
          <div key={m.label} className="flex gap-2">
            <dt className="text-muted-foreground">{m.label}:</dt>
            <dd className="min-w-0 break-words">{m.value}</dd>
          </div>
        ))}
      </dl>

      {body && <p className="whitespace-pre-line rounded-lg bg-black/20 p-4 text-sm leading-7">{body}</p>}

      <footer className="flex flex-wrap items-center gap-2">
        {extra}
        <Button asChild variant="outline" size="sm">
          <a href={`mailto:${email}?subject=${encodeURIComponent(replySubject)}`}>
            <Mail /> پاسخ با ایمیل
          </a>
        </Button>
        <form action={onToggleRead}>
          <Button type="submit" variant="ghost" size="sm">
            {read ? <Mail /> : <MailOpen />}
            {read ? "علامت خوانده‌نشده" : "علامت خوانده‌شده"}
          </Button>
        </form>
        <DeleteButton action={onDelete} confirmText={`این مورد از «${title}» برای همیشه حذف شود؟`} />
      </footer>
    </article>
  );
}
