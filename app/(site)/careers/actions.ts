"use server";

import { revalidatePath } from "next/cache";
import { getJobs } from "@/lib/content";
import { addApplication } from "@/lib/server/store";
import { saveResume, UserError } from "@/lib/server/files";

export type ApplyState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "resume", string>>;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitApplication(_prev: ApplyState, formData: FormData): Promise<ApplyState> {
  if (formData.get("website")) return { status: "success", message: "رزومه شما دریافت شد." };

  const field = (key: string, max: number) => String(formData.get(key) ?? "").trim().slice(0, max);
  const name = field("name", 120);
  const email = field("email", 200);
  const phone = field("phone", 40);
  const message = field("message", 3000);
  const jobId = field("job", 100);
  const resume = formData.get("resume");

  const errors: ApplyState["errors"] = {};
  if (name.length < 2) errors.name = "لطفاً نام خود را وارد کنید.";
  if (!EMAIL.test(email)) errors.email = "ایمیل معتبر نیست.";
  if (!(resume instanceof File) || resume.size === 0) errors.resume = "لطفاً فایل رزومه را انتخاب کنید.";
  if (Object.keys(errors).length) return { status: "error", errors };

  const job = (await getJobs()).find((j) => j.id === jobId);
  let resumeFile: string;
  try {
    resumeFile = await saveResume(resume as File);
  } catch (error) {
    if (error instanceof UserError) return { status: "error", errors: { resume: error.message } };
    throw error;
  }

  addApplication({
    jobId: job?.id ?? "",
    jobTitle: job?.title ?? "درخواست عمومی",
    name,
    email,
    phone,
    message,
    resumeFile,
    resumeName: (resume as File).name.slice(0, 200),
  });
  revalidatePath("/admin", "layout");

  return { status: "success", message: "رزومه شما با موفقیت ارسال شد. در صورت تناسب با شما تماس می‌گیریم." };
}
