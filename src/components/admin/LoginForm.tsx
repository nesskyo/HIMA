"use client";

import * as React from "react";
import Link from "next/link";
import { Lock, Mail, ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAdmin } from "@/lib/actions/auth";

export function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await loginAdmin(null, formData);

      if (result?.error) {
        setErrorMessage(result.error);
      }
    } catch {
      setErrorMessage("Login gagal diproses. Periksa environment Supabase di Vercel lalu coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#1F2937]">Email Pengurus</label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 size-4 text-[#6B7280]" />
          <Input
            name="email"
            type="email"
            required
            defaultValue="admin@himastie66.com"
            placeholder="admin@himastie66.com"
            className="pl-9 rounded-xl bg-gray-50/50 text-sm"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#1F2937]">Kata Sandi</label>
          <Link
            href="/admin/forgot-password"
            className="text-xs font-semibold text-[#84CC16] hover:text-[#65A30D] transition-colors"
          >
            Lupa Kata Sandi?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 size-4 text-[#6B7280]" />
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            required
            defaultValue="password123"
            placeholder="••••••••"
            className="pl-9 pr-10 rounded-xl bg-gray-50/50 text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-[#6B7280] hover:text-[#1F2937]"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        variant="brand-lime"
        className="w-full rounded-xl font-bold py-5 text-sm shadow-md mt-2"
      >
        {loading ? "Memproses Autentikasi..." : "Masuk ke Panel Admin"}
        <ArrowRight className="size-4 ml-1.5" />
      </Button>
    </form>
  );
}
