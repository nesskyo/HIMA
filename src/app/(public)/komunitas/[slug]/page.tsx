import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, BookOpen, MessageSquare, ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";
import { InstagramIcon } from "@/components/shared/SocialIcons";
import { Button } from "@/components/ui/button";
import { getCommunityBySlug } from "@/lib/services/community";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comm = await getCommunityBySlug(slug);

  if (!comm) {
    return { title: "Komunitas Tidak Ditemukan" };
  }

  return {
    title: `${comm.nama} | Komunitas Mahasiswa`,
    description: comm.deskripsi || "Profil komunitas mahasiswa STIE 66 Kendari.",
  };
}

export default async function KomunitasDetailPage({ params }: Props) {
  const { slug } = await params;
  const comm = await getCommunityBySlug(slug);

  if (!comm) {
    notFound();
  }

  let contactObj: Record<string, string> = {};
  try {
    contactObj = comm.kontak ? JSON.parse(comm.kontak) : {};
  } catch {
    // fallback
  }

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/komunitas"
            className="inline-flex items-center text-xs font-semibold text-[#6B7280] hover:text-[#1F2937] transition-colors"
          >
            <ArrowLeft className="size-4 mr-1.5" />
            Kembali ke Daftar Komunitas
          </Link>
        </div>

        {/* Header Profile Box */}
        <div className="bg-white rounded-3xl border border-gray-200/80 p-8 sm:p-12 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="size-20 rounded-2xl bg-gradient-to-tr from-[#FACC15]/20 to-[#84CC16]/20 flex items-center justify-center overflow-hidden border border-yellow-200 shrink-0">
              {comm.logo_url ? (
                <Image
                  src={comm.logo_url}
                  alt={comm.nama}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              ) : (
                <BookOpen className="size-10 text-[#854D0E]" />
              )}
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#84CC16]">
                Komunitas Binaan HIMA STIE 66
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] font-heading">
                {comm.nama}
              </h1>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 text-[#4B5563] text-sm sm:text-base leading-relaxed space-y-4">
            <h2 className="text-xl font-bold font-heading text-[#1F2937]">Tentang Komunitas</h2>
            <p className="whitespace-pre-line">{comm.deskripsi}</p>
          </div>

          {/* Social / Contact Narahubung */}
          <div className="pt-6 border-t border-gray-100 space-y-3">
            <h3 className="text-sm font-bold text-[#1F2937]">Hubungi Narahubung Komunitas:</h3>
            <div className="flex flex-wrap items-center gap-3">
              {contactObj.whatsapp && (
                <a
                  href={`https://wa.me/${contactObj.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="brand-lime" size="sm" className="rounded-xl font-bold text-xs">
                    <MessageSquare className="size-3.5 mr-1.5" />
                    Chat WhatsApp ({contactObj.whatsapp})
                  </Button>
                </a>
              )}
              {contactObj.instagram && (
                <a href={contactObj.instagram} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="rounded-xl font-semibold text-xs">
                    <InstagramIcon className="size-3.5 mr-1.5 text-pink-600" />
                    Instagram Resmi
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
