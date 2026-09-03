import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types/project";

const PROJECT_SELECT = "*, project_units(*)";

function sortUnits(project: Project): Project {
  if (project.project_units?.length) {
    project.project_units = [...project.project_units].sort(
      (a, b) => a.sort_order - b.sort_order
    );
  }
  return project;
}

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getProjects error:", error.message);
    return [];
  }

  return (data as Project[]).map(sortUnits);
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("getProjectBySlug error:", error.message);
    return null;
  }

  return data ? sortUnits(data as Project) : null;
}
