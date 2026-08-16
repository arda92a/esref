import type { Metadata } from "next";

import ProjectFilter from "@/components/ProjectFilter";
import { getProjects } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Projeler",
};

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Projelerimiz
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Devam eden ve tamamlanan projelerimize göz atın.
      </p>

      <div className="mt-8">
        <ProjectFilter projects={projects} />
      </div>
    </section>
  );
}
