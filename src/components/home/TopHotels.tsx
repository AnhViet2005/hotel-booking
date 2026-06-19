import Link from "next/link";
import { Hotel } from "@/types/hotel";
import HotelCard from "@/components/room/HotelCard";

interface TopHotelsProps {
  hotels: Hotel[];
}

export default function TopHotels({ hotels }: TopHotelsProps) {
  return (
    <section className="py-24 bg-muted/30 transition-colors border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-accent-500 font-bold tracking-[0.2em] uppercase text-xs mb-3">Lựa chọn hàng đầu</div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">Khách Sạn Được Đánh Giá Cao</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">Những kỳ lưu trú sang trọng được tuyển chọn kỹ lưỡng mang lại trải nghiệm tuyệt vời nhất cho quý khách.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.slice(0, 3).map(hotel => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Link href="/search" className="inline-flex items-center justify-center h-14 px-10 rounded-2xl bg-foreground text-background font-bold hover:opacity-90 transition-all shadow-xl shadow-foreground/10 active:scale-95">
            Khám phá thêm khách sạn
          </Link>
        </div>
      </div>
    </section>
  );
}
