import { getActiveRecruitment } from "@/lib/services/recruitment";
import { OprecManager } from "@/components/admin/OprecManager";

export const metadata = {
  title: "Kelola Open Recruitment",
  description: "Atur status dan formulir pendaftaran calon pengurus HIMA STIE 66 Kendari.",
};

export default async function AdminOprecPage() {
  const oprec = await getActiveRecruitment();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-heading text-[#1F2937]">
          Kelola Open Recruitment
        </h1>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Aktifkan pendaftaran untuk memunculkan banner peringatan di halaman depan secara otomatis.
        </p>
      </div>

      <OprecManager initialOprec={oprec} />
    </div>
  );
}
