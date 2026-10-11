import type { Metadata } from "next";
import { getPages, getProjects, getSubsidiaries } from "@/lib/content";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProjectsExplorer } from "@/components/sections/ProjectsExplorer";
import { CallToAction } from "@/components/sections/CallToAction";

export async function generateMetadata(): Promise<Metadata> {
  const { projects: page } = await getPages();
  return { title: "پروژه‌ها", description: page.description, alternates: { canonical: "/projects" } };
}

export default async function ProjectsPage() {
  const { projects: page } = await getPages();
  const [projects, subsidiaries] = await Promise.all([getProjects(), getSubsidiaries()]);

  return (
    <>
      <PageHeader
        eyebrow="پروژه‌ها"
        title={page.title}
        description={page.description}
        path="/projects"
      />
      <section className="container-page py-12">
        <ProjectsExplorer projects={projects} subsidiaries={subsidiaries} />
      </section>
      <CallToAction />
    </>
  );
}
