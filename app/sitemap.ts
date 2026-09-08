import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";
import { getProjects } from "@/lib/supabase/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.siteUrl}/hakkimizda`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.siteUrl}/projeler`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.siteUrl}/iletisim`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteConfig.siteUrl}/projeler/${project.slug}`,
    lastModified: project.updated_at,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes];
}
