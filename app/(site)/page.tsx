import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, Award } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

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

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Geleceğin Yapılarını Bugünden İnşa Ediyoruz
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            {siteConfig.name}, gayrimenkul ve inşaat projelerinde güvenilirlik,
            kalite ve zamanında teslimi ilke edinir. Konut ve ticari
            projelerimizle şehrin dokusuna değer katıyoruz.
          </p>
          <div className="mt-10 flex justify-center">
            <Button asChild size="lg">
              <Link href="/projeler">
                Projelerimizi İnceleyin
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t bg-secondary/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, description }) => (
            <div key={title} className="text-center sm:text-left">
              <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-background shadow-sm sm:mx-0">
                <Icon className="size-6" />
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

