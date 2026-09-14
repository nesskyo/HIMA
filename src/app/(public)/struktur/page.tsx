import Image from "next/image";
import { Users, Sparkles } from "lucide-react";
import { InstagramIcon, LinkedinIcon } from "@/components/shared/SocialIcons";
import { getActiveKabinet, getAllKabinets } from "@/lib/services/kabinet";
import type { OrgMember } from "@/types/database.types";

export const metadata = {
  title: "Struktur Organisasi",
  description:
    "Susunan pengurus dan panitia kabinet HIMA STIE 66 Kendari.",
};

export default async function StrukturPage() {
  const [{ kabinet, members }, allKabinets] = await Promise.all([
    getActiveKabinet(),
    getAllKabinets(),
  ]);

  // Group members by `badan`
  const groupedMembers = members.reduce<Record<string, OrgMember[]>>((acc, member) => {
    const badan = member.badan || "Anggota";
    if (!acc[badan]) {
      acc[badan] = [];
    }
    acc[badan].push(member);
    return acc;
  }, {});

  const bphMembers = groupedMembers["BPH"] || [];
  const otherDivisions = Object.keys(groupedMembers).filter((k) => k !== "BPH");

  return (
    <div className="py-12 sm:py-16">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FACC15]/20 text-[#854D0E] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="size-3.5 text-[#EAB308]" />
            <span>Kepengurusan Mahasiswa</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1F2937] font-heading tracking-tight">
            Struktur Organisasi
          </h1>
          <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed">
            Mengenal jajaran pengurus HIMA STIE 66 Kendari yang berdedikasi menggerakkan roda organisasi, melayani aspirasi, dan mengeksekusi program kerja.
          </p>
        </div>
      </div>

      {/* Active Cabinet Banner */}
      {kabinet && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="bg-gradient-to-tr from-[#1F2937] to-[#111827] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 size-80 bg-[#84CC16]/15 rounded-full blur-3xl" />
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#84CC16] text-white text-xs font-bold tracking-wide">
                <span>KABINET AKTIF {kabinet.tahun_mulai} / {kabinet.tahun_selesai}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black font-heading text-white">
                {kabinet.nama}
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
                {kabinet.deskripsi}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section 1: Badan Pengurus Harian (BPH) */}
      {bphMembers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="border-l-4 border-[#FACC15] pl-4 mb-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] font-heading">
              Badan Pengurus Harian (BPH)
            </h3>
            <p className="text-sm text-[#6B7280] mt-1">
              Pucuk pimpinan dan koordinator utama roda keorganisasian
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bphMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden card-hover-lift flex flex-col"
              >
                <div className="relative h-72 w-full bg-gray-100 overflow-hidden">
                  <Image
                    src={member.foto_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500"}
                    alt={member.nama}
                    fill
                    className="object-cover object-top hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#84CC16]">
                      {member.jabatan}
                    </span>
                    <h4 className="text-lg font-bold font-heading text-[#1F2937] mt-1 leading-snug">
                      {member.nama}
                    </h4>
                  </div>
                  {member.kontak_sosmed && (
                    <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                      {member.kontak_sosmed.instagram && (
                        <a
                          href={member.kontak_sosmed.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="size-8 rounded-lg bg-gray-50 hover:bg-[#FACC15] hover:text-[#1F2937] flex items-center justify-center transition-colors text-gray-500"
                          aria-label={`Instagram ${member.nama}`}
                        >
                          <InstagramIcon className="size-4" />
                        </a>
                      )}
                      {member.kontak_sosmed.linkedin && (
                        <a
                          href={member.kontak_sosmed.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="size-8 rounded-lg bg-gray-50 hover:bg-[#84CC16] hover:text-white flex items-center justify-center transition-colors text-gray-500"
                          aria-label={`LinkedIn ${member.nama}`}
                        >
                          <LinkedinIcon className="size-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 2: Divisi-Divisi Organisasi */}
      {otherDivisions.map((division) => (
        <section key={division} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="border-l-4 border-[#84CC16] pl-4 mb-8">
            <h3 className="text-2xl font-extrabold text-[#1F2937] font-heading">
              {division}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {groupedMembers[division].map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden card-hover-lift flex flex-col"
              >
                <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
                  <Image
                    src={member.foto_url || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500"}
                    alt={member.nama}
                    fill
                    className="object-cover object-top hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#84CC16]">
                      {member.jabatan}
                    </span>
                    <h4 className="text-base font-bold font-heading text-[#1F2937] mt-1 leading-snug">
                      {member.nama}
                    </h4>
                  </div>
                  {member.kontak_sosmed && (
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      {member.kontak_sosmed.instagram && (
                        <a
                          href={member.kontak_sosmed.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="size-7 rounded-md bg-gray-50 hover:bg-[#FACC15] hover:text-[#1F2937] flex items-center justify-center transition-colors text-gray-500"
                          aria-label={`Instagram ${member.nama}`}
                        >
                          <InstagramIcon className="size-3.5" />
                        </a>
                      )}
                      {member.kontak_sosmed.linkedin && (
                        <a
                          href={member.kontak_sosmed.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="size-7 rounded-md bg-gray-50 hover:bg-[#84CC16] hover:text-white flex items-center justify-center transition-colors text-gray-500"
                          aria-label={`LinkedIn ${member.nama}`}
                        >
                          <LinkedinIcon className="size-3.5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Archive / Periode Kabinet Sejarah (Traceability PRD.md Should-Have §5) */}
      {allKabinets.length > 1 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 border-t border-gray-200">
          <h3 className="text-lg font-bold font-heading text-[#1F2937] mb-4">
            Arsip Kabinet Periode Sebelumnya
          </h3>
          <div className="flex flex-wrap gap-3">
            {allKabinets.map((k) => (
              <div
                key={k.id}
                className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-medium text-[#4B5563]"
              >
                <span className="font-bold text-[#1F2937]">{k.nama}</span> ({k.tahun_mulai}-{k.tahun_selesai})
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
