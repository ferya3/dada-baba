"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, setup, type LoginState } from "./actions";

export function LoginForm({ firstRun }: { firstRun: boolean }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(firstRun ? setup : login, {});

  return (
    <form action={action} className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="username">نام کاربری</Label>
        <Input id="username" name="username" dir="ltr" autoComplete="username" required autoFocus />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">رمز عبور</Label>
        <Input
          id="password"
          name="password"
          type="password"
          dir="ltr"
          autoComplete={firstRun ? "new-password" : "current-password"}
          required
        />
      </div>
      {firstRun && (
        <div className="grid gap-2">
          <Label htmlFor="confirm">تکرار رمز عبور</Label>
          <Input id="confirm" name="confirm" type="password" dir="ltr" autoComplete="new-password" required />
        </div>
      )}
      {state.message && (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      )}
      <Button type="submit" disabled={pending} className="mt-2">
        {pending ? "لطفاً صبر کنید…" : firstRun ? "ساخت حساب و ورود" : "ورود"}
        <LogIn />
      </Button>
    </form>
  );
}
