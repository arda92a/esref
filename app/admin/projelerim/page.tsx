import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DeleteProjectButton from "@/components/DeleteProjectButton";
import { getProjects } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Projelerim</h1>
        <Button asChild size="sm">
          <Link href="/admin/projelerim/yeni">
            <Plus className="size-4" />
            Yeni Proje
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Henüz proje eklenmedi.
        </p>
      ) : (
        <div className="mt-6 divide-y rounded-lg border">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-wrap items-center justify-between gap-4 p-4"
            >
              <div>
                <p className="font-medium">{project.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge
                    variant={
                      project.status === "tamamlandi" ? "secondary" : "default"
                    }
                  >
                    {project.status === "tamamlandi"
                      ? "Tamamlandı"
                      : "Devam Ediyor"}
                  </Badge>
                  {project.location && <span>{project.location}</span>}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/projelerim/${project.id}`}>Düzenle</Link>
                </Button>
                <DeleteProjectButton id={project.id} title={project.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
