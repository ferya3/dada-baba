"use server";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "message", string>>;
  values?: { name: string; email: string; company: string; subsidiary: string; message: string };
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    subsidiary: String(formData.get("subsidiary") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  // Honeypot: real users never fill this hidden field.
  if (formData.get("website")) return { status: "success", message: "پیام شما ارسال شد." };

  const errors: ContactState["errors"] = {};
  if (values.name.length < 2) errors.name = "لطفاً نام خود را وارد کنید.";
  if (!EMAIL.test(values.email)) errors.email = "ایمیل معتبر نیست.";
  if (values.message.length < 10) errors.message = "پیام باید دست‌کم ۱۰ کاراکتر باشد.";
  if (Object.keys(errors).length) return { status: "error", errors, values };

  // TODO: deliver the enquiry — e.g. send an email (Resend / SMTP) or create a CRM lead.

  return { status: "success", message: "پیام شما با موفقیت ارسال شد. همکاران ما به‌زودی با شما تماس می‌گیرند." };
}
