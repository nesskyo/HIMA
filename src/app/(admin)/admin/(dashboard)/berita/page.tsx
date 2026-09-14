import { getPublishedNews } from "@/lib/services/news";
import { BeritaManager } from "@/components/admin/BeritaManager";

export const metadata = {
  title: "Kelola Berita",
  description: "Kelola dan publikasikan warta kegiatan HIMA STIE 66 Kendari.",
};

export default async function AdminBeritaPage() {
  const newsList = await getPublishedNews();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-heading text-[#1F2937]">
          Kelola Berita & Publikasi
        </h1>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Tulis kabar baru, perbarui artikel, dan kelola draf berita kampus.
        </p>
      </div>

      <BeritaManager initialNews={newsList} />
    </div>
  );
}
