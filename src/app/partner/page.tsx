"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Globe, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { registerOwner } from "@/utils/api";

export default function PartnerRegistrationPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [hotelName, setHotelName] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerOwner({ fullName, email, password, phone, hotelName });
      setSuccess(true);
      // Wait a bit before showing success message, then they should go to admin site
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-brand-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 to-brand-950 z-0"></div>
        <div className="w-full max-w-md relative z-10 bg-white/10 backdrop-blur-2xl rounded-3xl p-10 text-center border border-white/20 shadow-2xl">
          <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-400" />
          </div>
          <h2 className="text-3xl font-heading font-bold text-white mb-4">Đăng ký thành công!</h2>
          <p className="text-brand-200 mb-8 leading-relaxed">
            Chào mừng bạn đến với mạng lưới đối tác của Cybertron Hotel. Tài khoản quản lý khách sạn <strong>{hotelName}</strong> đã được tạo thành công.
          </p>
          <a
            href="http://localhost:3000/login" 
            className="inline-flex w-full items-center justify-center h-14 bg-accent-500 hover:bg-accent-600 text-white rounded-2xl font-bold transition-all shadow-lg"
          >
            Đến trang Quản trị (Admin)
          </a>
        </div>
      </div>
    );
  }

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

      <div className="w-full max-w-[1200px] flex gap-12 relative z-10">
        {/* Left Side: Marketing/Info */}
        <div className="hidden lg:flex flex-col justify-center w-1/2 pr-10">
          <Link href="/" className="inline-flex items-center gap-3 group mb-12">
            <Globe className="text-accent-500 w-8 h-8" />
            <span className="font-heading font-black text-3xl tracking-tight text-white drop-shadow-lg">
              Cybertron<span className="text-accent-500 italic">Hotel</span>
            </span>
          </Link>
          
          <h1 className="text-5xl font-heading font-bold text-white mb-6 leading-tight">
            Trở thành <span className="text-accent-500">Đối tác</span> của chúng tôi
          </h1>
          <p className="text-brand-200 text-lg mb-10 leading-relaxed">
            Tiếp cận hàng triệu khách hàng tiềm năng. Quản lý chỗ nghỉ dễ dàng, tăng doanh thu mạnh mẽ với hệ sinh thái công nghệ tiên tiến nhất.
          </p>

          <div className="space-y-6">
            {[
              "Mức hoa hồng cạnh tranh nhất thị trường",
              "Công cụ quản lý phòng & giá thông minh",
              "Thống kê doanh thu theo thời gian thực",
              "Hỗ trợ đối tác 24/7 chuyên nghiệp"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 text-white">
                <div className="w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-accent-500" />
                </div>
                <span className="font-medium text-lg text-brand-100">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 max-w-[500px] mx-auto lg:mx-0">
          <div className="bg-white/10 dark:bg-brand-900/60 backdrop-blur-2xl rounded-[40px] p-8 md:p-12 shadow-2xl border border-white/20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-accent-500/20 rounded-xl flex items-center justify-center text-accent-500">
                <Building2 className="w-6 h-6" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-white">
                Đăng ký Chỗ nghỉ
              </h2>
            </div>

            {error && (
              <div className="mb-6 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-brand-400 tracking-[0.2em] uppercase ml-1">Tên khách sạn / Chỗ nghỉ</label>
                <Input
                  required
                  placeholder="VD: Cybertron Resort & Spa"
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-brand-500 h-12 rounded-2xl focus:border-accent-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-brand-400 tracking-[0.2em] uppercase ml-1">Họ và Tên chủ sở hữu</label>
                <Input
                  required
                  placeholder="VD: Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-brand-500 h-12 rounded-2xl focus:border-accent-500/50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-brand-400 tracking-[0.2em] uppercase ml-1">Email</label>
                  <Input
                    required
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-brand-500 h-12 rounded-2xl focus:border-accent-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-brand-400 tracking-[0.2em] uppercase ml-1">Số điện thoại</label>
                  <Input
                    required
                    placeholder="VD: 0987654321"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-brand-500 h-12 rounded-2xl focus:border-accent-500/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-brand-400 tracking-[0.2em] uppercase ml-1">Mật khẩu (Trang quản trị)</label>
                <Input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-brand-500 h-12 rounded-2xl focus:border-accent-500/50"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 mt-4 text-base rounded-2xl font-bold shadow-xl shadow-accent-500/20 transition-all"
              >
                {loading ? "Đang xử lý..." : "Hoàn tất đăng ký"}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-brand-400">
              Bạn đã là đối tác?{" "}
              <a href="http://localhost:3000/login" className="font-bold text-accent-500 hover:underline">
                Đăng nhập Admin
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
