import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types/project";

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getProjects error:", error.message);
    return [];
  }

  return data as Project[];
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("getProjectBySlug error:", error.message);
    return null;
  }

  return data as Project | null;
}
