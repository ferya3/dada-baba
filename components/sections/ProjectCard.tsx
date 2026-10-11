import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Project, Subsidiary } from "@/lib/content/types";
import { TiltCard } from "@/components/motion/TiltCard";
import { toFaDigits } from "@/lib/utils";

export function ProjectCard({ project, subsidiary }: { project: Project; subsidiary?: Subsidiary }) {
  const color = subsidiary?.color ?? "var(--primary)";
  return (
    <TiltCard glow={color} className="flex flex-col">
      <article className="flex h-full flex-col gap-5 p-7">
        <div
          className="relative -mx-7 -mt-7 mb-2 grid h-44 place-items-center overflow-hidden border-b border-border"
          style={{ background: `radial-gradient(circle at 30% 20%, color-mix(in oklch, ${color} 45%, transparent), transparent 70%)` }}
          aria-hidden
        >
          <div className="bg-grid absolute inset-0 opacity-50" />
          <span className="relative text-4xl font-black" style={{ color }}>
            {project.highlight}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span className="rounded-full border border-border px-3 py-1">{project.category}</span>
          <span className="tabular-nums">{toFaDigits(project.year)}</span>
        </div>
        <h3 className="text-xl font-bold">{project.title}</h3>
        <p className="text-sm leading-7 text-muted-foreground">{project.summary}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2 text-sm">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="size-4" aria-hidden />
            {project.location}
          </span>
          {subsidiary && (
            <Link href={`/subsidiaries/${subsidiary.slug}`} className="font-medium hover:underline" style={{ color }}>
              {subsidiary.name}
            </Link>
          )}
        </div>
      </article>
    </TiltCard>
  );
}
