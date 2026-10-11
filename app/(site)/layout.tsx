import { getSettings } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { JsonLd, holdingOrganization } from "@/components/seo/JsonLd";
import { getSubsidiaries } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, subsidiaries] = await Promise.all([getSettings(), getSubsidiaries()]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[70] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        پرش به محتوای اصلی
      </a>
      <MotionProvider>
        <SmoothScroll />
        <ScrollProgress />
        <Header brand={{ name: settings.name, shortName: settings.shortName }} email={settings.email} />
        <main id="main">{children}</main>
        <Footer />
        <CustomCursor />
      </MotionProvider>
      <JsonLd data={holdingOrganization(settings, subsidiaries)} />
    </>
  );
}
