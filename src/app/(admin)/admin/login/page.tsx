import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] px-4">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto size-12 rounded-xl bg-[#FACC15]/20 flex items-center justify-center text-[#854D0E]">
            <Lock className="size-6 text-[#EAB308]" />
          </div>
          <CardTitle className="text-2xl font-bold font-heading text-[#1F2937]">
            Login Pengurus
          </CardTitle>
          <CardDescription className="text-sm text-[#6B7280]">
            Panel Pengelolaan Konten HIMA STIE 66 Kendari
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1F2937]">Email</label>
            <Input type="email" placeholder="admin@himastie66.ac.id" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1F2937]">Kata Sandi</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button variant="brand-lime" className="w-full font-semibold">
            Masuk ke Panel
          </Button>

          <div className="pt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-[#6B7280] hover:text-[#1F2937] transition-colors"
            >
              <ArrowLeft className="size-4 mr-1.5" />
              Kembali ke Beranda Publik
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
