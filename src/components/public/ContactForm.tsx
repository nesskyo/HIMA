"use client";

import * as React from "react";
import { toast } from "sonner";
import { Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending message
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Pesan atau aspirasi Anda berhasil terkirim!", {
        description: "Pengurus HIMA STIE 66 Kendari akan segera menindaklanjuti.",
      });
    }, 800);
  };

  if (submitted) {
    return (
      <div className="text-center py-12 px-6 bg-white rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
        <div className="size-14 rounded-full bg-[#84CC16]/15 text-[#65A30D] flex items-center justify-center mx-auto">
          <CheckCircle className="size-8" />
        </div>
        <h3 className="text-xl font-bold font-heading text-[#1F2937]">Terima Kasih!</h3>
        <p className="text-xs sm:text-sm text-[#6B7280] max-w-md mx-auto leading-relaxed">
          Pesan, kritik, atau saran Anda telah kami terima. Dukungan Anda sangat berarti untuk kemajuan organisasi mahasiswa STIE 66 Kendari.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSubmitted(false)}
          className="rounded-xl text-xs font-semibold"
        >
          Kirim Pesan Lainnya
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-5">
      <div className="border-l-4 border-[#84CC16] pl-3 mb-2">
        <h3 className="text-xl font-bold font-heading text-[#1F2937]">
          Kirim Aspirasi & Pertanyaan
        </h3>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Kotak saran dan komunikasi langsung ke pengurus HIMA
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#1F2937]">Nama Lengkap</label>
        <Input required placeholder="Masukkan nama Anda" className="rounded-xl bg-gray-50/50" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#1F2937]">Email Mahasiswa / Umum</label>
          <Input type="email" required placeholder="nama@email.com" className="rounded-xl bg-gray-50/50" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#1F2937]">No. WhatsApp (Opsional)</label>
          <Input placeholder="08xxxxxxxxxx" className="rounded-xl bg-gray-50/50" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#1F2937]">Subjek Pesan</label>
        <Input required placeholder="Topik atau perihal aspirasi" className="rounded-xl bg-gray-50/50" />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#1F2937]">Isi Pesan / Aspirasi</label>
        <Textarea
          required
          rows={4}
          placeholder="Tuliskan pesan, tanggapan, atau aspirasi Anda secara lengkap..."
          className="rounded-xl bg-gray-50/50"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        variant="brand-lime"
        className="w-full rounded-xl font-bold py-6 text-sm shadow-md"
      >
        <Send className="size-4 mr-2" />
        {loading ? "Mengirimkan Pesan..." : "Kirim Aspirasi Sekarang"}
      </Button>
    </form>
  );
}
