import { SceneFallback } from "@/components/3d/SceneFallback";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { JsonLd, breadcrumbs } from "@/components/seo/JsonLd";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  path: string;
  children?: React.ReactNode;
};

/** Hero band for inner pages. Deliberately 2D — 3D is reserved for key moments. */
export function PageHeader({ eyebrow, title, description, path, children }: PageHeaderProps) {
  return (
    <section className="noise relative overflow-hidden pt-40 pb-20 sm:pt-48 sm:pb-24">
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden />
      <SceneFallback className="-top-1/3 opacity-60" />
      <div className="container-page relative flex flex-col gap-6">
        <Reveal y={12}>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            <span className="h-px w-8 bg-primary" aria-hidden />
            {eyebrow}
          </span>
        </Reveal>
        <SplitText as="h1" immediate text={title} className="max-w-4xl text-4xl leading-[1.15] font-black tracking-tight text-balance sm:text-6xl" />
        {description && (
          <Reveal delay={0.3}>
            <p className="max-w-2xl text-lg leading-8 text-pretty text-muted-foreground">{description}</p>
          </Reveal>
        )}
        {children}
      </div>
      <JsonLd
        data={breadcrumbs([
          { name: "خانه", path: "/" },
          { name: eyebrow, path },
        ])}
      />
    </section>
  );
}
