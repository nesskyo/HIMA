import { getGalleryAlbums } from "@/lib/services/gallery";
import { GaleriManager } from "@/components/admin/GaleriManager";

export const metadata = {
  title: "Kelola Galeri & Media",
  description: "Kelola album dokumentasi kegiatan HIMA STIE 66 Kendari.",
};

export default async function AdminGaleriPage() {
  const albums = await getGalleryAlbums();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-heading text-[#1F2937]">
          Kelola Galeri & Dokumentasi
        </h1>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Kelola album kegiatan, unggah foto, dan sematkan video dokumentasi.
        </p>
      </div>

      <GaleriManager initialAlbums={albums} />
    </div>
  );
}
