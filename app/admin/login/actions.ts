"use server";

import { redirect } from "next/navigation";
import {
  checkCredentials,
  clearFailures,
  clientKey,
  createUser,
  isThrottled,
  PASSWORD_MIN,
  recordFailure,
  startSession,
  userCount,
} from "@/lib/server/auth";

export type LoginState = { message?: string };

const USERNAME = /^[a-zA-Z0-9_.-]{3,32}$/;

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const key = await clientKey();
  if (isThrottled(key)) return { message: "تلاش‌های ناموفق زیاد بود. ۱۵ دقیقه دیگر دوباره امتحان کنید." };

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const userId = checkCredentials(username, password);
  if (!userId) {
    recordFailure(key);
    return { message: "نام کاربری یا رمز عبور اشتباه است." };
  }

  clearFailures(key);
  await startSession(userId);
  redirect("/admin");
}

/** First run only: creates the first admin account. Refused once any account exists. */
export async function setup(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (userCount() > 0) return { message: "حساب مدیر قبلاً ساخته شده است. وارد شوید." };

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (!USERNAME.test(username)) return { message: "نام کاربری: ۳ تا ۳۲ حرف انگلیسی، عدد، نقطه، خط تیره یا زیرخط." };
  if (password.length < PASSWORD_MIN) return { message: `رمز عبور باید دست‌کم ${PASSWORD_MIN} کاراکتر باشد.` };
  if (password !== confirm) return { message: "تکرار رمز عبور یکسان نیست." };

  const userId = createUser(username, password);
  await startSession(userId);
  redirect("/admin");
}
