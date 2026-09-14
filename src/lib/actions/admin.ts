"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  Kabinet,
  OrgMember,
  NewsPost,
  EventItem,
  Community,
  RecruitmentPost,
  GalleryAlbum,
  GalleryItem,
  AdminUser,
} from "@/types/database.types";

/* =========================================================================
   1. KABINET & ANGGOTA ORGANISASI
========================================================================= */

export async function saveKabinet(data: Partial<Kabinet>) {
  try {
    const supabase = await createClient();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return { success: true, message: "Berhasil disimpan (Mode Demo)" };
    }

    if (data.is_active) {
      // If setting this cabinet as active, deactivate others
      await (supabase.from("kabinet") as any)
        .update({ is_active: false })
        .neq("id", data.id || "");
    }

    if (data.id) {
      const { error } = await (supabase.from("kabinet") as any)
        .update(data)
        .eq("id", data.id);
      if (error) throw error;
    } else {
      const { error } = await (supabase.from("kabinet") as any).insert([data]);
      if (error) throw error;
    }

    revalidatePath("/admin/struktur");
    revalidatePath("/struktur");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Gagal menyimpan data kabinet" };
  }
}

export async function deleteKabinet(id: string) {
  try {
    const supabase = await createClient();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };
    const { error } = await (supabase.from("kabinet") as any).delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/struktur");
    revalidatePath("/struktur");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function saveOrgMember(data: Partial<OrgMember>) {
  try {
    const supabase = await createClient();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };

    if (data.id) {
      const { error } = await (supabase.from("org_member") as any)
        .update(data)
        .eq("id", data.id);
      if (error) throw error;
    } else {
      const { error } = await (supabase.from("org_member") as any).insert([data]);
      if (error) throw error;
    }

    revalidatePath("/admin/struktur");
    revalidatePath("/struktur");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Gagal menyimpan data anggota" };
  }
}

export async function deleteOrgMember(id: string) {
  try {
    const supabase = await createClient();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };
    const { error } = await (supabase.from("org_member") as any).delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/struktur");
    revalidatePath("/struktur");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

/* =========================================================================
   2. BERITA / BLOG
========================================================================= */

export async function saveNewsPost(data: Partial<NewsPost>) {
  try {
    const supabase = await createClient();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };

    if (!data.slug && data.judul) {
      data.slug = data.judul
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    if (data.id) {
      const { error } = await (supabase.from("news_post") as any)
        .update(data)
        .eq("id", data.id);
      if (error) throw error;
    } else {
      const { error } = await (supabase.from("news_post") as any).insert([data]);
      if (error) throw error;
    }

    revalidatePath("/admin/berita");
    revalidatePath("/berita");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Gagal menyimpan berita" };
  }
}

export async function deleteNewsPost(id: string) {
  try {
    const supabase = await createClient();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };
    const { error } = await (supabase.from("news_post") as any).delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/berita");
    revalidatePath("/berita");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

/* =========================================================================
   3. EVENT / AGENDA
========================================================================= */

export async function saveEvent(data: Partial<EventItem>) {
  try {
    const supabase = await createClient();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };

    if (!data.slug && data.judul) {
      data.slug = data.judul
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    if (data.id) {
      const { error } = await (supabase.from("event") as any)
        .update(data)
        .eq("id", data.id);
      if (error) throw error;
    } else {
      const { error } = await (supabase.from("event") as any).insert([data]);
      if (error) throw error;
    }

    revalidatePath("/admin/event");
    revalidatePath("/event");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Gagal menyimpan event" };
  }
}

export async function deleteEvent(id: string) {
  try {
    const supabase = await createClient();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };
    const { error } = await (supabase.from("event") as any).delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/event");
    revalidatePath("/event");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

/* =========================================================================
   4. KOMUNITAS
========================================================================= */

export async function saveCommunity(data: Partial<Community>) {
  try {
    const supabase = await createClient();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };

    if (!data.slug && data.nama) {
      data.slug = data.nama
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    if (data.id) {
      const { error } = await (supabase.from("community") as any)
        .update(data)
        .eq("id", data.id);
      if (error) throw error;
    } else {
      const { error } = await (supabase.from("community") as any).insert([data]);
      if (error) throw error;
    }

    revalidatePath("/admin/komunitas");
    revalidatePath("/komunitas");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Gagal menyimpan komunitas" };
  }
}

export async function deleteCommunity(id: string) {
  try {
    const supabase = await createClient();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };
    const { error } = await (supabase.from("community") as any).delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/komunitas");
    revalidatePath("/komunitas");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

/* =========================================================================
   5. OPEN RECRUITMENT
========================================================================= */

export async function saveRecruitment(data: Partial<RecruitmentPost>) {
  try {
    const supabase = await createClient();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };

    if (data.id) {
      const { error } = await (supabase.from("recruitment_post") as any)
        .update(data)
        .eq("id", data.id);
      if (error) throw error;
    } else {
      const { error } = await (supabase.from("recruitment_post") as any).insert([data]);
      if (error) throw error;
    }

    revalidatePath("/admin/oprec");
    revalidatePath("/oprec");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Gagal menyimpan data oprec" };
  }
}

/* =========================================================================
   6. GALERI & ITEM MEDIA
========================================================================= */

export async function saveGalleryAlbum(data: Partial<GalleryAlbum>) {
  try {
    const supabase = await createClient();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };

    if (data.id) {
      const { error } = await (supabase.from("gallery_album") as any)
        .update(data)
        .eq("id", data.id);
      if (error) throw error;
    } else {
      const { error } = await (supabase.from("gallery_album") as any).insert([data]);
      if (error) throw error;
    }

    revalidatePath("/admin/galeri");
    revalidatePath("/galeri");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Gagal menyimpan album galeri" };
  }
}

export async function deleteGalleryAlbum(id: string) {
  try {
    const supabase = await createClient();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };
    const { error } = await (supabase.from("gallery_album") as any).delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/galeri");
    revalidatePath("/galeri");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function saveGalleryItem(data: Partial<GalleryItem>) {
  try {
    const supabase = await createClient();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };

    if (data.id) {
      const { error } = await (supabase.from("gallery_item") as any)
        .update(data)
        .eq("id", data.id);
      if (error) throw error;
    } else {
      const { error } = await (supabase.from("gallery_item") as any).insert([data]);
      if (error) throw error;
    }

    revalidatePath("/admin/galeri");
    revalidatePath("/galeri");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Gagal menyimpan item galeri" };
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    const supabase = await createClient();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };
    const { error } = await (supabase.from("gallery_item") as any).delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/galeri");
    revalidatePath("/galeri");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

/* =========================================================================
   7. PENGATURAN SITUS
========================================================================= */

export async function saveSiteSettings(key: string, value: any) {
  try {
    const supabase = await createClient();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };

    const { error } = await (supabase.from("site_settings") as any).upsert(
      { key, value },
      { onConflict: "key" }
    );
    if (error) throw error;

    revalidatePath("/admin/pengaturan");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Gagal menyimpan pengaturan" };
  }
}

/* =========================================================================
   8. MANAJEMEN AKUN ADMIN (SUPER ADMIN ONLY)
========================================================================= */

const DEMO_ADMIN_USERS: AdminUser[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    nama: "Super Admin (Demo)",
    email: "admin@himastie66.com",
    role: "super_admin",
    created_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    nama: "Humas & Publikasi",
    email: "editor@himastie66.com",
    role: "editor",
    created_at: "2024-02-15T10:30:00.000Z",
  },
];

export async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    const supabase = await createClient();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return DEMO_ADMIN_USERS;

    const { data, error } = await (supabase
      .from("admin_user") as any)
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEMO_ADMIN_USERS;
    }

    return data as AdminUser[];
  } catch {
    return DEMO_ADMIN_USERS;
  }
}

export async function createAdminUser(data: { nama: string; email: string; role: string; password?: string }) {
  try {
    const supabase = await createClient();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };

    // Create user in Supabase Auth
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password || "password123",
      email_confirm: true,
      user_metadata: {
        nama: data.nama,
        role: data.role,
      },
    });

    if (authErr) {
      // If admin.createUser is restricted by RLS on server client, insert profile directly
      const { error: insertErr } = await (supabase.from("admin_user") as any).insert([
        {
          nama: data.nama,
          email: data.email,
          role: data.role,
        },
      ]);
      if (insertErr) throw insertErr;
    }

    revalidatePath("/admin/pengguna");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Gagal menambahkan akun admin" };
  }
}

export async function updateAdminUser(id: string, data: Partial<Pick<AdminUser, "nama" | "role">>) {
  try {
    const supabase = await createClient();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };

    const { error } = await (supabase.from("admin_user") as any)
      .update(data)
      .eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/pengguna");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Gagal memperbarui data admin" };
  }
}

export async function deleteAdminUser(id: string) {
  try {
    const supabase = await createClient();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };

    const { error } = await (supabase.from("admin_user") as any).delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/pengguna");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

