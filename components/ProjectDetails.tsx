import type { LucideIcon } from "lucide-react";
import {
  ArrowLeftRight,
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  Car,
  HandCoins,
  Layers,
  Ruler,
  Sofa,
  Waves,
  DoorOpen,
} from "lucide-react";

import { formatPrice } from "@/lib/utils";
import {
  FURNISHING_LABELS,
  PROPERTY_TYPE_LABELS,
  ROOM_CONFIG_LABELS,
  type Project,
} from "@/types/project";

type DetailEntry = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function DetailItem({ icon: Icon, label, value }: DetailEntry) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
        <Icon className="size-4.5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

const AMENITIES: {
  key: "has_parking" | "has_pool" | "has_balcony" | "mortgage_eligible" | "swap_eligible";
  label: string;
  icon: LucideIcon;
}[] = [
  { key: "has_parking", label: "Otopark", icon: Car },
  { key: "has_pool", label: "Havuz", icon: Waves },
  { key: "has_balcony", label: "Balkon/Teras", icon: DoorOpen },
  { key: "mortgage_eligible", label: "Krediye Uygun", icon: HandCoins },
  { key: "swap_eligible", label: "Takasa Uygun", icon: ArrowLeftRight },
];

export default function ProjectDetails({ project }: { project: Project }) {
  const items: DetailEntry[] = [];

  if (project.property_type) {
    items.push({
      icon: Building2,
      label: "Emlak Türü",
      value: PROPERTY_TYPE_LABELS[project.property_type],
    });
  }
  if (project.area_m2 != null) {
    items.push({
      icon: Ruler,
      label: "Metrekare",
      value: `${project.area_m2} m²`,
    });
  }
  if (project.room_config) {
    items.push({
      icon: BedDouble,
      label: "Oda Sayısı",
      value: ROOM_CONFIG_LABELS[project.room_config],
    });
  }
  if (project.bathroom_count != null) {
    items.push({
      icon: Bath,
      label: "Banyo Sayısı",
      value: String(project.bathroom_count),
    });
  }
  if (project.building_age != null) {
    items.push({
      icon: CalendarDays,
      label: "Bina Yaşı",
      value: project.building_age === 0 ? "Yeni" : `${project.building_age} yıl`,
    });
  }
  if (project.floor_count != null) {
    items.push({
      icon: Layers,
      label: project.unit_mode === "coklu" ? "Bina Kat Sayısı" : "Kat Sayısı",
      value: String(project.floor_count),
    });
  }
  if (project.floor_no) {
    items.push({
      icon: Building2,
      label: "Bulunduğu Kat",
      value: project.floor_no,
    });
  }
  if (project.furnishing) {
    items.push({
      icon: Sofa,
      label: "Eşya Durumu",
      value: FURNISHING_LABELS[project.furnishing],
    });
  }

  const amenities = AMENITIES.filter(({ key }) => project[key]);
  const hasPrice = project.price != null && project.price_currency;

  if (items.length === 0 && amenities.length === 0 && !hasPrice) return null;

  return (
    <div className="mt-10 rounded-2xl border bg-muted/30 p-6 sm:p-8">
      <h2 className="text-lg font-semibold">Proje Detayları</h2>

      {hasPrice && (
        <p className="mt-2 text-2xl font-bold text-brand">
          {formatPrice(project.price as number, project.price_currency!)}
        </p>
      )}

      {items.length > 0 && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <DetailItem key={item.label} {...item} />
          ))}
        </div>
      )}

      {amenities.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {amenities.map(({ key, label, icon: Icon }) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand/5 px-3 py-1.5 text-sm font-medium text-brand"
            >
              <Icon className="size-4" />
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
