import type { Metadata } from "next";

import Reveal from "@/components/Reveal";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Hakkımızda",
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Hakkımızda
      </h1>
      <div className="mt-6 space-y-4 text-muted-foreground">
        <p>
          {siteConfig.name} Ltd., 2008 yılında kurulan ve Alayköy merkezli
          faaliyet gösteren bir inşaat müteahhitlik şirketidir.
        </p>
        <p>
          Kurulduğumuz günden bu yana konut, ticari yapılar ve anahtar teslim
          projeler başta olmak üzere farklı ölçekteki inşaat çalışmalarını;
          kalite, güvenilirlik ve müşteri memnuniyeti anlayışıyla
          gerçekleştirmekteyiz.
        </p>
        <p>
          Sektörde edindiğimiz deneyim ve güçlü çalışma anlayışımızla, her
          projenin ihtiyaçlarına uygun çözümler üretmeyi ve uzun ömürlü yapılar
          ortaya koymayı hedefliyoruz.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <Reveal className="rounded-lg border bg-card p-6">
          <h2 className="font-semibold">Vizyonumuz</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {siteConfig.vision}
          </p>
        </Reveal>
        <Reveal delay={100} className="rounded-lg border bg-card p-6">
          <h2 className="font-semibold">Misyonumuz</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {siteConfig.mission}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

