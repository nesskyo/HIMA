import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { getCurrentAdmin } from "@/lib/actions/auth";
import { getAdminUsers } from "@/lib/actions/admin";
import { PenggunaManager } from "@/components/admin/PenggunaManager";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Kelola Akun Admin",
  description: "Manajemen hak akses staf pengurus dan akun admin HIMA STIE 66 Kendari.",
};

export default async function AdminPenggunaPage() {
  const currentAdmin = await getCurrentAdmin();

  // Guard: Only super_admin can access this page
  if (currentAdmin?.role !== "super_admin") {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
        <div className="size-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
          <ShieldAlert className="size-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-heading text-[#1F2937]">
            Akses Dibatasi (Khusus Super Admin)
          </h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            Akun Anda terdaftar sebagai <strong className="text-gray-900">{currentAdmin?.role || "Editor"}</strong>. Halaman manajemen akun admin dan hak akses hanya dapat dibuka oleh Super Admin.
          </p>
        </div>
        <Link href="/admin/dashboard">
          <Button className="bg-[#1F2937] hover:bg-black text-white rounded-xl gap-2 text-xs">
            <ArrowLeft className="size-4" />
            Kembali ke Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const users = await getAdminUsers();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-heading text-[#1F2937]">
          Kelola Akun Admin & Pengurus
        </h1>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Atur hak akses staf pengurus HIMA STIE 66 Kendari, daftarkan akun baru, atau cabut akses demisioner.
        </p>
      </div>

      <PenggunaManager
        initialUsers={users}
        currentAdminId={currentAdmin.id}
      />
    </div>
  );
}
