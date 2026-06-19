"use client";

import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/Input";

export default function AdminHeader() {
  return (
    <header className="h-24 bg-card border-b border-border flex items-center justify-between px-10 sticky top-0 z-40">
      {/* Search */}
      <div className="w-96">
        <Input 
          icon={<Search className="w-4 h-4 text-accent-500" />}
          placeholder="Tìm kiếm mọi thứ..."
          className="rounded-xl bg-muted/50 border-transparent focus:border-accent-500/30 transition-all h-12"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <button className="relative w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-accent-500 hover:text-white transition-all group">
          <Bell className="w-5 h-5" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-background group-hover:border-accent-500 transition-colors"></span>
        </button>
        
        <div className="h-10 w-[1px] bg-border mx-2"></div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-foreground">Cybertron Admin</p>
            <p className="text-xs text-muted-foreground font-medium">Quản trị viên hệ thống</p>
          </div>
          <button className="w-12 h-12 rounded-xl bg-accent-500 flex items-center justify-center text-white font-bold shadow-lg shadow-accent-500/20 hover:scale-105 transition-transform">
            <User className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
