import type { Metadata } from "next";
import { Tag, Clock, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ưu Đãi Đặc Biệt - CybertronHotel",
  description: "Các chương trình khuyến mãi và ưu đãi đặc biệt.",
};

const offers = [
  { title: "Đặt sớm giảm 30%", desc: "Đặt phòng trước 30 ngày để nhận ưu đãi giảm giá lên đến 30% cho tất cả các loại phòng cao cấp.", badge: "HOT", color: "from-red-500 to-orange-500", discount: "30%", until: "30/06/2026", code: "EARLY30" },
  { title: "Cuối tuần lãng mạn", desc: "Đặt phòng 2 đêm cuối tuần, tặng bữa sáng và check-out muộn đến 14:00 miễn phí.", badge: "MỚI", color: "from-pink-500 to-rose-500", discount: "Miễn phí bữa sáng", until: "31/07/2026", code: "WEEKEND2" },
  { title: "Thành viên VIP", desc: "Đăng ký thành viên VIP, nhận ngay 15% cho lần đặt đầu tiên và điểm thưởng tích lũy.", badge: "VIP", color: "from-purple-500 to-indigo-500", discount: "15%", until: "Không giới hạn", code: "VIP15" },
  { title: "Hè rực rỡ biển xanh", desc: "Đặt resort ven biển mùa hè, nhận combo BBQ bãi biển và tour tham quan đảo.", badge: "HÈ 2026", color: "from-cyan-500 to-blue-500", discount: "Combo BBQ + Tour", until: "31/08/2026", code: "SUMMER26" },
  { title: "Gia đình vui vẻ", desc: "Đặt phòng gia đình (2 người lớn + 2 trẻ em), trẻ em dưới 12 tuổi được miễn phí.", badge: "GIA ĐÌNH", color: "from-green-500 to-emerald-500", discount: "Miễn phí trẻ em", until: "31/12/2026", code: "FAMILY" },
  { title: "Flash Sale 24h", desc: "Ưu đãi flash sale chớp nhoáng trong 24 giờ, giảm đến 50% chỉ dành cho thành viên.", badge: "FLASH", color: "from-yellow-500 to-amber-500", discount: "Đến 50%", until: "Mỗi thứ Sáu", code: "FLASH50" },
];

export default function SpecialOffersPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="relative bg-gradient-to-br from-rose-500 to-pink-700 text-white py-20 mb-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-white/20">
            <Tag className="w-4 h-4" /> Chương trình khuyến mãi
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6">Ưu Đãi Đặc Biệt</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">Không bỏ lỡ những ưu đãi cực hấp dẫn. Đặt ngay trước khi hết!</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div key={offer.code} className="bg-card rounded-3xl border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
              <div className={`bg-gradient-to-br ${offer.color} p-8 text-white relative`}>
                <span className="absolute top-4 right-4 bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full">{offer.badge}</span>
                <Zap className="w-10 h-10 mb-3 opacity-80" />
                <h2 className="font-heading text-xl font-bold mb-1">{offer.title}</h2>
                <div className="text-3xl font-black">{offer.discount}</div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{offer.desc}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Hạn: <strong className="text-foreground">{offer.until}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Mã:</span>
                    <code className="bg-accent-50 dark:bg-accent-950/30 text-accent-600 px-3 py-1 rounded-lg font-mono text-sm font-bold border border-accent-200">{offer.code}</code>
                  </div>
                </div>
                <Link href="/" className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-foreground text-background font-bold hover:opacity-90 transition-opacity text-sm">
                  Đặt phòng ngay <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
