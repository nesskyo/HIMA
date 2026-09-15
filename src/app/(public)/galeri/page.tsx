import { Camera } from "lucide-react";
import { getGalleryAlbums } from "@/lib/services/gallery";
import { GalleryClient } from "@/components/public/GalleryClient";

export const revalidate = 60; // ISR — revalidate every 60 seconds

export const metadata = {
  title: "Galeri & Dokumentasi Kegiatan",
  description: "Album dokumentasi foto dan video kegiatan mahasiswa HIMA STIE 66 Kendari.",
};

export default async function GaleriPage() {
  const albums = await getGalleryAlbums();

  return (
    <div className="py-12 sm:py-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#84CC16]/15 text-[#365314] text-xs font-bold uppercase tracking-wider">
            <Camera className="size-3.5 text-[#84CC16]" />
            <span>Rekam Jejak Kegiatan</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1F2937] font-heading tracking-tight">
            Galeri & Dokumentasi
          </h1>
          <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed">
            Arsip visual momentum bersejarah, kebersamaan pengurus, seminar, dan pengabdian masyarakat.
          </p>
        </div>
      </div>

      {/* Gallery Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GalleryClient albums={albums} />
      </div>
    </div>
  );
}
