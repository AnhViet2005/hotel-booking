"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Menu, Globe, CalendarDays, LogOut, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getUser, logout, getMyProfile } from "@/utils/api";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname?.startsWith("/admin");
  const [user, setUser] = useState<{ fullName: string; email: string; role: string } | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const u = getUser();
    setUser(u);
    if (u) {
      getMyProfile()
        .then((profile) => {
          setAvatarUrl((profile as any).avatarUrl || null);
        })
        .catch(console.error);
    } else {
      setAvatarUrl(null);
    }
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setDropdownOpen(false);
    router.push("/");
  };

  if (isAdmin) return null;

  const initial = user?.fullName?.charAt(0)?.toUpperCase() ?? "U";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
        <div className="glass dark:glass-dark rounded-3xl h-20 px-6 flex items-center justify-between shadow-xl shadow-foreground/5 dark:shadow-accent-500/5 border border-white/20 dark:border-white/5">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-accent-500/20 group-hover:scale-105 transition-transform">
                <Globe className="text-white w-6 h-6" />
              </div>
              <span className="font-heading font-bold text-2xl tracking-tight text-foreground">
                Cybertron<span className="text-accent-500 group-hover:text-accent-400 transition-colors">Hotel</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/destinations" className="text-foreground/80 hover:text-accent-500 font-medium transition-colors">Bài viết</Link>
            <Link href="/search" className="text-foreground/80 hover:text-accent-500 font-medium transition-colors">Khách sạn</Link>
            <Link href="/partner" className="text-accent-500 hover:text-accent-600 font-bold transition-colors">Hợp tác với chúng tôi</Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-foreground hover:bg-muted transition-colors text-sm font-medium">
              <CalendarDays className="w-4 h-4" />
              <span>Chuyến đi</span>
            </Link>

            {user ? (
              /* Auth Group */
              <div className="flex items-center gap-4">
                <NotificationBell />
                
                {/* User Avatar with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 group"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-accent-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-accent-500/30 group-hover:scale-105 transition-transform ring-2 ring-accent-500/30">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      initial
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-foreground/60 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden animate-dropdown">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="font-semibold text-foreground text-sm truncate">{user.fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Hồ sơ của tôi
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            ) : (
              /* Login Button */
              <Link href="/login" className="flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-full shadow-xl shadow-foreground/10 hover:opacity-90 transition-all transform hover:-translate-y-0.5">
                <User className="w-4 h-4" />
                <span className="font-medium">Đăng nhập</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="text-foreground hover:text-accent-500 p-2">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
