"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <footer className="bg-muted text-foreground pt-16 pb-8 border-t border-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center shadow-lg shadow-accent-500/20">
                <Globe className="text-white w-6 h-6" />
              </div>
              <span className="font-heading font-bold text-2xl tracking-tight text-foreground">
                Cybertron<span className="text-accent-500">Hotel</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Trải nghiệm những khách sạn sang trọng nhất thế giới. Đặt trọn kỳ nghỉ hoàn hảo của bạn với những ưu đãi độc quyền.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-card flex items-center justify-center hover:bg-accent-500 hover:text-white transition-all shadow-sm border border-border text-xs font-bold">IG</a>
              <a href="#" className="w-8 h-8 rounded-full bg-card flex items-center justify-center hover:bg-accent-500 hover:text-white transition-all shadow-sm border border-border text-xs font-bold">TW</a>
              <a href="#" className="w-8 h-8 rounded-full bg-card flex items-center justify-center hover:bg-accent-500 hover:text-white transition-all shadow-sm border border-border text-xs font-bold">FB</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg text-foreground mb-6">Liên kết nhanh</h4>
            <ul className="space-y-3">
              <li><Link href="/destinations" className="text-muted-foreground hover:text-accent-500 transition-colors">Điểm đến</Link></li>
              <li><Link href="/featured-hotels" className="text-muted-foreground hover:text-accent-500 transition-colors">Khách sạn nổi bật</Link></li>
              <li><Link href="/special-offers" className="text-muted-foreground hover:text-accent-500 transition-colors">Ưu đãi đặc biệt</Link></li>
              <li><Link href="/travel-guide" className="text-muted-foreground hover:text-accent-500 transition-colors">Cẩm nang du lịch</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading font-semibold text-lg text-foreground mb-6">Hỗ trợ</h4>
            <ul className="space-y-3">
              <li><Link href="/help" className="text-muted-foreground hover:text-accent-500 transition-colors">Trung tâm trợ giúp</Link></li>
              <li><Link href="/cancellation-policy" className="text-muted-foreground hover:text-accent-500 transition-colors">Chính sách hủy phòng</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-accent-500 transition-colors">Bảo mật thông tin</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-accent-500 transition-colors">Điều khoản dịch vụ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-lg text-foreground mb-6">Liên hệ</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm">123 Luxury Ave, Suite 500<br/>New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent-500 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent-500 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">support@cybertronhotel.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground/60 text-sm">
            © {new Date().getFullYear()} Cybertron Hotel. Mọi bản quyền được bảo lưu.
          </p>
          <div className="flex gap-4">
            <div className="px-3 py-1.5 border border-border rounded backdrop-blur-sm text-xs font-medium tracking-wider text-muted-foreground/60">VND ₫</div>
            <div className="px-3 py-1.5 border border-border rounded backdrop-blur-sm text-xs font-medium tracking-wider text-muted-foreground/60">VIE</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
