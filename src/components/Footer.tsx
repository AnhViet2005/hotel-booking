"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

interface ContactInfo {
  id?: number;
  email: string;
  phone: string;
  address: string;
  companyName?: string;
  websiteUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

export default function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        import { API_BASE_URL } from "../utils/api";
const apiUrl = API_BASE_URL;
        const res = await fetch(`${apiUrl}/contact-info`);
        if (res.ok) {
          const data = await res.json();
          setContactInfo(data);
        }
      } catch (error) {
        console.error("Failed to fetch contact info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const defaultContact: ContactInfo = {
    email: "support@cybertron.vn",
    phone: "1900 1234",
    address: "Số 1 Đại Cồ Việt, Hai Bà Trung, Hà Nội",
    companyName: "Cybertron Hotel",
  };

  const contact = contactInfo || defaultContact;

  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-950 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold font-heading mb-4 text-amber-400">
              {contact.companyName || "Cybertron Hotel"}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Nền tảng đặt phòng khách sạn trực tuyến hàng đầu, cung cấp dịch vụ lưu trú chất lượng cao với giá tốt nhất.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-amber-400">Khám Phá</h4>
            <ul className="space-y-2">
              {[
                { name: "Khách sạn nổi bật", href: "/featured-hotels" },
                { name: "Bài viết du lịch", href: "/posts" },
                { name: "Trở thành chủ sở hữu", href: "/partner" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-400 hover:text-amber-400 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-amber-400">Hỗ Trợ</h4>
            <ul className="space-y-2">
              {[
                { name: "Trung tâm trợ giúp", href: "/help" },
                { name: "Chính sách hủy", href: "/cancellation-policy" },
                { name: "Điều khoản dịch vụ", href: "/" },
                { name: "Chính sách bảo mật", href: "/" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-400 hover:text-amber-400 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-amber-400">Liên Hệ</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Email</p>
                  <a href={`mailto:${contact.email}`} className="text-gray-300 hover:text-amber-400 transition-colors">
                    {contact.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Điện thoại</p>
                  <a href={`tel:${contact.phone}`} className="text-gray-300 hover:text-amber-400 transition-colors">
                    {contact.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Địa chỉ</p>
                  <p className="text-gray-300">{contact.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        {(contact.facebookUrl || contact.instagramUrl) && (
          <div className="border-t border-gray-800 pt-8 pb-8">
            <h4 className="text-lg font-bold mb-4 text-amber-400">Kết Nối Với Chúng Tôi</h4>
            <div className="flex gap-4">
              {contact.facebookUrl && (
                <a
                  href={contact.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
              {contact.instagramUrl && (
                <a
                  href={contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-tr hover:from-pink-500 hover:to-orange-400 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.117.6c-.799.263-1.971.726-2.424 1.18-.463.453-.917 1.625-1.18 2.424-.267.788-.468 1.658-.528 2.936C.015 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.528 2.936.263.799.717 1.971 1.18 2.424.453.463 1.625.917 2.424 1.18.788.267 1.658.468 2.936.528C8.333 23.985 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.261 2.936-.528.799-.263 1.971-.717 2.424-1.18.463-.453.917-1.625 1.18-2.424.267-.788.468-1.658.528-2.936.057-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.261-2.148-.528-2.936-.263-.799-.717-1.971-1.18-2.424-.453-.463-1.625-.917-2.424-1.18-.788-.267-1.658-.468-2.936-.528C15.667.015 15.26 0 12 0zm0 2.16c3.203 0 3.585.009 4.849.070 1.171.054 1.805.244 2.227.408.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.354 1.056.408 2.227.061 1.264.07 1.646.07 4.849s-.009 3.585-.07 4.849c-.054 1.171-.244 1.805-.408 2.227-.217.562-.477.96-.896 1.382-.42.419-.819.679-1.381.896-.422.164-1.056.354-2.227.408-1.264.061-1.646.07-4.849.07s-3.585-.009-4.849-.07c-1.171-.054-1.805-.244-2.227-.408-.562-.217-.96-.477-1.382-.896-.419-.42-.679-.819-.896-1.381-.164-.422-.354-1.056-.408-2.227-.061-1.264-.07-1.646-.07-4.849s.009-3.585.07-4.849c.054-1.171.244-1.805.408-2.227.217-.562.477-.96.896-1.382.42-.419.819-.679 1.381-.896.422-.164 1.056-.354 2.227-.408 1.264-.061 1.646-.07 4.849-.07z" />
                    <circle cx="12" cy="12" r="3.305" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-950/50 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2024 {contact.companyName || "Cybertron Hotel"}. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="/" className="text-gray-500 hover:text-amber-400 text-sm transition-colors">Về chúng tôi</a>
            <a href="/" className="text-gray-500 hover:text-amber-400 text-sm transition-colors">Điều khoản</a>
            <a href="/" className="text-gray-500 hover:text-amber-400 text-sm transition-colors">Bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
