import type { Metadata } from "next";
import { HelpCircle, MessageCircle, Phone, Mail, ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Trung Tâm Trợ Giúp - CybertronHotel",
  description: "Câu hỏi thường gặp và hỗ trợ khách hàng 24/7.",
};

const faqs = [
  { q: "Làm thế nào để đặt phòng?", a: "Bạn có thể đặt phòng trực tiếp trên website bằng cách chọn khách sạn, chọn phòng và điền thông tin thanh toán. Sau khi đặt thành công, bạn sẽ nhận email xác nhận." },
  { q: "Tôi có thể hủy đặt phòng không?", a: "Chính sách hủy phụ thuộc vào từng khách sạn. Thông thường bạn có thể hủy miễn phí trước 24-48 giờ so với ngày nhận phòng. Vui lòng kiểm tra chính sách tại trang đặt phòng." },
  { q: "Làm sao để thay đổi ngày lưu trú?", a: "Truy cập mục 'Lịch sử đặt phòng' trong tài khoản của bạn, chọn đặt phòng cần thay đổi và liên hệ trực tiếp với khách sạn để điều chỉnh." },
  { q: "Phương thức thanh toán nào được chấp nhận?", a: "Chúng tôi chấp nhận thanh toán qua thẻ tín dụng/ghi nợ (Visa, Mastercard), chuyển khoản ngân hàng và thanh toán qua VNPay." },
  { q: "Có thể đặt phòng cho người khác không?", a: "Có, bạn có thể đặt phòng cho người khác. Chỉ cần điền thông tin của người lưu trú vào mục thông tin khách hàng khi đặt phòng." },
  { q: "Điểm thưởng được tính như thế nào?", a: "Với mỗi đêm lưu trú thành công, bạn sẽ nhận được điểm thưởng tương ứng với giá trị đặt phòng. Điểm thưởng có thể dùng để giảm giá cho các lần đặt tiếp theo." },
];

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20 mb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-white/20">
            <HelpCircle className="w-4 h-4" /> Hỗ trợ 24/7
          </div>
          <h1 className="font-heading text-5xl font-bold mb-6">Trung Tâm Trợ Giúp</h1>
          <p className="text-xl text-white/80 max-w-xl mx-auto">Chúng tôi luôn sẵn sàng hỗ trợ bạn mọi lúc mọi nơi.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Phone, title: "Hotline", value: "1800 123 456", sub: "Miễn phí 24/7", color: "text-green-500" },
            { icon: Mail, title: "Email", value: "support@cybertronhotel.com", sub: "Phản hồi trong 2 giờ", color: "text-blue-500" },
            { icon: MessageCircle, title: "Live Chat", value: "Chat trực tiếp", sub: "Online 8:00 - 22:00", color: "text-purple-500" },
          ].map((contact) => (
            <div key={contact.title} className="bg-card rounded-2xl border border-border p-6 text-center hover:shadow-lg transition-shadow">
              <contact.icon className={`w-8 h-8 ${contact.color} mx-auto mb-3`} />
              <h3 className="font-bold text-card-foreground mb-1">{contact.title}</h3>
              <p className="font-semibold text-foreground text-sm mb-1">{contact.value}</p>
              <p className="text-xs text-muted-foreground">{contact.sub}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div>
          <h2 className="font-heading text-3xl font-bold text-foreground mb-8 text-center">Câu hỏi thường gặp</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-card rounded-2xl border border-border overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-card-foreground hover:text-accent-500 transition-colors list-none">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-6 pb-6 text-muted-foreground leading-relaxed text-sm border-t border-border pt-4">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
