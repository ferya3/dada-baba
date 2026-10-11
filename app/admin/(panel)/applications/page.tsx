import { Download } from "lucide-react";
import { listApplications } from "@/lib/server/store";
import { markApplication, removeApplication } from "@/app/admin/actions";
import { InboxItem } from "@/components/admin/InboxItem";
import { PageTitle } from "@/components/admin/PageTitle";
import { Button } from "@/components/ui/button";
import { toFaNumber } from "@/lib/utils";

export const metadata = { title: "رزومه‌ها" };

export default function ApplicationsPage() {
  const applications = listApplications();
  const unread = applications.filter((a) => !a.read).length;

  return (
    <>
      <PageTitle
        title="رزومه‌ها"
        description={`رزومه‌های ارسال‌شده از صفحه فرصت‌های شغلی. ${toFaNumber(applications.length)} رزومه، ${toFaNumber(unread)} بررسی‌نشده.`}
      />
      {applications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">هنوز رزومه‌ای نرسیده است.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map((a) => (
            <InboxItem
              key={a.id}
              title={a.name}
              subtitle={a.jobTitle}
              date={a.createdAt}
              read={a.read}
              email={a.email}
              replySubject={`درخواست همکاری: ${a.jobTitle}`}
              body={a.message || undefined}
              meta={[
                { label: "ایمیل", value: <span dir="ltr">{a.email}</span> },
                { label: "تلفن", value: a.phone ? <span dir="ltr">{a.phone}</span> : "—" },
              ]}
              extra={
                <Button asChild size="sm">
                  <a href={`/admin/resume/${a.id}`}>
                    <Download /> دانلود رزومه
                  </a>
                </Button>
              }
              onToggleRead={markApplication.bind(null, a.id, !a.read)}
              onDelete={removeApplication.bind(null, a.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}
