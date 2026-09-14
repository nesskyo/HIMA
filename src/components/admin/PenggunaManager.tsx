"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  UserPlus,
  ShieldCheck,
  Shield,
  Trash2,
  Edit2,
  Search,
  KeyRound,
  Mail,
  User,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { AdminUser, AdminRole } from "@/types/database.types";
import {
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from "@/lib/actions/admin";

interface PenggunaManagerProps {
  initialUsers: AdminUser[];
  currentAdminId: string;
}

export function PenggunaManager({
  initialUsers,
  currentAdminId,
}: PenggunaManagerProps) {
  const [users, setUsers] = React.useState<AdminUser[]>(initialUsers);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Add modal state
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  // Edit modal state
  const [editingUser, setEditingUser] = React.useState<AdminUser | null>(null);

  // Delete modal state
  const [deletingUser, setDeletingUser] = React.useState<AdminUser | null>(null);

  const filteredUsers = React.useMemo(() => {
    return users.filter(
      (u) =>
        u.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const nama = (fd.get("nama") as string).trim();
    const email = (fd.get("email") as string).trim().toLowerCase();
    const role = fd.get("role") as AdminRole;
    const password = (fd.get("password") as string).trim() || "password123";

    if (!nama || !email) {
      toast.error("Nama dan Email wajib diisi");
      setLoading(false);
      return;
    }

    const res = await createAdminUser({ nama, email, role, password });
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Akun admin baru berhasil dibuat!");
      setIsAddOpen(false);
      // Optimistic update
      const newUser: AdminUser = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        nama,
        email,
        role,
        created_at: new Date().toISOString(),
      };
      setUsers((prev) => [...prev, newUser]);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const nama = (fd.get("nama") as string).trim();
    const role = fd.get("role") as AdminRole;

    if (!nama) {
      toast.error("Nama tidak boleh kosong");
      setLoading(false);
      return;
    }

    const res = await updateAdminUser(editingUser.id, { nama, role });
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Data admin berhasil diperbarui!");
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, nama, role } : u))
      );
      setEditingUser(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    if (deletingUser.id === currentAdminId) {
      toast.error("Anda tidak dapat menghapus akun Anda sendiri!");
      setDeletingUser(null);
      return;
    }

    setLoading(true);
    const res = await deleteAdminUser(deletingUser.id);
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Akun admin berhasil dihapus.");
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
      setDeletingUser(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Information Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <Info className="size-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-1">
          <p className="font-semibold">Zona Pengaturan Akses & Hak Istimewa Pengurus</p>
          <p className="text-amber-800 leading-relaxed">
            Halaman ini khusus untuk <strong className="font-bold">Super Admin</strong>. Anda dapat mendaftarkan akun pengurus baru, mengubah jabatan hak akses antara <em>Super Admin</em> (akses penuh sistem) dan <em>Editor</em> (akses kelola konten berita, event, & galeri), serta mencabut akses pengurus yang telah demisioner.
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Cari nama, email, atau role pengurus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-white border-gray-200 text-xs"
          />
        </div>

        <Button
          onClick={() => setIsAddOpen(true)}
          className="bg-[#1F2937] hover:bg-black text-white rounded-xl h-10 px-4 text-xs font-semibold gap-2 shadow-sm shrink-0"
        >
          <UserPlus className="size-4 text-[#FACC15]" />
          Tambah Admin Baru
        </Button>
      </div>

      {/* Users List Table */}
      <Card className="rounded-2xl border-gray-200 overflow-hidden shadow-sm bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider">
                <th className="p-4 pl-6">Pengurus</th>
                <th className="p-4">Email</th>
                <th className="p-4">Hak Akses (Role)</th>
                <th className="p-4">Tanggal Bergabung</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    Tidak ada akun admin yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isCurrent = user.id === currentAdminId;
                  const isSuper = user.role === "super_admin";

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`size-9 rounded-xl flex items-center justify-center font-bold text-xs uppercase text-white shadow-sm ${
                              isSuper
                                ? "bg-gradient-to-tr from-amber-500 to-yellow-400"
                                : "bg-gradient-to-tr from-[#84CC16] to-emerald-500"
                            }`}
                          >
                            {user.nama.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-[#1F2937] flex items-center gap-2">
                              {user.nama}
                              {isCurrent && (
                                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-emerald-200">
                                  Anda
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-gray-400">
                              ID: {user.id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                          <Mail className="size-3.5 text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        {isSuper ? (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 gap-1 font-semibold text-[11px]">
                            <ShieldCheck className="size-3 text-amber-600" />
                            Super Admin
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 gap-1 font-semibold text-[11px]">
                            <Shield className="size-3 text-blue-600" />
                            Editor Konten
                          </Badge>
                        )}
                      </td>

                      <td className="p-4 text-gray-500">
                        {new Date(user.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingUser(user)}
                            className="h-8 w-8 p-0 rounded-lg text-gray-600 hover:text-black border-gray-200"
                            title="Edit Role & Nama"
                          >
                            <Edit2 className="size-3.5" />
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingUser(user)}
                            disabled={isCurrent}
                            className="h-8 w-8 p-0 rounded-lg text-rose-600 hover:bg-rose-50 border-gray-200 disabled:opacity-40"
                            title={
                              isCurrent
                                ? "Tidak dapat menghapus akun sendiri"
                                : "Hapus Akun Pengurus"
                            }
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Role explanation summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-2xl border-gray-200 p-4 bg-white">
          <div className="flex items-start gap-3">
            <div className="size-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-4" />
            </div>
            <div className="space-y-1 text-xs">
              <span className="font-bold text-[#1F2937] block">Hak Akses: Super Admin</span>
              <p className="text-gray-500 leading-relaxed">
                Memiliki kendali penuh terhadap seluruh sistem: Kelola akun admin, konfigurasi pengaturan situs (kontak, sosmed, banner), serta seluruh modul konten (berita, event, struktur, komunitas, galeri, oprec).
              </p>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-gray-200 p-4 bg-white">
          <div className="flex items-start gap-3">
            <div className="size-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Shield className="size-4" />
            </div>
            <div className="space-y-1 text-xs">
              <span className="font-bold text-[#1F2937] block">Hak Akses: Editor Konten</span>
              <p className="text-gray-500 leading-relaxed">
                Dikhususkan bagi divisi humas dan publikasi untuk menulis artikel berita, memperbarui agenda kegiatan event, mengunggah foto dokumentasi kegiatan, serta mengelola pendaftaran open recruitment.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal: Tambah Admin Baru */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold font-heading text-[#1F2937] flex items-center gap-2">
              <UserPlus className="size-5 text-[#84CC16]" />
              Tambah Akun Pengurus Baru
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Buat akun admin untuk staf pengurus HIMA STIE 66 Kendari.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateUser} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <User className="size-3.5 text-gray-400" />
                Nama Lengkap Pengurus
              </label>
              <Input
                name="nama"
                required
                placeholder="Contoh: Muhammad Fajar"
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Mail className="size-3.5 text-gray-400" />
                Alamat Email Resmi
              </label>
              <Input
                name="email"
                type="email"
                required
                placeholder="contoh: fajar@himastie66.com"
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <KeyRound className="size-3.5 text-gray-400" />
                Password Awal (Default: password123)
              </label>
              <Input
                name="password"
                type="password"
                defaultValue="password123"
                placeholder="Minimal 6 karakter"
                className="h-10 rounded-xl text-xs"
              />
              <span className="text-[11px] text-gray-400">
                Pengurus dapat mengubah password ini setelah login.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">
                Tingkat Hak Akses (Role)
              </label>
              <select
                name="role"
                defaultValue="editor"
                className="w-full h-10 px-3 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#84CC16]"
              >
                <option value="editor">Editor Konten (Publikasi, Berita, Event)</option>
                <option value="super_admin">Super Admin (Akses Penuh & Akun)</option>
              </select>
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                className="rounded-xl h-10 text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#84CC16] hover:bg-[#65a30d] text-white rounded-xl h-10 text-xs font-bold"
              >
                {loading ? "Menyimpan..." : "Buat Akun"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Edit Pengurus */}
      <Dialog
        open={Boolean(editingUser)}
        onOpenChange={(open) => !open && setEditingUser(null)}
      >
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold font-heading text-[#1F2937] flex items-center gap-2">
              <Edit2 className="size-5 text-[#FACC15]" />
              Edit Akun Pengurus
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Perbarui nama atau ubah tingkat kewenangan akun {editingUser?.email}.
            </DialogDescription>
          </DialogHeader>

          {editingUser && (
            <form onSubmit={handleUpdateUser} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Nama Lengkap
                </label>
                <Input
                  name="nama"
                  defaultValue={editingUser.nama}
                  required
                  className="h-10 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Email</label>
                <Input
                  disabled
                  value={editingUser.email}
                  className="h-10 rounded-xl text-xs bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <span className="text-[10px] text-gray-400">
                  Email akun auth terdaftar tidak dapat diubah langsung.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Tingkat Hak Akses (Role)
                </label>
                <select
                  name="role"
                  defaultValue={editingUser.role}
                  className="w-full h-10 px-3 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#84CC16]"
                >
                  <option value="editor">Editor Konten (Publikasi, Berita, Event)</option>
                  <option value="super_admin">Super Admin (Akses Penuh & Akun)</option>
                </select>
              </div>

              <DialogFooter className="pt-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingUser(null)}
                  className="rounded-xl h-10 text-xs"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#1F2937] hover:bg-black text-white rounded-xl h-10 text-xs font-bold"
                >
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal: Konfirmasi Hapus */}
      <Dialog
        open={Boolean(deletingUser)}
        onOpenChange={(open) => !open && setDeletingUser(null)}
      >
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold font-heading text-rose-600 flex items-center gap-2">
              <AlertTriangle className="size-5" />
              Hapus Akun Pengurus?
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-600">
              Apakah Anda yakin ingin mencabut akses admin untuk{" "}
              <strong className="text-gray-900 font-bold">{deletingUser?.nama}</strong> (
              {deletingUser?.email})? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-3 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingUser(null)}
              className="rounded-xl h-10 text-xs"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleDeleteUser}
              disabled={loading}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-10 text-xs font-bold"
            >
              {loading ? "Menghapus..." : "Hapus Akses"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
