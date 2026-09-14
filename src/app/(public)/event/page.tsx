import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, Sparkles, ExternalLink, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getEvents } from "@/lib/services/events";

export const metadata = {
  title: "Agenda & Arsip Event",
  description: "Daftar kegiatan, seminar, pelatihan, dan arsip event HIMA STIE 66 Kendari.",
};

export default async function EventPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const currentTab = tab === "past" ? "past" : "upcoming";
  const events = await getEvents(currentTab);

  return (
    <div className="py-12 sm:py-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#84CC16]/15 text-[#365314] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="size-3.5 text-[#84CC16]" />
            <span>Agenda & Program Kerja</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1F2937] font-heading tracking-tight">
            Event & Kegiatan HIMA
          </h1>
          <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed">
            Temukan jadwal seminar, pelatihan kepemimpinan, kompetisi, dan kilas balik kegiatan yang telah terlaksana.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mt-10 flex justify-center">
          <div className="p-1 rounded-full bg-gray-100 border border-gray-200 inline-flex items-center gap-1">
            <Link href="/event?tab=upcoming">
              <Button
                variant={currentTab === "upcoming" ? "brand-lime" : "ghost"}
                size="sm"
                className="rounded-full px-5 text-xs font-bold"
              >
                Event Mendatang (Upcoming)
              </Button>
            </Link>
            <Link href="/event?tab=past">
              <Button
                variant={currentTab === "past" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-full px-5 text-xs font-bold"
              >
                Arsip Kegiatan (Past Event)
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200">
            <Calendar className="size-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#1F2937]">Belum ada event pada kategori ini</h3>
            <p className="text-sm text-[#6B7280] mt-1">
              Silakan periksa kembali kategori lain atau nantikan pembaruan jadwal selanjutnya.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden card-hover-lift flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-52 w-full bg-gray-100 overflow-hidden">
                    <Image
                      src={ev.cover_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800"}
                      alt={ev.judul}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      {ev.status === "upcoming" ? (
                        <Badge className="bg-[#84CC16] hover:bg-[#65A30D] text-white font-bold text-xs px-3 py-1">
                          Upcoming
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-200 text-gray-700 font-semibold text-xs px-3 py-1">
                          Telah Berlangsung
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <Calendar className="size-3.5 text-[#84CC16]" />
                        {new Date(ev.tanggal_mulai).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <Clock className="size-3.5 text-[#FACC15]" />
                        {new Date(ev.tanggal_mulai).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        WITA
                      </span>
                    </div>

                    <h3 className="text-lg font-bold font-heading text-[#1F2937] hover:text-[#84CC16] transition-colors leading-snug line-clamp-2">
                      <Link href={`/event/${ev.slug}`}>{ev.judul}</Link>
                    </h3>

                    <p className="text-xs text-[#6B7280] line-clamp-3 leading-relaxed">
                      {ev.deskripsi}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-[#1F2937] font-medium pt-2">
                      <MapPin className="size-3.5 text-[#FACC15] shrink-0" />
                      <span className="truncate">{ev.lokasi_atau_link}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-gray-100 mt-4 flex items-center justify-between gap-3">
                  <Link href={`/event/${ev.slug}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs font-semibold rounded-xl">
                      Detail Event
                    </Button>
                  </Link>

                  {ev.link_pendaftaran && ev.status === "upcoming" && (
                    <a
                      href={ev.link_pendaftaran}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="brand-lime" size="sm" className="w-full text-xs font-bold rounded-xl">
                        Daftar <ExternalLink className="size-3 ml-1" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
