import Link from "next/link";
import { Sparkles, Calendar, CheckCircle2, Clock, ArrowRight, ExternalLink, ShieldAlert, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getActiveRecruitment } from "@/lib/services/recruitment";

export const metadata = {
  title: "Open Recruitment Pengurus",
  description:
    "Informasi dan formulir pendaftaran calon pengurus baru HIMA STIE 66 Kendari.",
};

const TIMELINE_STEPS = [
  {
    step: "01",
    title: "Pendaftaran Online & Pengumpulan Berkas",
    date: "10 - 20 September 2026",
    desc: "Pengisian formulir pendaftaran online serta upload CV, KHS, dan surat motivasi.",
  },
  {
    step: "02",
    title: "Seleksi Administrasi & Verifikasi",
    date: "21 - 23 September 2026",
    desc: "Pemeriksaan kelengkapan berkas dan pengumuman peserta yang lolos ke tahap interview.",
  },
  {
    step: "03",
    title: "Wawancara & Forum Group Discussion (FGD)",
    date: "25 - 26 September 2026",
    desc: "Uji wawasan kepemimpinan, kepribadian, komitmen keorganisasian, dan simulasi kasus ekonomi.",
  },
  {
    step: "04",
    title: "Pengumuman Hasil Akhir & LDKM",
    date: "30 September 2026",
    desc: "Pengumuman resmi nama-nama pengurus baru terpilih dan persiapan pembekalan kepemimpinan.",
  },
];

const REQUIREMENTS = [
  "Mahasiswa aktif STIE 66 Kendari (Semester 1 s/d Semester 5).",
  "Memiliki IPK minimal 3.00 (dibuktikan dengan KHS terakhir).",
  "Berkomitmen aktif, loyal, dan bertanggung jawab selama 1 periode penuh kepengurusan.",
  "Mampu bekerja secara tim dan siap belajar hal baru.",
  "Tidak sedang menjabat sebagai ketua umum di organisasi mahasiswa intra-kampus lain.",
];

export default async function OprecPage() {
  const oprec = await getActiveRecruitment();
  const isOpen = oprec?.status === "open";

  return (
    <div className="py-12 sm:py-16">
      {/* 1. HERO STAND-OUT BANNER (desain.md §5.4 - Yellow theme) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-[#FACC15] rounded-3xl p-8 sm:p-14 text-[#1F2937] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 size-96 bg-white/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#1F2937] text-xs font-black uppercase tracking-wider shadow-sm">
              <Sparkles className="size-3.5 text-[#EAB308]" />
              <span>{isOpen ? "PENDAFTARAN SEDANG DIBUKA" : "PENDAFTARAN DITUTUP"}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight leading-tight">
              {oprec?.judul || "Open Recruitment HIMA STIE 66 Kendari"}
            </h1>

            <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed font-medium">
              {oprec?.deskripsi ||
                "Jadilah bagian dari perubahan! Asah jiwa kepemimpinanmu, perluas jejaring profesional, dan torehkan jejak karya nyata bersama kami."}
            </p>

            {/* Dates & Status Box */}
            {oprec && (
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm font-bold">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-[#84CC16]" />
                  <span>
                    Buka:{" "}
                    {new Date(oprec.tanggal_buka).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-red-600" />
                  <span>
                    Tutup:{" "}
                    {new Date(oprec.tanggal_tutup).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            )}

            {/* CTA Button */}
            <div className="pt-4">
              {isOpen && oprec?.link_form ? (
                <a href={oprec.link_form} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="brand-lime"
                    size="xl"
                    className="rounded-2xl text-base font-black shadow-lg"
                  >
                    Daftar Sekarang (Isi Formulir)
                    <ExternalLink className="size-5 ml-2" />
                  </Button>
                </a>
              ) : (
                <Button
                  disabled
                  size="lg"
                  className="rounded-xl bg-gray-400 text-white font-bold cursor-not-allowed"
                >
                  Pendaftaran Belum Dibuka / Telah Ditutup
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. TIMELINE SECTION (desain.md §5.4 - Vertical timeline with Lime dots) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#84CC16]">
            Alur Seleksi
          </span>
          <h2 className="text-3xl font-extrabold text-[#1F2937] font-heading mt-1">
            Timeline Tahapan Pendaftaran
          </h2>
        </div>

        <div className="relative border-l-2 border-[#84CC16]/40 ml-4 sm:ml-32 space-y-10 py-2">
          {TIMELINE_STEPS.map((item, idx) => (
            <div key={idx} className="relative pl-8 sm:pl-10">
              {/* Lime Green Indicator Dot */}
              <div className="absolute -left-[9px] top-1.5 size-4 rounded-full bg-[#84CC16] ring-4 ring-[#84CC16]/20" />

              {/* Date Box on Desktop (floats left) */}
              <div className="sm:absolute sm:-left-32 sm:top-1 sm:text-right sm:w-24 hidden sm:block">
                <span className="text-xs font-bold text-[#84CC16] block">{item.step}</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-2">
                <span className="text-xs font-bold text-[#84CC16] sm:hidden block mb-1">
                  Tahap {item.step}
                </span>
                <span className="text-xs font-semibold text-[#6B7280] block">
                  {item.date}
                </span>
                <h3 className="text-lg font-bold font-heading text-[#1F2937]">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. REQUIREMENTS & TERMS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-sm space-y-6">
          <div className="border-l-4 border-[#FACC15] pl-4">
            <h3 className="text-2xl font-bold font-heading text-[#1F2937]">
              Syarat & Kualifikasi Calon Pengurus
            </h3>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
              Harap perhatikan ketentuan berikut sebelum mengisi formulir pendaftaran
            </p>
          </div>

          <ul className="space-y-3 pt-2">
            {REQUIREMENTS.map((req, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-[#4B5563]">
                <CheckCircle2 className="size-4 text-[#84CC16] shrink-0 mt-0.5" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
