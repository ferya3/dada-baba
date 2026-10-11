"use client";

import { useActionState, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Briefcase, CircleCheck, FileUp, MapPin, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getLenis } from "@/components/motion/SmoothScroll";
import { submitApplication, type ApplyState } from "./actions";

export type BoardJob = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  subsidiary?: { name: string; color: string };
};

/** Open positions plus the application form; "ارسال رزومه" on a row preselects that job. */
export function JobBoard({ jobs }: { jobs: BoardJob[] }) {
  const [jobId, setJobId] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  function apply(id: string) {
    setJobId(id);
    const target = formRef.current;
    if (!target) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { offset: -120 });
    else target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <ul className="mt-12 flex flex-col">
        {jobs.map((job) => (
          <li key={job.id} className="group flex flex-col gap-4 border-t border-border py-6 last:border-b sm:flex-row sm:items-center">
            <div className="flex flex-1 flex-col gap-2">
              <h3 className="text-xl font-bold">{job.title}</h3>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {job.subsidiary && (
                  <span className="inline-flex items-center gap-2">
                    <span className="size-2 rounded-full" style={{ background: job.subsidiary.color }} aria-hidden />
                    {job.subsidiary.name}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="size-4" aria-hidden />
                  {job.department}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4" aria-hidden />
                  {job.location}
                </span>
              </div>
            </div>
            <Badge variant="outline">{job.type}</Badge>
            <button
              type="button"
              onClick={() => apply(job.id)}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary"
            >
              ارسال رزومه
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden />
            </button>
          </li>
        ))}
      </ul>

      <div ref={formRef} id="apply" className="mt-20 scroll-mt-32 rounded-xl border border-border bg-card/30 p-6 sm:p-10">
        <h2 className="text-2xl font-black">ارسال رزومه</h2>
        <p className="mt-2 text-muted-foreground">
          موقعیت مورد نظر را انتخاب کنید یا رزومه خود را برای همکاری‌های آینده بفرستید.
        </p>
        <ApplyForm jobs={jobs} jobId={jobId} onJobChange={setJobId} />
      </div>
    </>
  );
}

function ApplyForm({ jobs, jobId, onJobChange }: { jobs: BoardJob[]; jobId: string; onJobChange: (id: string) => void }) {
  const [state, action, pending] = useActionState<ApplyState, FormData>(submitApplication, { status: "idle" });
  const [fileName, setFileName] = useState("");
  const errors = state.errors ?? {};

  return (
    <AnimatePresence mode="wait">
      {state.status === "success" ? (
        <motion.div
          key="done"
          role="status"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 flex flex-col items-center gap-4 p-8 text-center"
        >
          <CircleCheck className="size-12 text-primary" aria-hidden />
          <p className="text-lg">{state.message}</p>
        </motion.div>
      ) : (
        <motion.form key="form" action={action} exit={{ opacity: 0 }} noValidate className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="job">موقعیت شغلی</Label>
            <select
              id="job"
              name="job"
              value={jobId}
              onChange={(e) => onJobChange(e.target.value)}
              className="h-12 w-full rounded-md border border-input bg-background px-4 text-base outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-ring/40 md:text-sm"
            >
              <option value="">درخواست عمومی (همکاری‌های آینده)</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                  {job.subsidiary ? ` — ${job.subsidiary.name}` : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="apply-name">نام و نام خانوادگی *</Label>
            <Input id="apply-name" name="name" autoComplete="name" aria-invalid={!!errors.name} required />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="apply-email">ایمیل *</Label>
            <Input id="apply-email" name="email" type="email" dir="ltr" autoComplete="email" aria-invalid={!!errors.email} required />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="apply-phone">شماره تماس</Label>
            <Input id="apply-phone" name="phone" type="tel" dir="ltr" autoComplete="tel" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="apply-resume">فایل رزومه * (PDF یا Word، حداکثر ۵ مگابایت)</Label>
            <label
              htmlFor="apply-resume"
              className="flex h-12 cursor-pointer items-center gap-3 rounded-md border border-dashed border-input bg-white/[0.03] px-4 text-sm text-muted-foreground transition-colors hover:border-primary"
            >
              <FileUp className="size-4 shrink-0" aria-hidden />
              <span className="truncate">{fileName || "انتخاب فایل…"}</span>
            </label>
            <input
              id="apply-resume"
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
            />
            {errors.resume && <p className="text-sm text-destructive">{errors.resume}</p>}
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="apply-message">توضیحات</Label>
            <Textarea id="apply-message" name="message" rows={4} />
          </div>
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <input name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" size="lg" disabled={pending}>
              {pending ? "در حال ارسال…" : "ارسال رزومه"}
              <Send />
            </Button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
