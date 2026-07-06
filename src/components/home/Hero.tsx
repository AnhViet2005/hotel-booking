"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Star } from "lucide-react";
import LocationSelect from "../search/LocationSelect";
import DateSelect, { DateConfig } from "../search/DateSelect";
import GuestSelect, { GuestConfig } from "../search/GuestSelect";
import { cn } from "@/utils/cn";

import { getPublicBanners } from "@/utils/api";
import { useEffect } from "react";

export default function Hero() {
  const router = useRouter();
  const [banners, setBanners] = useState<any[]>([]);
  const [currentBanner, setCurrentBanner] = useState<any>(null);
  const [location, setLocation] = useState("");
  const [dateConfig, setDateConfig] = useState<DateConfig>({
    mode: "calendar",
    dateRange: { start: null, end: null },
    flexible: { stayLength: "weekend", months: [] },
  });
  const [guests, setGuests] = useState<GuestConfig>({
    adults: 2,
    children: 0,
    rooms: 1,
    isBusinessTrip: false,
    bringsPet: false,
  });

  useEffect(() => {
    getPublicBanners().then(data => {
      if (data && data.length > 0) {
        setBanners(data);
        setCurrentBanner(data[0]);
      }
    }).catch(console.error);
  }, []);

  // Auto-play banners every 3 seconds
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev: any) => {
        const currentIndex = banners.findIndex(b => b.id === prev.id);
        const nextIndex = (currentIndex + 1) % banners.length;
        return banners[nextIndex];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [banners]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    params.append("adults", guests.adults.toString());
    params.append("children", guests.children.toString());
    params.append("rooms", guests.rooms.toString());
    
    if (dateConfig.mode === "calendar") {
      if (dateConfig.dateRange.start) {
        params.append("checkIn", dateConfig.dateRange.start.toISOString().split('T')[0]);
      }
      if (dateConfig.dateRange.end) {
        params.append("checkOut", dateConfig.dateRange.end.toISOString().split('T')[0]);
      }
    }
    
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-background z-20"></div>
        
        {/* Banner Images with Cross-fade */}
        {banners.map((banner, index) => {
          const isActive = currentBanner?.id === banner.id;
          return (
            <div 
              key={banner.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              )}
            >
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                className={cn(
                  "object-cover scale-105 transition-transform duration-[4000ms] ease-out",
                  isActive ? "scale-100" : "scale-105"
                )}
                priority={index === 0}
                unoptimized
              />
            </div>
          );
        })}

        {/* Fallback if no banners */}
        {banners.length === 0 && (
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Hotel"
            fill
            className="object-cover scale-105"
            priority
            unoptimized
          />
        )}
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 mt-10 w-full text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-accent-400 text-sm font-bold tracking-widest uppercase mb-8 animate-fade-in">
          <Star className="w-4 h-4 fill-accent-400" />
          Trải nghiệm đẳng cấp 5 sao
        </div>
        <h1 className="font-heading text-6xl md:text-8xl font-bold text-white mb-8 drop-shadow-2xl leading-[1.1] animate-slide-up">
          Trải Nghiệm Kì Nghỉ <br />
          <span className="text-gradient">Hoàn Hảo</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/80 mb-14 max-w-3xl mx-auto font-medium leading-relaxed animate-fade-in-delayed">
          Trải nghiệm kỳ nghỉ tuyệt vời nhất tại điểm đến mơ ước của bạn.
        </p>
        
        {/* Interactive Search Component */}
        <div className="bg-white/10 backdrop-blur-xl p-3 rounded-[40px] w-full max-w-[1100px] mx-auto shadow-2xl border border-white/10">
          <form onSubmit={handleSearch} className="bg-card rounded-[32px] flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-border p-2 shadow-sm">
            
            <LocationSelect location={location} setLocation={setLocation} />
            
            <DateSelect dateConfig={dateConfig} setDateConfig={setDateConfig} />
            
            <GuestSelect guests={guests} setGuests={setGuests} />

            <div className="p-1 w-full md:w-auto">
              <button type="submit" className="w-full md:w-auto bg-accent-500 hover:bg-accent-600 text-white rounded-[24px] px-8 py-5 flex items-center justify-center transition-all shadow-xl shadow-accent-500/30 hover:scale-[1.02] active:scale-[0.98]">
                <Search className="w-5 h-5 stroke-[3px]" />
                <span className="ml-3 font-bold text-lg">Tìm ngay</span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </section>
  );
}
