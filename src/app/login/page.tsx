"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { registerUser, loginUser, saveAuth } from "@/utils/api";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const data = await loginUser({ email, password });
        saveAuth(data);
        router.push("/");
      } else {
        const data = await registerUser({ fullName, email, password, phone });
        saveAuth(data);
        router.push("/");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-brand-950">
      {/* Background with Ambient Glow */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-950 via-brand-900/80 to-accent-950/20 z-10 backdrop-blur-[2px]"></div>
        <Image
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Luxury Hotel"
          fill
          className="object-cover opacity-40 scale-105"
        />
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-500/10 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-500/10 blur-[120px] rounded-full animate-pulse-slow"></div>
      </div>

      {/* Auth Card Container */}
      <div className="w-full max-w-[480px] relative z-10">
        <div className="text-center mb-12 animate-float">
          <Link href="/" className="inline-flex flex-col items-center gap-4 group">
            <div className="w-20 h-20 bg-white/10 dark:bg-brand-800/40 backdrop-blur-xl rounded-[24px] flex items-center justify-center shadow-2xl border border-white/20 group-hover:border-accent-500/50 transition-all duration-500">
              <Globe className="text-accent-500 w-10 h-10 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <span className="font-heading font-black text-4xl tracking-tight text-white drop-shadow-2xl">
              Cybertron<span className="text-accent-500 italic ml-1">Hotel</span>
            </span>
          </Link>
        </div>

        <div className="bg-white/10 dark:bg-brand-900/40 backdrop-blur-2xl rounded-[40px] p-10 md:p-12 shadow-2xl border border-white/20 dark:border-white/5 relative overflow-hidden">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/5 blur-3xl -z-10"></div>
          
          <h2 className="font-heading text-3xl font-bold text-white mb-3">
            {isLogin ? "Chào Mừng Trở Lại" : "Gia Nhập Cộng Đồng"}
          </h2>
          <p className="text-brand-300 mb-10 text-sm font-medium leading-relaxed">
            {isLogin 
              ? "Vui lòng nhập thông tin để truy cập kỳ nghỉ sang trọng của bạn." 
              : "Khám phá thế giới đẳng cấp với những ưu đãi đặc biệt dành riêng cho thành viên."}
          </p>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-brand-400 tracking-[0.2em] uppercase ml-1">Họ và Tên</label>
                  <Input
                    required
                    placeholder="VD: Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-brand-500 h-12 rounded-2xl focus:border-accent-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-brand-400 tracking-[0.2em] uppercase ml-1">Số điện thoại</label>
                  <Input
                    required
                    placeholder="VD: 0987654321"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-brand-500 h-12 rounded-2xl focus:border-accent-500/50 transition-all"
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-brand-400 tracking-[0.2em] uppercase ml-1">Địa chỉ Email</label>
              <Input
                required
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-brand-500 h-12 rounded-2xl focus:border-accent-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-brand-400 tracking-[0.2em] uppercase ml-1">Mật khẩu</label>
              <Input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-brand-500 h-12 rounded-2xl focus:border-accent-500/50 transition-all"
              />
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <Link href="/forgot-password" title="forgot-password-link" className="text-xs font-bold text-accent-500 hover:text-accent-400 transition-colors tracking-wide">
                  Quên mật khẩu?
                </Link>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 mt-6 text-base rounded-2xl font-bold shadow-xl shadow-accent-500/20 active:scale-[0.98] transition-all animate-shimmer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Đang xử lý..." : isLogin ? "Đăng nhập ngay" : "Tạo tài khoản"}
            </Button>
          </form>

          {/* Social Login Separator */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="bg-[#1a1a1a] px-4 text-brand-500 rounded-full">Hoặc tiếp tục với</span>
            </div>
          </div>

          {/* Google Login Button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
              const authUrl = apiUrl.replace('/api', '') + "/oauth2/authorization/google";
              window.location.href = authUrl;
            }}
            className="w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-4 bg-white/5 border-white/10 hover:bg-white/10 text-white transition-all duration-300 group"
          >
            <svg className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
              />
            </svg>
            Tiếp tục bằng Google
          </Button>

          <div className="mt-10 text-center text-sm text-brand-400 font-medium">
            {isLogin ? "Bạn chưa có tài khoản? " : "Bạn đã có tài khoản? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="font-bold text-accent-500 hover:text-accent-400 transition-all hover:underline underline-offset-4 ml-1"
            >
              {isLogin ? "Đăng ký thành viên" : "Đăng nhập ngay"}
            </button>
          </div>
        </div>
        
        {/* Subtle Footer Text */}
        <p className="text-center mt-8 text-[10px] font-black text-white/20 tracking-[0.4em] uppercase">
          Experience Ultimate Luxury
        </p>
      </div>
    </div>
  );
}
