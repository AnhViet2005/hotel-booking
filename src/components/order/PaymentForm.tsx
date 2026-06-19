"use client";

import { useState, useEffect } from "react";
import { CreditCard, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/utils/format";
import { getUser } from "@/utils/api";

interface PaymentFormProps {
  total: number;
  handlePay: (e: React.FormEvent, method: string) => void;
}

export default function PaymentForm({ total, handlePay }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("VNPAY");
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const user = getUser();
    if (user) {
      setUserData(user);
    }
  }, []);

  return (
    <form onSubmit={(e) => handlePay(e, paymentMethod)} className="bg-card rounded-[32px] p-8 md:p-10 shadow-2xl border border-border">
      
      <h2 className="font-heading text-2xl font-bold mb-8 flex items-center gap-3 text-card-foreground">
        <span className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-accent-500 text-sm font-black">01</span>
        Thông tin khách hàng
      </h2>
      <div className="bg-muted/30 rounded-2xl p-6 mb-12 border border-border/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase mb-1">Tên khách hàng</p>
            <p className="font-bold text-card-foreground">{userData?.fullName || "Khách"}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase mb-1">Email</p>
            <p className="font-bold text-card-foreground">{userData?.email || "—"}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase mb-1">Số điện thoại</p>
            <p className="font-bold text-card-foreground">{userData?.phone || "—"}</p>
          </div>
        </div>
        <p className="text-[10px] text-accent-600 mt-4 font-medium flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Thông tin đã được tự động lấy từ tài khoản của bạn
        </p>
      </div>

      <h2 className="font-heading text-2xl font-bold mb-8 flex items-center gap-3 text-card-foreground">
        <span className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-accent-500 text-sm font-black">02</span>
        <ShieldCheck className="w-5 h-5 text-accent-500" /> Phương thức thanh toán
      </h2>
      <div className="space-y-4 mb-10">
        <div 
          onClick={() => setPaymentMethod("VNPAY")}
          className={`flex items-center gap-4 p-4 bg-card rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === "VNPAY" ? "border-accent-500 bg-accent-500/5" : "border-border hover:border-accent-500/50"}`}
        >
          <div className={`w-5 h-5 rounded-full border-[2px] flex-shrink-0 flex items-center justify-center ${paymentMethod === "VNPAY" ? "border-accent-500" : "border-muted-foreground"}`}>
            {paymentMethod === "VNPAY" && <div className="w-2.5 h-2.5 rounded-full bg-accent-500"></div>}
          </div>
          <div>
            <div className="font-bold text-card-foreground">Thanh toán qua VNPAY</div>
            <div className="text-sm text-muted-foreground mt-1">Cổng thanh toán điện tử (Cọc 30%)</div>
          </div>
        </div>

        <div 
          onClick={() => setPaymentMethod("CASH")}
          className={`flex items-center gap-4 p-4 bg-card rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === "CASH" ? "border-accent-500 bg-accent-500/5" : "border-border hover:border-accent-500/50"}`}
        >
          <div className={`w-5 h-5 rounded-full border-[2px] flex-shrink-0 flex items-center justify-center ${paymentMethod === "CASH" ? "border-accent-500" : "border-muted-foreground"}`}>
            {paymentMethod === "CASH" && <div className="w-2.5 h-2.5 rounded-full bg-accent-500"></div>}
          </div>
          <div>
            <div className="font-bold text-card-foreground">Thanh toán Tiền mặt</div>
            <div className="text-sm text-muted-foreground mt-1">Thanh toán tại khách sạn khi nhận phòng</div>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full h-16 text-lg rounded-2xl shadow-2xl shadow-accent-500/20 font-bold transition-all hover:scale-[1.01] active:scale-[0.99] animate-shimmer">
        {paymentMethod === "VNPAY" ? `Thanh toán cọc (30%): ${formatCurrency(total * 0.3)}` : "Xác nhận đặt phòng (Trả tại KS)"}
      </Button>
      <div className="flex items-center justify-center gap-3 mt-6 text-sm text-muted-foreground font-medium">
        <ShieldCheck className="w-5 h-5 text-green-500" /> 
        <span>Giao dịch được mã hóa an toàn</span>
      </div>
    </form>
  );
}
