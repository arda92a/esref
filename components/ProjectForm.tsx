"use client";

import { useState } from "react";
import { X } from "lucide-react";

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
import { saveProject } from "@/app/admin/projelerim/actions";
import {
  FURNISHING_LABELS,
  HOUSING_PROPERTY_TYPES,
  PROPERTY_TYPE_LABELS,
  ROOM_CONFIG_LABELS,
  type Furnishing,
  type PriceCurrency,
  type Project,
  type PropertyType,
  type ProjectStatus,
  type RoomConfig,
} from "@/types/project";

const NONE = "none";

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

  return (
    <form action={saveProject} className="max-w-2xl space-y-6">
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
        <Label htmlFor="cover_image">Kapak Fotoğrafı</Label>
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
        <Label htmlFor="gallery_images">Galeri Fotoğrafları</Label>
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

      <Button type="submit">
        {project ? "Değişiklikleri Kaydet" : "Projeyi Ekle"}
      </Button>
    </form>
  );
}
