import { getCommunities } from "@/lib/services/community";
import { KomunitasManager } from "@/components/admin/KomunitasManager";

export const metadata = {
  title: "Kelola Komunitas Mahasiswa",
  description: "Kelola data sayap komunitas HIMA STIE 66 Kendari.",
};

export default async function AdminKomunitasPage() {
  const communities = await getCommunities();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-heading text-[#1F2937]">
          Kelola Komunitas Mahasiswa
        </h1>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Atur profil komunitas riset, kewirausahaan, dan pasar modal.
        </p>
      </div>

      <KomunitasManager initialCommunities={communities} />
    </div>
  );
}
