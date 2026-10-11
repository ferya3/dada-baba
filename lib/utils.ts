import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { siteConfig } from "@/lib/site";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const faNumber = new Intl.NumberFormat("fa-IR");

/** Formats a number with Persian digits and separators. */
export function toFaNumber(value: number) {
  return faNumber.format(value);
}

/** Converts Latin digits inside a string (e.g. a year) to Persian digits. */
export function toFaDigits(value: string | number) {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

const faDate = new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" });

export function formatFaDate(iso: string) {
  return faDate.format(new Date(iso));
}

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
