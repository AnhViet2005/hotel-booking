"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, Check, Clock, X, BellOff, Info, AlertTriangle } from "lucide-react";
import { getUserNotifications, getUnreadNotificationCount, markNotificationsAsRead } from "@/utils/api";
import Link from "next/link";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [data, count] = await Promise.all([
        getUserNotifications(),
        getUnreadNotificationCount()
      ]);
      setNotifications(data);
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => fetchNotifications(true), 30000); // Poll every 30s for users
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markNotificationsAsRead();
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  const getStatusBadge = (type: string) => {
    switch (type) {
      case "BOOKING_CREATED":
        return <span className="bg-blue-500/10 text-blue-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase border border-blue-500/20">Chờ xác nhận</span>;
      case "BOOKING_CONFIRMED":
        return <span className="bg-green-500/10 text-green-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase border border-green-500/20">Đã xác nhận</span>;
      case "BOOKING_CANCELLED":
        return <span className="bg-red-500/10 text-red-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase border border-red-500/20">Đã hủy</span>;
      case "BOOKING_COMPLETED":
        return <span className="bg-purple-500/10 text-purple-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase border border-purple-500/20">Hoàn tất</span>;
      default:
        return <span className="bg-slate-500/10 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase border border-slate-500/20">Thông báo</span>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
        case "BOOKING_CONFIRMED": return <Check className="h-5 w-5" />;
        case "BOOKING_CANCELLED": return <AlertTriangle className="h-5 w-5" />;
        default: return <Info className="h-5 w-5" />;
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2 rounded-full transition-all border",
          isOpen ? "bg-accent-500 text-white border-accent-500 shadow-lg shadow-accent-500/20" : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
        )}
      >
        <Bell className={cn("h-5 w-5", unreadCount > 0 && !isOpen && "animate-[bell-ring_1s_infinite]")} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-zinc-900">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 transform origin-top-right bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl z-[100] animate-in fade-in zoom-in duration-200 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white uppercase tracking-wider">Thông báo của bạn</h3>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5 uppercase">{unreadCount} tin nhắn mới</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest"
              >
                Đã đọc hết
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto no-scrollbar">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-8">
                <BellOff className="h-10 w-10 text-zinc-200 dark:text-zinc-800 mb-4" />
                <p className="text-sm font-bold text-zinc-900 dark:text-white">Chưa có thông báo</p>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Chúng tôi sẽ cập nhật trạng thái đơn đặt phòng của bạn tại đây.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "p-5 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/50 group relative flex gap-4",
                      !n.isRead ? "bg-blue-500/[0.02]" : "opacity-60"
                    )}
                  >
                    <div className={cn(
                      "h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center shadow-sm",
                      !n.isRead ? "bg-accent-500 text-white shadow-accent-500/20" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                    )}>
                      {getTypeIcon(n.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                         {getStatusBadge(n.type)}
                         <span className="text-[9px] font-medium text-zinc-400">{formatTime(n.createdAt)}</span>
                      </div>
                      
                      <p className={cn(
                        "text-[12px] leading-relaxed mb-2",
                        !n.isRead ? "text-zinc-900 dark:text-white font-bold" : "text-zinc-500 font-medium"
                      )}>
                        {n.message}
                      </p>

                      {n.bookingCode && (
                        <Link 
                          href={`/dashboard/bookings`}
                          className="inline-flex items-center gap-1.5 text-[10px] font-bold text-accent-600 hover:underline"
                        >
                          Xem chi tiết đơn #{n.bookingCode} <Check className="h-2.5 w-2.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 text-center">
            <Link href="/dashboard/bookings" className="text-[10px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-bold uppercase tracking-widest transition-colors">
               Xem lịch sử đặt phòng
            </Link>
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes bell-ring {
          0%, 100% { transform: rotate(0); }
          20% { transform: rotate(15deg); }
          40% { transform: rotate(-15deg); }
          60% { transform: rotate(10deg); }
          80% { transform: rotate(-10deg); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
