import type { Metadata } from "next";
import { Shield, Lock, Eye, Server, Bell, Key } from "lucide-react";

export const metadata: Metadata = {
  title: "Bảo Mật Thông Tin - CybertronHotel",
  description: "Chính sách bảo mật và quyền riêng tư của CybertronHotel.",
};

const sections = [
  { icon: Shield, title: "Thông tin chúng tôi thu thập", content: "Chúng tôi thu thập các thông tin cần thiết để cung cấp dịch vụ, bao gồm: họ tên, địa chỉ email, số điện thoại, thông tin thanh toán (được mã hóa), lịch sử đặt phòng và thông tin về thiết bị truy cập. Chúng tôi cam kết chỉ thu thập những thông tin thực sự cần thiết cho việc cung cấp dịch vụ." },
  { icon: Lock, title: "Cách chúng tôi bảo vệ dữ liệu", content: "Tất cả dữ liệu được mã hóa bằng SSL/TLS 256-bit. Thông tin thanh toán được xử lý qua các cổng thanh toán được chứng nhận PCI DSS. Hệ thống được giám sát 24/7 và kiểm tra bảo mật định kỳ. Chúng tôi áp dụng nguyên tắc truy cập tối thiểu - chỉ nhân viên được phân quyền mới có thể truy cập dữ liệu khách hàng." },
  { icon: Eye, title: "Cách chúng tôi sử dụng thông tin", content: "Thông tin của bạn được sử dụng để: xử lý đặt phòng và thanh toán, gửi xác nhận và thông báo liên quan đến dịch vụ, cải thiện trải nghiệm người dùng, gửi các ưu đãi phù hợp (nếu bạn đồng ý nhận). Chúng tôi không bán thông tin cá nhân cho bên thứ ba dưới bất kỳ hình thức nào." },
  { icon: Server, title: "Lưu trữ và xóa dữ liệu", content: "Dữ liệu của bạn được lưu trữ trên máy chủ tại Việt Nam và được sao lưu hàng ngày. Bạn có quyền yêu cầu xóa tài khoản và toàn bộ dữ liệu cá nhân bất kỳ lúc nào. Sau khi xóa, dữ liệu sẽ được xóa hoàn toàn trong vòng 30 ngày, trừ các dữ liệu cần giữ theo yêu cầu pháp lý." },
  { icon: Bell, title: "Cookie và theo dõi", content: "Chúng tôi sử dụng cookie để lưu thông tin phiên đăng nhập, tùy chỉnh trải nghiệm và phân tích lưu lượng truy cập. Bạn có thể tắt cookie trong trình duyệt, tuy nhiên một số tính năng có thể không hoạt động đầy đủ. Cookie theo dõi quảng cáo sẽ chỉ được sử dụng khi bạn đồng ý." },
  { icon: Key, title: "Quyền của bạn", content: "Bạn có đầy đủ các quyền: truy cập và xem thông tin cá nhân đang được lưu trữ, yêu cầu chỉnh sửa thông tin không chính xác, yêu cầu xóa tài khoản và dữ liệu, phản đối việc xử lý dữ liệu, rút lại sự đồng ý bất kỳ lúc nào. Để thực hiện các quyền này, liên hệ privacy@cybertronhotel.com." },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="bg-gradient-to-br from-slate-700 to-slate-900 text-white py-20 mb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-white/20">
            <Shield className="w-4 h-4" /> Bảo vệ dữ liệu
          </div>
          <h1 className="font-heading text-5xl font-bold mb-6">Bảo Mật Thông Tin</h1>
          <p className="text-xl text-white/80 max-w-xl mx-auto">Sự tin tưởng của bạn là ưu tiên hàng đầu của chúng tôi.</p>
          <p className="text-sm text-white/50 mt-4">Cập nhật lần cuối: 01/06/2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-accent-50 dark:bg-accent-950/20 border border-accent-200 dark:border-accent-800 rounded-2xl p-6 flex gap-4">
          <Shield className="w-6 h-6 text-accent-500 flex-shrink-0 mt-1" />
          <div>
            <p className="font-semibold text-foreground mb-1">Cam kết của CybertronHotel</p>
            <p className="text-sm text-muted-foreground leading-relaxed">Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn. Chính sách này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn khi sử dụng dịch vụ CybertronHotel.</p>
          </div>
        </div>

        {sections.map((section) => (
          <div key={section.title} className="bg-card rounded-2xl border border-border p-8">
            <h2 className="font-heading text-xl font-bold text-card-foreground mb-4 flex items-center gap-3">
              <div className="p-2 bg-accent-500/10 rounded-xl">
                <section.icon className="w-5 h-5 text-accent-500" />
              </div>
              {section.title}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">{section.content}</p>
          </div>
        ))}

        <div className="bg-card rounded-2xl border border-border p-8 text-center">
          <p className="text-muted-foreground text-sm">Có câu hỏi về chính sách bảo mật? Liên hệ với chúng tôi tại</p>
          <a href="mailto:privacy@cybertronhotel.com" className="text-accent-500 font-semibold hover:underline">privacy@cybertronhotel.com</a>
        </div>
      </div>
    </main>
  );
}
