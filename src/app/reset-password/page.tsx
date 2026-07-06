"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/utils/api";
import Link from "next/link";
import { Loader2, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Token không hợp lệ hoặc đã bị thiếu.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await resetPassword(token as string, newPassword);
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-black text-foreground mb-4">Thành công!</h1>
        <p className="text-muted-foreground mb-8">
          Mật khẩu của bạn đã được thay đổi thành công. Bạn sẽ được chuyển về trang đăng nhập trong giây lát.
        </p>
        <Link href="/login" className="text-accent-500 font-bold hover:underline">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-heading font-black text-foreground mb-4">Đặt lại mật khẩu</h1>
      <p className="text-muted-foreground mb-8">Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground/70 ml-2">Mật khẩu mới</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className="w-full pl-12 pr-12 py-4 bg-muted/50 border-none rounded-2xl focus:ring-2 focus:ring-accent-500 transition-all outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground/70 ml-2">Xác nhận mật khẩu</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className="w-full pl-12 pr-4 py-4 bg-muted/50 border-none rounded-2xl focus:ring-2 focus:ring-accent-500 transition-all outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm font-medium">{error}</div>}

        <button
          type="submit"
          disabled={loading || !!error && !token}
          className="w-full py-4 bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white font-black rounded-2xl shadow-lg shadow-accent-500/20 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Cập nhật mật khẩu"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-background rounded-[40px] shadow-2xl border border-border overflow-hidden">
        <Suspense fallback={<div className="p-10 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-accent-500" /></div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
