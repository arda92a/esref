import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { Project } from "@/types/project";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projeler/${project.slug}`}
      className="group overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {project.cover_image ? (
          <Image
            src={project.cover_image}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Fotoğraf yok
          </div>
        )}
        <Badge
          variant={project.status === "tamamlandi" ? "secondary" : "default"}
          className="absolute left-3 top-3"
        >
          {project.status === "tamamlandi" ? "Tamamlandı" : "Devam Ediyor"}
        </Badge>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold">{project.title}</h3>
          {project.price != null && project.price_currency && (
            <span className="shrink-0 text-sm font-semibold text-brand">
              {formatPrice(project.price, project.price_currency)}
            </span>
          )}
        </div>
        {(project.location || project.area_m2 != null) && (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">
              {[project.location, project.area_m2 != null ? `${project.area_m2} m²` : null]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </p>
        )}
      </div>
    </Link>
  );
}
