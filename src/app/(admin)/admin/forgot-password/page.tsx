"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestPasswordReset } from "@/lib/actions/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const result = await requestPasswordReset(email);
    setLoading(false);

    if (result?.error) {
      setErrorMessage(result.error);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-b from-[#F3F4F6] to-[#E5E7EB]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="size-12 rounded-2xl bg-[#FACC15] flex items-center justify-center text-[#1F2937] font-extrabold text-2xl mx-auto shadow-md">
            66
          </div>
          <h1 className="text-2xl font-black font-heading text-[#1F2937]">
            Reset Kata Sandi
          </h1>
          <p className="text-xs text-[#6B7280]">
            Kirimkan tautan pemulihan kata sandi ke email Anda
          </p>
        </div>

        <Card className="rounded-3xl border border-gray-200 shadow-xl bg-white p-2">
          <CardHeader className="text-center space-y-1 pb-4">
            <CardTitle className="text-lg font-bold font-heading text-[#1F2937]">
              Lupa Kata Sandi?
            </CardTitle>
            <CardDescription className="text-xs text-[#6B7280]">
              Masukkan alamat email terdaftar untuk menerima instruksi reset
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center py-6 space-y-4">
                <div className="size-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="size-6" />
                </div>
                <h3 className="text-base font-bold text-[#1F2937]">
                  Tautan Berhasil Dikirim!
                </h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  Silakan periksa kotak masuk atau folder spam email Anda ({email}) untuk melanjutkan reset kata sandi.
                </p>
                <Link href="/admin/login" className="block pt-2">
                  <Button variant="outline" size="sm" className="rounded-xl text-xs font-semibold">
                    Kembali ke Halaman Login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                    <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1F2937]">Email Pengurus</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 size-4 text-[#6B7280]" />
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@himastie66.com"
                      className="pl-9 rounded-xl bg-gray-50/50 text-sm"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  variant="brand-lime"
                  className="w-full rounded-xl font-bold py-5 text-sm shadow-md"
                >
                  <Send className="size-4 mr-1.5" />
                  {loading ? "Mengirim Tautan..." : "Kirim Tautan Reset"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Link
            href="/admin/login"
            className="inline-flex items-center text-xs font-semibold text-[#6B7280] hover:text-[#1F2937] transition-colors"
          >
            <ArrowLeft className="size-3.5 mr-1.5" />
            Kembali ke Form Login
          </Link>
        </div>
      </div>
    </div>
  );
}
