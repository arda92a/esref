"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { saveProject } from "@/app/admin/projelerim/actions";
import {
  FURNISHING_LABELS,
  HOUSING_PROPERTY_TYPES,
  PROPERTY_TYPE_LABELS,
  ROOM_CONFIG_LABELS,
  UNIT_MODE_LABELS,
  type Furnishing,
  type PriceCurrency,
  type Project,
  type ProjectUnit,
  type PropertyType,
  type ProjectStatus,
  type RoomConfig,
  type UnitMode,
} from "@/types/project";

const NONE = "none";

type UnitDraft = {
  key: string;
  id: string | null;
  defaultName: string;
  defaultAreaM2: string;
  defaultBathroomCount: string;
  defaultFloorNo: string;
  defaultPrice: string;
  roomConfig: RoomConfig | typeof NONE;
  furnishing: Furnishing | typeof NONE;
  priceCurrency: PriceCurrency;
  existingCoverUrl: string | null;
  coverPreview: string | null;
  existingGalleryUrls: string[];
  galleryNewPreviews: string[];
};

function unitToDraft(unit: ProjectUnit): UnitDraft {
  return {
    key: unit.id,
    id: unit.id,
    defaultName: unit.name,
    defaultAreaM2: unit.area_m2?.toString() ?? "",
    defaultBathroomCount: unit.bathroom_count?.toString() ?? "",
    defaultFloorNo: unit.floor_no ?? "",
    defaultPrice: unit.price?.toString() ?? "",
    roomConfig: unit.room_config ?? NONE,
    furnishing: unit.furnishing ?? NONE,
    priceCurrency: unit.price_currency ?? "GBP",
    existingCoverUrl: unit.cover_image,
    coverPreview: null,
    existingGalleryUrls: unit.gallery_images ?? [],
    galleryNewPreviews: [],
  };
}

function emptyUnitDraft(defaultCurrency: PriceCurrency): UnitDraft {
  return {
    key: crypto.randomUUID(),
    id: null,
    defaultName: "",
    defaultAreaM2: "",
    defaultBathroomCount: "",
    defaultFloorNo: "",
    defaultPrice: "",
    roomConfig: NONE,
    furnishing: NONE,
    priceCurrency: defaultCurrency,
    existingCoverUrl: null,
    coverPreview: null,
    existingGalleryUrls: [],
    galleryNewPreviews: [],
  };
}

function AmenityCheckbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5">
      <input
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={defaultChecked}
        className="size-4 accent-primary"
      />
      {label}
    </label>
  );
}

export default function ProjectForm({ project }: { project?: Project }) {
  const [coverPreview, setCoverPreview] = useState<string | null>(
    project?.cover_image ?? null
  );
  const [galleryExisting, setGalleryExisting] = useState<string[]>(
    project?.gallery_images ?? []
  );
  const [galleryNewPreviews, setGalleryNewPreviews] = useState<string[]>([]);
  const [status, setStatus] = useState<ProjectStatus>(
    project?.status ?? "devam-ediyor"
  );
  const [propertyType, setPropertyType] = useState<PropertyType | typeof NONE>(
    project?.property_type ?? NONE
  );
  const [priceCurrency, setPriceCurrency] = useState<PriceCurrency>(
    project?.price_currency ?? "GBP"
  );
  const [roomConfig, setRoomConfig] = useState<RoomConfig | typeof NONE>(
    project?.room_config ?? NONE
  );
  const [furnishing, setFurnishing] = useState<Furnishing | typeof NONE>(
    project?.furnishing ?? NONE
  );
  const [unitMode, setUnitMode] = useState<UnitMode>(
    project?.unit_mode ?? "tekil"
  );
  const [units, setUnits] = useState<UnitDraft[]>(() =>
    (project?.project_units ?? []).map(unitToDraft)
  );
  const [deletedUnitIds, setDeletedUnitIds] = useState<string[]>([]);

  const showHousingDetails =
    propertyType === NONE ||
    HOUSING_PROPERTY_TYPES.includes(propertyType as PropertyType);

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setCoverPreview(URL.createObjectURL(file));
  }

  function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setGalleryNewPreviews(files.map((file) => URL.createObjectURL(file)));
  }

  function removeExistingImage(url: string) {
    setGalleryExisting((prev) => prev.filter((u) => u !== url));
  }

  function addUnit() {
    setUnits((prev) => [...prev, emptyUnitDraft(priceCurrency)]);
  }

  function removeUnit(index: number) {
    setUnits((prev) => {
      const unit = prev[index];
      if (unit.id) setDeletedUnitIds((ids) => [...ids, unit.id as string]);
      return prev.filter((_, i) => i !== index);
    });
  }

  function updateUnit(index: number, patch: Partial<UnitDraft>) {
    setUnits((prev) =>
      prev.map((u, i) => (i === index ? { ...u, ...patch } : u))
    );
  }

  function handleUnitCoverChange(
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (file) updateUnit(index, { coverPreview: URL.createObjectURL(file) });
  }

  function handleUnitGalleryChange(
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(e.target.files ?? []);
    updateUnit(index, {
      galleryNewPreviews: files.map((file) => URL.createObjectURL(file)),
    });
  }

  function removeUnitExistingImage(index: number, url: string) {
    updateUnit(index, {
      existingGalleryUrls: units[index].existingGalleryUrls.filter(
        (u) => u !== url
      ),
    });
  }

  return (
    <form action={saveProject} className="max-w-3xl space-y-6">
      {project && <input type="hidden" name="id" value={project.id} />}
      <input
        type="hidden"
        name="existing_cover_url"
        value={project?.cover_image ?? ""}
      />
      <input
        type="hidden"
        name="existing_gallery_urls"
        value={JSON.stringify(galleryExisting)}
      />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="unit_mode" value={unitMode} />
      {unitMode === "coklu" && (
        <>
          <input type="hidden" name="unit_count" value={units.length} />
          <input
            type="hidden"
            name="deleted_unit_ids"
            value={JSON.stringify(deletedUnitIds)}
          />
        </>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="title">Proje Adı</Label>
        <Input
          id="title"
          name="title"
          defaultValue={project?.title}
          required
          maxLength={150}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="location">Konum</Label>
        <Input
          id="location"
          name="location"
          defaultValue={project?.location ?? ""}
          maxLength={150}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Açıklama</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={project?.description ?? ""}
          rows={5}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Durum</Label>
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as ProjectStatus)}
        >
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="devam-ediyor">Devam Ediyor</SelectItem>
            <SelectItem value="tamamlandi">Tamamlandı</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Proje Yapısı</Label>
        <div className="grid grid-cols-1 gap-2 rounded-lg border bg-muted/30 p-1 sm:grid-cols-2">
          {(Object.entries(UNIT_MODE_LABELS) as [UnitMode, string][]).map(
            ([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setUnitMode(value)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  unitMode === value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>

      {unitMode === "tekil" && (
      <>
      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="text-sm font-semibold text-foreground">
          Emlak Bilgileri
        </h3>

        <input
          type="hidden"
          name="property_type"
          value={propertyType === NONE ? "" : propertyType}
        />
        <div className="space-y-1.5">
          <Label>Emlak Türü</Label>
          <Select
            value={propertyType}
            onValueChange={(v) => setPropertyType(v as PropertyType)}
          >
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder="Seçilmedi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>Seçilmedi</SelectItem>
              {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">

          <div className="space-y-1.5">
            <Label htmlFor="price">Fiyat</Label>
            <div className="flex gap-2">
              <Input
                id="price"
                name="price"
                type="number"
                min={0}
                step="any"
                inputMode="decimal"
                defaultValue={project?.price ?? ""}
                placeholder="Örn: 250000"
              />
              <input type="hidden" name="price_currency" value={priceCurrency} />
              <Select
                value={priceCurrency}
                onValueChange={(v) => setPriceCurrency(v as PriceCurrency)}
              >
                <SelectTrigger className="w-24 shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GBP">£</SelectItem>
                  <SelectItem value="USD">$</SelectItem>
                  <SelectItem value="TRY">₺</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="area_m2">Metrekare (m²)</Label>
            <Input
              id="area_m2"
              name="area_m2"
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
              defaultValue={project?.area_m2 ?? ""}
              placeholder="Örn: 120"
            />
          </div>
        </div>
      </div>

      {showHousingDetails && (
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="text-sm font-semibold text-foreground">
            Konut Detayları
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Oda Sayısı</Label>
              <input
                type="hidden"
                name="room_config"
                value={roomConfig === NONE ? "" : roomConfig}
              />
              <Select
                value={roomConfig}
                onValueChange={(v) => setRoomConfig(v as RoomConfig)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seçilmedi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Seçilmedi</SelectItem>
                  {Object.entries(ROOM_CONFIG_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bathroom_count">Banyo Sayısı</Label>
              <Input
                id="bathroom_count"
                name="bathroom_count"
                type="number"
                min={0}
                step={1}
                defaultValue={project?.bathroom_count ?? ""}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="building_age">Bina Yaşı (yıl)</Label>
              <Input
                id="building_age"
                name="building_age"
                type="number"
                min={0}
                step={1}
                defaultValue={project?.building_age ?? ""}
                placeholder="Örn: 3"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="floor_count">Bina Kat Sayısı</Label>
              <Input
                id="floor_count"
                name="floor_count"
                type="number"
                min={0}
                step={1}
                defaultValue={project?.floor_count ?? ""}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="floor_no">Bulunduğu Kat</Label>
              <Input
                id="floor_no"
                name="floor_no"
                defaultValue={project?.floor_no ?? ""}
                placeholder="Örn: 3, Zemin, Çatı Katı"
                maxLength={30}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Eşya Durumu</Label>
              <input
                type="hidden"
                name="furnishing"
                value={furnishing === NONE ? "" : furnishing}
              />
              <Select
                value={furnishing}
                onValueChange={(v) => setFurnishing(v as Furnishing)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seçilmedi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Seçilmedi</SelectItem>
                  {Object.entries(FURNISHING_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
      </>
      )}

      {unitMode === "coklu" && (
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="text-sm font-semibold text-foreground">
            Bina Bilgileri
          </h3>

          <input
            type="hidden"
            name="property_type"
            value={propertyType === NONE ? "" : propertyType}
          />
          <div className="space-y-1.5">
            <Label>Emlak Türü</Label>
            <Select
              value={propertyType}
              onValueChange={(v) => setPropertyType(v as PropertyType)}
            >
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="Seçilmedi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Seçilmedi</SelectItem>
                {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="building_age">Bina Yaşı (yıl)</Label>
              <Input
                id="building_age"
                name="building_age"
                type="number"
                min={0}
                step={1}
                defaultValue={project?.building_age ?? ""}
                placeholder="Örn: 3"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="floor_count">Bina Kat Sayısı</Label>
              <Input
                id="floor_count"
                name="floor_count"
                type="number"
                min={0}
                step={1}
                defaultValue={project?.floor_count ?? ""}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="site_name">Site Adı (opsiyonel)</Label>
            <Input
              id="site_name"
              name="site_name"
              defaultValue={project?.site_name ?? ""}
              placeholder="Örn: Palmiye Sitesi"
              maxLength={150}
            />
            <p className="text-xs text-muted-foreground">
              Doldurulursa proje sayfasında “bu apartman {"{site adı}"} içerisinde
              yer almaktadır” notu gösterilir.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">
          Ek Özellikler
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          <AmenityCheckbox
            name="has_parking"
            label="Otopark"
            defaultChecked={project?.has_parking}
          />
          <AmenityCheckbox
            name="has_pool"
            label="Havuz"
            defaultChecked={project?.has_pool}
          />
          <AmenityCheckbox
            name="has_balcony"
            label="Balkon/Teras"
            defaultChecked={project?.has_balcony}
          />
          <AmenityCheckbox
            name="mortgage_eligible"
            label="Krediye Uygun"
            defaultChecked={project?.mortgage_eligible}
          />
          <AmenityCheckbox
            name="swap_eligible"
            label="Takasa Uygun"
            defaultChecked={project?.swap_eligible}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cover_image">
          {unitMode === "coklu" ? "Bina Kapak Fotoğrafı" : "Kapak Fotoğrafı"}
        </Label>
        <Input
          id="cover_image"
          name="cover_image"
          type="file"
          accept="image/*"
          onChange={handleCoverChange}
        />
        {coverPreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverPreview}
            alt="Kapak önizleme"
            className="mt-2 aspect-video w-full max-w-xs rounded-md border object-cover"
          />
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="gallery_images">
          {unitMode === "coklu"
            ? "Genel / Dış Mekan Galerisi"
            : "Galeri Fotoğrafları"}
        </Label>
        <Input
          id="gallery_images"
          name="gallery_images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleGalleryChange}
        />

        {(galleryExisting.length > 0 || galleryNewPreviews.length > 0) && (
          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {galleryExisting.map((url) => (
              <div
                key={url}
                className="group relative aspect-square overflow-hidden rounded-md border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt="Galeri fotoğrafı"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(url)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
            {galleryNewPreviews.map((url) => (
              <div
                key={url}
                className="relative aspect-square overflow-hidden rounded-md border ring-2 ring-primary/40"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt="Yeni galeri fotoğrafı"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {unitMode === "coklu" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Daire Tipleri
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addUnit}
            >
              <Plus className="size-4" />
              Daire Tipi Ekle
            </Button>
          </div>

          {units.length === 0 ? (
            <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Henüz daire tipi eklenmedi. Örn: “A Tipi Daire”, “B Tipi Daire”.
            </p>
          ) : (
            <div className="space-y-4">
              {units.map((unit, index) => (
                <UnitFieldset
                  key={unit.key}
                  index={index}
                  unit={unit}
                  onRemove={() => removeUnit(index)}
                  onChange={(patch) => updateUnit(index, patch)}
                  onCoverChange={(e) => handleUnitCoverChange(index, e)}
                  onGalleryChange={(e) => handleUnitGalleryChange(index, e)}
                  onRemoveExistingImage={(url) =>
                    removeUnitExistingImage(index, url)
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}

      <Button type="submit">
        {project ? "Değişiklikleri Kaydet" : "Projeyi Ekle"}
      </Button>
    </form>
  );
}

function UnitFieldset({
  index,
  unit,
  onRemove,
  onChange,
  onCoverChange,
  onGalleryChange,
  onRemoveExistingImage,
}: {
  index: number;
  unit: UnitDraft;
  onRemove: () => void;
  onChange: (patch: Partial<UnitDraft>) => void;
  onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGalleryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveExistingImage: (url: string) => void;
}) {
  const prefix = `unit_${index}`;

  return (
    <div className="space-y-4 rounded-xl border bg-card p-4 shadow-sm sm:p-5">
      <input type="hidden" name={`${prefix}_id`} value={unit.id ?? ""} />
      <input
        type="hidden"
        name={`${prefix}_sort_order`}
        value={index}
      />
      <input
        type="hidden"
        name={`${prefix}_existing_cover_url`}
        value={unit.existingCoverUrl ?? ""}
      />
      <input
        type="hidden"
        name={`${prefix}_existing_gallery_urls`}
        value={JSON.stringify(unit.existingGalleryUrls)}
      />
      <input
        type="hidden"
        name={`${prefix}_room_config`}
        value={unit.roomConfig === NONE ? "" : unit.roomConfig}
      />
      <input
        type="hidden"
        name={`${prefix}_furnishing`}
        value={unit.furnishing === NONE ? "" : unit.furnishing}
      />
      <input
        type="hidden"
        name={`${prefix}_price_currency`}
        value={unit.priceCurrency}
      />

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
            {index + 1}
          </span>
          <p className="text-sm font-semibold text-foreground">
            Daire Tipi {index + 1}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Bu daire tipini kaldır"
          className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${prefix}_name`}>Tip Adı</Label>
        <Input
          id={`${prefix}_name`}
          name={`${prefix}_name`}
          defaultValue={unit.defaultName}
          placeholder="Örn: A Tipi Daire"
          required
          maxLength={80}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Oda Sayısı</Label>
          <Select
            value={unit.roomConfig}
            onValueChange={(v) => onChange({ roomConfig: v as RoomConfig })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seçilmedi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>Seçilmedi</SelectItem>
              {Object.entries(ROOM_CONFIG_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}_area_m2`}>Metrekare (m²)</Label>
          <Input
            id={`${prefix}_area_m2`}
            name={`${prefix}_area_m2`}
            type="number"
            min={0}
            step="any"
            inputMode="decimal"
            defaultValue={unit.defaultAreaM2}
            placeholder="Örn: 120"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}_bathroom_count`}>Banyo Sayısı</Label>
          <Input
            id={`${prefix}_bathroom_count`}
            name={`${prefix}_bathroom_count`}
            type="number"
            min={0}
            step={1}
            defaultValue={unit.defaultBathroomCount}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}_floor_no`}>Bulunduğu Kat</Label>
          <Input
            id={`${prefix}_floor_no`}
            name={`${prefix}_floor_no`}
            defaultValue={unit.defaultFloorNo}
            placeholder="Örn: 3, Zemin, Çatı Katı"
            maxLength={30}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Eşya Durumu</Label>
          <Select
            value={unit.furnishing}
            onValueChange={(v) => onChange({ furnishing: v as Furnishing })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seçilmedi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>Seçilmedi</SelectItem>
              {Object.entries(FURNISHING_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}_price`}>Fiyat</Label>
          <div className="flex gap-2">
            <Input
              id={`${prefix}_price`}
              name={`${prefix}_price`}
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
              defaultValue={unit.defaultPrice}
              placeholder="Örn: 250000"
            />
            <Select
              value={unit.priceCurrency}
              onValueChange={(v) =>
                onChange({ priceCurrency: v as PriceCurrency })
              }
            >
              <SelectTrigger className="w-24 shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GBP">£</SelectItem>
                <SelectItem value="USD">$</SelectItem>
                <SelectItem value="TRY">₺</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${prefix}_cover_image`}>Tip Kapak Fotoğrafı</Label>
        <Input
          id={`${prefix}_cover_image`}
          name={`${prefix}_cover_image`}
          type="file"
          accept="image/*"
          onChange={onCoverChange}
        />
        {(unit.coverPreview || unit.existingCoverUrl) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={unit.coverPreview ?? unit.existingCoverUrl ?? ""}
            alt="Tip kapak önizleme"
            className="mt-2 aspect-video w-full max-w-xs rounded-md border object-cover"
          />
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${prefix}_gallery_images`}>Tip Galerisi</Label>
        <Input
          id={`${prefix}_gallery_images`}
          name={`${prefix}_gallery_images`}
          type="file"
          accept="image/*"
          multiple
          onChange={onGalleryChange}
        />

        {(unit.existingGalleryUrls.length > 0 ||
          unit.galleryNewPreviews.length > 0) && (
          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {unit.existingGalleryUrls.map((url) => (
              <div
                key={url}
                className="group relative aspect-square overflow-hidden rounded-md border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt="Tip galeri fotoğrafı"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemoveExistingImage(url)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
            {unit.galleryNewPreviews.map((url) => (
              <div
                key={url}
                className="relative aspect-square overflow-hidden rounded-md border ring-2 ring-primary/40"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt="Yeni tip galeri fotoğrafı"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
