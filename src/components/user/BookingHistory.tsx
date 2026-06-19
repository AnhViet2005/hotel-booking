import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Hotel as HotelIcon } from "lucide-react";
import { UserBooking } from "@/utils/api";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/utils/format";

interface BookingHistoryProps {
  bookings: UserBooking[];
}

export default function BookingHistory({ bookings }: BookingHistoryProps) {
  return (
    <div className="space-y-6">
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <div key={booking.id} className="bg-card rounded-[32px] overflow-hidden shadow-xl border border-border flex flex-col md:flex-row group hover:border-accent-500/30 transition-all delay-75">
            <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden">
              {booking.hotelImage ? (
                booking.hotelImage.startsWith("http://localhost") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={booking.hotelImage} alt={booking.hotelName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <Image src={booking.hotelImage} alt={booking.hotelName} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                )
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <HotelIcon className="w-14 h-14 text-muted-foreground/20" />
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-lg backdrop-blur-md border ${
                  booking.status === "Sắp tới"
                    ? "bg-green-500/90 text-white border-green-400/20"
                    : "bg-slate-900/90 text-white border-white/10"
                }`}>
                  {booking.status}
                </span>
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-heading font-bold text-2xl text-card-foreground mb-2">{booking.hotelName}</h3>
                    <div className="flex items-center text-sm text-muted-foreground font-medium">
                      <MapPin className="w-4 h-4 mr-1.5 text-accent-500" /> {booking.roomTypeName || booking.hotelCity}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-muted-foreground tracking-widest uppercase mb-1">Mã đặt phòng</p>
                    <p className="font-bold text-card-foreground font-mono">#{booking.id}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8 py-6 my-6 border-y border-border">
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground tracking-[0.2em] uppercase mb-2">Ngày lưu trú</p>
                    <div className="flex items-center gap-2 font-bold text-card-foreground">
                      <Calendar className="w-4 h-4 text-accent-500" />
                      {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-muted-foreground tracking-[0.2em] uppercase mb-1">Tổng tiền</p>
                    <p className="text-xl font-heading font-bold text-card-foreground">{formatCurrency(booking.totalAmount)}</p>
                  </div>
                </div>
                {/* Payment split breakdown */}
                <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-5 space-y-3 mb-2">
                  <p className="text-[10px] font-black text-muted-foreground tracking-[0.2em] uppercase">Phân bổ thanh toán</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                      <span className="text-muted-foreground">Đã cọc qua VNPay (30%)</span>
                    </div>
                    <span className="font-bold text-orange-500">{formatCurrency(booking.depositAmount ?? booking.totalAmount * 0.3)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                      <span className="text-muted-foreground">Thanh toán tại khách sạn (70%)</span>
                    </div>
                    <span className="font-bold text-green-500">{formatCurrency(booking.remainingAmount ?? booking.totalAmount * 0.7)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button className="flex-1 rounded-2xl h-12 font-bold shadow-lg shadow-accent-500/10">Xem chi tiết</Button>
                <Button variant="outline" className="flex-1 rounded-2xl h-12 font-bold border-border text-muted-foreground hover:bg-muted transition-all">Quản lý đặt phòng</Button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-card rounded-[32px] p-20 text-center shadow-xl border border-border">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-8 border border-border">
            <HotelIcon className="w-12 h-12 text-brand-200" />
          </div>
          <h3 className="text-2xl font-bold text-card-foreground mb-3">Bạn chưa có lịch đặt phòng nào</h3>
          <p className="text-muted-foreground max-sm mx-auto mb-10">Bắt đầu hành trình của bạn bằng cách khám phá những khách sạn tuyệt vời của chúng tôi.</p>
          <Link href="/">
            <Button className="rounded-2xl h-14 px-10 font-bold shadow-xl shadow-accent-500/20">Khám phá ngay</Button>
          </Link>
        </div>
      )}
    </div>
  );
}


