"use client";

import { useActionState, useEffect, useRef } from "react";
import { KeyRound, UserPlus } from "lucide-react";
import { addUser, changePassword, type FormState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function Status({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <p role="status" className={cn("text-sm", state.ok ? "text-emerald-400" : "text-destructive")}>
      {state.message}
    </p>
  );
}

export function AddUserForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(addUser, {});
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="new-username">نام کاربری</Label>
        <Input id="new-username" name="username" dir="ltr" autoComplete="off" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="new-password">رمز عبور (دست‌کم ۸ کاراکتر)</Label>
        <Input id="new-password" name="password" type="password" dir="ltr" autoComplete="new-password" required />
      </div>
      <Status state={state} />
      <Button type="submit" disabled={pending} className="justify-self-start">
        <UserPlus /> افزودن مدیر
      </Button>
    </form>
  );
}

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(changePassword, {});
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="current">رمز عبور فعلی</Label>
        <Input id="current" name="current" type="password" dir="ltr" autoComplete="current-password" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="next">رمز عبور جدید</Label>
        <Input id="next" name="next" type="password" dir="ltr" autoComplete="new-password" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirm">تکرار رمز عبور جدید</Label>
        <Input id="confirm" name="confirm" type="password" dir="ltr" autoComplete="new-password" required />
      </div>
      <Status state={state} />
      <Button type="submit" disabled={pending} className="justify-self-start">
        <KeyRound /> تغییر رمز عبور
      </Button>
    </form>
  );
}
