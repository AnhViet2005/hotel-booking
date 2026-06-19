"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { confirmBooking } from "@/utils/api";

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    // Read the query params returned by VNPay
    const responseCode = searchParams.get("vnp_ResponseCode");
    const orderInfo = searchParams.get("vnp_OrderInfo");
    
    if (responseCode === "00") {
      if (orderInfo && orderInfo.startsWith("Booking_")) {
        const bookingId = parseInt(orderInfo.replace("Booking_", ""), 10);
        if (!isNaN(bookingId)) {
          confirmBooking(bookingId)
            .then(() => setStatus("success"))
            .catch((err) => {
              console.error(err);
              setStatus("error");
            });
        } else {
          setStatus("success");
        }
      } else {
        setStatus("success");
      }
    } else if (responseCode) {
      setStatus("error");
    } else {
      // If someone accesses this page directly without VNPay params
      setStatus("error");
    }
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-accent-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-12 bg-brand-50 dark:bg-brand-950 flex flex-col items-center justify-center text-center px-4">
      <div className="bg-card p-10 rounded-[32px] shadow-2xl border border-border max-w-lg w-full">
        {status === "success" ? (
          <>
            <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-heading font-bold text-card-foreground mb-4">Thanh Toán Thành Công!</h1>
            <p className="text-muted-foreground mb-8">
              Cảm ơn bạn đã đặt cọc. Giao dịch của bạn đã được xác nhận.
              Thông tin chi tiết sẽ được gửi vào email của bạn.
            </p>
          </>
        ) : (
          <>
            <XCircle className="w-24 h-24 text-red-500 mx-auto mb-6" />
            <h1 className="text-3xl font-heading font-bold text-card-foreground mb-4">Thanh Toán Thất Bại</h1>
            <p className="text-muted-foreground mb-8">
              Giao dịch đã bị hủy hoặc có lỗi xảy ra trong quá trình thanh toán.
              Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
            </p>
          </>
        )}

        <div className="flex flex-col gap-4">
          <Button onClick={() => router.push("/dashboard")} className="h-14 rounded-xl font-bold text-lg">
            Đặt phòng của tôi
          </Button>
          <Button variant="outline" onClick={() => router.push("/")} className="h-14 rounded-xl font-bold text-lg">
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-accent-500" />
      </div>
    }>
      <PaymentResultContent />
    </Suspense>
  );
}
