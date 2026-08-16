export type ProjectStatus = "devam-ediyor" | "tamamlandi";

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  location: string | null;
  status: ProjectStatus;
  cover_image: string | null;
  gallery_images: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}
