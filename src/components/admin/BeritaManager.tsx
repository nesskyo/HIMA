"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Search, Eye, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { NewsPost } from "@/types/database.types";
import { saveNewsPost, deleteNewsPost } from "@/lib/actions/admin";

export function BeritaManager({ initialNews }: { initialNews: NewsPost[] }) {
  const [newsList, setNewsList] = React.useState(initialNews);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("Semua");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<Partial<NewsPost> | null>(null);
  const [loading, setLoading] = React.useState(false);

  const filteredNews = newsList.filter((item) => {
    const matchesSearch = item.judul.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "Semua" || item.kategori.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data: Partial<NewsPost> = {
      id: editingPost?.id,
      judul: fd.get("judul") as string,
      kategori: fd.get("kategori") as string,
      cover_url: fd.get("cover_url") as string,
      ringkasan: fd.get("ringkasan") as string,
      konten: fd.get("konten") as string,
      status: (fd.get("status") as any) || "published",
      published_at: fd.get("status") === "published" ? new Date().toISOString() : null,
    };

    const res = await saveNewsPost(data);
    setLoading(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Berita berhasil disimpan!");
      setModalOpen(false);
      setEditingPost(null);
      if (editingPost?.id) {
        setNewsList((prev) =>
          prev.map((n) => (n.id === editingPost.id ? ({ ...n, ...data } as NewsPost) : n))
        );
      } else {
        setNewsList((prev) => [
          {
            ...data,
            id: String(Date.now()),
            slug: data.judul!.toLowerCase().replace(/\s+/g, "-"),
            created_at: new Date().toISOString(),
          } as NewsPost,
          ...prev,
        ]);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus berita ini secara permanen?")) return;
    const res = await deleteNewsPost(id);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Berita telah dihapus.");
      setNewsList((prev) => prev.filter((n) => n.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {["Semua", "Kegiatan", "Akademik", "Sosial", "Pengumuman"].map((cat) => (
            <Button
              key={cat}
              variant={categoryFilter === cat ? "brand-lime" : "outline"}
              size="xs"
              onClick={() => setCategoryFilter(cat)}
              className="rounded-lg text-xs"
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 size-3.5 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul..."
              className="pl-9 text-xs rounded-xl h-9"
            />
          </div>

          <Button
            variant="brand-lime"
            size="sm"
            onClick={() => {
              setEditingPost(null);
              setModalOpen(true);
            }}
            className="rounded-xl font-bold text-xs shrink-0"
          >
            <Plus className="size-4 mr-1.5" />
            Tulis Berita
          </Button>
        </div>
      </div>

      {/* News Table */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-[#6B7280] font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Berita</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredNews.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3 max-w-md">
                      <div className="size-12 rounded-xl bg-gray-100 relative overflow-hidden shrink-0">
                        <Image
                          src={item.cover_url || "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=300"}
                          alt={item.judul}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-[#1F2937] text-sm truncate block">
                          {item.judul}
                        </span>
                        <span className="text-[11px] text-[#6B7280] truncate block">
                          {item.ringkasan || "Tidak ada ringkasan"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-[#1F2937]">{item.kategori}</td>
                  <td className="py-4 px-4">
                    {item.status === "published" ? (
                      <Badge className="bg-[#84CC16] hover:bg-[#65A30D] text-white text-[10px]">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">
                        Draft
                      </Badge>
                    )}
                  </td>
                  <td className="py-4 px-4 text-[#6B7280]">
                    {new Date(item.published_at || item.created_at).toLocaleDateString("id-ID")}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => {
                          setEditingPost(item);
                          setModalOpen(true);
                        }}
                        className="text-gray-600 hover:text-gray-900"
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create News Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold font-heading text-[#1F2937]">
              {editingPost ? "Edit Artikel Berita" : "Tulis Artikel Berita Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1F2937]">Judul Berita</label>
              <Input
                name="judul"
                required
                defaultValue={editingPost?.judul || ""}
                placeholder="Masukkan judul berita utama"
                className="rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1F2937]">Kategori</label>
                <select
                  name="kategori"
                  defaultValue={editingPost?.kategori || "Kegiatan"}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs bg-white font-medium"
                >
                  <option value="Kegiatan">Kegiatan</option>
                  <option value="Akademik">Akademik</option>
                  <option value="Sosial">Sosial</option>
                  <option value="Pengumuman">Pengumuman</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1F2937]">Status Publikasi</label>
                <select
                  name="status"
                  defaultValue={editingPost?.status || "published"}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs bg-white font-medium"
                >
                  <option value="published">Tayang (Published)</option>
                  <option value="draft">Draf (Draft)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1F2937]">URL Cover Gambar</label>
              <Input
                name="cover_url"
                defaultValue={editingPost?.cover_url || ""}
                placeholder="https://images.unsplash.com/... atau tautan bucket"
                className="rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1F2937]">Ringkasan Singkat (Excerpt)</label>
              <Textarea
                name="ringkasan"
                rows={2}
                defaultValue={editingPost?.ringkasan || ""}
                placeholder="Ringkasan 1-2 kalimat untuk preview di kartu..."
                className="rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1F2937]">Konten Berita Lengkap (HTML)</label>
              <Textarea
                name="konten"
                rows={8}
                required
                defaultValue={editingPost?.konten || "<p>Tulis artikel lengkap di sini...</p>"}
                placeholder="<p>Paragraf artikel...</p>"
                className="rounded-xl text-xs font-mono"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              variant="brand-lime"
              className="w-full rounded-xl font-bold py-5 mt-2"
            >
              {loading ? "Menyimpan Berita..." : "Simpan & Publikasikan Berita"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
