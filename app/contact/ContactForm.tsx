"use client";

import { useActionState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContact, type ContactState } from "./actions";

type Option = { slug: string; name: string };

function FieldError({ id, error }: { id: string; error?: string }) {
  return error ? (
    <p id={id} className="text-sm text-destructive">
      {error}
    </p>
  ) : null;
}

export function ContactForm({ subsidiaries }: { subsidiaries: Option[] }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, { status: "idle" });
  const errors = state.errors ?? {};
  const v = state.values;

  return (
    <AnimatePresence mode="wait">
      {state.status === "success" ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          role="status"
          className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card/60 p-12 text-center"
        >
          <CircleCheck className="size-12 text-primary" aria-hidden />
          <p className="text-lg">{state.message}</p>
        </motion.div>
      ) : (
        <motion.form key="form" action={action} noValidate className="grid gap-6 sm:grid-cols-2" exit={{ opacity: 0 }}>
          <div className="grid gap-2">
            <Label htmlFor="name">نام و نام خانوادگی *</Label>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              defaultValue={v?.name}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              required
            />
            <FieldError id="name-error" error={errors.name} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">ایمیل *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              dir="ltr"
              autoComplete="email"
              defaultValue={v?.email}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              required
            />
            <FieldError id="email-error" error={errors.email} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company">سازمان / شرکت</Label>
            <Input id="company" name="company" autoComplete="organization" defaultValue={v?.company} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subsidiary">زیرمجموعه مرتبط</Label>
            <select
              id="subsidiary"
              name="subsidiary"
              defaultValue={v?.subsidiary ?? ""}
              className="h-12 w-full rounded-md border border-input bg-background px-4 text-base outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-ring/40 md:text-sm"
            >
              <option value="">هلدینگ (عمومی)</option>
              {subsidiaries.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="message">پیام *</Label>
            <Textarea
              id="message"
              name="message"
              rows={6}
              defaultValue={v?.message}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              required
            />
            <FieldError id="message-error" error={errors.message} />
          </div>
          {/* Honeypot field, hidden from people and assistive tech. */}
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="website">وب‌سایت</label>
            <input id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" size="lg" disabled={pending}>
              {pending ? "در حال ارسال…" : "ارسال پیام"}
              <Send />
            </Button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
