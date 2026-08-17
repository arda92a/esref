import type { Metadata } from "next";
import { MapPin, Phone, Mail } from "lucide-react";

import ContactForm from "@/components/ContactForm";
import FacebookIcon from "@/components/icons/FacebookIcon";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "İletişim",
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        İletişim
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Sorularınız ve proje talepleriniz için bize ulaşın.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
              <a
                href={siteConfig.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {siteConfig.address}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="size-5 shrink-0 text-muted-foreground" />
              <a href={`tel:${siteConfig.phoneHref}`} className="hover:underline">
                {siteConfig.phone}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="size-5 shrink-0 text-muted-foreground" />
              <a href={`mailto:${siteConfig.email}`} className="hover:underline">
                {siteConfig.email}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <FacebookIcon className="size-5 shrink-0 text-muted-foreground" />
              <a
                href={siteConfig.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Facebook
              </a>
            </div>
          </div>

          <div className="aspect-video w-full overflow-hidden rounded-lg border">
            <iframe
              src={siteConfig.mapsEmbedUrl}
              className="h-full w-full"
              loading="lazy"
              title="Konum haritası"
            />
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
