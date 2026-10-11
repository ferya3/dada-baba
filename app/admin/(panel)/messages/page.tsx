import { listDocuments, listMessages } from "@/lib/server/store";
import { markMessage, removeMessage } from "@/app/admin/actions";
import { InboxItem } from "@/components/admin/InboxItem";
import { PageTitle } from "@/components/admin/PageTitle";
import type { Subsidiary } from "@/lib/content/types";
import { toFaNumber } from "@/lib/utils";

export const metadata = { title: "پیام‌های تماس" };

export default function MessagesPage() {
  const messages = listMessages();
  const names = new Map(listDocuments<Subsidiary>("subsidiaries").map((s) => [s.slug, s.name]));
  const unread = messages.filter((m) => !m.read).length;

  return (
    <>
      <PageTitle
        title="پیام‌های تماس"
        description={`پیام‌هایی که از فرم صفحه تماس ارسال شده‌اند. ${toFaNumber(messages.length)} پیام، ${toFaNumber(unread)} خوانده‌نشده.`}
      />
      {messages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">هنوز پیامی نرسیده است.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((m) => (
            <InboxItem
              key={m.id}
              title={m.name}
              date={m.createdAt}
              read={m.read}
              email={m.email}
              replySubject="پاسخ به پیام شما"
              body={m.message}
              meta={[
                { label: "ایمیل", value: <span dir="ltr">{m.email}</span> },
                { label: "سازمان", value: m.company || "—" },
                { label: "زیرمجموعه", value: m.subsidiary ? (names.get(m.subsidiary) ?? m.subsidiary) : "هلدینگ (عمومی)" },
              ]}
              onToggleRead={markMessage.bind(null, m.id, !m.read)}
              onDelete={removeMessage.bind(null, m.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}
