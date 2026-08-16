"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";

import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import { cn } from "@/lib/utils";
import type { Project, ProjectStatus } from "@/types/project";

type Filter = "hepsi" | ProjectStatus;

const filters: { value: Filter; label: string }[] = [
  { value: "hepsi", label: "Tümü" },
  { value: "devam-ediyor", label: "Devam Edenler" },
  { value: "tamamlandi", label: "Tamamlananlar" },
];

export default function ProjectFilter({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("hepsi");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const el = tabRefs.current[filter];
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    };
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [filter]);

  const filtered = useMemo(() => {
    if (filter === "hepsi") return projects;
    return projects.filter((p) => p.status === filter);
  }, [projects, filter]);

  return (
    <div>
      <div className="relative flex gap-6 border-b">
        {filters.map((f) => (
          <button
            key={f.value}
            ref={(el) => {
              tabRefs.current[f.value] = el;
            }}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              "relative pb-3 text-sm font-medium transition-colors",
              filter === f.value
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {f.label}
          </button>
        ))}
        <span
          className="absolute bottom-0 h-0.5 rounded-full bg-foreground transition-all duration-300 ease-out"
          style={{ left: indicator.left, width: indicator.width }}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">
          Bu kategoride henüz proje bulunmuyor.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <Reveal key={project.id} delay={(i % 3) * 80}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

