import type { Metadata } from "next";
import { Star, MapPin, ArrowRight, Crown } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Khách Sạn Nổi Bật - CybertronHotel",
  description: "Danh sách các khách sạn được khách hàng yêu thích và đánh giá cao nhất.",
};

const featured = [
  { id: 1, name: "InterContinental Hanoi Landmark72", city: "Hà Nội", rating: 4.9, reviews: 2341, price: 4500000, badge: "Tốt nhất Hà Nội", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80" },
  { id: 2, name: "Park Hyatt Saigon", city: "TP. HCM", rating: 4.8, reviews: 1876, price: 6200000, badge: "5 Sao", img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80" },
  { id: 3, name: "Fusion Maia Da Nang", city: "Đà Nẵng", rating: 4.9, reviews: 1543, price: 5800000, badge: "Bãi biển riêng", img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80" },
  { id: 4, name: "Anantara Hoi An Resort", city: "Hội An", rating: 4.7, reviews: 982, price: 3900000, badge: "Di sản", img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80" },
  { id: 5, name: "JW Marriott Phu Quoc", city: "Phú Quốc", rating: 4.9, reviews: 2104, price: 7500000, badge: "Đảo ngọc", img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80" },
  { id: 6, name: "Vinpearl Luxury Nha Trang", city: "Nha Trang", rating: 4.8, reviews: 1720, price: 4200000, badge: "Ven biển", img: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80" },
];

function formatCurrency(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

export default function FeaturedHotelsPage() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((hotel) => (
            <Link href={`/hotel/${hotel.id}`} key={hotel.id}
              className="group bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-52 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={hotel.img} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <span className="absolute top-3 left-3 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">{hotel.badge}</span>
              </div>
              <div className="p-5">
                <h2 className="font-heading text-lg font-bold text-card-foreground mb-1 line-clamp-1">{hotel.name}</h2>
                <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                  <MapPin className="w-3 h-3" /> {hotel.city}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-card-foreground">{hotel.rating}</span>
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
      </div>
    </main>
  );
}
