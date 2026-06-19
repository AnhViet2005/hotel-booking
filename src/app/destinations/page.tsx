import type { Metadata } from "next";
import { MapPin, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Điểm đến - CybertronHotel",
  description: "Khám phá các điểm đến du lịch nổi tiếng trên khắp Việt Nam và thế giới.",
};

const destinations = [
  { name: "Hà Nội", img: "https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=600&q=80", hotels: 124, desc: "Thủ đô ngàn năm văn hiến với phố cổ sầm uất và ẩm thực độc đáo." },
  { name: "TP. Hồ Chí Minh", img: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80", hotels: 218, desc: "Thành phố năng động nhất Việt Nam với nhịp sống sôi động không ngủ." },
  { name: "Đà Nẵng", img: "https://images.unsplash.com/photo-1559592413-7cbb3484eeb3?w=600&q=80", hotels: 97, desc: "Thành phố đáng sống với những bãi biển trải dài xanh ngắt." },
  { name: "Hội An", img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80", hotels: 63, desc: "Phố cổ di sản thế giới với những chiếc đèn lồng rực rỡ đêm đêm." },
  { name: "Phú Quốc", img: "https://images.unsplash.com/photo-1573790387438-4da905039392?w=600&q=80", hotels: 89, desc: "Đảo ngọc thiên đường với làn nước trong vắt và bãi cát trắng mịn." },
  { name: "Nha Trang", img: "https://images.unsplash.com/photo-1583417267826-aebc4d1542e1?w=600&q=80", hotels: 76, desc: "Thành phố biển nổi tiếng với những resort 5 sao đẳng cấp quốc tế." },
];

export default function DestinationsPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-accent-600 to-accent-800 text-white py-20 mb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-white/20">
            <MapPin className="w-4 h-4" /> Khám phá điểm đến
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6">Điểm Đến Trong Mơ</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Từ phố cổ yên bình đến bãi biển nhiệt đới, hãy để chúng tôi đưa bạn đến những điểm đến tuyệt vời nhất.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest) => (
            <Link href={`/?destination=${encodeURIComponent(dest.name)}`} key={dest.name}
              className="group bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-56 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={dest.img} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h2 className="font-heading text-2xl font-bold">{dest.name}</h2>
                  <div className="flex items-center gap-1 text-sm text-white/80">
                    <MapPin className="w-3 h-3" /> {dest.hotels} khách sạn
                  </div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{dest.desc}</p>
                <div className="flex items-center gap-1 text-accent-500 font-semibold text-sm group-hover:gap-2 transition-all">
                  Khám phá ngay <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
