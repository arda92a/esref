import Link from "next/link";
import { Building2, MapPin, Phone } from "lucide-react";

import { siteConfig, navLinks } from "@/lib/site-config";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <Building2 className="size-5" />
            {siteConfig.name}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {siteConfig.description}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Sayfalar</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">İletişim</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              {siteConfig.address}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" />
              <a
                href={`tel:${siteConfig.phoneHref}`}
                className="hover:text-foreground"
              >
                {siteConfig.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {year} {siteConfig.name}. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
