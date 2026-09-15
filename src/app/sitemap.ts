import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/tentang",
    "/struktur",
    "/berita",
    "/event",
    "/komunitas",
    "/oprec",
    "/galeri",
    "/kontak",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/berita" || route === "/event" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
