import type { Metadata } from "next";
import { FileText, Users, CreditCard, AlertTriangle, Scale, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Điều Khoản Dịch Vụ - CybertronHotel",
  description: "Điều khoản và điều kiện sử dụng dịch vụ CybertronHotel.",
};

const sections = [
  { icon: Users, title: "1. Điều khoản sử dụng tài khoản", items: ["Bạn phải từ 18 tuổi trở lên để đăng ký và sử dụng dịch vụ", "Mỗi người chỉ được tạo một tài khoản cá nhân", "Thông tin đăng ký phải chính xác và đầy đủ", "Bạn chịu trách nhiệm bảo mật mật khẩu và mọi hoạt động trong tài khoản", "CybertronHotel có quyền tạm ngưng tài khoản vi phạm điều khoản"] },
  { icon: CreditCard, title: "2. Đặt phòng và thanh toán", items: ["Giá phòng hiển thị đã bao gồm thuế và phí dịch vụ (trừ khi có ghi chú khác)", "Thanh toán được xử lý ngay khi xác nhận đặt phòng", "CybertronHotel đóng vai trò trung gian kết nối khách hàng và khách sạn", "Chúng tôi không chịu trách nhiệm về sự thay đổi giá do biến động thị trường", "Đặt phòng chỉ được xác nhận sau khi thanh toán thành công"] },
  { icon: AlertTriangle, title: "3. Trách nhiệm và giới hạn", items: ["CybertronHotel không chịu trách nhiệm về chất lượng dịch vụ thực tế của khách sạn", "Chúng tôi không đảm bảo tính liên tục và không gián đoạn của dịch vụ", "Thiệt hại tối đa CybertronHotel chịu trách nhiệm không vượt quá giá trị đặt phòng", "Chúng tôi không chịu trách nhiệm về thiệt hại gián tiếp hoặc hậu quả phát sinh", "Khách sạn chịu trách nhiệm trực tiếp về dịch vụ lưu trú"] },
  { icon: Scale, title: "4. Quyền sở hữu trí tuệ", items: ["Toàn bộ nội dung trên CybertronHotel thuộc quyền sở hữu của chúng tôi", "Bạn không được sao chép, phân phối hoặc sử dụng thương mại nội dung của chúng tôi", "Logo, thương hiệu CybertronHotel được bảo hộ theo pháp luật Việt Nam", "Đánh giá và nội dung bạn đăng tải cho phép chúng tôi sử dụng phi độc quyền", "Vi phạm quyền sở hữu trí tuệ sẽ bị xử lý theo quy định pháp luật"] },
  { icon: Globe, title: "5. Pháp luật áp dụng", items: ["Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam", "Tranh chấp sẽ được giải quyết tại tòa án có thẩm quyền tại TP. Hồ Chí Minh", "Nếu bất kỳ điều khoản nào vô hiệu, các điều khoản còn lại vẫn có hiệu lực", "CybertronHotel có quyền sửa đổi điều khoản và thông báo trước 30 ngày", "Tiếp tục sử dụng dịch vụ sau khi cập nhật đồng nghĩa với việc chấp nhận điều khoản mới"] },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="bg-gradient-to-br from-gray-800 to-gray-950 text-white py-20 mb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-white/20">
            <FileText className="w-4 h-4" /> Điều khoản pháp lý
          </div>
          <h1 className="font-heading text-5xl font-bold mb-6">Điều Khoản Dịch Vụ</h1>
          <p className="text-xl text-white/80 max-w-xl mx-auto">Vui lòng đọc kỹ trước khi sử dụng dịch vụ của chúng tôi.</p>
          <p className="text-sm text-white/50 mt-4">Có hiệu lực từ: 01/01/2026 | Cập nhật: 01/06/2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 flex gap-4">
          <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            Bằng cách sử dụng dịch vụ CybertronHotel, bạn đồng ý tuân thủ các điều khoản và điều kiện dưới đây. Nếu bạn không đồng ý, vui lòng không sử dụng dịch vụ của chúng tôi.
          </p>
        </div>

        {sections.map((section) => (
          <div key={section.title} className="bg-card rounded-2xl border border-border p-8">
            <h2 className="font-heading text-xl font-bold text-card-foreground mb-5 flex items-center gap-3">
              <div className="p-2 bg-accent-500/10 rounded-xl">
                <section.icon className="w-5 h-5 text-accent-500" />
              </div>
              {section.title}
            </h2>
            <ul className="space-y-3">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500 flex-shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="bg-card rounded-2xl border border-border p-8 text-center">
          <p className="text-muted-foreground text-sm">Có câu hỏi về điều khoản dịch vụ? Liên hệ với chúng tôi tại</p>
          <a href="mailto:legal@cybertronhotel.com" className="text-accent-500 font-semibold hover:underline">legal@cybertronhotel.com</a>
        </div>
      </div>
    </main>
  );
}
