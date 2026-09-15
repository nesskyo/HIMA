"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, CheckCircle, Users2, Sparkles, Building2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Kabinet, OrgMember } from "@/types/database.types";
import { saveKabinet, deleteKabinet, saveOrgMember, deleteOrgMember } from "@/lib/actions/admin";
import { MediaUploader } from "@/components/admin/MediaUploader";

interface StrukturManagerProps {
  initialKabinets: Kabinet[];
  initialMembers: OrgMember[];
}

export function StrukturManager({ initialKabinets, initialMembers }: StrukturManagerProps) {
  const [kabinets, setKabinets] = React.useState(initialKabinets);
  const [members, setMembers] = React.useState(initialMembers);

  // Active cabinet
  const activeKabinet = kabinets.find((k) => k.is_active) || kabinets[0];

  // Dialog States
  const [kabinetModalOpen, setKabinetModalOpen] = React.useState(false);
  const [editingKabinet, setEditingKabinet] = React.useState<Partial<Kabinet> | null>(null);

  const [memberModalOpen, setMemberModalOpen] = React.useState(false);
  const [editingMember, setEditingMember] = React.useState<Partial<OrgMember> | null>(null);
  const [memberPhotoUrl, setMemberPhotoUrl] = React.useState("");

  const [loading, setLoading] = React.useState(false);

  // Group members of active cabinet
  const currentMembers = members.filter((m) => m.kabinet_id === activeKabinet?.id);

  // Kabinet Save Handler
  const handleSaveKabinet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data: Partial<Kabinet> = {
      id: editingKabinet?.id,
      nama: fd.get("nama") as string,
      tahun_mulai: Number(fd.get("tahun_mulai")),
      tahun_selesai: Number(fd.get("tahun_selesai")),
      is_active: fd.get("is_active") === "on",
      deskripsi: fd.get("deskripsi") as string,
    };

    const res = await saveKabinet(data);
    setLoading(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Data kabinet berhasil disimpan!");
      setKabinetModalOpen(false);
      setEditingKabinet(null);
    }
  };

  // Member Save Handler
  const handleSaveMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data: Partial<OrgMember> = {
      id: editingMember?.id,
      kabinet_id: activeKabinet?.id || "22222222-2222-2222-2222-222222222222",
      nama: fd.get("nama") as string,
      jabatan: fd.get("jabatan") as string,
      badan: fd.get("badan") as string,
      foto_url: memberPhotoUrl || (fd.get("foto_url") as string) || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500",
      urutan: Number(fd.get("urutan") || 1),
      kontak_sosmed: {
        instagram: fd.get("instagram") as string,
        linkedin: fd.get("linkedin") as string,
      },
    };

    const res = await saveOrgMember(data);
    setLoading(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Data anggota berhasil disimpan!");
      setMemberModalOpen(false);
      setEditingMember(null);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm("Yakin ingin menghapus anggota ini?")) return;
    const res = await deleteOrgMember(id);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Anggota berhasil dihapus.");
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Kabinet Info Card */}
      <Card className="rounded-3xl border-gray-200/80 shadow-sm overflow-hidden">
        <CardHeader className="bg-[#1F2937] text-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#84CC16] text-white text-xs font-bold mb-2">
              <CheckCircle className="size-3" />
              <span>Kabinet Aktif</span>
            </div>
            <CardTitle className="text-2xl font-bold font-heading text-white">
              {activeKabinet?.nama || "Kabinet Belum Dibuat"}
            </CardTitle>
            <p className="text-xs text-gray-300 mt-1">
              Periode Kepengurusan: {activeKabinet?.tahun_mulai} / {activeKabinet?.tahun_selesai}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingKabinet(activeKabinet);
                setKabinetModalOpen(true);
              }}
              className="rounded-xl text-xs font-bold text-gray-900 bg-white hover:bg-gray-100"
            >
              <Edit2 className="size-3.5 mr-1" />
              Edit Kabinet
            </Button>
            <Button
              variant="brand-yellow"
              size="sm"
              onClick={() => {
                setEditingKabinet(null);
                setKabinetModalOpen(true);
              }}
              className="rounded-xl text-xs font-bold"
            >
              <Plus className="size-3.5 mr-1" />
              Kabinet Baru
            </Button>
          </div>
        </CardHeader>
        {activeKabinet?.deskripsi && (
          <CardContent className="p-6 text-xs sm:text-sm text-[#4B5563] bg-gray-50/40 leading-relaxed">
            <strong>Filosofi Kabinet:</strong> {activeKabinet.deskripsi}
          </CardContent>
        )}
      </Card>

      {/* 2. Members Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-heading text-[#1F2937]">
              Daftar Pengurus & Panitia
            </h2>
            <p className="text-xs text-[#6B7280]">
              Total: {currentMembers.length} pengurus terdaftar di kabinet ini
            </p>
          </div>

          <Button
            variant="brand-lime"
            size="sm"
            onClick={() => {
              setEditingMember(null);
              setMemberPhotoUrl("");
              setMemberModalOpen(true);
            }}
            className="rounded-xl font-bold text-xs"
          >
            <Plus className="size-4 mr-1.5" />
            Tambah Anggota
          </Button>
        </div>

        {/* Member Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="size-14 rounded-xl overflow-hidden bg-gray-100 relative shrink-0">
                  <Image
                    src={member.foto_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300"}
                    alt={member.nama}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="truncate space-y-0.5">
                  <span className="text-[10px] font-bold text-[#84CC16] uppercase tracking-wider block">
                    {member.badan}
                  </span>
                  <h4 className="text-xs font-bold text-[#1F2937] truncate">{member.nama}</h4>
                  <span className="text-[11px] text-[#6B7280] block truncate">
                    {member.jabatan}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => {
                    setEditingMember(member);
                    setMemberPhotoUrl(member.foto_url || "");
                    setMemberModalOpen(true);
                  }}
                  className="text-gray-500 hover:text-gray-900"
                >
                  <Edit2 className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => handleDeleteMember(member.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kabinet Modal */}
      <Dialog open={kabinetModalOpen} onOpenChange={setKabinetModalOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold font-heading text-[#1F2937]">
              {editingKabinet ? "Edit Data Kabinet" : "Tambah Kabinet Periode Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveKabinet} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1F2937]">Nama Kabinet</label>
              <Input
                name="nama"
                required
                defaultValue={editingKabinet?.nama || ""}
                placeholder="Contoh: Kabinet Sinergi Progresif"
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1F2937]">Tahun Mulai</label>
                <Input
                  name="tahun_mulai"
                  type="number"
                  required
                  defaultValue={editingKabinet?.tahun_mulai || 2026}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1F2937]">Tahun Selesai</label>
                <Input
                  name="tahun_selesai"
                  type="number"
                  required
                  defaultValue={editingKabinet?.tahun_selesai || 2027}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1F2937]">Filosofi & Deskripsi</label>
              <Textarea
                name="deskripsi"
                rows={3}
                defaultValue={editingKabinet?.deskripsi || ""}
                placeholder="Penjelasan semangat dan visi kepengurusan kabinet..."
                className="rounded-xl text-xs"
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                defaultChecked={editingKabinet ? editingKabinet.is_active : true}
                className="size-4 accent-[#84CC16] rounded"
              />
              <label htmlFor="is_active" className="text-xs font-semibold text-[#1F2937]">
                Jadikan Kabinet Aktif Berjalan
              </label>
            </div>
            <Button
              type="submit"
              disabled={loading}
              variant="brand-lime"
              className="w-full rounded-xl font-bold mt-2"
            >
              {loading ? "Menyimpan..." : "Simpan Data Kabinet"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Member Modal */}
      <Dialog open={memberModalOpen} onOpenChange={setMemberModalOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold font-heading text-[#1F2937]">
              {editingMember ? "Edit Data Pengurus" : "Tambah Pengurus Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveMember} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1F2937]">Nama Lengkap & Gelar</label>
              <Input
                name="nama"
                required
                defaultValue={editingMember?.nama || ""}
                placeholder="Nama pengurus"
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1F2937]">Badan / Divisi</label>
                <Input
                  name="badan"
                  required
                  defaultValue={editingMember?.badan || "BPH"}
                  placeholder="BPH / Divisi Humas"
                  className="rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1F2937]">Jabatan</label>
                <Input
                  name="jabatan"
                  required
                  defaultValue={editingMember?.jabatan || ""}
                  placeholder="Ketua / Anggota"
                  className="rounded-xl text-xs"
                />
              </div>
            </div>
            {/* Pas Foto Profil with MediaUploader */}
            <MediaUploader
              value={memberPhotoUrl}
              onChange={(url) => setMemberPhotoUrl(url)}
              bucket="foto-panitia"
              aspectRatio="3/4"
              label="Pas Foto Profil Pengurus"
              description="Format JPG, PNG, atau WebP (Rasio 3:4 pas foto resmi)"
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1F2937]">Link Instagram</label>
                <Input
                  name="instagram"
                  defaultValue={editingMember?.kontak_sosmed?.instagram || ""}
                  placeholder="https://instagram.com/..."
                  className="rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1F2937]">Link LinkedIn</label>
                <Input
                  name="linkedin"
                  defaultValue={editingMember?.kontak_sosmed?.linkedin || ""}
                  placeholder="https://linkedin.com/..."
                  className="rounded-xl text-xs"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1F2937]">Nomor Urut Tampil</label>
              <Input
                name="urutan"
                type="number"
                defaultValue={editingMember?.urutan || 1}
                className="rounded-xl text-xs"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              variant="brand-lime"
              className="w-full rounded-xl font-bold mt-2"
            >
              {loading ? "Menyimpan..." : "Simpan Data Pengurus"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
