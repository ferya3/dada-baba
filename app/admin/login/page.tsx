import { redirect } from "next/navigation";
import { getCurrentUser, userCount } from "@/lib/server/auth";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "ورود" };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/admin");
  const firstRun = userCount() === 0;

  return (
    <div className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="bg-grid pointer-events-none fixed inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" aria-hidden />
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card/70 p-8 backdrop-blur">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="grid size-12 place-items-center rounded-xl bg-primary/10 ring-1 ring-primary/30">
            <svg viewBox="0 0 24 24" className="size-6 text-primary" aria-hidden>
              <polygon points="12,3 20,7.5 20,16.5 12,21 4,16.5 4,7.5" fill="currentColor" />
            </svg>
          </span>
          <h1 className="text-xl font-black">{firstRun ? "ساخت حساب مدیر" : "ورود به پنل مدیریت"}</h1>
          {firstRun && (
            <p className="text-sm leading-7 text-muted-foreground">
              هنوز هیچ مدیری تعریف نشده است. نخستین حساب را بسازید؛ این صفحه پس از آن غیرفعال می‌شود.
            </p>
          )}
        </div>
        <LoginForm firstRun={firstRun} />
      </div>
    </div>
  );
}
