import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getPublishedNews } from "@/lib/services/news";

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

export const metadata = {
  title: "Kabar & Berita Terkini",
  description: "Warta, siaran pers, dan dokumentasi kegiatan HIMA STIE 66 Kendari.",
};

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; q?: string }>;
}) {
  const { kategori, q } = await searchParams;
  const newsList = await getPublishedNews({
    category: kategori || "Semua",
    search: q,
  });

  const categories = ["Semua", "Kegiatan", "Akademik", "Sosial", "Pengumuman"];
  const activeCategory = kategori || "Semua";

  return (
    <div className="py-12 sm:py-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FACC15]/20 text-[#854D0E] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="size-3.5 text-[#EAB308]" />
            <span>Portal Informasi Mahasiswa</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1F2937] font-heading tracking-tight">
            Kabar & Berita Kampus
          </h1>
          <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed">
            Ikuti perkembangan terbaru kegiatan organisasi, prestasi mahasiswa, dan artikel seputar ekonomi dan bisnis.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
              return (
                <Link
                  key={cat}
                  href={cat === "Semua" ? "/berita" : `/berita?kategori=${cat}`}
                >
                  <Button
                    variant={isActive ? "brand-lime" : "outline"}
                    size="sm"
                    className="rounded-full text-xs font-bold"
                  >
                    {cat}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Search Input */}
          <form method="GET" action="/berita" className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 size-4 text-[#6B7280]" />
            <Input
              name="q"
              defaultValue={q || ""}
              placeholder="Cari judul berita..."
              className="pl-9 rounded-full bg-white text-xs"
            />
          </form>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {newsList.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <p className="text-[#6B7280] text-sm">Tidak ada berita yang ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsList.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden border border-gray-200/80 rounded-2xl shadow-sm card-hover-lift flex flex-col"
              >
                <div className="relative h-52 w-full bg-gray-100 overflow-hidden">
                  <Image
                    src={item.cover_url || "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800"}
                    alt={item.judul}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#FACC15] text-[#1F2937] shadow-sm">
                      {item.kategori}
                    </span>
                  </div>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs text-[#6B7280]">
                      {new Date(item.published_at || item.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <h3 className="text-lg font-bold font-heading text-[#1F2937] line-clamp-2 hover:text-[#84CC16] transition-colors leading-snug">
                      <Link href={`/berita/${item.slug}`}>{item.judul}</Link>
                    </h3>
                    <p className="text-xs text-[#6B7280] line-clamp-3 leading-relaxed">
                      {item.ringkasan}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <Link
                      href={`/berita/${item.slug}`}
                      className="inline-flex items-center text-xs font-bold text-[#84CC16] hover:text-[#65A30D] group"
                    >
                      <span>Baca Selengkapnya</span>
                      <ArrowRight className="size-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
