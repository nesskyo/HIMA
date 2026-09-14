import Image from "next/image";
import Link from "next/link";
import { BookOpen, Users, Sparkles, ChevronRight, MessageSquare } from "lucide-react";
import { InstagramIcon } from "@/components/shared/SocialIcons";
import { Button } from "@/components/ui/button";
import { getCommunities } from "@/lib/services/community";

export const metadata = {
  title: "Komunitas Mahasiswa",
  description: "Komunitas minat dan bakat di bawah naungan HIMA STIE 66 Kendari.",
};

export default async function KomunitasPage() {
  const communities = await getCommunities();

  return (
    <div className="py-12 sm:py-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FACC15]/20 text-[#854D0E] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="size-3.5 text-[#EAB308]" />
            <span>Sayap Minat & Bakat</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1F2937] font-heading tracking-tight">
            Komunitas HIMA STIE 66
          </h1>
          <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed">
            Eksplorasi minat riset, bisnis kewirausahaan, dan investasi pasar modal bersama komunitas rekan-rekan mahasiswa.
          </p>
        </div>
      </div>

      {/* Community Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {communities.map((comm) => {
            let contactObj: Record<string, string> = {};
            try {
              contactObj = comm.kontak ? JSON.parse(comm.kontak) : {};
            } catch {
              // fallback
            }

            return (
              <div
                key={comm.id}
                className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden card-hover-lift flex flex-col justify-between p-8 space-y-6"
              >
                <div className="space-y-4">
                  <div className="size-16 rounded-2xl bg-gradient-to-tr from-[#FACC15]/20 to-[#84CC16]/20 flex items-center justify-center overflow-hidden border border-yellow-100">
                    {comm.logo_url ? (
                      <Image
                        src={comm.logo_url}
                        alt={comm.nama}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    ) : (
                      <BookOpen className="size-8 text-[#854D0E]" />
                    )}
                  </div>

                  <h3 className="text-xl font-bold font-heading text-[#1F2937]">
                    <Link href={`/komunitas/${comm.slug}`}>{comm.nama}</Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed line-clamp-4">
                    {comm.deskripsi}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-4">
                  {/* Social/WA Icons */}
                  <div className="flex items-center gap-2">
                    {contactObj.instagram && (
                      <a
                        href={contactObj.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="size-8 rounded-lg bg-gray-50 hover:bg-[#FACC15] hover:text-[#1F2937] flex items-center justify-center transition-colors text-gray-500"
                        title="Instagram"
                      >
                        <InstagramIcon className="size-4" />
                      </a>
                    )}
                    {contactObj.whatsapp && (
                      <a
                        href={`https://wa.me/${contactObj.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="size-8 rounded-lg bg-gray-50 hover:bg-[#84CC16] hover:text-white flex items-center justify-center transition-colors text-gray-500"
                        title="WhatsApp"
                      >
                        <MessageSquare className="size-4" />
                      </a>
                    )}
                  </div>

                  <Link href={`/komunitas/${comm.slug}`} className="block w-full">
                    <Button variant="outline-lime" size="sm" className="w-full rounded-xl text-xs font-bold">
                      Lihat Profil Lengkap <ChevronRight className="size-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
