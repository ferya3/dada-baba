import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, align = "start", className }: SectionHeadingProps) {
  return (
    <div className={cn("flex max-w-3xl flex-col gap-4", align === "center" && "mx-auto items-center text-center", className)}>
      {eyebrow && (
        <Reveal y={12}>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            <span className="h-px w-8 bg-primary" aria-hidden />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <SplitText text={title} className="text-3xl leading-tight font-black tracking-tight text-balance sm:text-4xl lg:text-5xl" />
      {description && (
        <Reveal delay={0.15}>
          <p className="text-base leading-8 text-pretty text-muted-foreground sm:text-lg">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
