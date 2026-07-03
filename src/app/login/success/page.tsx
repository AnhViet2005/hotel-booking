"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveAuth } from "@/utils/api";

export default function LoginSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // 1. Save token first to allow getMyProfile to work
      localStorage.setItem("token", token);
      
      // 2. Fetch profile and save full auth info
      import("@/utils/api").then(api => {
        api.getMyProfile().then(profile => {
          api.saveAuth({
            token,
            email: profile.email,
            fullName: profile.fullName,
            role: profile.role,
            phone: profile.phone,
            id: profile.id
          });
          router.push("/");
        }).catch(err => {
          console.error("Failed to fetch profile", err);
          router.push("/login?error=profile_fetch_failed");
        });
      });
    } else {
      router.push("/login?error=oauth2_failed");
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-950">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-white mb-2">Đang xác thực...</h2>
        <p className="text-brand-400">Vui lòng chờ trong giây lát</p>
      </div>
    </div>
  );
}
