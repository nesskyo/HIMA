import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Target, Eye, Compass, Users, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Tentang Kami",
  description:
    "Profil, sejarah, visi, misi, dan nilai-nilai dasar Himpunan Mahasiswa STIE 66 Kendari.",
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FACC15]/20 text-[#854D0E] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="size-3.5 text-[#EAB308]" />
            <span>Mengenal Lebih Dekat</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1F2937] font-heading tracking-tight">
            Tentang HIMA STIE 66 Kendari
          </h1>
          <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed">
            Organisasi pergerakan dan aktualisasi mahasiswa Sekolah Tinggi Ilmu Ekonomi Enam Enam Kendari yang berdedikasi menciptakan dampak nyata dalam dunia akademis, sosial, dan kewirausahaan.
          </p>
        </div>
      </div>

      {/* History & Story Section */}
      <section className="bg-white py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#84CC16]">
                Sejarah & Eksistensi
              </span>
              <h2 className="text-3xl font-extrabold text-[#1F2937] font-heading leading-tight">
                Menjadi Pilar Aspirasi & Inovasi Sejak Awal Berdiri
              </h2>
              <div className="space-y-4 text-sm text-[#4B5563] leading-relaxed">
                <p>
                  Himpunan Mahasiswa STIE 66 Kendari (HIMA STIE 66) didirikan sebagai wadah independen dan demokratis untuk menghimpun seluruh aspirasi mahasiswa ekonomi di Kendari. Seiring perkembangan ekonomi digital dan tantangan daerah di Sulawesi Tenggara, HIMA terus bertransformasi menjadi katalisator kepemimpinan muda.
                </p>
                <p>
                  Dengan semangat kekeluargaan dan profesionalisme, HIMA STIE 66 menyelenggarakan berbagai inisiatif strategis, mulai dari pelatihan kepemimpinan (LDKM), workshop pasar modal bersama BEI, seminar ekonomi kreatif, hingga bakti sosial rutin di pelosok daerah.
                </p>
              </div>

              <div className="pt-2">
                <Link href="/struktur">
                  <Button variant="brand-lime" className="rounded-xl font-bold">
                    Lihat Susunan Pengurus
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800"
                  alt="Kegiatan Pengurus HIMA STIE 66"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 p-5 rounded-2xl bg-[#FACC15] text-[#1F2937] shadow-xl max-w-xs hidden sm:block">
                <p className="text-2xl font-black font-heading leading-none">100%</p>
                <p className="text-xs font-semibold mt-1">
                  Komitmen mendedikasikan waktu dan tenaga untuk kemajuan mahasiswa STIE 66.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision and Mission Section */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Visi */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border-t-4 border-[#84CC16] shadow-sm space-y-4">
              <div className="size-12 rounded-2xl bg-[#84CC16]/15 flex items-center justify-center text-[#65A30D]">
                <Eye className="size-6 text-[#84CC16]" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-[#1F2937]">Visi Organisasi</h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Mewujudkan HIMA STIE 66 Kendari sebagai lembaga mahasiswa yang progresif, inklusif, dan berintegritas tinggi dalam melahirkan ekonom muda yang berdaya saing global serta berjiwa sosial.
              </p>
            </div>

            {/* Misi */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border-t-4 border-[#FACC15] shadow-sm space-y-4">
              <div className="size-12 rounded-2xl bg-[#FACC15]/20 flex items-center justify-center text-[#854D0E]">
                <Target className="size-6 text-[#EAB308]" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-[#1F2937]">Misi Organisasi</h3>
              <ul className="space-y-3 text-sm text-[#4B5563]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-[#84CC16] shrink-0 mt-0.5" />
                  <span>Membangun ekosistem belajar yang suportif dan merangsang riset ekonomi terapan.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-[#84CC16] shrink-0 mt-0.5" />
                  <span>Mengembangkan jiwa kewirausahaan (entrepreneurship) berbasis potensi lokal Sulawesi Tenggara.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-[#84CC16] shrink-0 mt-0.5" />
                  <span>Menjadi jembatan aspirasi yang transparan antara mahasiswa dan pihak pengelola kampus.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-[#84CC16] shrink-0 mt-0.5" />
                  <span>Menjalin kemitraan kolaboratif dengan sektor industri, BEM/HIMA universitas lain, dan pemerintah daerah.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FACC15] bg-[#FACC15]/20 px-2.5 py-1 rounded-md text-[#854D0E]">
              Fondasi Gerak
            </span>
            <h2 className="text-3xl font-extrabold text-[#1F2937] font-heading mt-2">
              Nilai-Nilai Utama (Core Values)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-gray-200/80 space-y-2.5">
              <span className="text-2xl font-black text-[#84CC16]">01</span>
              <h4 className="text-lg font-bold font-heading text-[#1F2937]">Integritas</h4>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Menjunjung kejujuran, etika akademis, dan tanggung jawab moral dalam setiap kegiatan.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-gray-200/80 space-y-2.5">
              <span className="text-2xl font-black text-[#FACC15]">02</span>
              <h4 className="text-lg font-bold font-heading text-[#1F2937]">Sinergi</h4>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Mengutamakan kolaborasi tanpa sekat antarangkatan, dosen, dan komunitas mahasiswa.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-gray-200/80 space-y-2.5">
              <span className="text-2xl font-black text-[#84CC16]">03</span>
              <h4 className="text-lg font-bold font-heading text-[#1F2937]">Inovatif</h4>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Berani melahirkan terobosan program kerja yang relevan dengan transformasi ekonomi digital.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-gray-200/80 space-y-2.5">
              <span className="text-2xl font-black text-[#FACC15]">04</span>
              <h4 className="text-lg font-bold font-heading text-[#1F2937]">Pengabdian</h4>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Mendedikasikan ilmu ekonomi untuk pemberdayaan masyarakat dan UMKM lokal.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
