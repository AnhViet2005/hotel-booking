import Image from "next/image";
import { MapPin, Check } from "lucide-react";
import { Hotel, Room } from "@/types/hotel";
import { formatCurrency } from "@/utils/format";
import { getImageUrl } from "@/utils/image";

interface BookingSummaryProps {
  hotel: Hotel;
  room: Room;
  tax: number;
  total: number;
  nights: number;
  quantity: number;
}

export default function BookingSummary({ hotel, room, tax, total, nights, quantity }: BookingSummaryProps) {
  return (
    <div className="bg-card rounded-[32px] p-8 shadow-2xl border border-border sticky top-28">
      <h3 className="font-heading text-xl font-bold text-card-foreground mb-8 pb-4 border-b border-border">Tóm tắt đơn hàng</h3>
      
      <div className="mb-8">
        <div className="relative h-48 rounded-2xl overflow-hidden mb-6 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={getImageUrl(hotel.image, "https://images.unsplash.com/photo-1542314831-c6a4d14d8c53?w=800&q=80")} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        </div>
        <h4 className="font-heading font-bold text-xl text-card-foreground mb-2">{hotel.name}</h4>
        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <MapPin className="w-4 h-4 mr-1.5 text-accent-500" /> {hotel.location}
        </div>
        
        <div className="p-5 bg-muted rounded-2xl border border-border">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-card-foreground line-clamp-1">{room.name}</span>
            <span className="text-[10px] font-black bg-card px-2 py-1 rounded-md text-accent-600 dark:text-accent-400 shadow-sm border border-accent-500/10 tracking-widest flex-shrink-0 ml-2">{room.capacity} KHÁCH</span>
          </div>
          {quantity > 1 && (
            <div className="text-xs font-bold text-accent-600 mb-2">Số lượng: {quantity} phòng</div>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <Check className="w-4 h-4 text-green-500" /> Hủy miễn phí trước 24h
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8 border-b border-border pb-8">
        <div className="flex justify-between text-muted-foreground gap-4">
          <span className="font-medium whitespace-nowrap">Giá phòng ({nights} đêm)</span>
          <span className="font-bold text-card-foreground text-right">{formatCurrency(room.price * nights * quantity)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground gap-4">
          <span className="font-medium">Thuế & Phí dịch vụ</span>
          <span className="font-bold text-card-foreground text-right">{formatCurrency(tax)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center text-xl mb-4">
        <span className="font-bold text-card-foreground">Tổng cộng</span>
        <span className="font-heading font-bold text-2xl text-card-foreground">{formatCurrency(total)}</span>
      </div>
      <div className="flex justify-between items-center text-xl pt-4 border-t border-border">
        <span className="font-bold text-accent-500">Cọc (30%)</span>
        <span className="font-heading font-bold text-3xl text-accent-500">{formatCurrency(total * 0.3)}</span>
      </div>
    </div>
  );
}
