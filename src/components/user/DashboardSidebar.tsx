"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Hotel, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { getUser, logout, getMyProfile } from "@/utils/api";

export default function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ fullName: string; email: string; role: string } | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.push("/login");
    } else {
      setUser(u);
      getMyProfile()
        .then((profile) => {
          if ((profile as any).avatarUrl) setAvatarUrl((profile as any).avatarUrl);
        })
        .catch(console.error);
    }
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: "Tổng quan", href: "/dashboard" },
    { icon: <Hotel className="w-5 h-5" />, label: "Đặt phòng của tôi", href: "/dashboard/bookings" },
    { icon: <Settings className="w-5 h-5" />, label: "Cài đặt", href: "/dashboard/settings" },
  ];

  // Get initials from full name
  const initials = user?.fullName
    ? user.fullName.split(" ").slice(-2).map((n) => n[0]).join("").toUpperCase()
    : "?";

  return (
    <div className="bg-card rounded-[32px] p-8 shadow-xl border border-border sticky top-28">
      {/* User Avatar + Info */}
      <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border">
        <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg shadow-accent-500/20">
          {avatarUrl ? (
            <img src={avatarUrl} alt={user?.fullName || "Avatar"} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-accent-500 flex items-center justify-center text-white font-bold text-xl">
              {initials}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-heading font-bold text-base text-card-foreground truncate">
            {user?.fullName || "Đang tải..."}
          </h3>
          <p className="text-xs text-muted-foreground font-medium truncate">{user?.email}</p>
          <span className="inline-block mt-1 text-[10px] font-black tracking-widest uppercase text-accent-500">
            {user?.role === "ADMIN" ? "Quản trị viên" : user?.role === "OWNER" ? "Chủ khách sạn" : "Thành viên"}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 mb-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              href={item.href}
              key={item.label}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${
                isActive
                  ? "bg-accent-500 text-white shadow-lg shadow-accent-500/20 scale-[1.02]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className={isActive ? "text-white" : "text-accent-500"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
      >
        <LogOut className="w-5 h-5 text-red-500" />
        Đăng xuất
      </button>
    </div>
  );
}
