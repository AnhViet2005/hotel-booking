"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Hotel as HotelIcon, Loader2, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getMyBookings, getUser, payRemainingBooking, cancelBooking, UserBooking, createReview } from "@/utils/api";
import { formatCurrency } from "@/utils/format";
import { getImageUrl } from "@/utils/image";
import { Star } from "lucide-react";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "Chờ xác nhận", color: "bg-yellow-500/90 text-white border-yellow-400/20" },
  CONFIRMED: { label: "Đã xác nhận",  color: "bg-blue-500/90 text-white border-blue-400/20" },
  COMPLETED: { label: "Hoàn tất",     color: "bg-green-500/90 text-white border-green-400/20" },
  CANCELLED: { label: "Đã hủy",       color: "bg-slate-900/90 text-white border-white/10" },
};

function formatDate(s: string) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<UserBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<number | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [pendingPaymentBooking, setPendingPaymentBooking] = useState<UserBooking | null>(null);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewingBooking, setReviewingBooking] = useState<UserBooking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchBookings = (silent = false) => {
    if (!silent) setLoading(true);
    getMyBookings()
      .then(setBookings)
      .catch(() => { if (!silent) setError("Không thể tải lịch sử đặt phòng. Vui lòng thử lại."); })
      .finally(() => { if (!silent) setLoading(false); });
  };

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push("/login"); return; }

    fetchBookings();
    const interval = setInterval(() => fetchBookings(true), 10000);
    return () => clearInterval(interval);
  }, [router]);

  const handleOpenDetail = (booking: UserBooking) => {
    setSelectedBooking(booking);
    setActionError(null);
  };

  const handleCloseDetail = () => {
    setSelectedBooking(null);
    setActionError(null);
  };

  const handlePayRemainingClick = (booking: UserBooking) => {
    setPendingPaymentBooking(booking);
    setShowPaymentMethodModal(true);
  };

  const handleConfirmPayment = async (method: string) => {
    if (!pendingPaymentBooking) return;
    
    setShowPaymentMethodModal(false);
    setActionError(null);
    setPayingId(pendingPaymentBooking.id);
    
    try {
      if (method === "VNPAY") {
        // VNPay redirect
        const remaining = Math.round(pendingPaymentBooking.totalAmount * 0.7);
        const returnUrl = encodeURIComponent(`${window.location.origin}/payment-result?bookingId=${pendingPaymentBooking.id}&method=VNPAY`);
        const res = await fetch(`http://localhost:4000/payment?amount=${remaining}&orderInfo=Booking_${pendingPaymentBooking.id}_Remaining&returnUrl=${returnUrl}`);
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error("Failed to get payment URL");
        }
      } else {
        // Cash payment
        const updated = await payRemainingBooking(pendingPaymentBooking.id, method);
        setBookings(bs => bs.map(b => b.id === pendingPaymentBooking.id ? updated : b));
        setSelectedBooking(updated);
      }
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Không thể thanh toán phần còn lại. Vui lòng thử lại sau.");
    } finally {
      setPayingId(null);
      setPendingPaymentBooking(null);
    }
  };

  const handleCancelBooking = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn đặt phòng này không?")) return;
    
    setCancellingId(id);
    setActionError(null);
    try {
      const updated = await cancelBooking(id);
      setBookings(bs => bs.map(b => b.id === id ? updated : b));
      setSelectedBooking(updated);
      alert("Đã hủy đơn đặt phòng thành công.");
    } catch (error: any) {
      setActionError(error.message || "Không thể hủy đơn. Vui lòng thử lại sau.");
    } finally {
      setCancellingId(null);
    }
  };

  const handleOpenReview = (booking: UserBooking) => {
    setReviewingBooking(booking);
    setReviewRating(5);
    setReviewComment("");
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!reviewingBooking) return;
    setSubmittingReview(true);
    try {
      await createReview({
        bookingId: reviewingBooking.id,
        rating: reviewRating,
        comment: reviewComment,
      });
      alert("Cảm ơn bạn đã gửi đánh giá!");
      setShowReviewModal(false);
      
      // Update local state to immediately reflect the new review
      setBookings(bs => bs.map(b => b.id === reviewingBooking.id ? {
        ...b,
        hasReview: true,
        reviewRating,
        reviewComment
      } : b));
      
      if (selectedBooking?.id === reviewingBooking.id) {
        setSelectedBooking({
          ...selectedBooking,
          hasReview: true,
          reviewRating,
          reviewComment
        });
      }
    } catch (error: any) {
      alert(error.message || "Không thể gửi đánh giá.");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <>
      <div className="mb-10">
        <div className="text-accent-500 font-bold tracking-[0.2em] uppercase text-xs mb-3">
          Lịch sử
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-brand-900 dark:text-white mb-2">
          Đặt Phòng Của Tôi
        </h1>
        <p className="text-brand-600 dark:text-brand-400 text-lg">
          Quản lý các chuyến đi và lịch sử đặt phòng của bạn.
        </p>
      </div>

      {/* Stats */}
      {!loading && bookings.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Tổng đơn", value: bookings.length },
            { label: "Hoàn tất", value: bookings.filter(b => b.status === "COMPLETED").length },
            { label: "Sắp tới", value: bookings.filter(b => b.status === "CONFIRMED").length },
            { label: "Đã hủy", value: bookings.filter(b => b.status === "CANCELLED").length },
          ].map(stat => (
            <div key={stat.label} className="bg-card rounded-2xl border p-5 shadow-sm text-center">
              <p className="text-3xl font-heading font-bold text-accent-500">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Booking List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-accent-500" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center text-red-600">
          {error}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-card rounded-[32px] p-20 text-center shadow-xl border border-border">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-8 border border-border">
            <HotelIcon className="w-12 h-12 text-muted-foreground/30" />
          </div>
          <h3 className="text-2xl font-bold text-card-foreground mb-3">Bạn chưa có lịch đặt phòng nào</h3>
          <p className="text-muted-foreground mx-auto mb-10 max-w-sm">
            Bắt đầu hành trình của bạn bằng cách khám phá những khách sạn tuyệt vời.
          </p>
          <Link href="/">
            <Button className="rounded-2xl h-14 px-10 font-bold shadow-xl shadow-accent-500/20">
              Khám phá ngay
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {bookings.map((booking) => {
            const status = STATUS_MAP[booking.status] ?? { label: booking.status, color: "bg-muted text-muted-foreground border-border" };
            return (
              <div
                key={booking.id}
                className="bg-card rounded-[32px] overflow-hidden shadow-xl border border-border flex flex-col md:flex-row group hover:border-accent-500/30 transition-all"
              >
                {/* Hotel Image */}
                <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden flex-shrink-0">
                  {booking.hotelImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getImageUrl(booking.hotelImage)}
                      alt={booking.hotelName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <HotelIcon className="w-14 h-14 text-muted-foreground/20" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-lg backdrop-blur-md border ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Booking Info */}
                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-heading font-bold text-xl text-card-foreground mb-1">
                          {booking.hotelName}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {booking.hotelCity && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-accent-500" /> {booking.hotelCity}
                            </span>
                          )}
                          {booking.roomTypeName && (
                            <span className="flex items-center gap-1">
                              <HotelIcon className="w-3.5 h-3.5 text-accent-500" /> {booking.roomTypeName}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-black text-muted-foreground tracking-widest uppercase mb-1">Mã đặt phòng</p>
                        <p className="font-bold text-card-foreground font-mono">{booking.bookingCode}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 py-5 my-4 border-y border-border">
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground tracking-[0.2em] uppercase mb-2">Ngày lưu trú</p>
                        <div className="flex items-center gap-2 font-bold text-card-foreground text-sm">
                          <Calendar className="w-4 h-4 text-accent-500 flex-shrink-0" />
                          {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-muted-foreground tracking-[0.2em] uppercase mb-2">Tổng thanh toán</p>
                        <p className="text-xl font-heading font-bold text-accent-500">
                          {formatCurrency(booking.totalAmount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={() => handleOpenDetail(booking)} className="flex-1 rounded-2xl h-11 font-bold shadow-sm shadow-accent-500/10 text-sm">
                      Xem chi tiết
                    </Button>
                    {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
                      <Button variant="outline" className="flex-1 rounded-2xl h-11 font-bold border-border text-muted-foreground hover:bg-muted text-sm">
                        Quản lý đặt phòng
                      </Button>
                    )}
                    {booking.status === "COMPLETED" && !booking.hasReview && (
                      <Button onClick={() => handleOpenReview(booking)} variant="outline" className="flex-1 rounded-2xl h-11 font-bold border-accent-500 text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-950/20 text-sm">
                        Đánh giá
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
          {selectedBooking && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-card rounded-3xl border shadow-2xl w-full max-w-3xl overflow-hidden">
                <div className="flex items-start justify-between gap-4 p-6 border-b">
                  <div>
                    <h2 className="text-2xl font-heading font-bold">Chi tiết đơn đặt phòng</h2>
                    <p className="text-sm text-muted-foreground">Mã đơn: {selectedBooking.bookingCode}</p>
                  </div>
                  <button onClick={handleCloseDetail} className="rounded-xl p-3 text-muted-foreground hover:bg-muted transition-colors">
                    Đóng
                  </button>
                </div>
                <div className="p-6 grid gap-4 lg:grid-cols-[1fr,320px]">
                  <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {([
                        ["Khách sạn", selectedBooking.hotelName],
                        ["Loại phòng", selectedBooking.roomTypeName ?? "—"],
                        ["Ngày đến", formatDate(selectedBooking.checkIn)],
                        ["Ngày đi", formatDate(selectedBooking.checkOut)],
                        ["Tổng tiền", formatCurrency(selectedBooking.totalAmount)],
                        ["Trạng thái đơn", selectedBooking.status],
                      ] as [string, string][]).map(([label, value]) => (
                        <div key={label} className="rounded-2xl border border-border p-4">
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">{label}</p>
                          <p className="font-semibold text-card-foreground">{value}</p>
                        </div>
                      ))}
                    </div>

                    <div className={`rounded-3xl border p-5 space-y-3 ${selectedBooking.remainingPaymentStatus === "PAID" ? "border-green-200 bg-green-50/50" : "border-slate-200 bg-slate-50"}`}>
                      {selectedBooking.remainingPaymentStatus === "PAID" && (
                        <div className="flex items-center gap-2 mb-2">
                           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                           <span className="text-xs font-black uppercase tracking-widest text-green-600">Đã thanh toán 100%</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Thanh toán cọc (30%)</span>
                        <span className="font-bold text-orange-600">{formatCurrency(selectedBooking.depositAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Thanh toán còn lại (70%)</span>
                        <span className="font-bold text-green-600">{formatCurrency(selectedBooking.remainingAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-dashed border-green-200">
                        <span className="font-bold text-card-foreground">Tổng cộng đã thu</span>
                        <span className={`font-bold text-lg ${selectedBooking.remainingPaymentStatus === "PAID" ? "text-green-600" : "text-orange-600"}`}>
                          {selectedBooking.remainingPaymentStatus === "PAID" ? formatCurrency(selectedBooking.totalAmount) : formatCurrency(selectedBooking.depositAmount)}
                        </span>
                      </div>
                      
                      {selectedBooking.remainingPaymentStatus === "PAID" && (
                        <div className="text-[10px] font-bold text-green-700 bg-green-100/50 px-2 py-1 rounded-md inline-block">
                          Phương thức: {selectedBooking.remainingPaymentMethod === "CASH" ? "Tiền mặt" : selectedBooking.remainingPaymentMethod || "Chuyển khoản"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {actionError && (
                      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {actionError}
                      </div>
                    )}

                    {selectedBooking.status === "CONFIRMED" && selectedBooking.remainingPaymentStatus !== "PAID" ? (
                      <div className="space-y-3">
                        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700">
                          Đơn đã được admin xác nhận cọc 30%. Bạn có thể thanh toán 70% còn lại ngay.
                        </div>
                        <Button
                          onClick={() => handlePayRemainingClick(selectedBooking)}
                          disabled={payingId === selectedBooking.id}
                          className="w-full rounded-2xl bg-green-600 text-white h-14 font-bold hover:bg-green-700 transition-colors"
                        >
                          {payingId === selectedBooking.id ? "Đang xử lý..." : "Thanh toán 70% còn lại"}
                        </Button>
                      </div>
                    ) : selectedBooking.status === "CONFIRMED" && selectedBooking.remainingPaymentStatus === "PAID" ? (
                      <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        Bạn đã thanh toán 70% còn lại. Chủ khách sạn sẽ nhận thông báo để hoàn thành đơn.
                      </div>
                    ) : selectedBooking.status === "PENDING" ? (
                      <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700">
                        Đơn đang chờ admin xác nhận cọc 30% trước khi bạn có thể thanh toán phần còn lại.
                      </div>
                    ) : null}

                    {/* Hủy đơn nếu chưa hoàn tất/hủy */}
                    {selectedBooking.status !== "COMPLETED" && selectedBooking.status !== "CANCELLED" && (
                      <div className="pt-4 border-t border-border">
                        <Button
                          variant="outline"
                          onClick={() => handleCancelBooking(selectedBooking.id)}
                          disabled={cancellingId === selectedBooking.id}
                          className="w-full rounded-2xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-500 h-14 font-bold transition-all"
                        >
                          {cancellingId === selectedBooking.id ? "Đang xử lý..." : "Hủy đặt phòng"}
                        </Button>
                        <p className="text-[10px] text-muted-foreground text-center mt-3 px-4">
                          Lưu ý: Tiền cọc (nếu đã thanh toán) sẽ được xử lý theo chính sách hoàn tiền của khách sạn.
                        </p>
                      </div>
                    )}

                    {/* Hiển thị đánh giá nếu có */}
                    {selectedBooking.hasReview && (
                      <div className="mt-6 border-t pt-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                          Đánh giá của bạn
                        </h3>
                        <div className="bg-muted p-4 rounded-2xl">
                          <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-4 h-4 ${
                                  s <= (selectedBooking.reviewRating || 0)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-muted-foreground/30 fill-muted"
                                }`}
                              />
                            ))}
                          </div>
                          {selectedBooking.reviewComment && (
                            <p className="text-sm text-card-foreground italic">
                              "{selectedBooking.reviewComment}"
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Payment Method Modal */}
      {showPaymentMethodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-card-foreground mb-4">Chọn phương thức thanh toán</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Thanh toán {formatCurrency(Math.round((pendingPaymentBooking?.totalAmount || 0) * 0.7))} (70% còn lại)
            </p>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleConfirmPayment("CASH")}
                className="w-full p-4 rounded-xl border border-border hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 transition-all text-left"
              >
                <div className="font-semibold text-card-foreground">💵 Thanh toán tại khách sạn</div>
                <div className="text-sm text-muted-foreground mt-1">Thanh toán tiền mặt khi nhận phòng</div>
              </button>

              <button
                onClick={() => handleConfirmPayment("VNPAY")}
                className="w-full p-4 rounded-xl border border-border hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all text-left"
              >
                <div className="font-semibold text-card-foreground">🏦 Thanh toán qua VNPAY</div>
                <div className="text-sm text-muted-foreground mt-1">Thanh toán trực tuyến an toàn</div>
              </button>
            </div>

            <Button
              onClick={() => setShowPaymentMethodModal(false)}
              className="w-full rounded-xl bg-muted text-card-foreground hover:bg-muted/80"
            >
              Hủy
            </Button>
          </div>
        </div>
      )}
      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-card-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-card-foreground mb-1">Đánh giá khách sạn</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Bạn đánh giá thế nào về {reviewingBooking?.hotelName}?
            </p>
            
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="focus:outline-none hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= reviewRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-muted text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Chia sẻ trải nghiệm của bạn</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Khách sạn rất tuyệt vời, phòng sạch sẽ và nhân viên thân thiện..."
                className="w-full rounded-xl border border-border bg-muted p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
              ></textarea>
            </div>

            <Button
              onClick={handleSubmitReview}
              disabled={submittingReview}
              className="w-full rounded-xl h-12 font-bold shadow-md shadow-accent-500/20"
            >
              {submittingReview ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                "Gửi đánh giá"
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
