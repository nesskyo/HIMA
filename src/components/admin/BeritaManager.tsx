"use client";

import * as React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
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
import { MediaUploader } from "@/components/admin/MediaUploader";

// Dynamic import for Tiptap editor (client-side only for better performance)
const TiptapEditor = dynamic(
  () => import("@/components/admin/TiptapEditor").then((m) => m.TiptapEditor),
  {
    ssr: false,
    loading: () => (
      <div className="border border-gray-200 rounded-2xl h-[260px] bg-gray-50 flex items-center justify-center text-xs text-gray-400">
        Memuat editor artikel...
      </div>
    ),
  }
);

export function BeritaManager({ initialNews }: { initialNews: NewsPost[] }) {
  const [newsList, setNewsList] = React.useState(initialNews);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("Semua");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<Partial<NewsPost> | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Rich editor and media states
  const [coverUrl, setCoverUrl] = React.useState("");
  const [kontenHtml, setKontenHtml] = React.useState("");

  const filteredNews = newsList.filter((item) => {
    const matchesSearch = item.judul.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "Semua" || item.kategori.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingPost(null);
    setCoverUrl("");
    setKontenHtml("<p>Tulis artikel lengkap di sini...</p>");
    setModalOpen(true);
  };

  const handleOpenEdit = (post: NewsPost) => {
    setEditingPost(post);
    setCoverUrl(post.cover_url || "");
    setKontenHtml(post.konten || "<p>Tulis artikel lengkap di sini...</p>");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data: Partial<NewsPost> = {
      id: editingPost?.id,
      judul: fd.get("judul") as string,
      kategori: fd.get("kategori") as string,
      cover_url: coverUrl,
      ringkasan: fd.get("ringkasan") as string,
      konten: kontenHtml,
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
            onClick={handleOpenAdd}
            className="rounded-xl text-xs font-bold gap-1.5 shrink-0"
          >
            <Plus className="size-4" />
            Tulis Berita
          </Button>
        </div>
      </div>

      {/* News Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[#6B7280] font-semibold">
                <th className="p-4 pl-6">Artikel</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Status</th>
                <th className="p-4">Tanggal Rilis</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredNews.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3 max-w-md">
                      {post.cover_url ? (
                        <div className="relative size-12 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                          <Image
                            src={post.cover_url}
                            alt={post.judul}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="size-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 text-gray-400">
                          📰
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-[#1F2937] line-clamp-1">{post.judul}</div>
                        <div className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                          {post.ringkasan || "Tidak ada ringkasan..."}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <Badge variant="outline" className="text-[10px] font-semibold">
                      {post.kategori}
                    </Badge>
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        post.status === "published"
                          ? "bg-[#84CC16]/10 text-[#65a30d]"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {post.status === "published" ? "Tayang" : "Draf"}
                    </span>
                  </td>

                  <td className="p-4 text-gray-500">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </td>

                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleOpenEdit(post)}
                        className="rounded-lg h-7 w-7 p-0"
                        title="Edit Berita"
                      >
                        <Edit2 className="size-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleDelete(post.id)}
                        className="rounded-lg h-7 w-7 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50 border-rose-100"
                        title="Hapus Berita"
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
        <DialogContent className="max-w-3xl rounded-2xl max-h-[90vh] overflow-y-auto">
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

            {/* Media Uploader with client-side compression */}
            <MediaUploader
              value={coverUrl}
              onChange={(url) => setCoverUrl(url)}
              bucket="cover-berita"
              aspectRatio="16/9"
              label="Cover Gambar Berita"
              description="Rekomendasi rasio 16:9 (JPG, PNG, atau WebP maks. 2MB)"
            />

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1F2937]">Ringkasan Singkat (Excerpt)</label>
              <Textarea
                name="ringkasan"
                rows={2}
                defaultValue={editingPost?.ringkasan || ""}
                placeholder="Ringkasan 1-2 kalimat untuk preview di kartu beranda/katalog..."
                className="rounded-xl text-xs"
              />
            </div>

            {/* Tiptap Rich Text Editor */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1F2937]">Konten Berita Lengkap</label>
              <TiptapEditor
                content={kontenHtml}
                onChange={(html) => setKontenHtml(html)}
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
