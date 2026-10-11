import type { Metadata } from "next";
import { getProjects, getSubsidiaries } from "@/lib/content";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProjectsExplorer } from "@/components/sections/ProjectsExplorer";
import { CallToAction } from "@/components/sections/CallToAction";

export const metadata: Metadata = {
  title: "پروژه‌ها",
  description: "پروژه‌های شاخص زیرمجموعه‌های هلدینگ آوند در عمران، انرژی، فناوری، لجستیک و سرمایه‌گذاری.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const [projects, subsidiaries] = await Promise.all([getProjects(), getSubsidiaries()]);

  return (
    <>
      <PageHeader
        eyebrow="پروژه‌ها"
        title="کارنامه‌ای که خود سخن می‌گوید"
        description="گزیده‌ای از پروژه‌هایی که با هم‌افزایی زیرمجموعه‌های گروه به سرانجام رسیده‌اند."
        path="/projects"
      />
      <section className="container-page py-12">
        <ProjectsExplorer projects={projects} subsidiaries={subsidiaries} />
      </section>
      <CallToAction />
    </>
  );
}
