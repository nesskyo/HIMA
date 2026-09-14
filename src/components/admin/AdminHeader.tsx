import { Shield, User } from "lucide-react";
import type { AdminUser } from "@/types/database.types";
import { Badge } from "@/components/ui/badge";

interface AdminHeaderProps {
  currentAdmin: AdminUser | null;
}

export function AdminHeader({ currentAdmin }: AdminHeaderProps) {
  const isSuperAdmin = currentAdmin?.role === "super_admin";

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2 text-xs text-[#6B7280]">
        <span className="font-semibold text-[#1F2937]">HIMA STIE 66 Kendari</span>
        <span>/</span>
        <span>Panel CMS</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Role Badge */}
        {isSuperAdmin ? (
          <Badge className="bg-[#FACC15] hover:bg-[#EAB308] text-[#1F2937] font-bold text-[11px] px-2.5 py-0.5">
            <Shield className="size-3 mr-1" />
            Super Admin
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-gray-100 text-[#1F2937] font-semibold text-[11px] px-2.5 py-0.5">
            Editor Humas
          </Badge>
        )}

        {/* User Profile Info */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
          <div className="size-8 rounded-full bg-[#84CC16]/20 text-[#365314] font-bold flex items-center justify-center text-xs">
            {currentAdmin?.nama?.charAt(0) || "A"}
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-bold text-[#1F2937] block leading-tight">
              {currentAdmin?.nama || "Admin Pengurus"}
            </span>
            <span className="text-[10px] text-[#6B7280] block">
              {currentAdmin?.email || "admin@himastie66.com"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
