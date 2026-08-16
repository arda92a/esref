"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

const turkishMap: Record<string, string> = {
  ı: "i",
  ğ: "g",
  ü: "u",
  ş: "s",
  ö: "o",
  ç: "c",
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[ığüşöç]/g, (c) => turkishMap[c] ?? c)
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

async function uploadImage(supabase: SupabaseClient, file: File) {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("project-images")
    .upload(path, file);
  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("project-images").getPublicUrl(path);

  return publicUrl;
}

export async function saveProject(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const id = formData.get("id")?.toString() || null;
  const title = formData.get("title")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() || null;
  const location = formData.get("location")?.toString().trim() || null;
  const status =
    formData.get("status")?.toString() === "tamamlandi"
      ? "tamamlandi"
      : "devam-ediyor";

  if (!title) throw new Error("Proje adı zorunludur.");

  const coverFile = formData.get("cover_image");
  const existingCoverUrl = formData.get("existing_cover_url")?.toString() || null;
  const coverUrl =
    coverFile instanceof File && coverFile.size > 0
      ? await uploadImage(supabase, coverFile)
      : existingCoverUrl;

  const existingGalleryRaw =
    formData.get("existing_gallery_urls")?.toString() || "[]";
  const existingGallery: string[] = JSON.parse(existingGalleryRaw);
  const newGalleryFiles = formData
    .getAll("gallery_images")
    .filter((f): f is File => f instanceof File && f.size > 0);
  const uploadedGallery = await Promise.all(
    newGalleryFiles.map((file) => uploadImage(supabase, file))
  );
  const galleryImages = [...existingGallery, ...uploadedGallery];

  if (id) {
    const { error } = await supabase
      .from("projects")
      .update({
        title,
        description,
        location,
        status,
        cover_image: coverUrl,
        gallery_images: galleryImages,
      })
      .eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const slug = `${slugify(title)}-${Math.random().toString(36).slice(2, 7)}`;
    const { error } = await supabase.from("projects").insert({
      title,
      slug,
      description,
      location,
      status,
      cover_image: coverUrl,
      gallery_images: galleryImages,
    });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/projelerim");
  revalidatePath("/projeler");
  redirect("/admin/projelerim");
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/projelerim");
  revalidatePath("/projeler");
}
