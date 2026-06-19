import type { Metadata } from "next";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cẩm Nang Du Lịch - CybertronHotel",
  description: "Kinh nghiệm du lịch, mẹo đặt phòng và hướng dẫn tham quan các địa danh nổi tiếng.",
};

const articles = [
  { title: "10 điều cần biết khi đặt phòng khách sạn", category: "Mẹo đặt phòng", readTime: "5 phút", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80", excerpt: "Từ cách chọn phòng phù hợp đến thời điểm tốt nhất để đặt phòng với giá ưu đãi nhất." },
  { title: "Khám phá ẩm thực đường phố Hà Nội", category: "Ẩm thực", readTime: "7 phút", img: "https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=600&q=80", excerpt: "Hành trình khám phá những món ngon không thể bỏ qua khi đến Hà Nội." },
  { title: "Top 5 bãi biển đẹp nhất Việt Nam", category: "Địa điểm", readTime: "6 phút", img: "https://images.unsplash.com/photo-1573790387438-4da905039392?w=600&q=80", excerpt: "Những bãi biển thiên đường với làn nước trong xanh và cảnh quan tuyệt đẹp." },
  { title: "Kinh nghiệm du lịch Hội An 3 ngày 2 đêm", category: "Lịch trình", readTime: "10 phút", img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80", excerpt: "Lịch trình chi tiết để khám phá trọn vẹn vẻ đẹp của phố cổ Hội An." },
  { title: "Checklist cần chuẩn bị trước chuyến du lịch", category: "Chuẩn bị", readTime: "4 phút", img: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&q=80", excerpt: "Đừng quên những thứ quan trọng này trước khi lên đường cho chuyến du lịch của bạn." },
  { title: "Mùa nào thích hợp du lịch Phú Quốc?", category: "Thời tiết", readTime: "5 phút", img: "https://images.unsplash.com/photo-1559592413-7cbb3484eeb3?w=600&q=80", excerpt: "Hướng dẫn chọn thời điểm lý tưởng để có chuyến đi Phú Quốc hoàn hảo nhất." },
];

const categoryColors: Record<string, string> = {
  "Mẹo đặt phòng": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Ẩm thực": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "Địa điểm": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Lịch trình": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "Chuẩn bị": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "Thời tiết": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
};

export default function TravelGuidePage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="relative bg-gradient-to-br from-emerald-500 to-teal-700 text-white py-20 mb-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-white/20">
            <BookOpen className="w-4 h-4" /> Kiến thức du lịch
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6">Cẩm Nang Du Lịch</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">Bí kíp du lịch, kinh nghiệm đặt phòng và khám phá điểm đến từ các chuyên gia.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div key={article.title} className="group bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className="relative h-48 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={article.img} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryColors[article.category]}`}>{article.category}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" /> {article.readTime} đọc
                  </div>
                </div>
                <h2 className="font-heading text-lg font-bold text-card-foreground mb-2 line-clamp-2 flex-1">{article.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center gap-1 text-accent-500 font-semibold text-sm group-hover:gap-2 transition-all">
                  Đọc tiếp <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
