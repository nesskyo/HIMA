import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = {
  title: "Login Pengurus",
  description: "Panel login administrator HIMA STIE 66 Kendari.",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-b from-[#F3F4F6] to-[#E5E7EB]">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="size-12 rounded-2xl bg-gradient-to-tr from-[#FACC15] to-[#84CC16] flex items-center justify-center text-white font-extrabold text-2xl mx-auto shadow-md">
            66
          </div>
          <h1 className="text-2xl font-black font-heading text-[#1F2937] tracking-tight">
            Panel Pengurus HIMA
          </h1>
          <p className="text-xs text-[#6B7280]">
            STIE 66 Kendari — Sistem Pengelolaan Konten Terpadu
          </p>
        </div>

        {/* Login Card */}
        <Card className="rounded-3xl border border-gray-200/90 shadow-xl bg-white p-2">
          <CardHeader className="text-center space-y-1 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#84CC16]/15 text-[#365314] text-xs font-bold mx-auto">
              <Shield className="size-3.5 text-[#84CC16]" />
              <span>Autentikasi Aman</span>
            </div>
            <CardTitle className="text-xl font-bold font-heading text-[#1F2937]">
              Masuk ke Akun Anda
            </CardTitle>
            <CardDescription className="text-xs text-[#6B7280]">
              Masukkan email dan kata sandi pengurus yang terdaftar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-[#6B7280] hover:text-[#1F2937] transition-colors"
          >
            <ArrowLeft className="size-3.5 mr-1.5" />
            Kembali ke Beranda Publik
          </Link>
        </div>
      </div>
    </div>
  );
}
