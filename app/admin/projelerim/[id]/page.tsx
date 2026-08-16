import { notFound } from "next/navigation";

import ProjectForm from "@/components/ProjectForm";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types/project";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        Projeyi Düzenle
      </h1>
      <div className="mt-6">
        <ProjectForm project={data as Project} />
      </div>
    </div>
  );
}
