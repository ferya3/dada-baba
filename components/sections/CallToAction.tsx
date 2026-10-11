import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";

export function CallToAction({
  title = "پروژه بعدی را با هم بسازیم",
  description = "تیم‌های تخصصی پنج شرکت گروه آماده‌اند تا از ایده تا بهره‌برداری کنار شما باشند.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="container-page py-24">
      <div className="noise relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-bl from-primary/20 via-card to-card px-6 py-16 text-center sm:px-16 sm:py-24">
        <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(circle,black,transparent_70%)]" aria-hidden />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
          <SplitText text={title} className="text-3xl font-black text-balance sm:text-5xl" />
          <Reveal delay={0.2}>
            <p className="text-lg leading-8 text-muted-foreground">{description}</p>
          </Reveal>
          <Reveal delay={0.3}>
            <MagneticButton>
              <Button asChild size="lg">
                <Link href="/contact">
                  شروع گفتگو
                  <ArrowLeft />
                </Link>
              </Button>
            </MagneticButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
