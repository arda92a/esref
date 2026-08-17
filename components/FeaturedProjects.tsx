"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import ProjectCard from "@/components/ProjectCard";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

export default function FeaturedProjects({ projects }: { projects: Project[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard embla init pattern
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (projects.length === 0) return null;

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="min-w-0 shrink-0 grow-0 basis-full pl-4 sm:basis-1/2 lg:basis-1/3"
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          type="button"
          aria-label="Önceki projeler"
          disabled={!canScrollPrev}
          onClick={() => emblaApi?.scrollPrev()}
          className="inline-flex size-9 items-center justify-center rounded-full border transition-colors hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft className="size-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {projects.map((project, i) => (
            <button
              key={project.id}
              type="button"
              aria-label={`${i + 1}. slayda git`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "size-1.5 rounded-full transition-all",
                i === selectedIndex ? "w-4 bg-brand" : "bg-muted-foreground/30"
              )}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Sonraki projeler"
          disabled={!canScrollNext}
          onClick={() => emblaApi?.scrollNext()}
          className="inline-flex size-9 items-center justify-center rounded-full border transition-colors hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
