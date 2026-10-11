"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Project, Subsidiary } from "@/lib/content/types";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";

/** Project grid with animated filtering by subsidiary. */
export function ProjectsExplorer({ projects, subsidiaries }: { projects: Project[]; subsidiaries: Subsidiary[] }) {
  const [filter, setFilter] = useState<string | null>(null);
  const bySlug = new Map(subsidiaries.map((s) => [s.slug, s]));
  const visible = filter ? projects.filter((p) => p.subsidiary === filter) : projects;
  const options = [{ slug: null, name: "همه", color: "var(--primary)" }, ...subsidiaries];

  return (
    <div className="flex flex-col gap-10">
      <div role="group" aria-label="فیلتر بر اساس زیرمجموعه" className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = filter === option.slug;
          return (
            <button
              key={option.slug ?? "all"}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(option.slug)}
              className={cn(
                "relative isolate rounded-full border border-border px-5 py-2 text-sm transition-colors",
                active ? "text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="project-filter"
                  className="absolute inset-0 -z-10 rounded-full"
                  style={{ background: option.color }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {option.name}
            </button>
          );
        })}
      </div>

      <motion.ul layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        <AnimatePresence mode="popLayout">
          {visible.map((project) => (
            <motion.li
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard project={project} subsidiary={bySlug.get(project.subsidiary)} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
