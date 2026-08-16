export const siteConfig = {
  name: "Yapı İnşaat",
  description:
    "Güvenilir, kaliteli ve zamanında teslim odaklı inşaat ve gayrimenkul projeleri.",
  phone: "+90 5xx xxx xx xx",
  phoneHref: "+905xxxxxxxxx",
  email: "info@yapiinsaat.com",
  address: "Örnek Mahallesi, Örnek Caddesi No:1, İstanbul",
  mapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.0!2d28.9784!3d41.0082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzI5LjUiTiAyOMKwNTgnNDIuMiJF!5e0!3m2!1str!2str!4v1700000000000",
  mapsUrl: "https://maps.google.com",
} as const;

export const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/projeler", label: "Projeler" },
  { href: "/iletisim", label: "İletişim" },
] as const;
