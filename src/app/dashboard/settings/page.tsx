"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Camera, Lock, Save, ShieldCheck, User as UserIcon, AlertCircle, Phone, Mail, BadgeCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getMyProfile, updateSettings } from "@/utils/api";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    getMyProfile().then(data => {
      const profile = data as any;
      if (profile.fullName) setFullName(profile.fullName);
      if (profile.email) setEmail(profile.email);
      if (profile.phone) setPhone(profile.phone);
      if (profile.avatarUrl) setAvatarPreview(profile.avatarUrl);
    }).catch(console.error);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (newPassword && newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (!avatarFile && !newPassword && !fullName && !email && !phone) {
      setError("Vui lòng thay đổi ít nhất một thông tin.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      if (fullName) formData.append("fullName", fullName);
      if (email) formData.append("email", email);
      if (phone) formData.append("phone", phone);
      if (currentPassword) formData.append("currentPassword", currentPassword);
      if (newPassword) formData.append("newPassword", newPassword);
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await updateSettings(formData);
      setSuccess("Cập nhật thông tin thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({
        ...user,
        fullName: res.fullName || fullName,
        email: res.email || email,
        phone: res.phone || phone,
      }));
      
      if (email && email !== user.email) {
          alert("Email đã thay đổi. Vui lòng ghi nhớ email mới để đăng nhập lần sau.");
      }

      if (res.avatarUrl) {
        setAvatarPreview(res.avatarUrl);
        setAvatarFile(null);
      }

      setTimeout(() => setSuccess(""), 5000);
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- HERO SECTION --- */}
      <div className="relative mb-24">
        <div className="h-48 md:h-64 overflow-hidden rounded-[40px] bg-gradient-to-br from-brand-900 via-brand-800 to-accent-600 relative border border-white/10 shadow-2xl shadow-brand-900/40">
            {/* Background patterns */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                 style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
            
            <div className="absolute inset-0 flex items-center px-12 md:px-20">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-4">
                        <BadgeCheck className="w-4 h-4 text-accent-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Account Control</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-heading font-black text-white leading-tight">
                        Cài Đặt <span className="text-accent-400 font-normal">.</span>
                    </h1>
                </div>
            </div>
        </div>

        {/* --- Floating Avatar --- */}
        <div className="absolute -bottom-16 left-12 md:left-20 flex items-end gap-6">
            <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-[32px] border-8 border-background bg-muted shadow-2xl overflow-hidden flex items-center justify-center relative ring-1 ring-border">
                    {avatarPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <UserIcon className="w-16 h-16 opacity-10" />
                    )}
                    
                    {/* Hover Overlay */}
                    <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all backdrop-blur-[2px]">
                        <Camera className="w-8 h-8 text-white mb-2" />
                        <span className="text-[10px] font-black text-white uppercase tracking-wider">Change Photo</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                </div>
                <button 
                  type="button"
                  onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                  className="absolute -bottom-2 -right-2 w-12 h-12 bg-accent-500 rounded-2xl flex items-center justify-center text-white border-4 border-background shadow-xl hover:scale-110 transition-all hover:bg-accent-600"
                >
                    <Camera className="w-5 h-5" />
                </button>
            </div>
            
            <div className="pb-4 hidden sm:block">
                <h2 className="text-2xl font-heading font-black text-brand-900 dark:text-white leading-none mb-2">{fullName || "Thành viên"}</h2>
                <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-accent-500/10 text-accent-600 text-[10px] font-black uppercase tracking-tighter border border-accent-500/20">Active User</span>
                    <span className="w-1 h-1 rounded-full bg-brand-300" />
                    <span className="text-xs text-muted-foreground font-medium">{email}</span>
                </div>
            </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12">
        {/* --- Main Area --- */}
        <div className="md:col-span-8 space-y-8">
            {/* PERSONAL INFO CARD */}
            <div className="bg-card rounded-[40px] p-8 md:p-12 shadow-2xl shadow-brand-900/5 border border-border relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                
                <div className="relative">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-accent-500/10 rounded-2xl flex items-center justify-center text-accent-500 border border-accent-500/20">
                            <UserIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-heading font-black text-brand-900 dark:text-white">Thông tin cơ bản</h3>
                            <p className="text-sm text-muted-foreground">Thông tin công cộng của bạn trên hệ thống.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black text-muted-foreground tracking-widest uppercase ml-1">
                                <UserIcon className="w-3 h-3" /> Họ và tên đầy đủ
                            </label>
                            <Input 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Nhập họ tên đầy đủ" 
                                className="rounded-[20px] bg-muted/20 border-border h-16 text-base font-bold focus:bg-card transition-all" 
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black text-muted-foreground tracking-widest uppercase ml-1">
                                    <Mail className="w-3 h-3" /> Địa chỉ Email
                                </label>
                                <Input 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com" 
                                    className="rounded-[20px] bg-muted/20 border-border h-16 text-base font-bold focus:bg-card transition-all" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black text-muted-foreground tracking-widest uppercase ml-1">
                                    <Phone className="w-3 h-3" /> Số điện thoại
                                </label>
                                <Input 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="09xx xxx xxx" 
                                    className="rounded-[20px] bg-muted/20 border-border h-16 text-base font-bold focus:bg-card transition-all" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PASSWORD CARD */}
            <div className="bg-card rounded-[40px] p-8 md:p-12 shadow-2xl shadow-brand-900/5 border border-border relative overflow-hidden">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 border border-red-500/20">
                        <Lock className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-heading font-black text-brand-900 dark:text-white">Bảo mật & Mật khẩu</h3>
                        <p className="text-sm text-muted-foreground">Thay đổi mật khẩu thường xuyên để bảo vệ tài khoản.</p>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="space-y-2">
                        <label className="block text-xs font-black text-muted-foreground tracking-widest uppercase ml-1">Mật khẩu hiện tại</label>
                        <Input 
                            type="password" 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••••••" 
                            className="rounded-[20px] bg-muted/20 border-border h-16 text-base font-bold focus:bg-card transition-all" 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="block text-xs font-black text-muted-foreground tracking-widest uppercase ml-1">Mật khẩu mới</label>
                            <Input 
                                type="password" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Tối thiểu 8 ký tự" 
                                className="rounded-[20px] bg-muted/20 border-border h-16 text-base font-bold focus:bg-card transition-all" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs font-black text-muted-foreground tracking-widest uppercase ml-1">Xác nhận mật khẩu</label>
                            <Input 
                                type="password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu mới" 
                                className="rounded-[20px] bg-muted/20 border-border h-16 text-base font-bold focus:bg-card transition-all" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- Sidebar Area (Submit & Feedback) --- */}
        <div className="md:col-span-4 space-y-8">
            <div className="bg-card rounded-[40px] p-8 shadow-2xl shadow-brand-900/5 border border-border sticky top-32">
                <h4 className="font-heading font-black text-lg mb-6">Trạng thái lưu</h4>
                
                <div className="space-y-6">
                    {/* Status badges */}
                    {!error && !success && (
                        <div className="p-6 rounded-[24px] bg-brand-50/50 border border-brand-100 flex items-center justify-center text-center">
                            <p className="text-xs text-brand-600 font-bold leading-relaxed">Thay đổi thông tin và nhấn Lưu để cập nhật hệ thống.</p>
                        </div>
                    )}

                    {error && (
                        <div className="p-6 rounded-[24px] bg-red-500/10 border border-red-500/20 text-red-600 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p className="text-sm font-bold leading-tight">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="p-6 rounded-[24px] bg-green-500/10 border border-green-500/20 text-green-600 flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p className="text-sm font-bold leading-tight">{success}</p>
                        </div>
                    )}

                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-16 rounded-[20px] font-black text-base shadow-2xl shadow-accent-500/30 overflow-hidden relative group active:scale-95 transition-all text-white bg-accent-500"
                    >
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-white" />
                        ) : (
                            <div className="flex items-center gap-3">
                                <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                Lưu tất cả thay đổi
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-accent-400 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                    </Button>

                    <p className="text-[10px] text-center text-muted-foreground font-black uppercase tracking-[0.2em] pt-4">
                        Secure Encryption Enabled
                    </p>
                </div>
            </div>

            {/* Mini helper card */}
            <div className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-[40px] p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                <h4 className="font-heading font-black text-xl mb-3 relative">Cần trợ giúp?</h4>
                <p className="text-sm text-white/60 mb-6 leading-relaxed relative">Nếu bạn gặp khó khăn trong việc cập nhật thông tin, vui lòng liên hệ đội ngũ hỗ trợ.</p>
                <Link href="/help" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent-400 hover:text-accent-300 transition-colors relative">
                    Customer Support <Save className="w-3 h-3 rotate-[-90deg]" />
                </Link>
            </div>
        </div>
      </form>
    </div>
  );
}
