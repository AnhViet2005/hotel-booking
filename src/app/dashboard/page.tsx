"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Hotel as HotelIcon, CalendarCheck, Settings, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { getMyBookings, getUser, UserBooking } from "@/utils/api";
import { formatCurrency } from "@/utils/format";
import { getImageUrl } from "@/utils/image";

export default function DashboardPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push("/login"); return; }
    setUser(u);

    getMyBookings().then(setBookings).finally(() => setLoading(false));
  }, [router]);


  const stats = [
    { label: "Tổng đặt phòng", value: bookings.length, color: "text-accent-500" },
    { label: "Đã xác nhận", value: bookings.filter(b => b.status === "CONFIRMED").length, color: "text-blue-500" },
    { label: "Hoàn tất", value: bookings.filter(b => b.status === "COMPLETED").length, color: "text-green-500" },
    { label: "Đã hủy", value: bookings.filter(b => b.status === "CANCELLED").length, color: "text-slate-500" },
  ];

  const recentBookings = bookings.slice(0, 3);

  const STATUS_COLOR: Record<string, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-400/30",
    CONFIRMED: "bg-blue-500/10 text-blue-600 border-blue-400/30",
    COMPLETED: "bg-green-500/10 text-green-600 border-green-400/30",
    CANCELLED: "bg-slate-500/10 text-slate-500 border-slate-400/30",
  };
  const STATUS_LABEL: Record<string, string> = {
    PENDING: "Chờ xác nhận", CONFIRMED: "Đã xác nhận", COMPLETED: "Hoàn tất", CANCELLED: "Đã hủy",
  };

  return (
    <>
      {/* Header */}
      <div className="mb-10">
        <div className="text-accent-500 font-bold tracking-[0.2em] uppercase text-xs mb-3">
          Chào mừng trở lại
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-brand-900 dark:text-white mb-2">
          {user ? `Xin chào, ${user.fullName.split(" ").pop()}! 👋` : "Tổng Quan"}
        </h1>
        <p className="text-brand-600 dark:text-brand-400 text-lg">
          Đây là bảng tóm tắt hoạt động tài khoản của bạn.
        </p>
      </div>



      {/* Stats Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-8 h-8 animate-spin text-accent-500" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map(stat => (
            <div key={stat.label} className="bg-card rounded-2xl border border-border p-5 shadow-sm text-center hover:border-accent-500/30 transition-all">
              <p className={`text-3xl font-heading font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link href="/dashboard/bookings" className="group bg-card rounded-2xl border border-border p-6 shadow-sm hover:border-accent-500/30 hover:shadow-md transition-all flex items-center gap-4">
          <div className="w-12 h-12 bg-accent-500/10 rounded-xl flex items-center justify-center group-hover:bg-accent-500 transition-colors">
            <HotelIcon className="w-6 h-6 text-accent-500 group-hover:text-white transition-colors" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-card-foreground">Đặt phòng của tôi</p>
            <p className="text-xs text-muted-foreground mt-0.5">Xem toàn bộ lịch sử</p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent-500 group-hover:translate-x-1 transition-all" />
        </Link>
        <Link href="/dashboard/settings" className="group bg-card rounded-2xl border border-border p-6 shadow-sm hover:border-accent-500/30 hover:shadow-md transition-all flex items-center gap-4">
          <div className="w-12 h-12 bg-accent-500/10 rounded-xl flex items-center justify-center group-hover:bg-accent-500 transition-colors">
            <Settings className="w-6 h-6 text-accent-500 group-hover:text-white transition-colors" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-card-foreground">Cài đặt tài khoản</p>
            <p className="text-xs text-muted-foreground mt-0.5">Đổi mật khẩu, avatar</p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent-500 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Recent Bookings */}
      {!loading && recentBookings.length > 0 && (
        <div className="bg-card rounded-[32px] border border-border shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-xl text-card-foreground flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-accent-500" />
              Đặt phòng gần đây
            </h3>
            <Link href="/dashboard/bookings" className="text-sm text-accent-500 hover:underline font-bold">
              Xem tất cả →
            </Link>
          </div>
          <div className="space-y-4">
            {recentBookings.map(b => (
              <div key={b.id} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  {b.hotelImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={getImageUrl(b.hotelImage)} alt={b.hotelName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <HotelIcon className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-card-foreground truncate">{b.hotelName}</p>
                  <p className="text-xs text-muted-foreground font-mono">{b.bookingCode}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-accent-500 text-sm">{formatCurrency(b.totalAmount)}</p>
                  <span className={`inline-block mt-1 text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full border ${STATUS_COLOR[b.status] || ""}`}>
                    {STATUS_LABEL[b.status] || b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
