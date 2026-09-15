"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Camera, Play, Image as ImageIcon } from "lucide-react";
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
import type { GalleryAlbum, GalleryItem } from "@/types/database.types";
import { saveGalleryAlbum, deleteGalleryAlbum, saveGalleryItem, deleteGalleryItem } from "@/lib/actions/admin";
import { MediaUploader } from "@/components/admin/MediaUploader";

export function GaleriManager({ initialAlbums }: { initialAlbums: GalleryAlbum[] }) {
  const [albums, setAlbums] = React.useState(initialAlbums);
  const [activeAlbumId, setActiveAlbumId] = React.useState(initialAlbums[0]?.id || "");

  const activeAlbum = albums.find((a) => a.id === activeAlbumId) || albums[0];

  // Modals
  const [albumModalOpen, setAlbumModalOpen] = React.useState(false);
  const [editingAlbum, setEditingAlbum] = React.useState<Partial<GalleryAlbum> | null>(null);
  const [albumCoverUrl, setAlbumCoverUrl] = React.useState("");

  const [itemModalOpen, setItemModalOpen] = React.useState(false);
  const [itemUrl, setItemUrl] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSaveAlbum = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data: Partial<GalleryAlbum> = {
      id: editingAlbum?.id,
      judul: fd.get("judul") as string,
      deskripsi: fd.get("deskripsi") as string,
      cover_url: albumCoverUrl,
    };

    const res = await saveGalleryAlbum(data);
    setLoading(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Album galeri berhasil disimpan!");
      setAlbumModalOpen(false);
      setEditingAlbum(null);
    }
  };

  const handleSaveItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data: Partial<GalleryItem> = {
      album_id: activeAlbum?.id,
      url: itemUrl,
      tipe: (fd.get("tipe") as any) || "foto",
      caption: fd.get("caption") as string,
      urutan: Number(fd.get("urutan") || 1),
    };

    const res = await saveGalleryItem(data);
    setLoading(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Media berhasil ditambahkan ke album!");
      setItemModalOpen(false);
      setItemUrl("");
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Hapus foto/video ini dari album?")) return;
    const res = await deleteGalleryItem(itemId);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Item berhasil dihapus.");
      setAlbums((prev) =>
        prev.map((a) =>
          a.id === activeAlbum?.id
            ? { ...a, items: (a.items || []).filter((i) => i.id !== itemId) }
            : a
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        {/* Album Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {albums.map((album) => (
            <Button
              key={album.id}
              variant={activeAlbum?.id === album.id ? "brand-lime" : "outline"}
              size="sm"
              onClick={() => setActiveAlbumId(album.id)}
              className="rounded-xl text-xs font-bold"
            >
              {album.judul} ({(album.items || []).length})
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditingAlbum(null);
              setAlbumCoverUrl("");
              setAlbumModalOpen(true);
            }}
            className="rounded-xl text-xs font-bold"
          >
            <Plus className="size-4 mr-1" />
            Album Baru
          </Button>

          {activeAlbum && (
            <Button
              variant="brand-lime"
              size="sm"
              onClick={() => {
                setItemUrl("");
                setItemModalOpen(true);
              }}
              className="rounded-xl font-bold text-xs"
            >
              <Plus className="size-4 mr-1" />
              Upload Foto / Video
            </Button>
          )}
        </div>
      </div>

      {/* Active Album Media Grid */}
      {activeAlbum && (
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-xl font-bold font-heading text-[#1F2937]">{activeAlbum.judul}</h2>
              <p className="text-xs text-[#6B7280] mt-0.5">{activeAlbum.deskripsi}</p>
            </div>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => {
                setEditingAlbum(activeAlbum);
                setAlbumCoverUrl(activeAlbum.cover_url || "");
                setAlbumModalOpen(true);
              }}
              className="text-xs"
            >
              <Edit2 className="size-3.5 mr-1" /> Edit Judul Album
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {(activeAlbum.items || []).map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 h-52 flex flex-col justify-between"
              >
                <div className="relative h-full w-full">
                  <Image src={item.url} alt={item.caption || "Foto"} fill className="object-cover" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold">
                    {item.tipe === "video" ? "Video" : "Foto"}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)}
                    className="absolute top-2 right-2 size-7 rounded-lg bg-red-600/90 hover:bg-red-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Hapus media"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
                {item.caption && (
                  <div className="p-2 bg-white text-[11px] text-[#4B5563] truncate border-t border-gray-100">
                    {item.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Album Modal */}
      <Dialog open={albumModalOpen} onOpenChange={setAlbumModalOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold font-heading text-[#1F2937]">
              {editingAlbum ? "Edit Album Galeri" : "Tambah Album Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveAlbum} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1F2937]">Judul Album</label>
              <Input
                name="judul"
                required
                defaultValue={editingAlbum?.judul || ""}
                placeholder="Contoh: Rapat Kerja & Pelantikan 2026"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <MediaUploader
                value={albumCoverUrl}
                onChange={(url) => setAlbumCoverUrl(url)}
                bucket="galeri"
                label="Cover Album"
                description="Upload gambar sampul album (JPG/WebP)"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1F2937]">Deskripsi Album</label>
              <Textarea
                name="deskripsi"
                rows={3}
                defaultValue={editingAlbum?.deskripsi || ""}
                placeholder="Rangkuman momentum kegiatan..."
                className="rounded-xl text-xs"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              variant="brand-lime"
              className="w-full rounded-xl font-bold py-5 mt-2"
            >
              {loading ? "Menyimpan..." : "Simpan Album"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Item Modal */}
      <Dialog open={itemModalOpen} onOpenChange={setItemModalOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold font-heading text-[#1F2937]">
              Tambah Foto / Video ke Album
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveItem} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1F2937]">Tipe Media</label>
              <select
                name="tipe"
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs bg-white font-medium"
              >
                <option value="foto">Foto</option>
                <option value="video">Video (URL Embed / YouTube)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <MediaUploader
                value={itemUrl}
                onChange={(url) => setItemUrl(url)}
                bucket="galeri"
                label="Unggah Foto Kegiatan"
                description="Upload dokumentasi (JPG/WebP)"
              />
              <p className="text-[10px] text-gray-400">
                *Jika tipe Video, silakan masukkan URL secara manual di input di bawah (fitur upload video segera hadir)
              </p>
              <Input
                name="url_manual"
                value={itemUrl}
                onChange={(e) => setItemUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="rounded-xl text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1F2937]">Keterangan / Caption</label>
              <Input
                name="caption"
                placeholder="Keterangan singkat momen foto..."
                className="rounded-xl text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1F2937]">Nomor Urut</label>
              <Input name="urutan" type="number" defaultValue={1} className="rounded-xl text-xs" />
            </div>
            <Button
              type="submit"
              disabled={loading}
              variant="brand-lime"
              className="w-full rounded-xl font-bold py-5 mt-2"
            >
              {loading ? "Menyimpan..." : "Tambahkan ke Album"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
