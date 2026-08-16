"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/ProjectCard";
import type { Project, ProjectStatus } from "@/types/project";

type Filter = "hepsi" | ProjectStatus;

const filters: { value: Filter; label: string }[] = [
  { value: "hepsi", label: "Tümü" },
  { value: "devam-ediyor", label: "Devam Edenler" },
  { value: "tamamlandi", label: "Tamamlananlar" },
];

export default function ProjectFilter({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("hepsi");

  const filtered = useMemo(() => {
    if (filter === "hepsi") return projects;
    return projects.filter((p) => p.status === filter);
  }, [projects, filter]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Button
            key={f.value}
            size="sm"
            variant={filter === f.value ? "default" : "outline"}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">
          Bu kategoride henüz proje bulunmuyor.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
