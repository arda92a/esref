import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, Award } from "lucide-react";

import { Button } from "@/components/ui/button";
import FeaturedProjects from "@/components/FeaturedProjects";
import Reveal from "@/components/Reveal";
import StatsCounter from "@/components/StatsCounter";
import { siteConfig } from "@/lib/site-config";
import { getProjects } from "@/lib/supabase/queries";

const highlights = [
  {
    icon: ShieldCheck,
    title: "Güvenilir İşçilik",
    description: "Her projede kaliteli malzeme ve titiz uygulama.",
  },
  {
    icon: Clock,
    title: "Zamanında Teslim",
    description: "Belirlenen takvime bağlı, şeffaf süreç yönetimi.",
  },
  {
    icon: Award,
    title: "Deneyimli Ekip",
    description: "Yılların tecrübesiyle uçtan uca proje yönetimi.",
  },
];

export const revalidate = 60;

export default async function Home() {
  const projects = await getProjects();
  const completedCount = projects.filter(
    (p) => p.status === "tamamlandi"
  ).length;
  const ongoingCount = projects.filter(
    (p) => p.status === "devam-ediyor"
  ).length;
  const featuredProjects = projects.slice(0, 6);
  const experienceYears = new Date().getFullYear() - siteConfig.foundedYear;

  return (
    <div>
      <section className="relative mx-auto max-w-6xl overflow-hidden px-4 py-20 sm:px-6 sm:py-28">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-brand/15 blur-3xl" />
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h1
            className="animate-fade-in-up text-4xl font-semibold tracking-tight sm:text-5xl"
            style={{ animationDelay: "0ms" }}
          >
            Geleceğin Yapılarını Bugünden İnşa Ediyoruz
          </h1>
          <p
            className="animate-fade-in-up mt-6 text-lg text-muted-foreground"
            style={{ animationDelay: "120ms" }}
          >
            {siteConfig.name}, gayrimenkul ve inşaat projelerinde güvenilirlik,
            kalite ve zamanında teslimi ilke edinir. Konut ve ticari
            projelerimizle şehrin dokusuna değer katıyoruz.
          </p>
          <div
            className="animate-fade-in-up mt-10 flex justify-center"
            style={{ animationDelay: "240ms" }}
          >
            <Button asChild size="lg" className="group">
              <Link href="/projeler">
                Projelerimizi İnceleyin
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t bg-secondary/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, description }, i) => (
            <Reveal key={title} delay={i * 100} className="text-center sm:text-left">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand sm:mx-0">
                <Icon className="size-6" />
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {description}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-brand text-brand-foreground">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-6 px-4 py-16 sm:px-6">
          <StatsCounter value={experienceYears} suffix="+" label="Yıl Deneyim" />
          <StatsCounter value={completedCount} suffix="+" label="Tamamlanan Proje" />
          <StatsCounter value={ongoingCount} suffix="+" label="Devam Eden Proje" />
        </div>
      </section>

      {featuredProjects.length > 0 && (
        <section className="border-t bg-secondary/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <Reveal>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Öne Çıkan Projeler
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Devam eden ve tamamlanan projelerimizden bir seçki.
              </p>
            </Reveal>

            <div className="mt-10 rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
              <FeaturedProjects projects={featuredProjects} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}


