import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import {
  PROPERTY_TYPE_LABELS,
  ROOM_CONFIG_LABELS,
  type Project,
} from "@/types/project";

/** Derives a single price label for the card overlay. */
function getCardPriceLabel(project: Project): string | null {
  if (project.unit_mode === "coklu") {
    const prices = (project.project_units ?? [])
      .filter((u) => u.price != null && u.price_currency)
      .map((u) => ({ amount: u.price as number, currency: u.price_currency! }));
    if (prices.length === 0) return null;
    if (prices.length === 1) return formatPrice(prices[0].amount, prices[0].currency);
    return `${formatPrice(
      Math.min(...prices.map((p) => p.amount)),
      prices[0].currency
    )} – ${formatPrice(
      Math.max(...prices.map((p) => p.amount)),
      prices[0].currency
    )}`;
  }
  if (project.price != null && project.price_currency) {
    return formatPrice(project.price, project.price_currency);
  }
  return null;
}

function UnitRoomConfigs({ project }: { project: Project }) {
  const units = project.project_units ?? [];
  const roomConfigs = Array.from(
    new Set(units.map((u) => u.room_config).filter((v): v is NonNullable<typeof v> => !!v))
  );
  if (roomConfigs.length === 0) return null;
  return (
    <p className="mt-1 text-sm text-muted-foreground">
      {roomConfigs.map((rc) => ROOM_CONFIG_LABELS[rc]).join(" · ")}
    </p>
  );
}

export default function ProjectCard({ project }: { project: Project }) {
  const isMultiUnit = project.unit_mode === "coklu";
  const priceLabel = getCardPriceLabel(project);

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
        {priceLabel && (
          <span className="absolute right-3 top-3 rounded-md bg-brand px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            {priceLabel}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold">{project.title}</h3>
          {isMultiUnit ? (
            <Badge variant="outline" className="shrink-0">
              Apartman
            </Badge>
          ) : project.property_type && PROPERTY_TYPE_LABELS[project.property_type] ? (
            <Badge variant="outline" className="shrink-0">
              {PROPERTY_TYPE_LABELS[project.property_type]}
            </Badge>
          ) : null}
        </div>
        {(project.region || project.location || project.area_m2 != null) && (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">
              {[
                project.region || project.location,
                project.area_m2 != null ? `${project.area_m2} m²` : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </p>
        )}
        {isMultiUnit && <UnitRoomConfigs project={project} />}
      </div>
    </Link>
  );
}
