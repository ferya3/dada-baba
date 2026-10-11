import type { Stat } from "@/lib/content/types";
import { Counter } from "@/components/motion/Counter";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

export function StatsGrid({ stats, className, accent }: { stats: Stat[]; className?: string; accent?: string }) {
  return (
    <RevealGroup
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border",
        stats.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4",
        className,
      )}
    >
      {stats.map((stat) => (
        <RevealItem key={stat.label} className="flex flex-col gap-2 bg-background p-6 sm:p-8">
          <Counter
            value={stat.value}
            suffix={stat.suffix}
            className="text-3xl font-black tabular-nums sm:text-5xl"
          />
          <span className="text-sm text-muted-foreground" style={accent ? { color: accent } : undefined}>
            {stat.label}
          </span>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
