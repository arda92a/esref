import type { Metadata } from "next";
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
          {siteConfig.name} olarak, konut ve ticari yapı projelerinde
          güvenilirliği ve kaliteyi ön planda tutan bir çalışma anlayışıyla
          hareket ediyoruz. Her projede müşteri memnuniyetini, sağlam
          mühendislik uygulamalarını ve zamanında teslimi önceliklendiriyoruz.
        </p>
        <p>
          Vizyonumuz; yaşam alanlarını değerli kılan, çevresiyle uyumlu ve
          uzun ömürlü yapılar inşa ederek şehirlerin gelişimine katkı sağlamak.
          Misyonumuz ise her projede şeffaf iletişim, titiz işçilik ve
          sürdürülebilir malzeme kullanımıyla güven inşa etmektir.
        </p>
      </div>
    </section>
  );
}
