import { getAllKabinets, getActiveKabinet } from "@/lib/services/kabinet";
import { StrukturManager } from "@/components/admin/StrukturManager";

export const metadata = {
  title: "Kelola Struktur Organisasi",
  description: "Kelola data kabinet dan susunan panitia HIMA STIE 66 Kendari.",
};

export default async function AdminStrukturPage() {
  const [allKabinets, activeData] = await Promise.all([
    getAllKabinets(),
    getActiveKabinet(),
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-heading text-[#1F2937]">
          Kelola Struktur & Kepengurusan
        </h1>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Perbarui data kabinet tahunan, susunan BPH, dan divisi tanpa perlu bantuan developer.
        </p>
      </div>

      <StrukturManager
        initialKabinets={allKabinets}
        initialMembers={activeData.members}
      />
    </div>
  );
}
