import type { Metadata } from "next";
import { XCircle, CheckCircle, AlertCircle, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Chính Sách Hủy Phòng - CybertronHotel",
  description: "Chính sách hủy phòng và hoàn tiền của CybertronHotel.",
};

export default function CancellationPolicyPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white py-20 mb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-white/20">
            <XCircle className="w-4 h-4" /> Chính sách hoàn trả
          </div>
          <h1 className="font-heading text-5xl font-bold mb-6">Chính Sách Hủy Phòng</h1>
          <p className="text-xl text-white/80 max-w-xl mx-auto">Minh bạch, rõ ràng và đảm bảo quyền lợi cho khách hàng.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Policy tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 text-center">
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <h3 className="font-bold text-green-800 dark:text-green-300 text-lg mb-2">Hủy miễn phí</h3>
            <p className="text-green-700 dark:text-green-400 text-sm">Trước 48 giờ nhận phòng</p>
            <div className="mt-3 text-2xl font-black text-green-600">Hoàn 100%</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 text-center">
            <AlertCircle className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
            <h3 className="font-bold text-yellow-800 dark:text-yellow-300 text-lg mb-2">Hủy một phần</h3>
            <p className="text-yellow-700 dark:text-yellow-400 text-sm">Trước 24 giờ nhận phòng</p>
            <div className="mt-3 text-2xl font-black text-yellow-600">Hoàn 50%</div>
          </div>
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
            <XCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="font-bold text-red-800 dark:text-red-300 text-lg mb-2">Không hoàn tiền</h3>
            <p className="text-red-700 dark:text-red-400 text-sm">Trong vòng 24 giờ hoặc không đến</p>
            <div className="mt-3 text-2xl font-black text-red-600">Hoàn 0%</div>
          </div>
        </div>

        {/* Details */}
        {[
          { icon: Info, title: "Quy trình hủy phòng", color: "text-blue-500", items: ["Đăng nhập vào tài khoản và vào mục 'Lịch sử đặt phòng'", "Chọn đặt phòng cần hủy và nhấn nút 'Hủy đặt phòng'", "Xác nhận lý do hủy và gửi yêu cầu", "Hoàn tiền sẽ được xử lý trong 3-7 ngày làm việc"] },
          { icon: CheckCircle, title: "Trường hợp đặc biệt được hoàn 100%", color: "text-green-500", items: ["Khách sạn hủy đặt phòng từ phía cung cấp dịch vụ", "Sự kiện bất khả kháng (thiên tai, dịch bệnh) có xác nhận", "Đặt phòng sai do lỗi hệ thống của CybertronHotel", "Khách sạn không đạt tiêu chuẩn như mô tả"] },
          { icon: AlertCircle, title: "Lưu ý quan trọng", color: "text-orange-500", items: ["Thời gian tính từ thời điểm gửi yêu cầu hủy, không phải thời điểm xác nhận", "Một số khách sạn có chính sách riêng, kiểm tra kỹ trước khi đặt", "Phí xử lý giao dịch (nếu có) sẽ không được hoàn lại", "Liên hệ hotline 1800 123 456 để được hỗ trợ trực tiếp"] },
        ].map((section) => (
          <div key={section.title} className="bg-card rounded-2xl border border-border p-8">
            <h2 className="font-heading text-xl font-bold text-card-foreground mb-5 flex items-center gap-3">
              <section.icon className={`w-6 h-6 ${section.color}`} />
              {section.title}
            </h2>
            <ul className="space-y-3">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm">
                  <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground flex-shrink-0 mt-0.5">{i + 1}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
