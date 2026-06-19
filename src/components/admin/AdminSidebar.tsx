"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/utils/cn";
import {
  LayoutDashboard,
  Hotel,
  CalendarCheck,
  Users,
  Settings,
  LogOut,
  Globe,
} from "lucide-react";
import { getUser, getMyProfile } from "@/utils/api";


const MENU_ITEMS = [
  { icon: LayoutDashboard, label: "Tổng quan", href: "/admin" },
  { icon: Hotel, label: "Quản lý khách sạn", href: "/admin/hotels" },
  { icon: CalendarCheck, label: "Đặt phòng", href: "/admin/bookings" },
  { icon: Users, label: "Người dùng", href: "/admin/users" },
  { icon: Settings, label: "Cài đặt", href: "/admin/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);

  useEffect(() => {
    const u = getUser();
    setUser(u);
    if (u) {
      getMyProfile().then((p: any) => setAvatarUrl(p.avatarUrl || null)).catch(console.error);
    }
  }, []);

  const initials = user?.fullName
    ? user.fullName.split(" ").slice(-2).map(n => n[0]).join("").toUpperCase()
    : "?";

  return (
    <aside className="w-80 h-screen sticky top-0 bg-card border-r border-border flex flex-col p-8">
      {/* Logo */}
      <div className="mb-12">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-accent-500/20 group-hover:scale-105 transition-transform">
            <Globe className="text-white w-6 h-6" />
          </div>
          <span className="font-heading font-bold text-2xl tracking-tight text-foreground">
            Cybertron<span className="text-accent-500">Admin</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all group",
                isActive
                  ? "bg-accent-500 text-white shadow-lg shadow-accent-500/20 scale-[1.02]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-white" : "text-accent-500 group-hover:text-accent-400"
              )} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-8 border-t border-border">
        <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all">
          <LogOut className="w-5 h-5" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
