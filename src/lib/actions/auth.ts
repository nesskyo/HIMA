"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { AdminUser } from "@/types/database.types";

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
});

export async function requireAdminSession() {
  const supabase = await createClient();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      user: null,
      admin: {
        id: "11111111-1111-1111-1111-111111111111",
        nama: "Super Admin (Demo)",
        email: "admin@himastie66.com",
        role: "super_admin",
        created_at: new Date().toISOString(),
      } as AdminUser,
    };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Sesi admin tidak valid. Silakan login kembali.");
  }

  const { data: adminProfile, error: profileErr } = await (supabase
    .from("admin_user") as any)
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profileErr || !adminProfile) {
    const fallbackRole = (user.user_metadata?.role as string | undefined) || "editor";
    if (fallbackRole !== "super_admin" && fallbackRole !== "editor") {
      throw new Error("Akun ini tidak memiliki hak akses administrator pengurus.");
    }

    return {
      user,
      admin: {
        id: user.id,
        nama: user.user_metadata?.nama || user.email?.split("@")[0] || "Admin",
        email: user.email || "",
        role: fallbackRole as "super_admin" | "editor",
        created_at: user.created_at || new Date().toISOString(),
      } as AdminUser,
    };
  }

  return {
    user,
    admin: adminProfile as AdminUser,
  };
}

export async function loginAdmin(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    return {
      error: validation.error.issues[0]?.message || "Format data tidak valid",
    };
  }

  const supabase = await createClient();

  // If Supabase credentials are not yet set in environment, support demo admin bypass
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (email === "admin@himastie66.com" && password === "password123") {
      redirect("/admin/dashboard");
    }
    return {
      error: "Kredensial demo: admin@himastie66.com / password123 (atau isi .env.local untuk live Supabase).",
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return {
      error: "Email atau kata sandi salah. Silakan coba lagi.",
    };
  }

  // Verify that the user is registered in admin_user
  const { data: adminProfile, error: profileErr } = await (supabase
    .from("admin_user") as any)
    .select("*")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileErr || !adminProfile) {
    // If not found in admin_user table, check user metadata fallback
    const role = data.user.user_metadata?.role;
    if (!role) {
      await supabase.auth.signOut();
      return {
        error: "Akun ini tidak memiliki hak akses administrator pengurus.",
      };
    }
  }

  revalidatePath("/admin", "layout");
  redirect("/admin/dashboard");
}

export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/admin", "layout");
  redirect("/admin/login");
}

export async function requestPasswordReset(email: string) {
  const emailValidation = z.string().email().safeParse(email);
  if (!emailValidation.success) {
    return { error: "Format email tidak valid" };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/admin/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Default fallback for development/demo mode if not logged in
      return {
        id: "11111111-1111-1111-1111-111111111111",
        nama: "Super Admin (Demo)",
        email: "admin@himastie66.com",
        role: "super_admin",
        created_at: new Date().toISOString(),
      };
    }

    const { data: profile } = await (supabase
      .from("admin_user") as any)
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (profile) {
      return profile as AdminUser;
    }

    return {
      id: user.id,
      nama: user.user_metadata?.nama || user.email?.split("@")[0] || "Admin",
      email: user.email || "",
      role: (user.user_metadata?.role as any) || "editor",
      created_at: user.created_at || new Date().toISOString(),
    };
  } catch {
    return {
      id: "11111111-1111-1111-1111-111111111111",
      nama: "Super Admin (Demo)",
      email: "admin@himastie66.com",
      role: "super_admin",
      created_at: new Date().toISOString(),
    };
  }
}
