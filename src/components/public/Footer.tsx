import Link from "next/link";
import { MapPin, Mail, MessageSquare, ExternalLink } from "lucide-react";
import { InstagramIcon, TiktokIcon, YoutubeIcon } from "@/components/shared/SocialIcons";
import { getSiteSettings } from "@/lib/services/settings";

export async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="bg-[#1F2937] text-white pt-16 pb-12 border-t-4 border-[#FACC15]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Identity & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-tr from-[#FACC15] to-[#84CC16] flex items-center justify-center text-white font-extrabold text-xl">
                66
              </div>
              <div>
                <span className="text-lg font-bold font-heading text-white block leading-tight">
                  HIMA STIE 66
                </span>
                <span className="text-xs text-yellow-400 font-semibold tracking-wider">
                  KENDARI
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Wadah resmi mahasiswa Sekolah Tinggi Ilmu Ekonomi Enam Enam Kendari.
              Berkomitmen mendorong potensi intelektual, jiwa kewirausahaan, dan
              pengabdian masyarakat.
            </p>
            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.social_media.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="size-9 rounded-lg bg-gray-800 hover:bg-[#FACC15] hover:text-[#1F2937] flex items-center justify-center transition-colors text-gray-300"
                aria-label="Instagram HIMA STIE 66"
              >
                <InstagramIcon className="size-4" />
              </a>
              <a
                href={settings.social_media.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="size-9 rounded-lg bg-gray-800 hover:bg-[#84CC16] hover:text-white flex items-center justify-center transition-colors text-gray-300"
                aria-label="TikTok HIMA STIE 66"
              >
                <TiktokIcon className="size-4" />
              </a>
              <a
                href={settings.social_media.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="size-9 rounded-lg bg-gray-800 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors text-gray-300"
                aria-label="YouTube HIMA STIE 66"
              >
                <YoutubeIcon className="size-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-base font-bold font-heading text-white border-l-3 border-[#FACC15] pl-2.5">
              Navigasi Halaman
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/tentang" className="hover:text-[#FACC15] transition-colors">
                  Tentang & Profil Organisasi
                </Link>
              </li>
              <li>
                <Link href="/struktur" className="hover:text-[#FACC15] transition-colors">
                  Struktur Kepengurusan Kabinet
                </Link>
              </li>
              <li>
                <Link href="/berita" className="hover:text-[#FACC15] transition-colors">
                  Kabar & Berita Terkini
                </Link>
              </li>
              <li>
                <Link href="/event" className="hover:text-[#FACC15] transition-colors">
                  Agenda & Arsip Event
                </Link>
              </li>
              <li>
                <Link href="/komunitas" className="hover:text-[#FACC15] transition-colors">
                  Komunitas Mahasiswa
                </Link>
              </li>
              <li>
                <Link href="/oprec" className="hover:text-[#84CC16] transition-colors font-semibold">
                  Open Recruitment Pengurus
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="hover:text-[#FACC15] transition-colors">
                  Dokumentasi & Galeri
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Useful Website / Quick Links (Traceability PRD.md §14) */}
          <div className="space-y-4">
            <h3 className="text-base font-bold font-heading text-white border-l-3 border-[#84CC16] pl-2.5">
              Tautan Penting
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-300">
              {settings.quick_links.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-[#84CC16] transition-colors"
                  >
                    <span>{link.title}</span>
                    <ExternalLink className="size-3 text-gray-400" />
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  <span>Portal Kelola Konten (Admin)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Kontak Resmi */}
          <div className="space-y-4">
            <h3 className="text-base font-bold font-heading text-white border-l-3 border-[#FACC15] pl-2.5">
              Kontak Sekretariat
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="size-4 text-[#FACC15] shrink-0 mt-1" />
                <span className="text-xs leading-relaxed">
                  {settings.contact_info.address}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare className="size-4 text-[#84CC16] shrink-0" />
                <a
                  href={`https://wa.me/${settings.contact_info.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#84CC16] transition-colors text-xs font-medium"
                >
                  {settings.contact_info.whatsapp} (WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="size-4 text-[#FACC15] shrink-0" />
                <a
                  href={`mailto:${settings.contact_info.email}`}
                  className="hover:text-[#FACC15] transition-colors text-xs"
                >
                  {settings.contact_info.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-700/60 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} HIMA STIE 66 Kendari. Seluruh hak cipta dilindungi.</p>
          <p className="flex items-center gap-1">
            Dikelola oleh Divisi Hubungan Masyarakat & Medinfo
          </p>
        </div>
      </div>
    </footer>
  );
}
