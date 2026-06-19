"use client";

import { useState, useEffect } from "react";
import { Camera, Lock, Save, ShieldCheck, User as UserIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getMyProfile, updateSettings } from "@/utils/api";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    getMyProfile().then(data => {
      if ((data as any).avatarUrl) setAvatarPreview((data as any).avatarUrl);
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

    if (!avatarFile && !newPassword) {
      setError("Vui lòng chọn ảnh mới hoặc nhập mật khẩu để thay đổi.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      if (currentPassword) formData.append("currentPassword", currentPassword);
      if (newPassword) formData.append("newPassword", newPassword);
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await updateSettings(formData);
      setSuccess("Cập nhật thông tin thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
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
    <div>
      <div className="mb-10">
        <div className="text-accent-500 font-bold tracking-[0.2em] uppercase text-xs mb-3">
          Quản lý tài khoản
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-brand-900 dark:text-white mb-2">
          Cài Đặt
        </h1>
        <p className="text-brand-600 dark:text-brand-400 text-lg">
          Cập nhật thông tin cá nhân và bảo mật tài khoản của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Avatar Section */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-[32px] p-8 shadow-xl border border-border text-center">
            <h3 className="font-heading font-bold text-lg mb-6 flex items-center justify-center gap-2">
              <UserIcon className="w-5 h-5 text-accent-500" />
              Ảnh đại diện
            </h3>
            
            <div className="relative w-32 h-32 mx-auto mb-6 group">
              <div className="w-full h-full bg-muted rounded-full flex items-center justify-center text-4xl font-bold text-muted-foreground border-4 border-background shadow-lg overflow-hidden relative">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-16 h-16 opacity-20" />
                )}
              </div>
              
              <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all backdrop-blur-sm">
                <Camera className="w-8 h-8 text-white" />
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
              
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center text-white border-4 border-background shadow-lg hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground mb-6">
              Định dạng hỗ trợ: JPG, PNG, GIF. Kích thước tối đa 2MB.
            </p>
          </div>
        </div>

        {/* Password Section */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-[32px] p-8 md:p-10 shadow-xl border border-border">
            <h3 className="font-heading text-2xl font-bold mb-8 flex items-center gap-3 text-card-foreground">
              <span className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-accent-500 text-sm font-black">
                <Lock className="w-4 h-4" />
              </span>
              Bảo mật mật khẩu
            </h3>

            <form onSubmit={handleSave}>
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-xs font-black text-muted-foreground tracking-[0.2em] uppercase mb-3">
                    Mật khẩu hiện tại
                  </label>
                  <Input 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Nhập mật khẩu hiện tại" 
                    className="rounded-xl bg-muted/50 border-border h-14" 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-muted-foreground tracking-[0.2em] uppercase mb-3">
                      Mật khẩu mới
                    </label>
                    <Input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mật khẩu mới (tối thiểu 8 ký tự)" 
                      className="rounded-xl bg-muted/50 border-border h-14" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-muted-foreground tracking-[0.2em] uppercase mb-3">
                      Xác nhận mật khẩu
                    </label>
                    <Input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới" 
                      className="rounded-xl bg-muted/50 border-border h-14" 
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-600 dark:text-green-400">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="font-medium text-sm">{success}</span>
                </div>
              )}

              <div className="flex justify-end pt-6 border-t border-border">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="h-14 px-10 rounded-2xl font-bold shadow-xl shadow-accent-500/20"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Đang lưu...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save className="w-5 h-5" />
                      Lưu thay đổi
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
