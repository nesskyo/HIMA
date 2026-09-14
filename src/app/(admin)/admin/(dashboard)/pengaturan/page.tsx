import { getSiteSettings } from "@/lib/services/settings";
import { PengaturanManager } from "@/components/admin/PengaturanManager";

export const metadata = {
  title: "Pengaturan Situs",
  description: "Kelola kontak resmi, media sosial, dan banner hero HIMA STIE 66 Kendari.",
};

export default async function AdminPengaturanPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-heading text-[#1F2937]">
          Pengaturan Situs Terpadu
        </h1>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Kelola kontak, tautan sosial media, dan teks beranda tanpa perlu redeploy kode.
        </p>
      </div>

      <PengaturanManager initialSettings={settings} />
    </div>
  );
}
