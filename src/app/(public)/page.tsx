import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Calendar,
  Users,
  Award,
  BookOpen,
  MapPin,
  Clock,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPublishedNews } from "@/lib/services/news";
import { getEvents } from "@/lib/services/events";
import { getActiveKabinet } from "@/lib/services/kabinet";
import { getActiveRecruitment } from "@/lib/services/recruitment";
import { getCommunities } from "@/lib/services/community";
import { getSiteSettings } from "@/lib/services/settings";

export default async function HomePage() {
  const [latestNews, upcomingEvents, kabinetData, activeOprec, communities, settings] =
    await Promise.all([
      getPublishedNews({ limit: 3 }),
      getEvents("upcoming"),
      getActiveKabinet(),
      getActiveRecruitment(),
      getCommunities(),
      getSiteSettings(),
    ]);

  const nextEvent = upcomingEvents[0];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION (desain.md §5.2) */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#1F2937]">
        {/* Background Image with Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1920&auto=format&fit=crop"
            alt="Mahasiswa STIE 66 Kendari"
            fill
            priority
            className="object-cover object-center opacity-30 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F2937] via-[#1F2937]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1F2937]/90 via-[#1F2937]/60 to-transparent" />
        </div>

        {/* Decorative Geometric Shapes (desain.md §5.2) */}
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-[#FACC15]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -left-20 size-80 rounded-full bg-[#84CC16]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl space-y-6">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-yellow-400 text-xs sm:text-sm font-semibold">
              <Sparkles className="size-4 text-[#FACC15] animate-pulse" />
              <span>Portal Resmi Mahasiswa STIE 66 Kendari</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15] font-heading">
              Sinergi Nyata, Menggerakkan{" "}
              <span className="text-[#FACC15] underline decoration-[#84CC16] decoration-wavy decoration-4">
                Ekonomi
              </span>{" "}
              & Inovasi Mahasiswa.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-gray-300 leading-relaxed font-normal">
              {settings.hero_section.subtitle ||
                "Wadah representasi aspirasi, pengembangan kepemimpinan, dan aktualisasi mahasiswa Sekolah Tinggi Ilmu Ekonomi Enam Enam Kendari."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4 justify-center sm:justify-start">
              <Link href="/event">
                <Button variant="brand-lime" size="lg" className="rounded-full shadow-lg font-bold">
                  {settings.hero_section.cta_primary_text || "Lihat Program Kerja"}
                  <ArrowRight className="size-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/tentang">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-2 border-white/30 text-white hover:bg-white/10 font-semibold backdrop-blur-sm"
                >
                  {settings.hero_section.cta_secondary_text || "Tentang Kami"}
                </Button>
              </Link>
            </div>
          </div>

          {/* Active Cabinet Mini Card Preview */}
          {kabinetData.kabinet && (
            <div className="w-full sm:w-80 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">
                  Kabinet Aktif
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#84CC16] text-white">
                  {kabinetData.kabinet.tahun_mulai}/{kabinetData.kabinet.tahun_selesai}
                </span>
              </div>
              <h2 className="text-xl font-bold font-heading text-white">
                {kabinetData.kabinet.nama}
              </h2>
              <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
                {kabinetData.kabinet.deskripsi}
              </p>
              <Link href="/struktur" className="block pt-2">
                <Button
                  variant="brand-yellow"
                  size="sm"
                  className="w-full justify-between rounded-lg font-bold"
                >
                  <span>Lihat Susunan Pengurus</span>
                  <ChevronRight className="size-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 2. OPREC BANNER ALERT (If active recruitment is open) */}
      {activeOprec && activeOprec.status === "open" && (
        <section className="bg-gradient-to-r from-[#FACC15] to-[#F59E0B] py-3.5 px-4 shadow-inner border-y border-yellow-300">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[#1F2937]">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <span className="size-2.5 rounded-full bg-[#84CC16] animate-ping" />
              <span className="text-sm font-bold tracking-tight">
                📢 {activeOprec.judul} telah dibuka!
              </span>
            </div>
            <Link href="/oprec">
              <Button
                variant="brand-lime"
                size="sm"
                className="rounded-full shadow-sm font-bold text-xs"
              >
                Daftar Sekarang
                <ArrowRight className="size-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* 3. KEY STATS SECTION */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-xl bg-[#FAFAFA] border border-gray-100">
              <Users className="size-8 mx-auto text-[#84CC16] mb-2" />
              <div className="text-3xl font-extrabold text-[#1F2937] font-heading">
                {kabinetData.members.length || 45}+
              </div>
              <div className="text-sm text-[#6B7280] font-medium mt-1">Pengurus Aktif</div>
            </div>
            <div className="p-6 rounded-xl bg-[#FAFAFA] border border-gray-100">
              <Award className="size-8 mx-auto text-[#FACC15] mb-2" />
              <div className="text-3xl font-extrabold text-[#1F2937] font-heading">15+</div>
              <div className="text-sm text-[#6B7280] font-medium mt-1">Program Kerja</div>
            </div>
            <div className="p-6 rounded-xl bg-[#FAFAFA] border border-gray-100">
              <BookOpen className="size-8 mx-auto text-[#84CC16] mb-2" />
              <div className="text-3xl font-extrabold text-[#1F2937] font-heading">
                {communities.length}
              </div>
              <div className="text-sm text-[#6B7280] font-medium mt-1">Komunitas Mahasiswa</div>
            </div>
            <div className="p-6 rounded-xl bg-[#FAFAFA] border border-gray-100">
              <Sparkles className="size-8 mx-auto text-[#FACC15] mb-2" />
              <div className="text-3xl font-extrabold text-[#1F2937] font-heading">1500+</div>
              <div className="text-sm text-[#6B7280] font-medium mt-1">Mahasiswa Terdampak</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. UPCOMING EVENT SPOTLIGHT (desain.md §4.3) */}
      {nextEvent && (
        <section className="py-16 bg-[#FAFAFA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#84CC16]">
                  Agenda Terdekat
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] font-heading mt-1">
                  Event HIMA STIE 66
                </h2>
              </div>
              <Link href="/event">
                <Button variant="ghost" className="text-sm font-semibold text-[#84CC16] hover:text-[#65A30D]">
                  Lihat Semua Event <ChevronRight className="size-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm card-hover-lift">
              <div className="lg:col-span-5 relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden">
                <Image
                  src={nextEvent.cover_url || "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800"}
                  alt={nextEvent.judul}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-[#84CC16] hover:bg-[#65A30D] text-white font-bold px-3 py-1 text-xs">
                  Event Mendatang
                </Badge>
              </div>
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#6B7280]">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="size-4 text-[#84CC16]" />
                    {new Date(nextEvent.tanggal_mulai).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-4 text-[#FACC15]" />
                    {new Date(nextEvent.tanggal_mulai).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    WITA
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-heading text-[#1F2937] hover:text-[#84CC16] transition-colors">
                  <Link href={`/event/${nextEvent.slug}`}>{nextEvent.judul}</Link>
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-3">
                  {nextEvent.deskripsi}
                </p>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1F2937] font-medium pt-1">
                  <MapPin className="size-4 text-[#FACC15] shrink-0" />
                  <span>{nextEvent.lokasi_atau_link}</span>
                </div>
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  {nextEvent.link_pendaftaran && (
                    <a
                      href={nextEvent.link_pendaftaran}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="brand-lime" className="rounded-xl font-bold">
                        Daftar Partisipan
                        <ExternalLink className="size-4 ml-1.5" />
                      </Button>
                    </a>
                  )}
                  <Link href={`/event/${nextEvent.slug}`}>
                    <Button variant="outline" className="rounded-xl font-semibold">
                      Detail Kegiatan
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. LATEST NEWS / BERITA (desain.md §4.2) */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FACC15] bg-[#FACC15]/20 px-2.5 py-1 rounded-md text-[#854D0E]">
                Warta Terkini
              </span>
              <h2 className="text-3xl font-extrabold text-[#1F2937] font-heading mt-2">
                Kabar & Berita Kampus
              </h2>
              <p className="text-sm text-[#6B7280] mt-1">
                Informasi dan dokumentasi kegiatan pengurus HIMA STIE 66 Kendari
              </p>
            </div>
            <Link href="/berita">
              <Button variant="outline-lime" size="sm" className="rounded-full">
                Lihat Semua Berita <ChevronRight className="size-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestNews.map((news) => (
              <Card
                key={news.id}
                className="overflow-hidden border border-gray-200/80 rounded-2xl shadow-sm card-hover-lift flex flex-col"
              >
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  <Image
                    src={news.cover_url || "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800"}
                    alt={news.judul}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#FACC15] text-[#1F2937] shadow-sm">
                      {news.kategori}
                    </span>
                  </div>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs text-[#6B7280]">
                      {new Date(news.published_at || news.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <h3 className="text-lg font-bold font-heading text-[#1F2937] line-clamp-2 hover:text-[#84CC16] transition-colors leading-snug">
                      <Link href={`/berita/${news.slug}`}>{news.judul}</Link>
                    </h3>
                    <p className="text-xs text-[#6B7280] line-clamp-3 leading-relaxed">
                      {news.ringkasan}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <Link
                      href={`/berita/${news.slug}`}
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
        </div>
      </section>

      {/* 6. KOMUNITAS MAHASISWA PREVIEW */}
      <section className="py-16 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#84CC16]">
              Sayap Organisasi
            </span>
            <h2 className="text-3xl font-extrabold text-[#1F2937] font-heading mt-1">
              Komunitas Minat & Bakat
            </h2>
            <p className="text-sm text-[#6B7280] mt-2">
              Wadah eksplorasi keahlian khusus di bawah naungan HIMA STIE 66 Kendari
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {communities.map((comm) => (
              <div
                key={comm.id}
                className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm card-hover-lift flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="size-12 rounded-xl bg-[#FACC15]/20 flex items-center justify-center overflow-hidden">
                    {comm.logo_url ? (
                      <Image
                        src={comm.logo_url}
                        alt={comm.nama}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    ) : (
                      <BookOpen className="size-6 text-[#854D0E]" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold font-heading text-[#1F2937]">
                    <Link href={`/komunitas/${comm.slug}`}>{comm.nama}</Link>
                  </h3>
                  <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-3">
                    {comm.deskripsi}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <Link
                    href={`/komunitas/${comm.slug}`}
                    className="text-xs font-semibold text-[#84CC16] hover:text-[#65A30D] inline-flex items-center"
                  >
                    Profil Komunitas <ChevronRight className="size-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA BANNER GABUNG / KONTAK */}
      <section className="py-16 bg-gradient-to-tr from-[#1F2937] to-[#111827] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 size-72 bg-[#84CC16]/20 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
            Punya Ide, Saran, atau Ingin Berkolaborasi?
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
            Pintu sekretariat dan kanal komunikasi HIMA STIE 66 Kendari selalu terbuka lebar
            untuk seluruh civitas akademika dan mitra eksternal.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/kontak">
              <Button variant="brand-lime" size="lg" className="rounded-full font-bold">
                Hubungi Kami Sekarang
              </Button>
            </Link>
            <Link href="/oprec">
              <Button variant="brand-yellow" size="lg" className="rounded-full font-bold">
                Gabung Jadi Pengurus
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
