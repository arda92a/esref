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
import type { Project, ProjectStatus } from "@/types/project";

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
