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
                <Link href="#" className="text-xs font-bold text-accent-500 hover:text-accent-400 transition-colors tracking-wide">
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
