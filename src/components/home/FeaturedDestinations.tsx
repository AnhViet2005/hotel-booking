"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPublicBanners } from "@/utils/api";

const STATIC_FEATURED = [
  { title: "Sapa", subtitle: "Lào Cai, Việt Nam", imageUrl: "https://images.unsplash.com/photo-1598285521151-c4391694f488?w=800&q=80", linkUrl: "" },
  { title: "Đà Lạt", subtitle: "Lâm Đồng, Việt Nam", imageUrl: "https://images.unsplash.com/photo-1549474843-ed839ec15f91?w=800&q=80", linkUrl: "" },
  { title: "Phú Quốc", subtitle: "Kiên Giang, Việt Nam", imageUrl: "https://images.unsplash.com/photo-1589394815804-964ed0bc2eb5?w=800&q=80", linkUrl: "" },
  { title: "Hạ Long", subtitle: "Quảng Ninh, Việt Nam", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80", linkUrl: "" },
];

export default function FeaturedDestinations() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getPublicBanners();
        if (data && data.length > 0) {
          setBanners(data);
        } else {
          setBanners(STATIC_FEATURED);
        }
      } catch (error) {
        setBanners(STATIC_FEATURED);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  return (
    <section className="py-24 bg-background transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <div className="text-accent-500 font-bold tracking-[0.2em] uppercase text-xs mb-3">Trải nghiệm đẳng cấp</div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">Khách Sạn Nổi Bật</h2>
          </div>
          <Link href="/search" className="hidden sm:flex items-center gap-2 text-foreground font-bold hover:text-accent-500 transition-colors bg-muted px-6 py-3 rounded-2xl border border-border">
            Xem tất cả <span className="text-accent-500">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse"></div>
            ))
          ) : (
            banners.map((banner, i) => {
              const searchLink = banner.linkUrl || `/search?keyword=${encodeURIComponent(banner.title)}`;
              return (
                <Link 
                  href={searchLink} 
                  key={i} 
                  className="group relative h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 block"
                >
                  <img 
                    src={banner.imageUrl} 
                    alt={banner.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-heading font-bold text-white mb-1">{banner.title}</h3>
                    <p className="text-white/80 text-sm font-medium">{banner.subtitle}</p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
