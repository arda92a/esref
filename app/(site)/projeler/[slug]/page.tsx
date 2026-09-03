import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import ProjectGallery from "@/components/ProjectGallery";
import ProjectDetails from "@/components/ProjectDetails";
import ProjectUnitSelector from "@/components/ProjectUnitSelector";
import { getProjectBySlug } from "@/lib/supabase/queries";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  return { title: project?.title ?? "Proje" };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
        {project.cover_image ? (
          <Image
            src={project.cover_image}
            alt={project.title}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Fotoğraf yok
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {project.title}
        </h1>
        <Badge variant={project.status === "tamamlandi" ? "secondary" : "default"}>
          {project.status === "tamamlandi" ? "Tamamlandı" : "Devam Ediyor"}
        </Badge>
      </div>

      {project.location && (
        <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="size-4 shrink-0" />
          {project.location}
        </p>
      )}

      {project.site_name && (
        <p className="mt-3 inline-flex items-center rounded-full border border-brand/20 bg-brand/5 px-3 py-1.5 text-sm font-medium text-brand">
          Bu proje {project.site_name} içerisinde yer almaktadır.
        </p>
      )}

      {project.description && (
        <p className="mt-6 whitespace-pre-line text-muted-foreground">
          {project.description}
        </p>
      )}

      {project.gallery_images.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold">
            {project.unit_mode === "coklu" ? "Genel Galeri" : "Galeri"}
          </h2>
          <div className="mt-4">
            <ProjectGallery images={project.gallery_images} title={project.title} />
          </div>
        </div>
      )}

      <ProjectDetails project={project} />

      {project.unit_mode === "coklu" && project.project_units && (
        <ProjectUnitSelector units={project.project_units} title={project.title} />
      )}
    </article>
  );
}
