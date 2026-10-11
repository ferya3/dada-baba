import type { Metadata, Viewport } from "next";
import "@fontsource-variable/vazirmatn";
import "./globals.css";
import { siteLocale, siteUrl } from "@/lib/site";
import { getSettings } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    metadataBase: new URL(siteUrl),
    title: { default: `${settings.name} | ${settings.nameEn}`, template: `%s | ${settings.name}` },
    description: settings.description,
    applicationName: settings.name,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: siteLocale,
      siteName: settings.name,
      title: settings.name,
      description: settings.description,
      url: "/",
    },
    twitter: { card: "summary_large_image", title: settings.name, description: settings.description },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#11141c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-dvh overflow-x-clip">{children}</body>
    </html>
  );
}
