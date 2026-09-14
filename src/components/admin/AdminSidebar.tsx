"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  Users2,
  BookOpen,
  Megaphone,
  Image as ImageIcon,
  Settings,
  ShieldCheck,
  Globe,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/types/database.types";
import { logoutAdmin } from "@/lib/actions/auth";

interface AdminSidebarProps {
  currentAdmin: AdminUser | null;
}

export function AdminSidebar({ currentAdmin }: AdminSidebarProps) {
  const pathname = usePathname();

  const isSuperAdmin = currentAdmin?.role === "super_admin";

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Kelola Berita",
      href: "/admin/berita",
      icon: Newspaper,
    },
    {
      label: "Kelola Event",
      href: "/admin/event",
      icon: Calendar,
    },
    {
      label: "Struktur Organisasi",
      href: "/admin/struktur",
      icon: Users2,
    },
    {
      label: "Komunitas Mahasiswa",
      href: "/admin/komunitas",
      icon: BookOpen,
    },
    {
      label: "Open Recruitment",
      href: "/admin/oprec",
      icon: Megaphone,
    },
    {
      label: "Galeri & Media",
      href: "/admin/galeri",
      icon: ImageIcon,
    },
    {
      label: "Pengaturan Situs",
      href: "/admin/pengaturan",
      icon: Settings,
    },
  ];

  if (isSuperAdmin) {
    navItems.push({
      label: "Kelola Akun Admin",
      href: "/admin/pengguna",
      icon: ShieldCheck,
    });
  }

  return (
    <aside className="w-64 bg-[#1F2937] text-white flex flex-col justify-between shrink-0 min-h-screen border-r border-gray-800">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-gray-800">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-gradient-to-tr from-[#FACC15] to-[#84CC16] flex items-center justify-center text-white font-black text-lg">
              66
            </div>
            <div>
              <span className="font-extrabold text-sm font-heading block tracking-tight text-white">
                CMS HIMA STIE 66
              </span>
              <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">
                Panel Pengurus
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Menu Utama
          </div>
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin/dashboard"
                ? pathname === "/admin/dashboard"
                : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                  isActive
                    ? "bg-[#84CC16] text-white shadow-sm font-bold"
                    : "text-gray-300 hover:bg-gray-800/80 hover:text-white"
                )}
              >
                <Icon className={cn("size-4", isActive ? "text-white" : "text-gray-400")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation & Logout */}
      <div className="p-4 border-t border-gray-800 space-y-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <span className="flex items-center gap-2">
            <Globe className="size-4 text-[#FACC15]" />
            <span>Lihat Web Publik</span>
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700 text-gray-300">Live</span>
        </Link>

        <form action={logoutAdmin}>
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer text-left"
          >
            <LogOut className="size-4" />
            <span>Keluar (Logout)</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
