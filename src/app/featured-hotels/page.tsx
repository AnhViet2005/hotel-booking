"use client";

import { useEffect, useState } from "react";
import { Star, MapPin, Crown, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/utils/format";
import { getPublicHotels } from "@/utils/api";
import type { Hotel } from "@/types/hotel";

interface FeaturedHotel extends Hotel {
  badge?: string;
}

export default function FeaturedHotelsPage() {
  const [featured, setFeatured] = useState<FeaturedHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedHotels = async () => {
      try {
        setLoading(true);
        const hotels = await getPublicHotels();
        
        // Map API response to featured hotels format and sort by rating
        const featuredHotels: FeaturedHotel[] = hotels
          .map((hotel) => ({
            ...hotel,
            badge: hotel.rating >= 4.8 ? "Tốt nhất" : hotel.rating >= 4.5 ? "5 Sao" : "Nổi bật",
          }))
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 6);
        
        setFeatured(featuredHotels);
      } catch (err) {
        console.error("Failed to fetch hotels:", err);
        setError("Không thể tải danh sách khách sạn. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedHotels();
  }, []);
  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="relative bg-gradient-to-br from-amber-500 to-orange-600 text-white py-20 mb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1600&q=80')] bg-cover bg-center opacity-15" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-white/20">
            <Crown className="w-4 h-4" /> Lựa chọn hàng đầu
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6">Khách Sạn Nổi Bật</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Những khách sạn được khách hàng đánh giá cao nhất, mang đến trải nghiệm lưu trú hoàn hảo.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent-500" />
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg text-center">
            {error}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            Không tìm thấy khách sạn nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((hotel) => (
              <Link href={`/hotel/${hotel.id}`} key={hotel.id}
                className="group bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-52 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={hotel.image || "https://via.placeholder.com/600x400"} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <span className="absolute top-3 left-3 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">{hotel.badge}</span>
                </div>
                <div className="p-5">
                  <h2 className="font-heading text-lg font-bold text-card-foreground mb-1 line-clamp-1">{hotel.name}</h2>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                    <MapPin className="w-3 h-3" /> {hotel.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-card-foreground">{hotel.rating?.toFixed(1) || "N/A"}</span>
                      <span className="text-muted-foreground text-xs">({hotel.reviews})</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Từ</div>
                      <div className="font-bold text-accent-500 text-sm">{formatCurrency(hotel.price)}<span className="text-xs text-muted-foreground font-normal">/đêm</span></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
