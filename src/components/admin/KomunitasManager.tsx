"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Community } from "@/types/database.types";
import { saveCommunity, deleteCommunity } from "@/lib/actions/admin";

export function KomunitasManager({ initialCommunities }: { initialCommunities: Community[] }) {
  const [communities, setCommunities] = React.useState(initialCommunities);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingComm, setEditingComm] = React.useState<Partial<Community> | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data: Partial<Community> = {
      id: editingComm?.id,
      nama: fd.get("nama") as string,
      deskripsi: fd.get("deskripsi") as string,
      logo_url: fd.get("logo_url") as string,
      urutan: Number(fd.get("urutan") || 1),
      kontak: JSON.stringify({
        instagram: fd.get("instagram") as string,
        whatsapp: fd.get("whatsapp") as string,
      }),
    };

    const res = await saveCommunity(data);
    setLoading(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Komunitas berhasil disimpan!");
      setModalOpen(false);
      setEditingComm(null);
      if (editingComm?.id) {
        setCommunities((prev) =>
          prev.map((c) => (c.id === editingComm.id ? ({ ...c, ...data } as Community) : c))
        );
      } else {
        setCommunities((prev) => [
          {
            ...data,
            id: String(Date.now()),
            slug: data.nama!.toLowerCase().replace(/\s+/g, "-"),
            created_at: new Date().toISOString(),
          } as Community,
          ...prev,
        ]);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus data komunitas ini?")) return;
    const res = await deleteCommunity(id);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Komunitas berhasil dihapus.");
      setCommunities((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <span className="text-xs font-bold text-[#6B7280]">
          Total {communities.length} Komunitas Mahasiswa Terdaftar
        </span>

        <Button
          variant="brand-lime"
          size="sm"
          onClick={() => {
            setEditingComm(null);
            setModalOpen(true);
          }}
          className="rounded-xl font-bold text-xs"
        >
          <Plus className="size-4 mr-1.5" />
          Tambah Komunitas Baru
        </Button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {communities.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="size-12 rounded-xl bg-[#FACC15]/20 flex items-center justify-center overflow-hidden">
                  {item.logo_url ? (
                    <Image src={item.logo_url} alt={item.nama} width={48} height={48} className="object-cover" />
                  ) : (
                    <BookOpen className="size-6 text-[#854D0E]" />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => {
                      setEditingComm(item);
                      setModalOpen(true);
                    }}
                  >
                    <Edit2 className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>

              <h3 className="text-base font-bold font-heading text-[#1F2937]">{item.nama}</h3>
              <p className="text-xs text-[#6B7280] line-clamp-3 leading-relaxed">{item.deskripsi}</p>
            </div>

            <div className="text-[11px] text-[#84CC16] font-semibold border-t border-gray-100 pt-3">
              Urutan Tampil: #{item.urutan}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold font-heading text-[#1F2937]">
              {editingComm ? "Edit Data Komunitas" : "Tambah Komunitas Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1F2937]">Nama Komunitas</label>
              <Input
                name="nama"
                required
                defaultValue={editingComm?.nama || ""}
                placeholder="Contoh: Economic Research Club"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1F2937]">URL Logo / Ikon</label>
              <Input
                name="logo_url"
                defaultValue={editingComm?.logo_url || ""}
                placeholder="https://images.unsplash.com/..."
                className="rounded-xl text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1F2937]">WhatsApp Narahubung</label>
                <Input
                  name="whatsapp"
                  defaultValue={
                    editingComm?.kontak ? JSON.parse(editingComm.kontak).whatsapp || "" : ""
                  }
                  placeholder="+628123456789"
                  className="rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1F2937]">Instagram</label>
                <Input
                  name="instagram"
                  defaultValue={
                    editingComm?.kontak ? JSON.parse(editingComm.kontak).instagram || "" : ""
                  }
                  placeholder="https://instagram.com/..."
                  className="rounded-xl text-xs"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1F2937]">Nomor Urut</label>
              <Input
                name="urutan"
                type="number"
                defaultValue={editingComm?.urutan || 1}
                className="rounded-xl text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1F2937]">Deskripsi Komunitas</label>
              <Textarea
                name="deskripsi"
                rows={3}
                required
                defaultValue={editingComm?.deskripsi || ""}
                placeholder="Fokus kegiatan dan manfaat komunitas..."
                className="rounded-xl text-xs"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              variant="brand-lime"
              className="w-full rounded-xl font-bold py-5 mt-2"
            >
              {loading ? "Menyimpan..." : "Simpan Data Komunitas"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
