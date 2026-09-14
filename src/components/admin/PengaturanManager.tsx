"use client";

import * as React from "react";
import { toast } from "sonner";
import { Save, PhoneCall, Globe, Sparkles, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SiteSettingsConfig } from "@/lib/services/settings";
import { saveSiteSettings } from "@/lib/actions/admin";

export function PengaturanManager({ initialSettings }: { initialSettings: SiteSettingsConfig }) {
  const [loading, setLoading] = React.useState(false);

  // Save Contact Info
  const handleSaveContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const value = {
      whatsapp: fd.get("whatsapp") as string,
      email: fd.get("email") as string,
      address: fd.get("address") as string,
    };

    const res = await saveSiteSettings("contact_info", value);
    setLoading(false);
    if (res.error) toast.error(res.error);
    else toast.success("Informasi kontak berhasil diperbarui!");
  };

  // Save Social Media
  const handleSaveSocial = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const value = {
      instagram: fd.get("instagram") as string,
      tiktok: fd.get("tiktok") as string,
      youtube: fd.get("youtube") as string,
    };

    const res = await saveSiteSettings("social_media", value);
    setLoading(false);
    if (res.error) toast.error(res.error);
    else toast.success("Tautan media sosial berhasil diperbarui!");
  };

  // Save Hero Banner
  const handleSaveHero = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const value = {
      title: fd.get("title") as string,
      subtitle: fd.get("subtitle") as string,
      cta_primary_text: fd.get("cta_primary_text") as string,
      cta_secondary_text: fd.get("cta_secondary_text") as string,
    };

    const res = await saveSiteSettings("hero_section", value);
    setLoading(false);
    if (res.error) toast.error(res.error);
    else toast.success("Konten banner beranda berhasil diperbarui!");
  };

  return (
    <div className="max-w-4xl space-y-6">
      <Tabs defaultValue="kontak" className="space-y-6">
        <TabsList className="bg-white p-1 rounded-2xl border border-gray-200 shadow-sm inline-flex">
          <TabsTrigger value="kontak" className="rounded-xl text-xs font-bold gap-1.5 px-4 py-2">
            <PhoneCall className="size-3.5" />
            Kontak Sekretariat
          </TabsTrigger>
          <TabsTrigger value="sosmed" className="rounded-xl text-xs font-bold gap-1.5 px-4 py-2">
            <Globe className="size-3.5" />
            Media Sosial
          </TabsTrigger>
          <TabsTrigger value="hero" className="rounded-xl text-xs font-bold gap-1.5 px-4 py-2">
            <Sparkles className="size-3.5" />
            Hero Beranda
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Kontak */}
        <TabsContent value="kontak">
          <Card className="rounded-3xl border-gray-200/80 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-lg font-bold font-heading text-[#1F2937]">
                Kontak Resmi Organisasi
              </CardTitle>
              <CardDescription className="text-xs text-[#6B7280]">
                Informasi ini akan langsung tampil pada footer, header, dan halaman kontak
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSaveContact} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1F2937]">Nomor WhatsApp Resmi</label>
                  <Input
                    name="whatsapp"
                    required
                    defaultValue={initialSettings.contact_info.whatsapp}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1F2937]">Alamat Email</label>
                  <Input
                    name="email"
                    type="email"
                    required
                    defaultValue={initialSettings.contact_info.email}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1F2937]">Alamat Lengkap Sekretariat</label>
                  <Textarea
                    name="address"
                    rows={3}
                    required
                    defaultValue={initialSettings.contact_info.address}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={loading} variant="brand-lime" className="rounded-xl font-bold">
                    <Save className="size-4 mr-2" />
                    Simpan Kontak
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Sosmed */}
        <TabsContent value="sosmed">
          <Card className="rounded-3xl border-gray-200/80 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-lg font-bold font-heading text-[#1F2937]">
                Tautan Akun Media Sosial
              </CardTitle>
              <CardDescription className="text-xs text-[#6B7280]">
                Tautan profil media sosial resmi HIMA STIE 66 Kendari
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSaveSocial} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1F2937]">URL Profil Instagram</label>
                  <Input
                    name="instagram"
                    required
                    defaultValue={initialSettings.social_media.instagram}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1F2937]">URL Profil TikTok</label>
                  <Input
                    name="tiktok"
                    required
                    defaultValue={initialSettings.social_media.tiktok}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1F2937]">URL Saluran YouTube</label>
                  <Input
                    name="youtube"
                    required
                    defaultValue={initialSettings.social_media.youtube}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={loading} variant="brand-lime" className="rounded-xl font-bold">
                    <Save className="size-4 mr-2" />
                    Simpan Media Sosial
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Hero */}
        <TabsContent value="hero">
          <Card className="rounded-3xl border-gray-200/80 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-lg font-bold font-heading text-[#1F2937]">
                Teks Banner Hero Beranda
              </CardTitle>
              <CardDescription className="text-xs text-[#6B7280]">
                Ubah narasi dan tombol aksi halaman utama tanpa perlu coding ulang
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSaveHero} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1F2937]">Subjudul Hero</label>
                  <Textarea
                    name="subtitle"
                    rows={2}
                    required
                    defaultValue={initialSettings.hero_section.subtitle}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1F2937]">Teks Tombol Aksi 1</label>
                    <Input
                      name="cta_primary_text"
                      required
                      defaultValue={initialSettings.hero_section.cta_primary_text}
                      className="rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1F2937]">Teks Tombol Aksi 2</label>
                    <Input
                      name="cta_secondary_text"
                      required
                      defaultValue={initialSettings.hero_section.cta_secondary_text}
                      className="rounded-xl text-xs"
                    />
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={loading} variant="brand-lime" className="rounded-xl font-bold">
                    <Save className="size-4 mr-2" />
                    Simpan Teks Hero
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
