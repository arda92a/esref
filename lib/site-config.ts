const address = "65. Atatürk Cad., Alayköy, Kuzey Kıbrıs";

export const siteConfig = {
  name: "Tanrıkulu Construction",
  description:
    "2008 yılından bu yana Alayköy merkezli, kalite, güvenilirlik ve müşteri memnuniyeti odaklı inşaat ve anahtar teslim projeler.",
  phone: "+90 548 834 56 68",
  phoneHref: "+905488345668",
  email: "esreftanrikulu@gmail.com",
  address,
  facebookUrl: "https://www.facebook.com/tanrikuluconstruction/",
  mapsEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`,
  mapsUrl: "https://maps.app.goo.gl/b2AeSAWwFx79skT1A",
  foundedYear: 2008,
  vision:
    "İnşaat sektöründe güvenilirliği, kaliteli işçiliği ve profesyonel çalışma anlayışıyla tercih edilen, sürekli gelişen ve geleceğe değer katan öncü bir yapı şirketi olmak.",
  mission:
    "Müşterilerimizin ihtiyaç ve beklentilerini doğru anlayarak; kaliteli, güvenli, estetik ve zamanında teslim edilen yapılar ortaya koymak. Her projemizde dürüstlük, şeffaflık ve müşteri memnuniyetini temel alarak uzun vadeli güven ilişkileri oluşturmak.",
} as const;

export const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/projeler", label: "Projeler" },
  { href: "/iletisim", label: "İletişim" },
] as const;
