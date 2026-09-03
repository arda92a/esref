"use client";

import { useState } from "react";
import Image from "next/image";
import { Bath, BedDouble, Layers, Ruler, Sofa, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import ProjectGallery from "@/components/ProjectGallery";
import { cn, formatPrice } from "@/lib/utils";
import { FURNISHING_LABELS, ROOM_CONFIG_LABELS, type ProjectUnit } from "@/types/project";

function SpecChip({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm font-medium">
      <Icon className="size-4 text-brand" />
      {label}
    </span>
  );
}

export default function ProjectUnitSelector({
  units,
  title,
}: {
  units: ProjectUnit[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (units.length === 0) return null;

  const active = units[activeIndex];
  const hasPrice = active.price != null && active.price_currency;

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold">Daire Tipleri</h2>

      <div className="mt-4 flex flex-wrap gap-2">
        {units.map((unit, i) => (
          <button
            key={unit.id}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              i === activeIndex
                ? "border-brand bg-brand text-white shadow-sm"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            {unit.name}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border bg-muted/30 p-5 sm:p-6">
        {active.cover_image && (
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
            <Image
              src={active.cover_image}
              alt={`${title} - ${active.name}`}
              fill
              sizes="(min-width: 768px) 700px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-semibold">{active.name}</h3>
          {hasPrice && (
            <span className="text-xl font-bold text-brand">
              {formatPrice(active.price as number, active.price_currency!)}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {active.room_config && (
            <SpecChip icon={BedDouble} label={ROOM_CONFIG_LABELS[active.room_config]} />
          )}
          {active.area_m2 != null && (
            <SpecChip icon={Ruler} label={`${active.area_m2} m²`} />
          )}
          {active.bathroom_count != null && (
            <SpecChip icon={Bath} label={`${active.bathroom_count} Banyo`} />
          )}
          {active.unit_count != null && (
            <SpecChip icon={Layers} label={`${active.unit_count} Daire`} />
          )}
          {active.furnishing && (
            <SpecChip icon={Sofa} label={FURNISHING_LABELS[active.furnishing]} />
          )}
        </div>

        {active.features.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {active.features.map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1.5 text-sm font-medium text-brand"
              >
                <Sparkles className="size-3.5" />
                {feature}
              </span>
            ))}
          </div>
        )}

        {active.gallery_images.length > 0 && (
          <div className="mt-6">
            <ProjectGallery
              images={active.gallery_images}
              title={`${title} - ${active.name}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
