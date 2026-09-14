"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Shield, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/tentang", label: "Tentang" },
  { href: "/struktur", label: "Struktur" },
  { href: "/berita", label: "Berita" },
  { href: "/event", label: "Event" },
  { href: "/komunitas", label: "Komunitas" },
  { href: "/oprec", label: "Oprec" },
  { href: "/galeri", label: "Galeri" },
  { href: "/kontak", label: "Kontak" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "glass-header shadow-sm py-3"
          : "bg-white/95 backdrop-blur-md border-b border-gray-100 py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="size-10 rounded-xl bg-gradient-to-tr from-[#FACC15] to-[#84CC16] flex items-center justify-center text-white font-extrabold text-xl shadow-sm group-hover:scale-105 transition-transform">
            66
          </div>
          <div className="flex flex-col text-left">
            <span className="text-base font-extrabold font-heading text-[#1F2937] leading-none tracking-tight group-hover:text-[#84CC16] transition-colors">
              HIMA STIE 66
            </span>
            <span className="text-[11px] font-semibold text-[#6B7280] tracking-wide mt-0.5">
              KENDARI
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3 py-1.5 text-sm font-medium transition-colors rounded-md",
                  isActive
                    ? "text-[#1F2937] font-semibold"
                    : "text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-50"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#FACC15] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/kontak">
            <Button
              variant="brand-lime"
              size="sm"
              className="rounded-full shadow-sm"
            >
              <PhoneCall className="size-3.5 mr-1.5" />
              Hubungi Kami
            </Button>
          </Link>
          <Link href="/admin/login" title="Login Pengurus / Admin">
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-gray-400 hover:text-gray-700 rounded-full"
            >
              <Shield className="size-4" />
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/admin/login">
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-gray-500 rounded-full"
            >
              <Shield className="size-4" />
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="size-6 text-[#1F2937]" />
            ) : (
              <Menu className="size-6 text-[#1F2937]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (desain.md §5.1 - Yellow STIE 66 theme) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-yellow-200 bg-[#FACC15] px-4 pt-4 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-3 rounded-xl text-base font-semibold transition-all flex items-center justify-between",
                    isActive
                      ? "bg-white text-[#1F2937] shadow-sm font-bold"
                      : "text-[#854D0E] hover:bg-yellow-300/60"
                  )}
                >
                  <span>{link.label}</span>
                  <ArrowRight className="size-4 opacity-70" />
                </Link>
              );
            })}
            <div className="pt-3">
              <Link href="/kontak" className="block w-full">
                <Button
                  variant="brand-lime"
                  className="w-full justify-center rounded-xl py-5 text-base font-bold shadow-md"
                >
                  <PhoneCall className="size-4 mr-2" />
                  Hubungi Pengurus
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
