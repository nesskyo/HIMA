import { MapPin, Mail, MessageSquare, Clock, Sparkles, ExternalLink } from "lucide-react";
import { getSiteSettings } from "@/lib/services/settings";
import { ContactForm } from "@/components/public/ContactForm";

export const metadata = {
  title: "Hubungi Kami",
  description:
    "Informasi kontak sekretariat, WhatsApp, email, dan peta lokasi HIMA STIE 66 Kendari.",
};

export default async function KontakPage() {
  const settings = await getSiteSettings();

  return (
    <div className="py-12 sm:py-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FACC15]/20 text-[#854D0E] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="size-3.5 text-[#EAB308]" />
            <span>Kanal Komunikasi & Aspirasi</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1F2937] font-heading tracking-tight">
            Hubungi HIMA STIE 66
          </h1>
          <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed">
            Sampaikan pertanyaan, masukan, atau ajakan kemitraan. Kami siap mendengarkan dan merespons komunikasi Anda.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-6">
              <div className="border-l-4 border-[#FACC15] pl-3">
                <h2 className="text-xl font-bold font-heading text-[#1F2937]">
                  Sekretariat Organisasi
                </h2>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="size-11 rounded-2xl bg-[#FACC15]/20 text-[#854D0E] flex items-center justify-center shrink-0">
                    <MapPin className="size-5 text-[#EAB308]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#6B7280] block uppercase tracking-wider">
                      Alamat Kampus
                    </span>
                    <p className="text-sm font-semibold text-[#1F2937] mt-0.5 leading-relaxed">
                      {settings.contact_info.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="size-11 rounded-2xl bg-[#84CC16]/15 text-[#65A30D] flex items-center justify-center shrink-0">
                    <MessageSquare className="size-5 text-[#84CC16]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#6B7280] block uppercase tracking-wider">
                      WhatsApp Resmi
                    </span>
                    <a
                      href={`https://wa.me/${settings.contact_info.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-[#84CC16] hover:text-[#65A30D] mt-0.5 inline-block"
                    >
                      {settings.contact_info.whatsapp} (Klik untuk Chat)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="size-11 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                    <Mail className="size-5 text-[#FACC15]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#6B7280] block uppercase tracking-wider">
                      Email
                    </span>
                    <a
                      href={`mailto:${settings.contact_info.email}`}
                      className="text-sm font-semibold text-[#1F2937] hover:text-[#84CC16] mt-0.5 inline-block"
                    >
                      {settings.contact_info.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="size-11 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                    <Clock className="size-5 text-[#84CC16]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#6B7280] block uppercase tracking-wider">
                      Jam Layanan Sekretariat
                    </span>
                    <p className="text-sm font-semibold text-[#1F2937] mt-0.5">
                      Senin - Sabtu: 09.00 - 17.00 WITA
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Box */}
            <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden p-2">
              <iframe
                title="Peta Lokasi STIE 66 Kendari"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3980.088656645398!2d122.5186!3d-3.9922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d98f2e245dc714b%3A0x6ea717b1d98fa669!2sSTIE%2066%20Kendari!5e0!3m2!1sid!2sid!4v1650000000000!5m2!1sid!2sid"
                className="w-full h-64 rounded-2xl border-0"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Column: Contact & Aspiration Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
