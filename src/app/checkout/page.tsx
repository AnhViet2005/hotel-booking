"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getPublicHotelById, createBooking, getUser, confirmBooking } from "@/utils/api";
import { formatCurrency } from "@/utils/format";
import { Hotel, Room } from "@/types/hotel";
import { Button } from "@/components/ui/Button";
import PaymentForm from "@/components/order/PaymentForm";
import BookingSummary from "@/components/order/BookingSummary";
import { Loader2 } from "lucide-react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawHotelId = searchParams.get("hotelId");
  const rawRoomsParam = searchParams.get("rooms"); // New format: "id1:qty1,id2:qty2"
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const adults = searchParams.get("adults") || "2";
  const children = searchParams.get("children") || "0";
  
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<{room: Room, quantity: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rawHotelId || !rawRoomsParam) {
      setLoading(false);
      return;
    }

    setLoading(true);
    getPublicHotelById(rawHotelId)
      .then((data) => {
        setHotel(data);
        // Parse "id:qty,id:qty"
        const roomPairs = rawRoomsParam.split(",");
        const selections = roomPairs.map(pair => {
            const [id, qty] = pair.split(":");
            const foundRoom = data.rooms?.find(r => r.id.toString() === id);
            return foundRoom ? { room: foundRoom, quantity: parseInt(qty) } : null;
        }).filter((item): item is {room: Room, quantity: number} => item !== null);
        
        setSelectedRooms(selections);
      })
      .catch((err) => {
        console.error("Failed to load hotel", err);
        setHotel(null);
        setSelectedRooms([]);
      })
      .finally(() => setLoading(false));
  }, [rawHotelId, rawRoomsParam]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-12 flex flex-col items-center justify-center text-center">
        <Loader2 className="w-12 h-12 animate-spin text-accent-500 mb-4" />
        <h2 className="text-xl font-medium text-muted-foreground">Đang tải thông tin đặt phòng...</h2>
      </div>
    );
  }

  if (!hotel || selectedRooms.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-12 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4">Ops! Yêu cầu đặt phòng không hợp lệ.</h1>
        <Button onClick={() => router.push("/")}>Quay lại trang chủ</Button>
      </div>
    );
  }

  const getNights = () => {
    if (!checkIn || !checkOut) return 1;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  };

  const nights = getNights();
  const tax = 100000;
  const subtotal = selectedRooms.reduce((sum, item) => sum + (item.room.price * item.quantity), 0) * nights;
  const total = subtotal + tax;

  const handlePay = async (e: React.FormEvent, method: string) => {
    e.preventDefault();
    try {
      const user = getUser();
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const bookingId = await createBooking({
        hotelId: Number(hotel.id),
        rooms: selectedRooms.map(s => ({ roomTypeId: s.room.id, quantity: s.quantity })),
        checkIn: checkIn || today.toISOString().split("T")[0],
        checkOut: checkOut || tomorrow.toISOString().split("T")[0],
        guestName: user?.fullName || "Khách",
        guestEmail: user?.email || "",
        guestPhone: "0123456789",
      });

      if (method === "CASH") {
        await confirmBooking(bookingId);
        router.push("/dashboard/bookings?success=true");
        return;
      }

      const depositAmount = Math.round(total * 0.3);
      const returnUrl = encodeURIComponent(`${window.location.origin}/payment-result`);
      const res = await fetch(`http://localhost:4000/payment?amount=${depositAmount}&orderInfo=Booking_${bookingId}&returnUrl=${returnUrl}`);
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Không thể khởi tạo thanh toán VNPay!");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi đặt phòng. Vui lòng kiểm tra lại đăng nhập hoặc thông tin!");
    }
  };

  return (
    <div className="bg-brand-50 dark:bg-brand-950 min-h-screen pt-32 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12">
          <div className="text-accent-500 font-bold tracking-[0.2em] uppercase text-xs mb-3">Quy trình an toàn</div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-brand-900 dark:text-white mb-4">Thanh Toán An Toàn</h1>
          <p className="text-brand-600 dark:text-brand-400 text-lg">Vui lòng kiểm tra lại thông tin chi tiết trước khi hoàn tất đặt phòng.</p>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-12 items-start">
          <div className="flex-1">
            <PaymentForm total={total} handlePay={handlePay} />
          </div>

          <div className="w-full lg:w-96 flex-shrink-0">
             {/* Note: Update BookingSummary component to handle multiple rooms if necessary, or just show aggregate */}
             <div className="bg-card rounded-3xl p-6 border border-border shadow-lg space-y-6">
                <h3 className="font-bold text-xl mb-4">Tổng quan đơn hàng</h3>
                {selectedRooms.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span>{item.room.name} (x{item.quantity})</span>
                    <span className="font-bold">{formatCurrency(item.room.price * item.quantity * nights)}</span>
                  </div>
                ))}
                <div className="border-t border-dashed pt-4 flex justify-between font-medium text-muted-foreground">
                   <span>Thuế & phí</span>
                   <span>{formatCurrency(tax)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between items-center">
                   <span className="font-bold">Tổng cộng</span>
                   <span className="text-2xl font-bold text-accent-600">{formatCurrency(total)}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 pb-12 flex items-center justify-center">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
