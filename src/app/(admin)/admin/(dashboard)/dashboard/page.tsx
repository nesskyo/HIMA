import Link from "next/link";
import { Newspaper, Calendar, Users, Megaphone, Plus, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublishedNews } from "@/lib/services/news";
import { getEvents } from "@/lib/services/events";
import { getActiveKabinet } from "@/lib/services/kabinet";
import { getActiveRecruitment } from "@/lib/services/recruitment";
import { getCurrentAdmin } from "@/lib/actions/auth";

export const metadata = {
  title: "Dashboard Administrator",
  description: "Ringkasan data dan pengelolaan konten HIMA STIE 66 Kendari.",
};

export default async function AdminDashboardPage() {
  const [news, upcomingEvents, kabinetData, oprec, currentAdmin] = await Promise.all([
    getPublishedNews(),
    getEvents("upcoming"),
    getActiveKabinet(),
    getActiveRecruitment(),
    getCurrentAdmin(),
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#84CC16]/15 text-[#365314] text-xs font-bold">
            <ShieldCheck className="size-3.5 text-[#84CC16]" />
            <span>Sesi Administrator Aktif</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#1F2937]">
            Selamat Datang, {currentAdmin?.nama || "Pengurus"}!
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Kelola konten website HIMA STIE 66 Kendari secara mudah, mandiri, dan cepat.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/admin/berita/baru">
            <Button variant="brand-lime" size="sm" className="rounded-xl font-bold text-xs">
              <Plus className="size-4 mr-1" />
              Tulis Berita
            </Button>
          </Link>
          <Link href="/admin/event/baru">
            <Button variant="brand-yellow" size="sm" className="rounded-xl font-bold text-xs">
              <Plus className="size-4 mr-1" />
              Tambah Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat Cards Grid (PRD.md §12) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-2xl border-gray-200/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              Total Berita Terbit
            </CardTitle>
            <div className="size-8 rounded-lg bg-[#FACC15]/20 text-[#854D0E] flex items-center justify-center">
              <Newspaper className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black font-heading text-[#1F2937]">
              {news.length}
            </div>
            <p className="text-[11px] text-[#6B7280] mt-1">Artikel aktif di situs publik</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              Event Mendatang
            </CardTitle>
            <div className="size-8 rounded-lg bg-[#84CC16]/15 text-[#365314] flex items-center justify-center">
              <Calendar className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black font-heading text-[#1F2937]">
              {upcomingEvents.length}
            </div>
            <p className="text-[11px] text-[#6B7280] mt-1">Agenda terdaftar</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              Anggota Kabinet
            </CardTitle>
            <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black font-heading text-[#1F2937]">
              {kabinetData.members.length}
            </div>
            <p className="text-[11px] text-[#6B7280] mt-1">
              {kabinetData.kabinet?.nama || "Kabinet Aktif"}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              Status Oprec
            </CardTitle>
            <div className="size-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Megaphone className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-black font-heading text-[#1F2937] capitalize">
              {oprec?.status === "open" ? "Dibuka" : "Ditutup"}
            </div>
            <p className="text-[11px] text-[#6B7280] mt-1">
              {oprec?.judul || "Belum ada gelombang"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Drafts & Quick Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Latest Published News List */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold font-heading text-[#1F2937]">
              Warta Berita Terbaru
            </h3>
            <Link
              href="/admin/berita"
              className="text-xs font-bold text-[#84CC16] hover:text-[#65A30D] inline-flex items-center"
            >
              Semua Berita <ArrowRight className="size-3.5 ml-1" />
            </Link>
          </div>

          <div className="space-y-3">
            {news.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-100 flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5 truncate">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FACC15] text-[#1F2937]">
                    {item.kategori}
                  </span>
                  <h4 className="text-xs font-bold text-[#1F2937] truncate mt-1">
                    {item.judul}
                  </h4>
                  <span className="text-[10px] text-[#6B7280]">
                    {new Date(item.published_at || item.created_at).toLocaleDateString("id-ID")}
                  </span>
                </div>
                <Link href={`/admin/berita`}>
                  <Button variant="outline" size="xs" className="rounded-lg text-[11px]">
                    Kelola
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Help & Guidelines */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold font-heading text-[#1F2937]">
              Panduan Cepat Admin Humas / Medinfo
            </h3>
          </div>

          <div className="space-y-3 text-xs text-[#4B5563] leading-relaxed">
            <div className="p-3 rounded-xl bg-yellow-50/60 border border-yellow-200/60">
              <span className="font-bold text-[#854D0E] block">Pergantian Kabinet Tahunan:</span>
              <p className="mt-0.5">
                Buka menu <strong>Struktur Organisasi</strong> untuk mengubah nama kabinet, foto anggota, dan jabatan pengurus baru tanpa butuh bantuan developer.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-lime-50/60 border border-lime-200/60">
              <span className="font-bold text-[#365314] block">Publikasi Event & Oprec:</span>
              <p className="mt-0.5">
                Setelah pendaftaran dibuka, status Oprec akan otomatis memunculkan banner peringatan mencolok di halaman depan beranda publik.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
