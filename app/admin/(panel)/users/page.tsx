import { listUsers, requireAdmin } from "@/lib/server/auth";
import { removeUser } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { PageTitle } from "@/components/admin/PageTitle";
import { formatFaDate } from "@/lib/utils";
import { AddUserForm, ChangePasswordForm } from "./UserForms";

export const metadata = { title: "مدیران" };

export default async function UsersPage() {
  const me = await requireAdmin();
  const users = listUsers();

  return (
    <>
      <PageTitle title="مدیران" description="همه مدیران به تمام بخش‌های پنل دسترسی کامل دارند." />
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-xl border border-border">
          <h2 className="border-b border-border px-5 py-4 font-bold">فهرست مدیران</h2>
          <ul>
            {users.map((u) => (
              <li key={u.id} className="flex items-center gap-3 border-b border-border px-5 py-3 last:border-0">
                <span className="grid size-9 place-items-center rounded-full bg-primary/15 font-bold text-primary uppercase" aria-hidden>
                  {u.username[0]}
                </span>
                <span className="flex flex-1 flex-col">
                  <span className="font-medium" dir="ltr">
                    {u.username}
                  </span>
                  <span className="text-xs text-muted-foreground">عضو از {formatFaDate(u.createdAt)}</span>
                </span>
                {u.id === me.id ? (
                  <span className="text-xs text-muted-foreground">شما</span>
                ) : (
                  users.length > 1 && (
                    <DeleteButton action={removeUser.bind(null, u.id)} confirmText={`دسترسی «${u.username}» حذف شود؟`} />
                  )
                )}
              </li>
            ))}
          </ul>
        </section>
        <div className="flex flex-col gap-6">
          <section className="rounded-xl border border-border p-5">
            <h2 className="mb-4 font-bold">افزودن مدیر</h2>
            <AddUserForm />
          </section>
          <section className="rounded-xl border border-border p-5">
            <h2 className="mb-4 font-bold">تغییر رمز عبور من</h2>
            <ChangePasswordForm />
          </section>
        </div>
      </div>
    </>
  );
}
