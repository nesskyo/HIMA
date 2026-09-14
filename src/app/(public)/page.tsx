import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FACC15]/20 text-[#854D0E] font-medium text-sm mb-6">
        <Sparkles className="size-4 text-[#EAB308]" />
        <span>Portal Resmi Mahasiswa STIE 66 Kendari</span>
      </div>

      <h1 className="text-4xl sm:text-6xl font-extrabold text-[#1F2937] tracking-tight max-w-3xl leading-tight">
        Himpunan Mahasiswa{" "}
        <span className="text-[#84CC16] underline decoration-[#FACC15] decoration-wavy decoration-2">
          STIE 66 Kendari
        </span>
      </h1>

      <p className="mt-6 text-lg sm:text-xl text-[#6B7280] max-w-2xl leading-relaxed">
        Wadah aspirasi, inovasi, dan aktualisasi mahasiswa Sekolah Tinggi Ilmu
        Ekonomi Enam Enam Kendari. Bergerak bersama menciptakan dampak nyata.
      </p>

      <div className="mt-10 flex flex-wrap gap-4 justify-center items-center">
        <Button variant="brand-lime" size="lg" className="rounded-full shadow-md">
          Lihat Program Kerja
          <ArrowRight className="size-4 ml-1" />
        </Button>
        <Button variant="brand-yellow" size="lg" className="rounded-full">
          Tentang Kami
        </Button>
        <Link href="/admin/login">
          <Button variant="outline" size="lg" className="rounded-full">
            <ShieldCheck className="size-4 mr-1 text-[#84CC16]" />
            Panel Admin
          </Button>
        </Link>
      </div>
    </div>
  );
}
