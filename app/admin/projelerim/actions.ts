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

  const unitMode =
    formData.get("unit_mode")?.toString() === "coklu" ? "coklu" : "tekil";
  const siteName =
    unitMode === "coklu"
      ? formData.get("site_name")?.toString().trim() || null
      : null;

  const propertyType = formData.get("property_type")?.toString() || null;
  const buildingAgeRaw = formData.get("building_age")?.toString().trim();
  const buildingAge = buildingAgeRaw ? Number(buildingAgeRaw) : null;
  const floorCountRaw = formData.get("floor_count")?.toString().trim();
  const floorCount = floorCountRaw ? Number(floorCountRaw) : null;
  const hasParking = formData.get("has_parking") === "true";
  const hasPool = formData.get("has_pool") === "true";
  const hasBalcony = formData.get("has_balcony") === "true";
  const mortgageEligible = formData.get("mortgage_eligible") === "true";
  const swapEligible = formData.get("swap_eligible") === "true";

  // Room/price/area/furnishing only apply at the project level for "tekil"
  // (single-structure) projects; "coklu" projects carry these per unit instead.
  let price: number | null = null;
  let priceCurrency: string | null = null;
  let areaM2: number | null = null;
  let roomConfig: string | null = null;
  let bathroomCount: number | null = null;
  let floorNo: string | null = null;
  let furnishing: string | null = null;

  if (unitMode === "tekil") {
    const priceRaw = formData.get("price")?.toString().trim();
    price = priceRaw ? Number(priceRaw) : null;
    priceCurrency =
      price !== null ? formData.get("price_currency")?.toString() || "GBP" : null;
    const areaRaw = formData.get("area_m2")?.toString().trim();
    areaM2 = areaRaw ? Number(areaRaw) : null;
    roomConfig = formData.get("room_config")?.toString() || null;
    const bathroomRaw = formData.get("bathroom_count")?.toString().trim();
    bathroomCount = bathroomRaw ? Number(bathroomRaw) : null;
    floorNo = formData.get("floor_no")?.toString().trim() || null;
    furnishing = formData.get("furnishing")?.toString() || null;
  }

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

  const projectPayload = {
    title,
    description,
    location,
    status,
    cover_image: coverUrl,
    gallery_images: galleryImages,
    unit_mode: unitMode,
    site_name: siteName,
    property_type: propertyType,
    price,
    price_currency: priceCurrency,
    area_m2: areaM2,
    room_config: roomConfig,
    bathroom_count: bathroomCount,
    building_age: buildingAge,
    floor_count: floorCount,
    floor_no: floorNo,
    furnishing,
    has_parking: hasParking,
    has_pool: hasPool,
    has_balcony: hasBalcony,
    mortgage_eligible: mortgageEligible,
    swap_eligible: swapEligible,
  };

  let projectId = id;

  if (id) {
    const { error } = await supabase
      .from("projects")
      .update(projectPayload)
      .eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const slug = `${slugify(title)}-${Math.random().toString(36).slice(2, 7)}`;
    const { data, error } = await supabase
      .from("projects")
      .insert({ ...projectPayload, slug })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    projectId = data.id;
  }

  if (projectId) {
    if (unitMode === "coklu") {
      await saveUnits(supabase, projectId, formData);
    } else {
      // Switched back to a single structure: drop any previously saved unit types.
      const { error } = await supabase
        .from("project_units")
        .delete()
        .eq("project_id", projectId);
      if (error) throw new Error(error.message);
    }
  }

  revalidatePath("/admin/projelerim");
  revalidatePath("/projeler");
  redirect("/admin/projelerim");
}

async function saveUnits(
  supabase: SupabaseClient,
  projectId: string,
  formData: FormData
) {
  const deletedIdsRaw = formData.get("deleted_unit_ids")?.toString() || "[]";
  const deletedIds: string[] = JSON.parse(deletedIdsRaw);
  if (deletedIds.length > 0) {
    const { error } = await supabase
      .from("project_units")
      .delete()
      .in("id", deletedIds);
    if (error) throw new Error(error.message);
  }

  const unitCount = Number(formData.get("unit_count")?.toString() || "0");

  for (let i = 0; i < unitCount; i++) {
    const prefix = `unit_${i}`;
    const unitId = formData.get(`${prefix}_id`)?.toString() || null;
    const name = formData.get(`${prefix}_name`)?.toString().trim() ?? "";
    if (!name) continue;

    const roomConfig = formData.get(`${prefix}_room_config`)?.toString() || null;
    const areaRaw = formData.get(`${prefix}_area_m2`)?.toString().trim();
    const areaM2 = areaRaw ? Number(areaRaw) : null;
    const bathroomRaw = formData
      .get(`${prefix}_bathroom_count`)
      ?.toString()
      .trim();
    const bathroomCount = bathroomRaw ? Number(bathroomRaw) : null;
    const floorNo = formData.get(`${prefix}_floor_no`)?.toString().trim() || null;
    const furnishing = formData.get(`${prefix}_furnishing`)?.toString() || null;
    const priceRaw = formData.get(`${prefix}_price`)?.toString().trim();
    const price = priceRaw ? Number(priceRaw) : null;
    const priceCurrency =
      price !== null
        ? formData.get(`${prefix}_price_currency`)?.toString() || "GBP"
        : null;
    const sortOrderRaw = formData.get(`${prefix}_sort_order`)?.toString();
    const sortOrder = sortOrderRaw ? Number(sortOrderRaw) : i;

    const coverFile = formData.get(`${prefix}_cover_image`);
    const existingCoverUrl =
      formData.get(`${prefix}_existing_cover_url`)?.toString() || null;
    const coverUrl =
      coverFile instanceof File && coverFile.size > 0
        ? await uploadImage(supabase, coverFile)
        : existingCoverUrl;

    const existingGalleryRaw =
      formData.get(`${prefix}_existing_gallery_urls`)?.toString() || "[]";
    const existingGallery: string[] = JSON.parse(existingGalleryRaw);
    const newGalleryFiles = formData
      .getAll(`${prefix}_gallery_images`)
      .filter((f): f is File => f instanceof File && f.size > 0);
    const uploadedGallery = await Promise.all(
      newGalleryFiles.map((file) => uploadImage(supabase, file))
    );
    const galleryImages = [...existingGallery, ...uploadedGallery];

    const unitPayload = {
      project_id: projectId,
      name,
      room_config: roomConfig,
      area_m2: areaM2,
      bathroom_count: bathroomCount,
      floor_no: floorNo,
      furnishing,
      price,
      price_currency: priceCurrency,
      cover_image: coverUrl,
      gallery_images: galleryImages,
      sort_order: sortOrder,
    };

    if (unitId) {
      const { error } = await supabase
        .from("project_units")
        .update(unitPayload)
        .eq("id", unitId);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("project_units").insert(unitPayload);
      if (error) throw new Error(error.message);
    }
  }
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
