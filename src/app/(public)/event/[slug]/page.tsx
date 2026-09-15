import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Calendar, Clock, MapPin, ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getEventBySlug } from "@/lib/services/events";

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

export async function generateStaticParams() {
  try {
    const { getEvents } = await import("@/lib/services/events");
    const events = await getEvents();
    return events.map((ev) => ({ slug: ev.slug }));
  } catch {
    return [];
  }
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ev = await getEventBySlug(slug);

  if (!ev) {
    return { title: "Event Tidak Ditemukan" };
  }

  return {
    title: ev.judul,
    description: ev.deskripsi || "Informasi event resmi HIMA STIE 66 Kendari.",
    openGraph: {
      title: `${ev.judul} | HIMA STIE 66 Kendari`,
      description: ev.deskripsi || undefined,
      images: ev.cover_url ? [{ url: ev.cover_url }] : [],
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const ev = await getEventBySlug(slug);

  if (!ev) {
    notFound();
  }

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <div className="mb-8">
          <Link
            href="/event"
            className="inline-flex items-center text-xs font-semibold text-[#6B7280] hover:text-[#1F2937] transition-colors"
          >
            <ArrowLeft className="size-4 mr-1.5" />
            Kembali ke Daftar Event
          </Link>
        </div>

        {/* Status Badge & Header */}
        <div className="space-y-4">
          <div>
            {ev.status === "upcoming" ? (
              <Badge className="bg-[#84CC16] hover:bg-[#65A30D] text-white font-bold text-xs px-3 py-1">
                Event Mendatang (Upcoming)
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-gray-200 text-gray-700 font-semibold text-xs px-3 py-1">
                Kegiatan Telah Terlaksana
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2937] font-heading tracking-tight leading-tight">
            {ev.judul}
          </h1>
        </div>

        {/* Cover Image */}
        {ev.cover_url && (
          <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden my-8 shadow-sm">
            <Image
              src={ev.cover_url}
              alt={ev.judul}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        {/* Event Highlights Info Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-gray-200/80 shadow-sm my-8">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-[#84CC16]/15 flex items-center justify-center text-[#65A30D] shrink-0">
              <Calendar className="size-5 text-[#84CC16]" />
            </div>
            <div>
              <span className="text-xs text-[#6B7280] font-medium block">Tanggal Pelaksanaan</span>
              <span className="text-sm font-bold text-[#1F2937]">
                {new Date(ev.tanggal_mulai).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-[#FACC15]/20 flex items-center justify-center text-[#854D0E] shrink-0">
              <Clock className="size-5 text-[#EAB308]" />
            </div>
            <div>
              <span className="text-xs text-[#6B7280] font-medium block">Waktu Acara</span>
              <span className="text-sm font-bold text-[#1F2937]">
                {new Date(ev.tanggal_mulai).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                WITA s/d Selesai
              </span>
            </div>
          </div>

          <div className="sm:col-span-2 flex items-start gap-3 pt-3 border-t border-gray-100">
            <div className="size-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 shrink-0">
              <MapPin className="size-5 text-[#FACC15]" />
            </div>
            <div>
              <span className="text-xs text-[#6B7280] font-medium block">Lokasi / Tautan</span>
              <span className="text-sm font-bold text-[#1F2937] leading-relaxed">
                {ev.lokasi_atau_link}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4 text-[#374151] leading-relaxed text-base">
          <h2 className="text-2xl font-bold font-heading text-[#1F2937]">
            Tentang Kegiatan
          </h2>
          <p className="whitespace-pre-line text-sm sm:text-base leading-relaxed">
            {ev.deskripsi}
          </p>
        </div>

        {/* CTA Register Button */}
        {ev.link_pendaftaran && ev.status === "upcoming" && (
          <div className="mt-12 p-8 rounded-3xl bg-gradient-to-tr from-[#1F2937] to-[#111827] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-xl font-bold font-heading text-white">
                Tertarik Bergabung di Kegiatan Ini?
              </h3>
              <p className="text-xs text-gray-300">
                Pendaftaran terbuka untuk mahasiswa STIE 66 dan peserta umum sesuai kuota.
              </p>
            </div>
            <a href={ev.link_pendaftaran} target="_blank" rel="noopener noreferrer">
              <Button variant="brand-lime" size="lg" className="rounded-full font-bold shadow-lg">
                Daftar Sekarang <ExternalLink className="size-4 ml-1.5" />
              </Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
