import type { LucideIcon } from "lucide-react";
import {
  ArrowLeftRight,
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  Check,
  Car,
  FileCheck,
  HandCoins,
  LandPlot,
  Layers,
  Percent,
  Ruler,
  Sofa,
  Waves,
  DoorOpen,
} from "lucide-react";

import { formatPrice, turkishAblativeSuffix } from "@/lib/utils";
import {
  FURNISHING_LABELS,
  PROPERTY_TYPE_LABELS,
  ROOM_CONFIG_LABELS,
  ZONING_STATUS_LABELS,
  isLandType,
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

function getLandItems(project: Project): DetailEntry[] {
  const items: DetailEntry[] = [];
  if (project.property_type) {
    items.push({
      icon: LandPlot,
      label: "Emlak Türü",
      value: PROPERTY_TYPE_LABELS[project.property_type],
    });
  }
  if (project.area_m2 != null) {
    items.push({
      icon: Ruler,
      label: "Metrekare",
      value: `${new Intl.NumberFormat("tr-TR").format(project.area_m2)} m²`,
    });
  }
  if (project.zoning_status) {
    items.push({
      icon: FileCheck,
      label: "İmar Durumu",
      value: ZONING_STATUS_LABELS[project.zoning_status],
    });
  }
  if (project.zoning_ratio != null) {
    items.push({
      icon: Percent,
      label: "İmar Oranı",
      value: `%${new Intl.NumberFormat("tr-TR").format(project.zoning_ratio)}`,
    });
  }
  if (project.floor_permit != null) {
    items.push({
      icon: Layers,
      label: "Kat İzni",
      value: `${project.floor_permit} kat`,
    });
  }
  return items;
}

export default function ProjectDetails({ project }: { project: Project }) {
  const isLand = project.unit_mode === "tekil" && isLandType(project.property_type);
  const items: DetailEntry[] = isLand ? getLandItems(project) : [];

  if (!isLand && project.property_type) {
    items.push({
      icon: Building2,
      label: "Emlak Türü",
      value: PROPERTY_TYPE_LABELS[project.property_type],
    });
  }
  if (!isLand && project.area_m2 != null) {
    items.push({
      icon: Ruler,
      label: "Metrekare",
      value: `${project.area_m2} m²`,
    });
  }
  if (!isLand && project.room_config) {
    items.push({
      icon: BedDouble,
      label: "Oda Sayısı",
      value: ROOM_CONFIG_LABELS[project.room_config],
    });
  }
  if (!isLand && project.bathroom_count != null) {
    items.push({
      icon: Bath,
      label: "Banyo Sayısı",
      value: String(project.bathroom_count),
    });
  }
  if (!isLand && project.building_age != null) {
    items.push({
      icon: CalendarDays,
      label: "Bina Yaşı",
      value: project.building_age === 0 ? "Yeni" : `${project.building_age} yıl`,
    });
  }
  if (!isLand && project.floor_count != null) {
    items.push({
      icon: Layers,
      label: project.unit_mode === "coklu" ? "Bina Kat Sayısı" : "Kat Sayısı",
      value: String(project.floor_count),
    });
  }
  if (!isLand && project.floor_no) {
    items.push({
      icon: Building2,
      label: "Bulunduğu Kat",
      value: project.floor_no,
    });
  }
  if (!isLand && project.furnishing) {
    items.push({
      icon: Sofa,
      label: "Eşya Durumu",
      value: FURNISHING_LABELS[project.furnishing],
    });
  }

  const amenities = isLand ? [] : AMENITIES.filter(({ key }) => project[key]);
  const landFeatures = isLand ? project.features ?? [] : [];
  const hasPrice = project.price != null && project.price_currency;

  if (
    items.length === 0 &&
    amenities.length === 0 &&
    landFeatures.length === 0 &&
    !hasPrice
  )
    return null;

  return (
    <div className="mt-10 rounded-2xl border bg-muted/30 p-6 sm:p-8">
      <h2 className="text-lg font-semibold">
        {isLand
          ? `${PROPERTY_TYPE_LABELS[project.property_type!]} Detayları`
          : "Proje Detayları"}
      </h2>

      {hasPrice && (
        <div className="mt-2">
          <p className="text-2xl font-bold text-brand">
            {formatPrice(project.price as number, project.price_currency!)}
            {isLand && project.price_is_starting && (
              <>
                ’{turkishAblativeSuffix(project.price as number)}
                <span className="ml-2 text-sm font-medium text-muted-foreground">
                  başlayan fiyatlarla
                </span>
              </>
            )}
          </p>
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <DetailItem key={item.label} {...item} />
          ))}
        </div>
      )}

      {landFeatures.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {landFeatures.map((feature) => (
            <span
              key={feature}
              className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand/5 px-3 py-1.5 text-sm font-medium text-brand"
            >
              <Check className="size-4" />
              {feature}
            </span>
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
