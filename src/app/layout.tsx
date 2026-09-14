import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    template: "%s | HIMA STIE 66 Kendari",
    default: "HIMA STIE 66 Kendari — Himpunan Mahasiswa STIE 66 Kendari",
  },
  description:
    "Website Resmi Himpunan Mahasiswa Sekolah Tinggi Ilmu Ekonomi Enam Enam Kendari. Informasi seputar profil kabinet, program kerja, berita, kegiatan, dan pendaftaran.",
  keywords: [
    "HIMA STIE 66",
    "STIE 66 Kendari",
    "Himpunan Mahasiswa",
    "Ekonomi Kendari",
    "Organisasi Mahasiswa",
    "Sulawesi Tenggara",
  ],
  authors: [{ name: "HIMA STIE 66 Kendari" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "HIMA STIE 66 Kendari",
    title: "HIMA STIE 66 Kendari — Web Resmi & Portal Informasi",
    description:
      "Wadah aspirasi, kolaborasi, dan aktualisasi mahasiswa STIE 66 Kendari. Dapatkan info program kerja, berita, dan open recruitment terbaru.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${poppins.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
