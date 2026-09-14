"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Calendar, MapPin, Sparkles } from "lucide-react";
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
import type { EventItem } from "@/types/database.types";
import { saveEvent, deleteEvent } from "@/lib/actions/admin";

export function EventManager({ initialEvents }: { initialEvents: EventItem[] }) {
  const [events, setEvents] = React.useState(initialEvents);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingEvent, setEditingEvent] = React.useState<Partial<EventItem> | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data: Partial<EventItem> = {
      id: editingEvent?.id,
      judul: fd.get("judul") as string,
      deskripsi: fd.get("deskripsi") as string,
      tanggal_mulai: new Date(fd.get("tanggal_mulai") as string).toISOString(),
      tanggal_selesai: new Date(fd.get("tanggal_selesai") as string).toISOString(),
      lokasi_atau_link: fd.get("lokasi_atau_link") as string,
      cover_url: fd.get("cover_url") as string,
      link_pendaftaran: (fd.get("link_pendaftaran") as string) || null,
      status: (fd.get("status") as any) || "upcoming",
    };

    const res = await saveEvent(data);
    setLoading(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Event berhasil disimpan!");
      setModalOpen(false);
      setEditingEvent(null);
      if (editingEvent?.id) {
        setEvents((prev) =>
          prev.map((ev) => (ev.id === editingEvent.id ? ({ ...ev, ...data } as EventItem) : ev))
        );
      } else {
        setEvents((prev) => [
          {
            ...data,
            id: String(Date.now()),
            slug: data.judul!.toLowerCase().replace(/\s+/g, "-"),
            created_at: new Date().toISOString(),
          } as EventItem,
          ...prev,
        ]);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus agenda event ini?")) return;
    const res = await deleteEvent(id);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Event berhasil dihapus.");
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <span className="text-xs font-bold text-[#6B7280]">
          Total {events.length} Agenda Kegiatan Terdaftar
        </span>

        <Button
          variant="brand-lime"
          size="sm"
          onClick={() => {
            setEditingEvent(null);
            setModalOpen(true);
          }}
          className="rounded-xl font-bold text-xs"
        >
          <Plus className="size-4 mr-1.5" />
          Tambah Event Baru
        </Button>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-[#6B7280] font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Event</th>
                <th className="py-3.5 px-4">Jadwal & Waktu</th>
                <th className="py-3.5 px-4">Lokasi</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3 max-w-sm">
                      <div className="size-12 rounded-xl bg-gray-100 relative overflow-hidden shrink-0">
                        <Image
                          src={ev.cover_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=300"}
                          alt={ev.judul}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-[#1F2937] text-sm truncate block">
                          {ev.judul}
                        </span>
                        <span className="text-[11px] text-[#6B7280] truncate block">
                          {ev.deskripsi}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#1F2937] whitespace-nowrap">
                    <div className="font-medium">
                      {new Date(ev.tanggal_mulai).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <div className="text-[11px] text-[#6B7280]">
                      {new Date(ev.tanggal_mulai).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      WITA
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#6B7280] max-w-xs truncate">
                    {ev.lokasi_atau_link}
                  </td>
                  <td className="py-4 px-4">
                    {ev.status === "upcoming" ? (
                      <Badge className="bg-[#84CC16] hover:bg-[#65A30D] text-white text-[10px]">
                        Upcoming
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">
                        Past
                      </Badge>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => {
                          setEditingEvent(ev);
                          setModalOpen(true);
                        }}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Edit2 className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => handleDelete(ev.id)}
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

      {/* Edit / Add Event Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold font-heading text-[#1F2937]">
              {editingEvent ? "Edit Agenda Event" : "Tambah Agenda Event Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1F2937]">Nama Kegiatan / Event</label>
              <Input
                name="judul"
                required
                defaultValue={editingEvent?.judul || ""}
                placeholder="Contoh: Seminar Nasional Kewirausahaan"
                className="rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1F2937]">Waktu Mulai</label>
                <Input
                  name="tanggal_mulai"
                  type="datetime-local"
                  required
                  defaultValue={
                    editingEvent?.tanggal_mulai
                      ? new Date(editingEvent.tanggal_mulai).toISOString().slice(0, 16)
                      : ""
                  }
                  className="rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1F2937]">Waktu Selesai</label>
                <Input
                  name="tanggal_selesai"
                  type="datetime-local"
                  required
                  defaultValue={
                    editingEvent?.tanggal_selesai
                      ? new Date(editingEvent.tanggal_selesai).toISOString().slice(0, 16)
                      : ""
                  }
                  className="rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1F2937]">Lokasi / Tautan Online</label>
                <Input
                  name="lokasi_atau_link"
                  required
                  defaultValue={editingEvent?.lokasi_atau_link || "Auditorium STIE 66 Kendari"}
                  placeholder="Ruang / Zoom Link"
                  className="rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1F2937]">Status Event</label>
                <select
                  name="status"
                  defaultValue={editingEvent?.status || "upcoming"}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs bg-white font-medium"
                >
                  <option value="upcoming">Mendatang (Upcoming)</option>
                  <option value="past">Selesai (Past)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1F2937]">URL Cover Banner</label>
              <Input
                name="cover_url"
                defaultValue={editingEvent?.cover_url || ""}
                placeholder="https://images.unsplash.com/..."
                className="rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1F2937]">Tautan Formulir Pendaftaran (Opsional)</label>
              <Input
                name="link_pendaftaran"
                defaultValue={editingEvent?.link_pendaftaran || ""}
                placeholder="https://forms.gle/..."
                className="rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1F2937]">Deskripsi Rinci</label>
              <Textarea
                name="deskripsi"
                rows={4}
                required
                defaultValue={editingEvent?.deskripsi || ""}
                placeholder="Jelaskan tujuan, pembicara, dan target peserta..."
                className="rounded-xl text-xs"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              variant="brand-lime"
              className="w-full rounded-xl font-bold py-5 mt-2"
            >
              {loading ? "Menyimpan..." : "Simpan Data Event"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
