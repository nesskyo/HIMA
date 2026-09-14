"use client";

import * as React from "react";
import { toast } from "sonner";
import { Megaphone, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { RecruitmentPost } from "@/types/database.types";
import { saveRecruitment } from "@/lib/actions/admin";

export function OprecManager({ initialOprec }: { initialOprec: RecruitmentPost | null }) {
  const [loading, setLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(initialOprec?.status === "open");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data: Partial<RecruitmentPost> = {
      id: initialOprec?.id,
      judul: fd.get("judul") as string,
      deskripsi: fd.get("deskripsi") as string,
      tanggal_buka: new Date(fd.get("tanggal_buka") as string).toISOString(),
      tanggal_tutup: new Date(fd.get("tanggal_tutup") as string).toISOString(),
      link_form: fd.get("link_form") as string,
      status: isOpen ? "open" : "closed",
    };

    const res = await saveRecruitment(data);
    setLoading(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Pengaturan Open Recruitment berhasil diperbarui!");
    }
  };

  return (
    <Card className="rounded-3xl border-gray-200/80 shadow-sm max-w-3xl">
      <CardHeader className="border-b border-gray-100 pb-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold font-heading text-[#1F2937]">
              Pengaturan Gelombang Pendaftaran
            </CardTitle>
            <CardDescription className="text-xs text-[#6B7280]">
              Atur jadwal, status penerimaan, dan tautan formulir calon pengurus
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1F2937]">Status Pendaftaran:</span>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                isOpen ? "bg-[#84CC16] text-white shadow-sm" : "bg-gray-200 text-gray-700"
              }`}
            >
              {isOpen ? "SEDANG DIBUKA (OPEN)" : "DITUTUP (CLOSED)"}
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1F2937]">Judul Gelombang Oprec</label>
            <Input
              name="judul"
              required
              defaultValue={initialOprec?.judul || "Open Recruitment Pengurus Baru HIMA STIE 66"}
              placeholder="Contoh: Open Recruitment Gelombang 1 Periode 2026/2027"
              className="rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1F2937]">Tanggal Buka</label>
              <Input
                name="tanggal_buka"
                type="date"
                required
                defaultValue={
                  initialOprec?.tanggal_buka ? initialOprec.tanggal_buka.slice(0, 10) : ""
                }
                className="rounded-xl text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1F2937]">Tanggal Tutup</label>
              <Input
                name="tanggal_tutup"
                type="date"
                required
                defaultValue={
                  initialOprec?.tanggal_tutup ? initialOprec.tanggal_tutup.slice(0, 10) : ""
                }
                className="rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1F2937]">
              Tautan Formulir Online (Google Form / Typeform)
            </label>
            <Input
              name="link_form"
              required
              defaultValue={initialOprec?.link_form || "https://forms.gle/..."}
              placeholder="https://forms.gle/..."
              className="rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1F2937]">Deskripsi & Ajakan</label>
            <Textarea
              name="deskripsi"
              rows={4}
              required
              defaultValue={initialOprec?.deskripsi || ""}
              placeholder="Jelaskan ajakan bergabung dan manfaat menjadi pengurus..."
              className="rounded-xl text-xs"
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              variant="brand-lime"
              className="rounded-xl font-bold px-8 shadow-md"
            >
              <Save className="size-4 mr-2" />
              {loading ? "Menyimpan..." : "Simpan Pengaturan Oprec"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
